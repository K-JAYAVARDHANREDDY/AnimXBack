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
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Architected with <span className="heart">❤</span> using{' '}
          <a href="https://www.npmjs.com/package/@animx-jaya/animations" target="_blank" rel="noreferrer">@animx-jaya/animations</a>
        </p>
        <p>State-of-the-art interactive motion library for modern web applications</p>
      </footer>
    </div>
  )
}

export default App
