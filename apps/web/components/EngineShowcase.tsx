'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimX } from '@animx-jaya/core'
import gsap from 'gsap'
import './EngineShowcase.css'

export function EngineShowcase() {
  return (
    <div className="engine-showcase-wrapper">
      <GodModeSection />
      <PracticalUxSection />
      
      {/* ── Visual Separator ── */}
      <div className="flex items-center justify-center py-10 opacity-30">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   God Mode Demo Section
   Showcases Time Dilation, Particles, 3D Spatial, Procedural features
─────────────────────────────────────────────────────────── */
function GodModeSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Demo Refs
  const timeBoxRef = useRef<HTMLDivElement>(null)
  const particleBoxRef = useRef<HTMLDivElement>(null)
  const spatialCardRef = useRef<HTMLDivElement>(null)
  const generativeDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Start physics loop on timeBox to show dilation
    if (timeBoxRef.current) {
        gsap.to(timeBoxRef.current, { rotation: 360, repeat: -1, ease: 'linear', duration: 2 })
    }
  }, [])

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <section className="section-container" style={{ marginTop: '2rem' }}>
      <div className="section-header text-center sm:text-left">
        <div className="section-badge mx-auto sm:mx-0" style={{ background: 'rgba(255, 0, 85, 0.2)', color: '#ff0055', borderColor: '#ff0055', display: 'inline-block', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>v2.0 Exclusive</div>
        <h2 className="section-title text-3xl sm:text-4xl font-black mb-3">AnimX "God Mode"</h2>
        <p className="section-desc max-w-2xl text-gray-400">
          Pushing the boundaries of DOM animation. Frame-perfect time dilation, DOM particle physics, and native 3D extrusion.
        </p>
      </div>

      <div className="novel-grid">
        
        {/* ── 01. GLOBAL TIME WARP ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">01</span><h3 className="novel-title text-xl font-bold">Global Time Warp</h3></div>
            <span className="props-badge">Time Controller</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Instantly scale time for <em>every</em> animation on the page. Slow-motion, fast-forward, or reverse.
          </p>
          <div className="engine-preview" style={{ flexDirection: 'column', gap: 16 }}>
             <div ref={timeBoxRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#ff477e,#9d4edd)', borderRadius: '10%' }}>
               <span>Time ⏱️</span>
             </div>
             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
               <button className="engine-play-btn" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => AnimX.time().slowMotion(0.1)}>🐌 Slow (0.1x)</button>
               <button className="engine-play-btn" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => AnimX.time().normal()}>▶ Normal (1x)</button>
               <button className="engine-play-btn" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => AnimX.time().fastForward(4)}>⚡ Fast (4x)</button>
             </div>
          </div>
          <div className="engine-snippet">
             <pre><code>{`AnimX.time().slowMotion(0.1)\nAnimX.time().fastForward(4)\nAnimX.time().normal()`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('time', 'AnimX.time().slowMotion(0.1)')}>{copiedKey === 'time' ? '✓' : 'Copy'}</button>
          </div>
        </div>

        {/* ── 02. NATIVE DOM PARTICLES ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">02</span><h3 className="novel-title text-xl font-bold">Native DOM Particles</h3></div>
            <span className="props-badge">Physics Emitter</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Shatter any DOM element into physics-driven particles natively — no Canvas or WebGL required.
          </p>
          <div className="engine-preview" style={{ flexDirection: 'column', gap: 16, height: 200, position: 'relative' }}>
             <div 
                ref={particleBoxRef} 
                className="engine-box" 
                style={{ background: 'linear-gradient(135deg,#00f5ff,#9d4edd)', cursor: 'pointer', zIndex: 100 }}
                onClick={() => {
                  AnimX.particles(particleBoxRef.current!).explode({ count: 40, spread: 200, color: '#00f5ff' })
                  setTimeout(() => gsap.to(particleBoxRef.current, { opacity: 1 }), 1500)
                }}
             >
               <span>Click to Shatter 💥</span>
             </div>
             <button className="engine-play-btn" style={{ padding: '8px 12px', fontSize: 12 }} 
                onClick={() => AnimX.particles(document.body).rain({ count: 60, color: '#ff477e' })}>
                🌧️ Rain Particles
             </button>
          </div>
          <div className="engine-snippet">
             <pre><code>{`AnimX.particles('#btn').explode({ count: 40 })\nAnimX.particles('body').rain({ color: 'gold' })`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('particles', "AnimX.particles('#btn').explode()")}>{copiedKey === 'particles' ? '✓' : 'Copy'}</button>
          </div>
        </div>

        {/* ── 03. SPATIAL 3D EXTRUSION ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">03</span><h3 className="novel-title text-xl font-bold">Spatial 3D Engine</h3></div>
            <span className="props-badge">Z-Space</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Extrude any flat 2D element into layered 3D depth and track gyroscope or mouse perspective automatically.
          </p>
          <div className="engine-preview" style={{ height: 200 }}>
             <div ref={spatialCardRef} className="engine-box" style={{ background: '#0a0e1a', border: '1px solid #9d4edd', color: '#9d4edd' }}>
               <span>Hover me 🕶️</span>
             </div>
          </div>
          <button className="engine-play-btn" style={{ borderRadius: 0, margin: 0, borderTop: '1px solid var(--border)' }} onClick={(e) => {
             const btn = e.currentTarget
             AnimX.spatial(spatialCardRef.current!).depth(12).trackMousePerspective()
             btn.textContent = "3D Enabled (Move Mouse)"
             btn.disabled = true
          }}>
             🧊 Enable 3D Depth
          </button>
          <div className="engine-snippet">
             <pre><code>{`AnimX.spatial('#card')\n  .depth(12)\n  .trackMousePerspective()`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('spatial', "AnimX.spatial('#card').depth(12).trackMousePerspective()")}>{copiedKey === 'spatial' ? '✓' : 'Copy'}</button>
          </div>
        </div>

        {/* ── 04. GENERATIVE MOTION ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">04</span><h3 className="novel-title text-xl font-bold">Generative Motion</h3></div>
            <span className="props-badge">Procedural AI</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Move elements organically using procedural algorithmic noise instead of A-to-B linear keyframes.
          </p>
          <div className="engine-preview" style={{ height: 200 }}>
             <div ref={generativeDotRef} style={{ width: 20, height: 20, borderRadius: '50%', background: '#ff9d00', boxShadow: '0 0 20px #ff9d00' }}></div>
          </div>
          <button className="engine-play-btn" style={{ borderRadius: 0, margin: 0, borderTop: '1px solid var(--border)' }} onClick={(e) => {
             const btn = e.currentTarget
             AnimX.generative(generativeDotRef.current!).wander({ speed: 4, bounds: 80 })
             btn.textContent = "Wandering..."
             btn.disabled = true
          }}>
             ✨ Start Wander
          </button>
          <div className="engine-snippet">
             <pre><code>{`AnimX.generative('.firefly')\n  .wander({ speed: 4, bounds: 80 })`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('gen', "AnimX.generative('.firefly').wander()")}>{copiedKey === 'gen' ? '✓' : 'Copy'}</button>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   Practical UX Demo Section
─────────────────────────────────────────────────────────── */
function PracticalUxSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Demo Refs
  const scrollBoxRef = useRef<HTMLDivElement>(null)
  const magneticBtnRef = useRef<HTMLButtonElement>(null)
  const [items, setItems] = useState([1, 2, 3])
  const flipContainerRef = useRef<HTMLDivElement>(null)
  const typoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (magneticBtnRef.current) {
       const mag = AnimX.magnetic(magneticBtnRef.current).interact(50)
       return () => { if ((mag as any).destroy) (mag as any).destroy() }
    }
  }, [])

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const shuffleItems = () => {
    if (!flipContainerRef.current) return
    AnimX.layout(flipContainerRef.current).flip(() => {
      setItems(prev => [...prev].sort(() => Math.random() - 0.5))
    })
  }

  return (
    <section className="section-container" style={{ marginTop: '2rem' }}>
      <div className="section-header text-center sm:text-left mt-8">
        <div className="section-badge mx-auto sm:mx-0" style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', borderColor: '#00ff88', display: 'inline-block', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Essential Everyday UX</div>
        <h2 className="section-title text-3xl sm:text-4xl font-black mb-3">AnimX "Practical Superpowers"</h2>
        <p className="section-desc max-w-2xl text-gray-400">
          Replacing hours of boilerplate with single-line native DOM operations. FLIP transitions, scroll pinning, magnetic cursors, and text engines.
        </p>
      </div>

      <div className="novel-grid">
        
        {/* ── 01. SCROLL REVEAL ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">01</span><h3 className="novel-title text-xl font-bold">Scroll Storytelling</h3></div>
            <span className="props-badge">ScrollEngine</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Instantly tie elements to scroll triggers. Scrub sequences, pin backgrounds, or reveal on viewport entry.
          </p>
          <div className="engine-preview" style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
             <div ref={scrollBoxRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#00ff88,#0A0A10)' }}>
               <span>Scroll Me! 📜</span>
             </div>
          </div>
          <button className="engine-play-btn" style={{ borderRadius: 0, margin: 0, borderTop: '1px solid var(--border)' }} onClick={(e) => {
             const btn = e.currentTarget
             AnimX.scroll(scrollBoxRef.current!).parallax(1.5)
             btn.textContent = "Parallax Active (Scroll page)"
             btn.disabled = true
          }}>
             ⬇️ Enable Parallax
          </button>
          <div className="engine-snippet">
             <pre><code>{`AnimX.scroll('.card')\n  .reveal({ distance: 50 })\nAnimX.scroll('.bg').parallax()`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('scroll', 'AnimX.scroll(".card").reveal()')}>{copiedKey === 'scroll' ? '✓' : 'Copy'}</button>
          </div>
        </div>

        {/* ── 02. FLIP ENGINE ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">02</span><h3 className="novel-title text-xl font-bold">Layout FLIP Engine</h3></div>
            <span className="props-badge">First Last Invert Play</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Animate DOM hierarchy changes elegantly. Perfect for grid filtering, list sorting, and card morphing.
          </p>
          <div className="engine-preview" style={{ height: 200, display: 'flex', flexDirection: 'column', gap: 10, padding: 20 }} ref={flipContainerRef}>
             {items.map(i => (
                <div key={i} style={{ width: '100%', height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                   Item {i}
                </div>
             ))}
          </div>
          <button className="engine-play-btn" style={{ borderRadius: 0, margin: 0, borderTop: '1px solid var(--border)' }} onClick={shuffleItems}>
             🔀 Shuffle Items
          </button>
          <div className="engine-snippet">
             <pre><code>{`AnimX.layout('#grid').flip(() => {\n  setItems(shuffled)\n})`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('flip', "AnimX.layout('#grid').flip(() => { stateChange() })")}>{copiedKey === 'flip' ? '✓' : 'Copy'}</button>
          </div>
        </div>

        {/* ── 03. MAGNETIC UX ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">03</span><h3 className="novel-title text-xl font-bold">Magnetic Cursors</h3></div>
            <span className="props-badge">Micro-interaction</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Premium agency feel out of the box. Automatically pulls interacting buttons toward the mouse cursor softly.
          </p>
          <div className="engine-preview" style={{ height: 200 }}>
             <button ref={magneticBtnRef} style={{ background: 'linear-gradient(135deg, #ff477e, #ff0055)', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: 30, cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>
               Hover & Pull Me 🧲
             </button>
          </div>
          <div className="engine-snippet">
             <pre><code>{`AnimX.magnetic('#btn')\n  .interact(50 /* pull strength */)`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('magnetic', "AnimX.magnetic('#btn').interact(50)")}>{copiedKey === 'magnetic' ? '✓' : 'Copy'}</button>
          </div>
        </div>

        {/* ── 04. TYPOGRAPHY ENGINE ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">04</span><h3 className="novel-title text-xl font-bold">Advanced Typography</h3></div>
            <span className="props-badge">Text Engine</span>
          </div>
          <p className="novel-desc text-sm text-gray-400 mb-4 px-6 pt-4">
            Terminal typewriting, hacker decoding, and scramble effects natively supported for strings.
          </p>
          <div className="engine-preview" style={{ height: 200 }}>
             <div ref={typoRef} style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>
               SYSTEM_READY
             </div>
          </div>
          <button className="engine-play-btn" style={{ borderRadius: 0, margin: 0, borderTop: '1px solid var(--border)' }} onClick={() => {
             AnimX.text(typoRef.current!).scramble('ACCESS_GRANTED', 1.5)
          }}>
             🔐 Scramble Text
          </button>
          <div className="engine-snippet">
             <pre><code>{`AnimX.text('#hero')\n  .scramble('Hello World', 1.5)`}</code></pre>
             <button className="engine-copy-btn" onClick={() => copy('text', "AnimX.text('#hero').scramble('Hello', 1.5)")}>{copiedKey === 'text' ? '✓' : 'Copy'}</button>
          </div>
        </div>

      </div>
    </section>
  )
}
