import { useState, useRef, useCallback } from 'react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface-2: #161616;
    --surface-3: #1c1c1c;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --text-1: #f5f5f5;
    --text-2: #a3a3a3;
    --text-3: #525252;
    --accent: #6366f1;
    --accent-dim: rgba(99,102,241,0.12);
    --accent-glow: rgba(99,102,241,0.35);
    --green: #22c55e;
    --green-dim: rgba(34,197,94,0.1);
    --amber: #f59e0b;
    --font: 'Geist', system-ui, sans-serif;
    --mono: 'Geist Mono', 'Fira Code', monospace;
    --radius: 12px;
    --radius-sm: 8px;
    --radius-xs: 6px;
    --transition: 160ms cubic-bezier(0.4,0,0.2,1);
  }

  body { background: var(--bg); }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes appear {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  .app {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font);
    color: var(--text-1);
    display: flex;
    flex-direction: column;
  }

  /* ── NAV ── */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 56px;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .nav-logo {
    width: 28px;
    height: 28px;
    background: var(--accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-wordmark {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-1);
    letter-spacing: -0.02em;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 10px;
  }

  .badge-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-2);
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 2px var(--green-dim);
  }

  /* ── LAYOUT ── */
  .main {
    flex: 1;
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: calc(100vh - 56px);
  }

  /* ── SIDEBAR ── */
  .sidebar {
    border-right: 1px solid var(--border);
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--surface);
    overflow-y: auto;
  }

  .sidebar-section {
    margin-bottom: 8px;
  }

  .sidebar-label {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    color: var(--text-3);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0 8px 8px;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-xs);
    font-size: 13.5px;
    color: var(--text-2);
    cursor: pointer;
    transition: all var(--transition);
    border: 1px solid transparent;
    user-select: none;
  }

  .sidebar-item:hover {
    background: var(--surface-2);
    color: var(--text-1);
    border-color: var(--border);
  }

  .sidebar-item.active {
    background: var(--accent-dim);
    color: var(--accent);
    border-color: rgba(99,102,241,0.2);
  }

  .sidebar-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .sidebar-divider {
    height: 1px;
    background: var(--border);
    margin: 8px 0;
  }

  .sidebar-meta {
    margin-top: auto;
    padding: 12px 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
  }

  .sidebar-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--text-3);
    padding: 3px 0;
  }

  .sidebar-meta-val {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-2);
  }

  /* ── CONTENT ── */
  .content {
    display: flex;
    flex-direction: column;
    background: var(--bg);
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    gap: 12px;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toolbar-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-1);
  }

  .toolbar-sub {
    font-size: 13px;
    color: var(--text-3);
    font-family: var(--mono);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: var(--radius-xs);
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font);
    cursor: pointer;
    transition: all var(--transition);
    border: 1px solid transparent;
    outline: none;
    white-space: nowrap;
    text-decoration: none;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-2);
    border-color: var(--border);
  }

  .btn-ghost:hover {
    background: var(--surface-2);
    color: var(--text-1);
    border-color: var(--border-hover);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    border-color: transparent;
  }

  .btn-primary:hover {
    background: #818cf8;
  }

  .btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-sm {
    padding: 5px 10px;
    font-size: 12px;
    gap: 5px;
  }

  /* ── WORKSPACE ── */
  .workspace {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    overflow: hidden;
  }

  .panel {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
    overflow: hidden;
    animation: appear 0.25s ease both;
  }

  .panel:last-child { border-right: none; }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--text-2);
    letter-spacing: 0.01em;
  }

  .panel-tag {
    font-size: 10px;
    font-family: var(--mono);
    padding: 2px 7px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--text-3);
    background: var(--surface-2);
  }

  .panel-tag.input-tag {
    color: #60a5fa;
    border-color: rgba(96,165,250,0.2);
    background: rgba(96,165,250,0.06);
  }

  .panel-tag.output-tag {
    color: #a78bfa;
    border-color: rgba(167,139,250,0.2);
    background: rgba(167,139,250,0.06);
  }

  .panel-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow: hidden;
    background: var(--bg);
    position: relative;
  }

  /* ── UPLOAD ZONE ── */
  .upload-zone {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1.5px dashed var(--border-hover);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all var(--transition);
    background: transparent;
    padding: 40px;
    text-align: center;
  }

  .upload-zone:hover,
  .upload-zone.drag {
    border-color: var(--accent);
    background: var(--accent-dim);
  }

  .upload-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--surface-2);
    border: 1px solid var(--border-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    transition: all var(--transition);
  }

  .upload-zone:hover .upload-icon-wrap,
  .upload-zone.drag .upload-icon-wrap {
    background: var(--accent-dim);
    border-color: rgba(99,102,241,0.3);
  }

  .upload-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-1);
  }

  .upload-sub {
    font-size: 12.5px;
    color: var(--text-3);
    line-height: 1.5;
  }

  .upload-sub span {
    font-family: var(--mono);
    font-size: 11px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--text-2);
  }

  /* ── IMAGE DISPLAY ── */
  .image-display {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--border);
    animation: appear 0.3s ease;
  }

  .image-display img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 6px;
  }

  /* ── PROCESSING STATE ── */
  .processing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100%;
    justify-content: center;
  }

  .spinner-ring {
    width: 40px;
    height: 40px;
    border: 2px solid var(--surface-3);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .processing-text {
    text-align: center;
  }

  .processing-label {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-1);
    margin-bottom: 4px;
  }

  .processing-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
  }

  .progress-bar {
    width: 160px;
    height: 2px;
    background: var(--surface-3);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 4px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #818cf8, var(--accent));
    background-size: 400px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 99px;
    width: 100%;
  }

  /* ── PANEL FOOTER ── */
  .panel-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .panel-footer-info {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .info-sep { opacity: 0.3; }

  /* ── EMPTY PANEL ── */
  .empty-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
    opacity: 0.4;
  }

  .empty-label {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text-3);
    text-align: center;
    line-height: 1.6;
  }

  /* ── STATUS BAR ── */
  .statusbar {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 24px;
    height: 28px;
    border-top: 1px solid var(--border);
    background: var(--surface);
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
    flex-shrink: 0;
    overflow: hidden;
  }

  .statusbar-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .statusbar-item.ml { margin-left: auto; }

  .status-ok { color: var(--green); }

  /* ── MOBILE RESPONSIVE FIXES ── */
  @media (max-width: 850px) {
    .main {
      display: flex;
      flex-direction: column;
    }
    .sidebar {
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    .workspace {
      display: flex;
      flex-direction: column;
      overflow-y: visible;
    }
    .panel {
      border-right: none;
      border-bottom: 1px solid var(--border);
      min-height: 400px;
    }
    .toolbar {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    .toolbar-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    .statusbar {
      flex-wrap: wrap;
      height: auto;
      padding: 12px 24px;
      gap: 12px;
    }
    .statusbar-item.ml {
      margin-left: 0;
    }
  }
`

const IconUpload = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
  </svg>
)
const IconDownload = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
  </svg>
)
const IconRefresh = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
  </svg>
)
const IconLogo = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
  </svg>
)
const IconFile = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" style={{color:'var(--text-3)'}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
  </svg>
)

export default function App() {
  const [original, setOriginal] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [drag, setDrag] = useState(false)
  const [filename, setFilename] = useState(null)
  const [fileMeta, setFileMeta] = useState(null)
  const inputRef = useRef(null)

  const processFile = useCallback(async (file) => {
    if (!file) return
    setFilename(file.name)
    setFileMeta(`${(file.size / 1024).toFixed(1)} KB · ${file.type.split('/')[1]?.toUpperCase()}`)
    setOriginal(URL.createObjectURL(file))
    setResult(null)
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('https://deweathering-engine-xohp.onrender.com/process', { method: 'POST', body: fd })
      if (res.ok) setResult(URL.createObjectURL(await res.blob()))
      else alert('Backend error. Ensure the FastAPI server is running.')
    } catch { alert('Connection failed. Check your server.') }
    finally { setLoading(false) }
  }, [])

  const handleDownload = () => {
    if (!result) return
    Object.assign(document.createElement('a'), { href: result, download: 'restored_sparse.png' }).click()
  }

  const onDrop = (e) => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files[0]) }
  const onDragOver = (e) => { e.preventDefault(); setDrag(true) }

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo"><IconLogo /></div>
            <span className="nav-wordmark">deweathering</span>
          </div>
          <div className="nav-right">
            <span className="badge">RPCA · IALM</span>
            <div className="badge-status">
              <div className="dot" />
              <span>Engine ready</span>
            </div>
          </div>
        </nav>

        <div className="main">

          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-label">Algorithm</div>
              <div className="sidebar-item active">
                <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                </svg>
                Robust PCA
              </div>
              <div className="sidebar-item" style={{opacity:0.5,cursor:'not-allowed'}}>
                <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3"/>
                </svg>
                Blind Deconvolution
                <span style={{marginLeft:'auto',fontSize:'10px',color:'var(--text-3)'}}>soon</span>
              </div>
              <div className="sidebar-item" style={{opacity:0.5,cursor:'not-allowed'}}>
                <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                </svg>
                Neural Inpainting
                <span style={{marginLeft:'auto',fontSize:'10px',color:'var(--text-3)'}}>soon</span>
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <div className="sidebar-label">Parameters</div>
              {[
                ['Lambda (λ)', '1 / √max(m,n)'],
                ['Tolerance (ε)', '1e-7'],
                ['Max iterations', '1000'],
                ['μ init', '1.25 / ‖D‖₂'],
                ['ρ (scaling)', '1.5'],
              ].map(([k, v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',borderRadius:'6px'}}>
                  <span style={{fontSize:'12.5px',color:'var(--text-2)'}}>{k}</span>
                  <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-3)'}}>{v}</span>
                </div>
              ))}
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-meta">
              <div className="sidebar-meta-row">
                <span>Model</span>
                <span className="sidebar-meta-val">IALM</span>
              </div>
              <div className="sidebar-meta-row">
                <span>Mode</span>
                <span className="sidebar-meta-val">Adaptive rank</span>
              </div>
              <div className="sidebar-meta-row">
                <span>Output</span>
                <span className="sidebar-meta-val">Sparse (E)</span>
              </div>
              <div className="sidebar-meta-row" style={{marginTop:'6px',paddingTop:'6px',borderTop:'1px solid var(--border)'}}>
                <span style={{color:'var(--text-3)'}}>Endpoint</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-3)',maxWidth:'120px',overflow:'hidden',textOverflow:'ellipsis'}}>render.com</span>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="content">
            {/* TOOLBAR */}
            <div className="toolbar">
              <div className="toolbar-left">
                <span className="toolbar-title">Document Restoration</span>
                {filename && <span className="toolbar-sub">/ {filename}</span>}
              </div>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                {result && (
                  <button className="btn btn-ghost btn-sm" onClick={() => { setOriginal(null); setResult(null); setFilename(null) }}>
                    <IconRefresh /> Reset
                  </button>
                )}
                <label className="btn btn-ghost btn-sm" style={{cursor:'pointer'}}>
                  <IconUpload /> Open file
                  <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => processFile(e.target.files[0])} />
                </label>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleDownload}
                  disabled={!result}
                >
                  <IconDownload /> Export
                </button>
              </div>
            </div>

            {/* WORKSPACE */}
            <div className="workspace">

              {/* INPUT PANEL */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <IconFile />
                    input
                    <span className="panel-tag input-tag">D matrix</span>
                  </div>
                  {original && <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-3)'}}>{fileMeta}</span>}
                </div>

                <div className="panel-body">
                  {!original ? (
                    <div
                      className={`upload-zone${drag ? ' drag' : ''}`}
                      onClick={() => inputRef.current?.click()}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={() => setDrag(false)}
                    >
                      <div className="upload-icon-wrap">
                        <IconUpload />
                      </div>
                      <div>
                        <div className="upload-title">Drop a weathered document</div>
                        <div className="upload-sub" style={{marginTop:'6px'}}>
                          or click to browse &nbsp;·&nbsp; <span>PNG</span> <span>JPG</span> <span>JPEG</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="image-display">
                      <img src={original} alt="Input" />
                    </div>
                  )}
                </div>

                <div className="panel-footer">
                  <div className="panel-footer-info">
                    <span>Weathered matrix</span>
                    <span className="info-sep">·</span>
                    <span>D = A + E</span>
                  </div>
                  {original && (
                    <label className="btn btn-ghost btn-sm" style={{cursor:'pointer'}}>
                      Change
                      <input type="file" accept="image/*" style={{display:'none'}} onChange={e => processFile(e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>

              {/* OUTPUT PANEL */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" style={{color:'var(--text-3)'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                    </svg>
                    output
                    <span className="panel-tag output-tag">E matrix</span>
                  </div>
                  {result && (
                    <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11.5px',color:'var(--green)'}}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                      Complete
                    </div>
                  )}
                </div>

                <div className="panel-body">
                  {loading ? (
                    <div className="processing">
                      <div className="spinner-ring" />
                      <div className="processing-text">
                        <div className="processing-label">Running RPCA decomposition</div>
                        <div className="processing-sub">Solving via augmented Lagrangian</div>
                        <div className="progress-bar" style={{margin:'10px auto 0'}}>
                          <div className="progress-fill" />
                        </div>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="image-display" style={{background:'#fff'}}>
                      <img src={result} alt="Restored" />
                    </div>
                  ) : (
                    <div className="empty-panel">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{color:'var(--text-3)'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                      </svg>
                      <div className="empty-label">
                        Upload a document to<br/>begin restoration
                      </div>
                    </div>
                  )}
                </div>

                <div className="panel-footer">
                  <div className="panel-footer-info">
                    <span>Sparse component</span>
                    <span className="info-sep">·</span>
                    <span>Low-rank stains removed</span>
                  </div>
                  {result && (
                    <button className="btn btn-ghost btn-sm" onClick={handleDownload}>
                      <IconDownload /> Save PNG
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* STATUS BAR */}
            <div className="statusbar">
              <div className="statusbar-item">
                <span className="status-ok">●</span>
                <span>engine online</span>
              </div>
              <div className="statusbar-item">
                <span>algo: IALM</span>
              </div>
              <div className="statusbar-item">
                <span>λ = 1/√max(m,n)</span>
              </div>
              {filename && (
                <div className="statusbar-item">
                  <span>file: {filename}</span>
                </div>
              )}
              <div className="statusbar-item ml">
                <span>deweathering-engine-xohp.onrender.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
