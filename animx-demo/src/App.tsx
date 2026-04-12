import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { 
  TextScramble,
  CounterAnimation,
  NeonGlow,
  InfiniteTextMarquee,
  StaggerPulse,
  MagneticCursor,
  PaperFoldScroll,
  ParallaxHero,
  HorizontalScrollText,
  ScrollExpandMedia,
  SvgPathDrawing,
  TestimonialStackCards,
  CardFlip3D,
  FullscreenCardSwipe,
  ANIMATION_REGISTRY
} from '@animx-jaya/animations'
import { AnimX, AnimXSignal } from '@animx-jaya/core'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Premium Next-Gen UI
        </div>
        <h1 className="hero-title">
          <span className="gradient-text">AnimX</span>
          <br />
          Experience Design
        </h1>
        <p className="hero-subtitle">
          Every animation is carefully crafted and <strong>100% customizable</strong> via props. 
          Unleash fluid motion, vibrant glows, and responsive interactions right out of the box.
        </p>
        <div className="install-command">
          <code>npm i @animx-jaya/animations @animx-jaya/core</code>
        </div>
      </header>

      {/* Registry Info */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Component Registry</h2>
          <p className="section-desc">
            Explore our curated library of <strong>{ANIMATION_REGISTRY.length}</strong> premium animations
          </p>
        </div>
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
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Live Interactive Showcase</h2>
          <p className="section-desc">Witness state-of-the-art micro-interactions configured entirely via props.</p>
        </div>

        <div className="demo-showcase">
          {/* TextScramble */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>TextScramble</h3>
              <span className="props-badge">Text Deciphering</span>
            </div>
            <div className="demo-props">
              <code>fontSize="3rem" fontWeight={900} letterSpacing="0.15em" textTransform="uppercase" hoverTrigger={true}</code>
            </div>
            <div className="demo-content">
              <TextScramble 
                text="SYSTEM OVERRIDE" 
                color="#00f5ff" 
                speed={60}
                fontSize="4rem"
                fontWeight={900}
                letterSpacing="0.15em"
                textTransform="uppercase"
                hoverTrigger={true}
              />
            </div>
          </div>

          {/* CounterAnimation */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>CounterAnimation</h3>
              <span className="props-badge">Metrics Display</span>
            </div>
            <div className="demo-props">
              <code>bgColor="rgba(10,10,16,0.6)" valueColor="#9d4edd" columns={4} cardBorderRadius="24px" staggerDelay={150}</code>
            </div>
            <div className="demo-content">
              <CounterAnimation 
                duration={4} 
                accentColor="#9d4edd"
                bgColor="rgba(10,10,16,0.6)"
                valueColor="#00f5ff"
                labelColor="#a0a0b8"
                columns={4}
                gap="1.5rem"
                cardBorderRadius="24px"
                staggerDelay={150}
                easing="ease-out"
              />
            </div>
          </div>

          {/* NeonGlow */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>NeonGlow</h3>
              <span className="props-badge">Luminous Interface</span>
            </div>
            <div className="demo-props">
              <code>glowColor="#ff477e" bgColor="#050508" borderRadius={24} defaultTab="gaming" showFooter={false}</code>
            </div>
            <div className="demo-content">
              <NeonGlow 
                glowColor="#ff477e"
                bgColor="#050508"
                borderRadius={24}
                defaultTab="gaming"
                showFooter={false}
                flickerDuration={2}
              />
            </div>
          </div>

          {/* InfiniteTextMarquee */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>InfiniteTextMarquee</h3>
              <span className="props-badge">Fluid Typography</span>
            </div>
            <div className="demo-props">
              <code>bgColor="rgba(157, 78, 221, 0.1)" textColor="#ff477e" fontSize="3rem" rowGap="1rem" padding="2rem"</code>
            </div>
            <div className="demo-content">
              <InfiniteTextMarquee 
                topText="ULTRA RESPONSIVE" 
                bottomText="MODERN AESTHETICS" 
                speed={12}
                bgColor="rgba(157, 78, 221, 0.05)"
                textColor="#00f5ff"
                fontSize="3.5rem"
                fontWeight={800}
                separator=" • "
                rowGap="1rem"
                padding="2rem"
                borderRadius="24px"
              />
            </div>
          </div>

          {/* StaggerPulse */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>StaggerPulse</h3>
              <span className="props-badge">Grid Symphony</span>
            </div>
            <div className="demo-props">
              <code>bgColor="transparent" accentColor="#00f5ff" defaultCols={8} defaultRows={4} defaultPattern="ripple"</code>
            </div>
            <div className="demo-content">
              <StaggerPulse 
                accentColor="#00f5ff"
                bgColor="rgba(10,10,16,0.6)"
                borderRadius={24}
                defaultCols={8}
                defaultRows={4}
                defaultElemSize={16}
                defaultPattern="ripple"
                defaultAnimKind="bounce"
                defaultSpeed={600}
                showTabs={true}
                defaultTab="chat"
              />
            </div>
          </div>

          {/* MagneticCursor */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>MagneticCursor</h3>
              <span className="props-badge">Delightful Interactions</span>
            </div>
            <div className="demo-props">
              <code>headline="Build Amazing" headlineAccent="Products" showStats={true} gradientSecondary="#ff477e"</code>
            </div>
            <div className="demo-content">
              <MagneticCursor 
                strength={0.5}
                radius={120}
                bgColor="#9d4edd"
                containerBgColor="rgba(10,10,16,0.6)"
                containerBorderRadius={32}
                headline="Build Amazing"
                headlineAccent="Experiences"
                subtitle="Interactions that snap, guide, and adapt instantly"
                ctaText="Start Building →"
                secondaryCtaText="View API"
                brandName="AnimX"
                logoText="A"
                navItems={['Design', 'Components', 'Docs']}
                stats={[
                  { label: 'Latency', value: '<5ms' },
                  { label: 'Integrations', value: '10+' },
                  { label: 'Satisfaction', value: '100%' }
                ]}
                showStats={true}
                showBadge={true}
                badgeText="Interactive"
                gradientSecondary="#00f5ff"
              />
            </div>
          </div>

          {/* PaperFoldScroll */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>PaperFoldScroll</h3>
              <span className="props-badge">Origami Perspective</span>
            </div>
            <div className="demo-props">
              <code>height={500} foldScale={0.85} perspective={1200} borderRadius="24px"</code>
            </div>
            <div className="demo-content" style={{ height: '600px', display: 'flex', alignItems: 'center' }}>
              <PaperFoldScroll 
                height={500}
                foldScale={0.88}
                rotateX={6}
                rotateY={3}
                foldOpacity={0.6}
                borderRadius="24px"
                perspective={1200}
                showScrollIndicator={true}
                showPageCounter={true}
                titleFontSize="2rem"
                contentFontSize="1rem"
              />
            </div>
          </div>

          {/* ParallaxHero */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>ParallaxHero</h3>
              <span className="props-badge">Multi-layered Depth</span>
            </div>
            <div className="demo-props">
              <code>layerSpeed1={0.2} layerSpeed2={0.5} gridColor="#9d4edd" borderRadius={24}</code>
            </div>
            <div className="demo-content" style={{ height: '600px', display: 'flex', alignItems: 'center' }}>
              <ParallaxHero 
                headline="ELEVATE VISION"
                subline="Discover immersive scrollytelling depth"
                accentColor="#9d4edd"
                bgColor="rgba(10,10,16,0.8)"
                layerSpeed1={0.2}
                layerSpeed2={0.5}
                layerSpeed3={0.8}
                containerHeight={520}
                borderRadius={24}
                showTabs={true}
                defaultTab="saas"
                ctaText="Engage Gravity"
                badgeText="✨ True 3D Depth"
                gridColor="#00f5ff"
                gridOpacity={0.1}
                gridSize={64}
              />
            </div>
          </div>

          {/* HorizontalScrollText */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>HorizontalScrollText</h3>
              <span className="props-badge">Kinetic Scrubbing</span>
            </div>
            <div className="demo-props">
              <code>fontSize="clamp(4rem, 12vw, 10rem)" textStrokeColor="#ff477e" height={400}</code>
            </div>
            <div className="demo-content">
              <HorizontalScrollText 
                bgColor="rgba(10,10,16,0.6)"
                textColor="#ff477e"
                scrubDuration={2}
                fontSize="clamp(4rem, 12vw, 10rem)"
                fontWeight={900}
                letterSpacing="-0.02em"
                textStrokeWidth={2}
                textStrokeColor="#ff477e"
                separator=" — "
                repeatCount={4}
                height={400}
                paddingY="4rem"
                borderRadius="24px"
                showScrollHint={true}
              />
            </div>
          </div>

          {/* ScrollExpandMedia */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>ScrollExpandMedia</h3>
              <span className="props-badge">Immersive Framing</span>
            </div>
            <div className="demo-props">
              <code>initialScale={0.5} initialBorderRadius={48} finalBorderRadius={0} scrollMultiplier={1.4}</code>
            </div>
            <div className="demo-content">
              <ScrollExpandMedia 
                mediaType="image" 
                mediaUrl="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                initialScale={0.5}
                finalScale={1}
                initialBorderRadius={48}
                finalBorderRadius={0}
                height={500}
                scrollMultiplier={1.4}
                bgColor="rgba(10,10,16,0.6)"
                containerBorderRadius="24px"
                showScrollHint={true}
                ease="power2.inOut"
              />
            </div>
          </div>

          {/* SvgPathDrawing */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>SvgPathDrawing</h3>
              <span className="props-badge">Vector Tracing</span>
            </div>
            <div className="demo-props">
              <code>defaultText="FUTURE" strokeColor="#00f5ff" bgColor="rgba(10,10,16,0.8)"</code>
            </div>
            <div className="demo-content">
              <SvgPathDrawing 
                strokeColor="#00f5ff"
                strokeWidth={3}
                duration={3}
                defaultText="FUTURE"
                defaultFontIndex={1}
                defaultAnimMode="letter"
                staggerDelay={0.15}
                maxLength={10}
                bgColor="rgba(10,10,16,0.8)"
                canvasBgColor="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                showControls={true}
                ease="power3.inOut"
              />
            </div>
          </div>

          {/* TestimonialStackCards */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>TestimonialStackCards</h3>
              <span className="props-badge">Cascade Reviews</span>
            </div>
            <div className="demo-props">
              <code>cardWidth={220} cardHeight={280} bgTextFontSize="10vw" accentColor="#9d4edd"</code>
            </div>
            <div className="demo-content" style={{ height: '700px', display: 'flex', alignItems: 'center' }}>
              <TestimonialStackCards 
                textColor="#ffffff"
                accentColor="#9d4edd"
                bgColor="rgba(10,10,16,0.6)"
                panelHeight={640}
                scrollPerCard={320}
                cardWidth={220}
                cardHeight={280}
                cardBorderRadius={24}
                cardPadding={32}
                bgTextFontSize="clamp(48px, 10vw, 140px)"
                bgTextOpacity={[0.04, 0.08, 0.04]}
                cardRotations={[-8, 0, 8]}
                showScrollIndicator={true}
                quoteFontSize="0.95rem"
                nameFontSize="0.9rem"
                roleFontSize="0.8rem"
              />
            </div>
          </div>

          {/* CardFlip3D */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>CardFlip3D</h3>
              <span className="props-badge">Spatial Flipping</span>
            </div>
            <div className="demo-props">
              <code>cardWidth={300} cardHeight={400} perspective={1400} frontBg="rgba(20,20,30,0.8)" backBg="#9d4edd"</code>
            </div>
            <div className="demo-content">
              <CardFlip3D 
                flipDirection="horizontal"
                duration={0.9}
                accentColor="#00f5ff"
                cardWidth={300}
                cardHeight={400}
                perspective={1400}
                borderRadius={32}
                frontBg="rgba(10,10,16,0.9)"
                backBg="#9d4edd"
                frontTitle="Unveil Secret"
                backTitle="Matrix Entry"
                frontEmoji="🌌"
                backText="Pure CSS 3D transforms managed entirely via props, creating beautiful dimensional interfaces."
                ease={[0.76, 0, 0.24, 1]}
                showDemoCards={true}
              />
            </div>
          </div>

          {/* FullscreenCardSwipe */}
          <div className="demo-block">
            <div className="demo-header">
              <h3>FullscreenCardSwipe</h3>
              <span className="props-badge">Cinematic Transitions</span>
            </div>
            <div className="demo-props">
              <code>pages with image="url" overlayOpacity={0.6}</code>
            </div>
            <div className="demo-content" style={{ height: '700px', display: 'flex', alignItems: 'center' }}>
              <FullscreenCardSwipe 
                initialPages={[
                  {
                    id: 1,
                    label: '01',
                    title: 'Neon Dreams',
                    subtitle: 'Cityscapes at night',
                    bg: '#050508',
                    accent: '#9d4edd',
                    textColor: '#ffffff',
                    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200',
                    imagePosition: 'center',
                    overlayOpacity: 0.6
                  },
                  {
                    id: 2,
                    label: '02',
                    title: 'Synthwave',
                    subtitle: 'Retro aesthetics',
                    bg: '#0a0a10',
                    accent: '#ff477e',
                    textColor: '#ffffff',
                    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200',
                    imagePosition: 'center',
                    overlayOpacity: 0.5
                  },
                  {
                    id: 3,
                    label: '03',
                    title: 'Cyberpunk',
                    subtitle: 'Digital futures',
                    bg: '#050508',
                    accent: '#00f5ff',
                    textColor: '#ffffff',
                    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
                    imagePosition: 'center',
                    overlayOpacity: 0.65
                  }
                ]}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── Core Engine Demo ── */}
      <CoreEngineSection />

      {/* ── God Mode Engine Demo ── */}
      <GodModeSection />

      {/* ── Practical UX Engine Demo ── */}
      <PracticalUxSection />

      {/* ── Iframe Embed Demo ── */}
      <IframeEmbedSection />

      {/* Props Summary */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Metrics</h2>
          <p className="section-desc">Extensive configuration capabilities across the entire library</p>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-number">150+</span>
            <span className="summary-label">Dynamic Props</span>
          </div>
          <div className="summary-card">
            <span className="summary-number">14</span>
            <span className="summary-label">Premium Components</span>
          </div>
          <div className="summary-card">
            <span className="summary-number">100%</span>
            <span className="summary-label">TypeScript Safe</span>
          </div>
          <div className="summary-card">
            <span className="summary-number">1</span>
            <span className="summary-label">Unified Core Engine</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Architected with <span className="heart">❤</span> using{' '}
          <a href="https://www.npmjs.com/package/@animx-jaya/animations" target="_blank" rel="noreferrer">@animx-jaya/animations</a>
          {' '}+{' '}
          <a href="https://www.npmjs.com/package/@animx-jaya/core" target="_blank" rel="noreferrer">@animx-jaya/core</a>
        </p>
        <p>State-of-the-art interactive motion library for modern web applications</p>
      </footer>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   CoreEngineSection
   Showcases the 6 novel AnimX capabilities that no other library has
────────────────────────────────────────────────────────── */
function CoreEngineSection() {
  // Refs for intent demo
  const intentBoxRef = useRef<HTMLDivElement>(null)
  const [activeIntent, setActiveIntent] = useState<string>('celebrate')

  // Refs for physics demo
  const springBoxRef  = useRef<HTMLDivElement>(null)
  const gravityBallRef = useRef<HTMLDivElement>(null)
  const orbitDotRef   = useRef<HTMLDivElement>(null)
  const orbitStopRef  = useRef<(() => void) | null>(null)
  const [orbitActive, setOrbitActive] = useState(false)

  // Refs for signal demo
  const signalBarRef  = useRef<HTMLInputElement>(null)
  const signalBoxRef  = useRef<HTMLDivElement>(null)
  const [signalVal, setSignalVal] = useState(0)
  const liveSignal = useRef<AnimXSignal>(null as any)

  // Refs for sequencer demo
  const seq1Ref = useRef<HTMLDivElement>(null)
  const seq2Ref = useRef<HTMLDivElement>(null)
  const seq3Ref = useRef<HTMLDivElement>(null)

  // Refs for morph demo
  const morphTextRef   = useRef<HTMLDivElement>(null)
  const morphNumRef    = useRef<HTMLDivElement>(null)
  const morphColorRef  = useRef<HTMLDivElement>(null)
  const [morphPhase, setMorphPhase] = useState(0)

  // Refs for choreograph demo
  const waveDotsRef  = useRef<HTMLDivElement>(null)
  const waveStopRef  = useRef<(() => void) | null>(null)
  const [waveActive, setWaveActive] = useState(false)

  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // ----- Signal setup -----
  useEffect(() => {
    // @ts-ignore — create signal on mount
    liveSignal.current = AnimX.signal(0)
    liveSignal.current.subscribe((v: number) => setSignalVal(v))
    if (signalBoxRef.current) {
      AnimX.sync(liveSignal.current).bind(signalBoxRef.current, {
        x: [-80, 80], scale: [0.7, 1.2], opacity: [0.3, 1]
      })
    }
  }, [])

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // ── Feature blocks ──────────────────────────────────
  const intents = [
    { id: 'celebrate', emoji: '🎉', label: 'Celebrate' },
    { id: 'error',     emoji: '❌', label: 'Error'     },
    { id: 'success',   emoji: '✅', label: 'Success'   },
    { id: 'warn',      emoji: '⚠️', label: 'Warn'      },
    { id: 'attention', emoji: '👁',  label: 'Attention' },
    { id: 'loading',   emoji: '⏳', label: 'Loading'   },
  ]

  return (
    <section className="section-container">
      <div className="section-header">
        <div className="section-badge">@animx-jaya/core — What Makes It Different</div>
        <h2 className="section-title">AnimX Core Engine</h2>
        <p className="section-desc">
          6 capabilities no other animation library has — built into one unified engine.
        </p>
      </div>

      <div className="novel-grid">

        {/* ── 1. INTENT SYSTEM ───────────────────────────── */}
        <div className="novel-card">
          <div className="demo-header">
            <div>
              <span className="novel-number">01</span>
              <h3 className="novel-title">Intent System</h3>
            </div>
            <span className="props-badge">Semantic Animations</span>
          </div>
          <p className="novel-desc">
            Tell AnimX <em>what feeling</em> you want — not how to achieve it.
            It composes the right multi-step, multi-property animation automatically.
          </p>

          {/* Intent picker */}
          <div className="intent-pills">
            {intents.map(({ id, emoji, label }) => (
              <button
                key={id}
                className={`intent-pill ${activeIntent === id ? 'active' : ''}`}
                onClick={() => setActiveIntent(id)}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          <div className="engine-preview">
            <div
              ref={intentBoxRef}
              className="intent-box"
              onClick={() => {
                if (intentBoxRef.current)
                  AnimX.intent(activeIntent as any, intentBoxRef.current).play()
              }}
              title="Click to trigger"
            >
              <span style={{ fontSize: 28 }}>
                {intents.find(x => x.id === activeIntent)?.emoji}
              </span>
              <span style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>Click me</span>
            </div>
          </div>

          <div className="engine-snippet">
            <pre><code>{`// No manual tweens. Just describe the feeling:
AnimX.intent('${activeIntent}', '#my-element').play()

// Works with DOM refs too:
AnimX.intent('success', buttonEl).play()`}</code></pre>
            <button className="engine-copy-btn" onClick={() => copy('intent', `AnimX.intent('${activeIntent}', '#my-element').play()`)}>
              {copiedKey === 'intent' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── 2. REAL PHYSICS ────────────────────────────── */}
        <div className="novel-card">
          <div className="demo-header">
            <div>
              <span className="novel-number">02</span>
              <h3 className="novel-title">Real Physics</h3>
            </div>
            <span className="props-badge">Differential Equations</span>
          </div>
          <p className="novel-desc">
            Spring, gravity, and orbital motion solved via actual ODE integrators —
            not cubic-bezier approximations. Real mass, stiffness, damping, restitution.
          </p>

          <div className="engine-preview" style={{ gap: 24, flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div ref={springBoxRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#9d4edd,#00f5ff)', width: 80, height: 50, fontSize: 11 }}>
                <span>Spring</span>
              </div>
              <button className="engine-play-btn" style={{ margin: 0, padding: '8px 16px', fontSize: 12 }}
                onClick={() => {
                  if (!springBoxRef.current) return
                  AnimX.physics(springBoxRef.current).spring({ stiffness: 180, damping: 8 }).to({ x: 80 }).play()
                  setTimeout(() => AnimX.physics(springBoxRef.current!).spring({ stiffness: 180, damping: 8 }).to({ x: 0 }).play(), 1200)
                }}>
                ▶ Spring
              </button>
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div ref={gravityBallRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#ff477e,#ff9d00)', width: 50, height: 50, borderRadius: '50%', fontSize: 18 }}>
                ⚽
              </div>
              <button className="engine-play-btn" style={{ margin: 0, padding: '8px 16px', fontSize: 12 }}
                onClick={() => {
                  if (!gravityBallRef.current) return
                  // @ts-ignore reset position
                  gsap.set(gravityBallRef.current, { y: 0 })
                  AnimX.physics(gravityBallRef.current).gravity({ g: 800, bounce: 0.65 }).drop()
                }}>
                ▼ Gravity
              </button>
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div ref={orbitDotRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#00f5ff,#9d4edd)', width: 36, height: 36, borderRadius: '50%', fontSize: 14 }}>
                ✦
              </div>
              <button className="engine-play-btn" style={{ margin: 0, padding: '8px 16px', fontSize: 12 }}
                onClick={() => {
                  if (!orbitDotRef.current) return
                  if (orbitActive) {
                    orbitStopRef.current?.()
                    setOrbitActive(false)
                  } else {
                    const r = orbitDotRef.current.getBoundingClientRect()
                    const result = AnimX.physics(orbitDotRef.current).orbit({ cx: r.left + 80, cy: r.top, radius: 55, speed: 0.6 })
                    orbitStopRef.current = result.stop
                    setOrbitActive(true)
                  }
                }}>
                {orbitActive ? '⏹ Stop Orbit' : '🌀 Orbit'}
              </button>
            </div>
          </div>

          <div className="engine-snippet">
            <pre><code>{`// Spring — real spring-mass-damper ODE:
AnimX.physics('#card')
  .spring({ stiffness: 180, damping: 8 })
  .to({ x: 200 }).play()

// Gravity with bounce (restitution coefficient):
AnimX.physics('#ball').gravity({ g: 800, bounce: 0.65 }).drop()

// Orbital motion at any radius + speed:
const orb = AnimX.physics('#dot').orbit({ radius: 80, speed: 0.6 })
orb.stop()`}</code></pre>
            <button className="engine-copy-btn" onClick={() => copy('physics', `AnimX.physics('#card').spring({ stiffness: 180, damping: 8 }).to({ x: 200 }).play()`)}>
              {copiedKey === 'physics' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── 3. REACTIVE SIGNALS ────────────────────────── */}
        <div className="novel-card">
          <div className="demo-header">
            <div>
              <span className="novel-number">03</span>
              <h3 className="novel-title">Reactive Signals</h3>
            </div>
            <span className="props-badge">Live Data Binding</span>
          </div>
          <p className="novel-desc">
            A signal is a clamped [0,1] reactive value. Connect it to scroll, mouse,
            a timer, or a WebSocket. Every bound element updates instantly — zero animation calls.
          </p>

          <div className="engine-preview" style={{ flexDirection: 'column', gap: 20 }}>
            <div style={{ width: '100%' }}>
              <input
                ref={signalBarRef}
                type="range" min={0} max={100} defaultValue={0}
                style={{ width: '100%', accentColor: '#00f5ff' }}
                onChange={e => {
                  if (liveSignal.current) liveSignal.current.value = Number(e.target.value) / 100
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginTop: 4 }}>
                <span>signal.value = 0</span>
                <span style={{ color: '#00f5ff', fontFamily: 'var(--font-mono)' }}>
                  {signalVal.toFixed(2)}
                </span>
                <span>signal.value = 1</span>
              </div>
            </div>
            <div ref={signalBoxRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#9d4edd,#00f5ff)', width: 90, height: 50, fontSize: 12 }}>
              <span>Bound ⚡</span>
            </div>
          </div>

          <div className="engine-snippet">
            <pre><code>{`const sig = AnimX.signal()

// Bind to any source:
sig.fromScroll('#section')   // tracks viewport visibility
sig.fromMouse('x')           // tracks horizontal mouse
sig.fromTimer(2000)          // loops 0→1 every 2s
sig.value = 0.75             // set it manually anytime

// Bind multiple CSS properties at once:
AnimX.sync(sig).bind('#box', {
  x:       [-80, 80],
  scale:   [0.7, 1.2],
  opacity: [0.3, 1],
})`}</code></pre>
            <button className="engine-copy-btn" onClick={() => copy('signal', `const sig = AnimX.signal()\nsig.fromScroll('#section')\nAnimX.sync(sig).bind('#box', { x: [-80, 80], opacity: [0, 1] })`)}>
              {copiedKey === 'signal' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── 4. FLUENT SEQUENCER ────────────────────────── */}
        <div className="novel-card">
          <div className="demo-header">
            <div>
              <span className="novel-number">04</span>
              <h3 className="novel-title">Fluent Sequencer</h3>
            </div>
            <span className="props-badge">Declarative Timelines</span>
          </div>
          <p className="novel-desc">
            Chain complex multi-step animations in a single readable expression.
            No GSAP position strings, no label management — just intention.
          </p>

          <div className="engine-preview" style={{ gap: 16 }}>
            {[
              { ref: seq1Ref, color: 'linear-gradient(135deg,#9d4edd,#ff477e)', label: '① Hero' },
              { ref: seq2Ref, color: 'linear-gradient(135deg,#ff477e,#ff9d00)', label: '② Subtitle' },
              { ref: seq3Ref, color: 'linear-gradient(135deg,#00f5ff,#9d4edd)', label: '③ Button' },
            ].map(({ ref, color, label }) => (
              <div key={label} ref={ref} className="engine-box"
                style={{ background: color, width: 90, height: 44, fontSize: 11, opacity: 0 }}>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <button className="engine-play-btn"
            onClick={() => {
              if (!seq1Ref.current || !seq2Ref.current || !seq3Ref.current) return
              AnimX.sequence()
                .from(seq1Ref.current,  { y: 40, opacity: 0 })
                .wait(0.08)
                .from(seq2Ref.current,  { y: 40, opacity: 0 })
                .wait(0.08)
                .from(seq3Ref.current,  { scale: 0, opacity: 0 })
                .play()
            }}>
            ▶ Play Sequence
          </button>

          <div className="engine-snippet">
            <pre><code>{`AnimX.sequence()
  .from('#hero',     { y: 60, opacity: 0 })   // step 1
  .wait(0.1)
  .from('#subtitle', { y: 40, opacity: 0 })   // step 2
  .parallel(                                   // step 3: simultaneous
    ['#btn-a', '#btn-b'],
    { scale: 0, opacity: 0 }
  )
  .stagger('.card', { y: 40, opacity: 0 }, 0.08)
  .play()`}</code></pre>
            <button className="engine-copy-btn" onClick={() => copy('sequence', `AnimX.sequence()\n  .from('#hero', { y: 60, opacity: 0 })\n  .wait(0.1)\n  .from('#subtitle', { y: 40, opacity: 0 })\n  .play()`)}>
              {copiedKey === 'sequence' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── 5. MORPH ───────────────────────────────────── */}
        <div className="novel-card">
          <div className="demo-header">
            <div>
              <span className="novel-number">05</span>
              <h3 className="novel-title">Morph</h3>
            </div>
            <span className="props-badge">State Transitions</span>
          </div>
          <p className="novel-desc">
            Text, numbers, colors, and full CSS property sets — all morphable in one call.
            Not just position tweens; whole <em>visual states</em> shift seamlessly.
          </p>

          <div className="engine-preview" style={{ flexDirection: 'column', gap: 18 }}>
            <div ref={morphTextRef} className="morph-demo-text">Hello World</div>
            <div ref={morphNumRef}  className="morph-demo-num">0</div>
            <div ref={morphColorRef} className="morph-demo-color">Color Morph</div>
          </div>

          <div style={{ display: 'flex', gap: 10, padding: '0 20px 4px' }}>
            {[
              { label: 'Text',   action: () => {
                if (!morphTextRef.current) return
                const phrases = ['Hello World','AnimX Rocks','Morph Magic','Write Once']
                const next = phrases[(morphPhase + 1) % phrases.length]
                AnimX.morph(morphTextRef.current).text(morphTextRef.current.textContent ?? '', next).play()
                setMorphPhase(p => (p + 1) % phrases.length)
              }},
              { label: 'Number', action: () => {
                if (!morphNumRef.current) return
                const target = Math.floor(Math.random() * 100000)
                AnimX.morph(morphNumRef.current).number(0, target, { format: n => n.toFixed(0).toLocaleString() + ' users' }).play()
              }},
              { label: 'Color',  action: () => {
                if (!morphColorRef.current) return
                const colors: [string,string][] = [['#ff477e','#00f5ff'],['#9d4edd','#ff9d00'],['#00f5ff','#ff477e']]
                const [from, to] = colors[morphPhase % colors.length]
                AnimX.morph(morphColorRef.current).color(from, to, 'backgroundColor').play()
              }},
            ].map(({ label, action }) => (
              <button key={label} className="engine-play-btn" style={{ margin: 0, flex: 1, padding: '10px 8px', fontSize: 12 }} onClick={action}>
                {label}
              </button>
            ))}
          </div>

          <div className="engine-snippet">
            <pre><code>{`// Cross-fade text with a slide transition:
AnimX.morph('#title').text('Hello', 'Welcome').play()

// Count any number with custom formatting:
AnimX.morph('#stats').number(0, 94823, {
  format: n => n.toFixed(0) + ' users'
}).play()

// Animate CSS color properties:
AnimX.morph('#badge').color('#ff0000', '#00cc55', 'backgroundColor').play()

// Morph between any two visual states:
AnimX.morph('#card').between(stateA, stateB, { duration: 0.6 }).play()`}</code></pre>
            <button className="engine-copy-btn" onClick={() => copy('morph', `AnimX.morph('#title').text('Hello', 'Welcome').play()`)}>
              {copiedKey === 'morph' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ── 6. CHOREOGRAPH ─────────────────────────────── */}
        <div className="novel-card">
          <div className="demo-header">
            <div>
              <span className="novel-number">06</span>
              <h3 className="novel-title">Choreograph</h3>
            </div>
            <span className="props-badge">Relational Animations</span>
          </div>
          <p className="novel-desc">
            Elements that <em>know about each other</em>. Wave, converge, and cascade
            behaviors emerge from the group — not individually programmed on each element.
          </p>

          <div className="engine-preview" style={{ flexDirection: 'column', gap: 24 }}>
            <div ref={waveDotsRef} className="choreo-dots">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="choreo-dot"
                  style={{ background: `hsl(${200 + i * 20},80%,65%)` }} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="engine-play-btn" style={{ margin: 0, flex: 1, padding: '10px 8px', fontSize: 12 }}
                onClick={() => {
                  if (!waveDotsRef.current) return
                  if (waveActive) {
                    waveStopRef.current?.()
                    setWaveActive(false)
                  } else {
                    const dotEls = Array.from(waveDotsRef.current.querySelectorAll('.choreo-dot')) as HTMLElement[]
                    const result = AnimX.choreograph(dotEls).wave(28, 0.7)
                    waveStopRef.current = result.stop
                    setWaveActive(true)
                  }
                }}>
                {waveActive ? '⏹ Stop Wave' : '〜 Wave'}
              </button>
              <button className="engine-play-btn" style={{ margin: 0, flex: 1, padding: '10px 8px', fontSize: 12 }}
                onClick={() => {
                  if (!waveDotsRef.current) return
                  const dotEls = Array.from(waveDotsRef.current.querySelectorAll('.choreo-dot')) as HTMLElement[]
                  AnimX.choreograph(dotEls).cascade({ y: 50, opacity: 0, scale: 0 }, 0.1).play()
                }}>
                ↴ Cascade
              </button>
            </div>
          </div>

          <div className="engine-snippet">
            <pre><code>{`// Gravity-like convergence — all elements drift toward a point:
AnimX.choreograph([el1, el2, el3])
  .converge({ x: 400, y: 300 }, 0.06)

// Sinusoidal wave ripple through all elements:
const wave = AnimX.choreograph(document.querySelectorAll('.dot'))
  .wave(amplitude=28, frequency=0.7)
wave.stop()

// Cascade — domino stagger entrance:
AnimX.choreograph(document.querySelectorAll('.card'))
  .cascade({ y: 60, opacity: 0 }, staggerDelay=0.1)
  .play()`}</code></pre>
            <button className="engine-copy-btn" onClick={() => copy('choreo', `AnimX.choreograph(document.querySelectorAll('.dot')).wave(28, 0.7)`)}>
              {copiedKey === 'choreo' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}




/* ─────────────────────────────────────────────────────────
   Iframe Embed Demo Section
   Shows a live embedded AnimX animation + copy-able code
─────────────────────────────────────────────────────────── */
const EMBED_ANIMATIONS = [
  { id: 'infinite-text-marquee',    label: 'Infinite Marquee' },
  { id: 'text-scramble',            label: 'Text Scramble'    },
  { id: 'counter-animation',        label: 'Counter'          },
  { id: 'neon-glow',                label: 'Neon Glow'        },
  { id: 'card-flip-3d',             label: 'Card Flip 3D'     },
  { id: 'stagger-pulse',            label: 'Stagger Pulse'    },
]

function IframeEmbedSection() {
  const ANIMX_BASE = 'http://localhost:3000'   // change to your deployed URL in production
  const [activeId, setActiveId] = useState(EMBED_ANIMATIONS[0].id)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)

  const embedUrl   = `${ANIMX_BASE}/embed/${activeId}`
  const iframeCode = `<iframe\n  src="${embedUrl}"\n  width="640"\n  height="400"\n  frameborder="0"\n  allowfullscreen\n  title="AnimX - ${activeId}"\n></iframe>`
  const scriptCode = `npx animx add ${activeId}`

  const copy = (text: string, which: 'embed' | 'script') => {
    navigator.clipboard.writeText(text)
    if (which === 'embed') { setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000) }
    else                   { setCopiedScript(true); setTimeout(() => setCopiedScript(false), 2000) }
  }

  return (
    <section className="section-container">
      <div className="section-header">
        <div className="section-badge">Plug &amp; Play Embeds</div>
        <h2 className="section-title">Iframe Embedding</h2>
        <p className="section-desc">
          Drop any AnimX animation into any site with a single <code style={{ fontSize: 16 }}>&lt;iframe&gt;</code> — no build step required.
        </p>
      </div>

      {/* Animation selector pills */}
      <div className="embed-pills">
        {EMBED_ANIMATIONS.map(a => (
          <button
            key={a.id}
            className={`embed-pill ${activeId === a.id ? 'active' : ''}`}
            onClick={() => setActiveId(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="embed-layout">
        {/* Live iframe preview */}
        <div className="embed-preview-wrap">
          <div className="embed-preview-label">Live Preview</div>
          <iframe
            key={activeId}
            src={embedUrl}
            width="100%"
            height="400"
            style={{ border: 'none', borderRadius: 16, display: 'block', background: '#0a0e1a' }}
            title={`AnimX – ${activeId}`}
            allowFullScreen
          />
          <p className="embed-note">
            ⚡ Powered by <strong>AnimX</strong> — serving from <code>{ANIMX_BASE}/embed/{activeId}</code>
          </p>
        </div>

        {/* Code snippets */}
        <div className="embed-codes">
          <div className="embed-code-block">
            <div className="embed-code-header">
              <span>Embed (iframe)</span>
              <button className="embed-copy" onClick={() => copy(iframeCode, 'embed')}>
                {copiedEmbed ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre><code>{iframeCode}</code></pre>
          </div>

          <div className="embed-code-block">
            <div className="embed-code-header">
              <span>AnimX CLI</span>
              <button className="embed-copy" onClick={() => copy(scriptCode, 'script')}>
                {copiedScript ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre><code>{scriptCode}</code></pre>
          </div>

          <div className="embed-info">
            <div className="embed-info-row">
              <span className="embed-info-icon">📦</span>
              <div>
                <strong>Zero config</strong>
                <p>Renders a fully isolated animation page — no React, no build step on the consumer side.</p>
              </div>
            </div>
            <div className="embed-info-row">
              <span className="embed-info-icon">🎨</span>
              <div>
                <strong>Default props</strong>
                <p>Each embed uses the animation's default prop values. Customize via URL params (coming soon).</p>
              </div>
            </div>
            <div className="embed-info-row">
              <span className="embed-info-icon">🔗</span>
              <div>
                <strong>Shareable</strong>
                <p>Link directly to <code>/embed/&lt;id&gt;</code> on your AnimX deployment to share any animation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App

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
      <div className="section-header">
        <div className="section-badge" style={{ background: 'rgba(255, 0, 85, 0.2)', color: '#ff0055', borderColor: '#ff0055' }}>v2.0 Exclusive</div>
        <h2 className="section-title">AnimX "God Mode"</h2>
        <p className="section-desc">
          Pushing the boundaries of DOM animation. Frame-perfect time dilation, DOM particle physics, and native 3D extrusion.
        </p>
      </div>

      <div className="novel-grid">
        
        {/* ── 01. GLOBAL TIME WARP ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">01</span><h3 className="novel-title">Global Time Warp</h3></div>
            <span className="props-badge">Time Controller</span>
          </div>
          <p className="novel-desc">
            Instantly scale time for <em>every</em> animation on the page. Slow-motion, fast-forward, or reverse.
          </p>
          <div className="engine-preview" style={{ flexDirection: 'column', gap: 16 }}>
             <div ref={timeBoxRef} className="engine-box" style={{ background: 'linear-gradient(135deg,#ff477e,#9d4edd)', borderRadius: '10%' }}>
               <span>Time ⏱️</span>
             </div>
             <div style={{ display: 'flex', gap: 10 }}>
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
            <div><span className="novel-number">02</span><h3 className="novel-title">Native DOM Particles</h3></div>
            <span className="props-badge">Physics Emitter</span>
          </div>
          <p className="novel-desc">
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
            <div><span className="novel-number">03</span><h3 className="novel-title">Spatial 3D Engine</h3></div>
            <span className="props-badge">Z-Space</span>
          </div>
          <p className="novel-desc">
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
            <div><span className="novel-number">04</span><h3 className="novel-title">Generative Motion</h3></div>
            <span className="props-badge">Procedural AI</span>
          </div>
          <p className="novel-desc">
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
       return () => (mag as any).destroy?.()
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
      <div className="section-header">
        <div className="section-badge" style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', borderColor: '#00ff88' }}>Essential Everyday UX</div>
        <h2 className="section-title">AnimX "Practical Superpowers"</h2>
        <p className="section-desc">
          Replacing hours of boilerplate with single-line native DOM operations. FLIP transitions, scroll pinning, magnetic cursors, and text engines.
        </p>
      </div>

      <div className="novel-grid">
        
        {/* ── 01. SCROLL REVEAL ── */}
        <div className="novel-card">
          <div className="demo-header">
            <div><span className="novel-number">01</span><h3 className="novel-title">Scroll Storytelling</h3></div>
            <span className="props-badge">ScrollEngine</span>
          </div>
          <p className="novel-desc">
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
            <div><span className="novel-number">02</span><h3 className="novel-title">Layout FLIP Engine</h3></div>
            <span className="props-badge">First Last Invert Play</span>
          </div>
          <p className="novel-desc">
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
            <div><span className="novel-number">03</span><h3 className="novel-title">Magnetic Cursors</h3></div>
            <span className="props-badge">Micro-interaction</span>
          </div>
          <p className="novel-desc">
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
            <div><span className="novel-number">04</span><h3 className="novel-title">Advanced Typography</h3></div>
            <span className="props-badge">Text Engine</span>
          </div>
          <p className="novel-desc">
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
