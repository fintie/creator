const API_PREFIXES = ['/api/health', '/api/videos', '/api/variations'];

function corsHeaders(origin, allowedOrigin) {
  const value = origin === allowedOrigin ? allowedOrigin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': value,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function withCors(response, origin, allowedOrigin) {
  const headers = new Headers(response.headers);
  const extra = corsHeaders(origin, allowedOrigin);
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, allowedOrigin) });
    }

    if (!API_PREFIXES.some((prefix) => url.pathname === prefix)) {
      return withCors(new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }), origin, allowedOrigin);
    }

    const upstreamUrl = new URL(url.pathname + url.search, env.BACKEND_ORIGIN);
    const upstreamRequest = new Request(upstreamUrl.toString(), request);
    upstreamRequest.headers.set('host', new URL(env.BACKEND_ORIGIN).host);

    try {
      const response = await fetch(upstreamRequest);
      return withCors(response, origin, allowedOrigin);
    } catch (error) {
      return withCors(new Response(JSON.stringify({ error: 'Upstream fetch failed', detail: String(error) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }), origin, allowedOrigin);
    }
  },
};
