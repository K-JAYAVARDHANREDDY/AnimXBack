import { TextScramble } from '@animx-jaya/animations'
import { CounterAnimation } from '@animx-jaya/animations'
import { NeonGlow } from '@animx-jaya/animations'
import { ANIMATION_REGISTRY } from '@animx-jaya/animations'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Installed from npm
        </div>
        <h1 className="hero-title">
          <span className="gradient-text">@animx-jaya</span>
          <br />
          in action
        </h1>
        <p className="hero-subtitle">
          This project uses <code>@animx-jaya/animations</code> and <code>@animx-jaya/core</code> installed directly from npm.
        </p>
        <div className="install-command">
          <code>npm i @animx-jaya/animations @animx-jaya/core</code>
        </div>
      </header>

      {/* Registry Info */}
      <section className="registry-section">
        <h2 className="section-title">📦 Animation Registry</h2>
        <p className="section-desc">
          <code>ANIMATION_REGISTRY</code> contains <strong>{ANIMATION_REGISTRY.length}</strong> ready-to-use animations
        </p>
        <div className="registry-grid">
          {ANIMATION_REGISTRY.map((entry) => (
            <div key={entry.id} className="registry-card">
              <div className="card-engine">{(entry.metadata as any).engine ?? 'unknown'}</div>
              <h3 className="card-name">{(entry.metadata as any).name ?? entry.id}</h3>
              <p className="card-desc">{(entry.metadata as any).description ?? ''}</p>
              <div className="card-meta">
                <span className="card-difficulty">{(entry.metadata as any).difficulty ?? '—'}</span>
                <span className="card-category">{(entry.metadata as any).category ?? '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demos */}
      <section className="demo-section">
        <h2 className="section-title">🎬 Live Demos</h2>
        <p className="section-desc">These components are imported directly from <code>@animx-jaya/animations</code></p>

        <div className="demo-block">
          <div className="demo-header">
            <h3>TextScramble</h3>
            <code className="import-code">{"import { TextScramble } from '@animx-jaya/animations'"}</code>
          </div>
          <div className="demo-content">
            <TextScramble />
          </div>
        </div>

        <div className="demo-block">
          <div className="demo-header">
            <h3>CounterAnimation</h3>
            <code className="import-code">{"import { CounterAnimation } from '@animx-jaya/animations'"}</code>
          </div>
          <div className="demo-content">
            <CounterAnimation />
          </div>
        </div>

        <div className="demo-block">
          <div className="demo-header">
            <h3>NeonGlow</h3>
            <code className="import-code">{"import { NeonGlow } from '@animx-jaya/animations'"}</code>
          </div>
          <div className="demo-content dark-bg">
            <NeonGlow />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with <span className="heart">❤️</span> using{' '}
          <a href="https://www.npmjs.com/package/@animx-jaya/animations" target="_blank">@animx-jaya/animations</a>
          {' '}+{' '}
          <a href="https://www.npmjs.com/package/@animx-jaya/core" target="_blank">@animx-jaya/core</a>
        </p>
      </footer>
    </div>
  )
}

export default App
