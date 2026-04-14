import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const PUBLIC_BASE = import.meta.env.BASE_URL || '/';

const apiUrl = (path) => `${API_BASE}${path}`;

const featuredCollections = [
  {
    title: 'Agent orchestration',
    text: 'Route every prompt through a smart creative controller that picks the best generation path for each brief.',
  },
  {
    title: 'Video generation pipeline',
    text: 'Blend Seedance2.0 outputs with FFmpeg transformations for fast concepting and polished previews.',
  },
  {
    title: 'Evaluation loop',
    text: 'Score each cut with AI and human review, then feed stronger results back into the reward loop.',
  },
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prompt, setPrompt] = useState('Turn this clip into a premium fashion campaign with elegant motion and golden-hour lighting.');
  const [style, setStyle] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    fetch(apiUrl('/api/videos'))
      .then((res) => res.json())
      .then(setLibrary)
      .catch(() => setLibrary([]));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please upload a video first.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('prompt', prompt);
    formData.append('style', style);

    try {
      const response = await fetch(apiUrl('/api/variations'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Generation failed.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand">Visionary Studio</div>
          <div className="nav-links">
            <a href={`${PUBLIC_BASE}#workflow`}>Workflow</a>
            <a href={`${PUBLIC_BASE}#generator`}>Generator</a>
            <a href={`${PUBLIC_BASE}#library`}>Library</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Creative video AI platform</p>
            <h1>Upload a video, apply a prompt, generate polished variations.</h1>
            <p className="hero-text">
              Designed with the premium visual feel of Artlist, but focused on agent orchestration,
              variation generation, evaluation, and reward-driven learning.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href={`${PUBLIC_BASE}#generator`}>Start creating</a>
              <a className="ghost-btn" href={`${PUBLIC_BASE}#workflow`}>See workflow</a>
            </div>
          </div>

          <div className="hero-card">
            <div className="status-pill">Seedance2.0 + FFmpeg + FastAPI</div>
            <div className="preview-stack">
              <div className="preview-card dark">
                <span>Input</span>
                <strong>Upload source clip</strong>
              </div>
              <div className="preview-arrow">→</div>
              <div className="preview-card accent">
                <span>Router</span>
                <strong>LLM orchestration</strong>
              </div>
              <div className="preview-arrow">→</div>
              <div className="preview-card light">
                <span>Output</span>
                <strong>Final cut + memo</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="feature-strip" id="workflow">
          {featuredCollections.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="workflow-panel">
          <div className="workflow-copy">
            <p className="eyebrow">Pipeline</p>
            <h2>Input to learning memo, in one production loop.</h2>
            <ol>
              <li>Input prompt and uploaded source video</li>
              <li>LLM router selects generation or transformation strategy</li>
              <li>Seedance2.0 and FFmpeg create candidate variations</li>
              <li>AI + human evaluation score the results</li>
              <li>Reward loop improves future outputs and writes a memo</li>
            </ol>
          </div>
          <div className="workflow-visual">
            <div>Input</div>
            <div>Orchestration</div>
            <div>Generation</div>
            <div>Evaluation</div>
            <div>Optimization</div>
            <div>Output</div>
          </div>
        </section>

        <section className="generator-section" id="generator">
          <div className="generator-card">
            <p className="eyebrow">Generate variation</p>
            <h2>Upload video</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Video file
                <input type="file" accept="video/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </label>
              <label>
                Prompt
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="4" />
              </label>
              <label>
                Style preset
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option>Cinematic</option>
                  <option>Editorial</option>
                  <option>High Contrast</option>
                  <option>Dreamscape</option>
                </select>
              </label>
              <button className="primary-btn full" type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate variation'}
              </button>
              {error && <p className="error-text">{error}</p>}
            </form>
          </div>

          <div className="result-card">
            <p className="eyebrow">Latest output</p>
            <h2>Preview</h2>
            {result ? (
              <div className="result-grid">
                <video controls src={result.original_url} />
                <video controls src={result.variation_url} />
                <div className="result-meta">
                  <strong>Prompt</strong>
                  <p>{result.prompt}</p>
                  <strong>Notes</strong>
                  <ul>
                    {result.notes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="placeholder-card">
                Your generated variation will appear here with the original video, output preview, and processing notes.
              </div>
            )}
          </div>
        </section>

        <section className="library-section" id="library">
          <div className="section-heading">
            <p className="eyebrow">Curated inspiration</p>
            <h2>Artlist-style browsing for campaigns and mood boards</h2>
          </div>
          <div className="library-grid">
            {library.map((item) => (
              <article className="library-card" key={item.id}>
                <img src={item.original_url} alt={item.title} />
                <div className="library-copy">
                  <div className="library-title-row">
                    <h3>{item.title}</h3>
                    <span className={`status ${item.status}`}>{item.status}</span>
                  </div>
                  <p>{item.prompt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
