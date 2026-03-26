'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/parallax-hero.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ── Reusable 3-layer parallax container ──────────────────────────────
interface ParallaxRefs {
  layer1: React.RefObject<HTMLDivElement | null>
  layer2: React.RefObject<HTMLDivElement | null>
  layer3: React.RefObject<HTMLDivElement | null>
  stickyRef: React.RefObject<HTMLDivElement | null>
}

function ParallaxContainer({
  height = 480,
  scrollHeight = 1400,
  children,
  speeds = [0.3, 0.6, 0.9],
  bg = '#0a0a0f',
}: {
  height?: number
  scrollHeight?: number
  children: (refs: ParallaxRefs) => React.ReactNode
  speeds?: [number, number, number]
  bg?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)
  const layer1     = useRef<HTMLDivElement>(null)
  const layer2     = useRef<HTMLDivElement>(null)
  const layer3     = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const inner   = innerRef.current
    const l1 = layer1.current
    const l2 = layer2.current
    const l3 = layer3.current
    if (!wrapper || !inner || !l1 || !l2 || !l3) return

    const ctx = gsap.context(() => {
      const common = {
        scrollTrigger: {
          trigger: inner,
          scroller: wrapper,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        }
      }
      gsap.to(l1, { ...common, yPercent: -(speeds[0] * 100) })
      gsap.to(l2, { ...common, yPercent: -(speeds[1] * 100) })
      gsap.to(l3, { ...common, yPercent: -(speeds[2] * 100), opacity: 0 })
    })

    return () => ctx.revert()
  }, [speeds])

  return (
    <div
      ref={wrapperRef}
      className="w-full rounded-xl overflow-y-scroll"
      style={{ height, background: bg }}
    >
      <div ref={innerRef} style={{ height: scrollHeight }}>
        <div ref={stickyRef} className="sticky top-0 overflow-hidden" style={{ height }}>
          {children({ layer1, layer2, layer3, stickyRef })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 1 — SaaS Landing Page (like Stripe / Linear)
// ─────────────────────────────────────────────────────────────────────
function SaaSLanding() {
  return (
    <ParallaxContainer bg="#04040f" speeds={[0.25, 0.55, 0.9]}>
      {({ layer1, layer2, layer3 }) => (
        <>
          {/* Layer 1 — Far background: grid + ambient orbs */}
          <div ref={layer1} className="absolute inset-0">
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: 'linear-gradient(#6366f144 1px, transparent 1px), linear-gradient(90deg, #6366f144 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }} />
            {/* Far orbs */}
            <div className="absolute rounded-full" style={{ width: 500, height: 500, top: '-10%', left: '60%', background: 'radial-gradient(circle, #6366f122 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute rounded-full" style={{ width: 400, height: 400, top: '20%', left: '-10%', background: 'radial-gradient(circle, #8b5cf622 0%, transparent 70%)', filter: 'blur(40px)' }} />
            {/* Floating dots */}
            {[...Array(16)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-indigo-500" style={{
                width: 2 + (i % 3), height: 2 + (i % 3),
                top: `${8 + (i * 19) % 85}%`, left: `${4 + (i * 17) % 92}%`,
                opacity: 0.1 + (i % 4) * 0.06,
              }} />
            ))}
          </div>

          {/* Layer 2 — Mid: floating UI cards */}
          <div ref={layer2} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Left card */}
            <div className="absolute rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4" style={{ left: '5%', top: '18%', width: 180 }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center text-xs">📈</div>
                <span className="text-white text-xs font-semibold">Revenue</span>
              </div>
              <p className="text-2xl font-black text-white">$94.2K</p>
              <p className="text-green-400 text-xs mt-1">+12.4% this month</p>
              <div className="flex items-end gap-1 mt-3 h-8">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-indigo-500" style={{ height: `${h}%`, opacity: 0.4 + i * 0.08 }} />
                ))}
              </div>
            </div>
            {/* Right card */}
            <div className="absolute rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4" style={{ right: '5%', top: '30%', width: 190 }}>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Active users</p>
              <p className="text-2xl font-black text-white">48,291</p>
              <div className="mt-3 space-y-1.5">
                {[['Pro', 62, '#6366f1'], ['Team', 24, '#8b5cf6'], ['Free', 14, '#a78bfa']].map(([l, w, c]) => (
                  <div key={l as string} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-8">{l}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${w}%`, backgroundColor: c as string }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{w}%</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom notification */}
            <div className="absolute rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 flex items-center gap-3" style={{ bottom: '18%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">New signup from Berlin 🇩🇪</span>
            </div>
          </div>

          {/* Layer 3 — Foreground: headline */}
          <div ref={layer3} className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Trusted by 48,000+ developers
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Ship faster.<br />
              <span className="text-indigo-400">Scale smarter.</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-sm mb-6">The all-in-one platform for modern teams. Analytics, billing, and collaboration — built in.</p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">Start free trial</button>
              <button className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-medium transition-colors hover:bg-white/5">Watch demo →</button>
            </div>
            <p className="text-gray-600 text-[10px] mt-4 absolute bottom-4">↓ scroll to see parallax layers move</p>
          </div>
        </>
      )}
    </ParallaxContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 2 — Travel / Experience site (like Airbnb / Booking)
// ─────────────────────────────────────────────────────────────────────
function TravelHero() {
  return (
    <ParallaxContainer bg="#030a0a" speeds={[0.2, 0.5, 0.85]}>
      {({ layer1, layer2, layer3 }) => (
        <>
          {/* Layer 1 — Sky + mountains */}
          <div ref={layer1} className="absolute inset-0">
            {/* Sky gradient */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0c1a3a 0%, #0a2a1a 60%, #041008 100%)' }} />
            {/* Stars */}
            {[...Array(40)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white" style={{
                width: 1 + (i % 2), height: 1 + (i % 2),
                top: `${(i * 13) % 50}%`, left: `${(i * 17) % 100}%`,
                opacity: 0.3 + (i % 5) * 0.1,
              }} />
            ))}
            {/* Moon */}
            <div className="absolute rounded-full bg-yellow-100" style={{ width: 48, height: 48, top: '12%', right: '18%', boxShadow: '0 0 40px rgba(255,255,200,0.3)' }} />
            {/* Far mountains */}
            <svg className="absolute bottom-0 w-full" viewBox="0 0 800 200" preserveAspectRatio="none" style={{ opacity: 0.4 }}>
              <path d="M0 200 L0 120 L80 60 L160 100 L260 40 L360 90 L460 30 L560 80 L660 50 L760 85 L800 60 L800 200 Z" fill="#0a2a1a" />
            </svg>
          </div>

          {/* Layer 2 — Mid: foreground trees + city silhouette */}
          <div ref={layer2} className="absolute inset-0 pointer-events-none">
            <svg className="absolute bottom-0 w-full" viewBox="0 0 800 260" preserveAspectRatio="none">
              <path d="M0 260 L0 160 L40 100 L80 140 L120 80 L160 130 L200 90 L240 120 L280 70 L320 110 L360 85 L400 115 L440 75 L480 105 L520 90 L560 120 L600 80 L640 110 L680 95 L720 125 L760 100 L800 130 L800 260 Z" fill="#041a0a" />
            </svg>
            {/* Fireflies */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-yellow-300" style={{
                width: 3, height: 3,
                top: `${40 + (i * 23) % 40}%`, left: `${10 + (i * 19) % 80}%`,
                boxShadow: '0 0 6px rgba(255,255,100,0.8)',
                opacity: 0.7, animation: `pulse ${1 + i * 0.3}s infinite`,
              }} />
            ))}
          </div>

          {/* Layer 3 — Foreground: headline */}
          <div ref={layer3} className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Discover the World</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
              Where will you<br />
              <span className="text-emerald-400">go next?</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xs mb-6">Handpicked experiences in 190+ countries. Guided tours, hidden gems, and local stories.</p>
            {/* Search bar */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 w-full max-w-sm">
              <span className="text-lg">🔍</span>
              <span className="text-gray-400 text-sm flex-1 text-left">Search destinations…</span>
              <button className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold">Explore</button>
            </div>
            {/* Tags */}
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {['🏔 Mountains', '🏖 Beaches', '🏙 Cities', '🌿 Jungle'].map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10">{t}</span>
              ))}
            </div>
            <p className="text-gray-600 text-[10px] mt-4 absolute bottom-4">↓ scroll to see depth</p>
          </div>
        </>
      )}
    </ParallaxContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 3 — Developer Portfolio (like awwwards.com entries)
// ─────────────────────────────────────────────────────────────────────
function PortfolioHero() {
  return (
    <ParallaxContainer bg="#020205" speeds={[0.2, 0.5, 0.9]}>
      {({ layer1, layer2, layer3 }) => (
        <>
          {/* Layer 1 — Code lines background */}
          <div ref={layer1} className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(#00c3ff22 1px, transparent 1px)',
              backgroundSize: '100% 28px',
            }} />
            {/* Blurred code text */}
            {['const', 'function', 'return', 'import', 'export', 'async', 'await', 'const', 'let'].map((kw, i) => (
              <span key={i} className="absolute font-mono text-cyan-500 select-none pointer-events-none" style={{
                fontSize: 11 + (i % 3) * 4,
                top: `${5 + (i * 21) % 85}%`,
                left: `${3 + (i * 23) % 88}%`,
                opacity: 0.05 + (i % 4) * 0.02,
                filter: 'blur(1px)',
              }}>{kw}</span>
            ))}
            {/* Glow orb */}
            <div className="absolute rounded-full" style={{ width: 400, height: 400, top: '20%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, #00c3ff08 0%, transparent 70%)' }} />
          </div>

          {/* Layer 2 — Floating tech stack badges */}
          <div ref={layer2} className="absolute inset-0 pointer-events-none">
            {[
              { label: 'React',      icon: '⚛',  x: '8%',  y: '20%', color: '#61dafb' },
              { label: 'TypeScript', icon: 'TS',  x: '75%', y: '15%', color: '#3178c6' },
              { label: 'Next.js',    icon: '▲',   x: '82%', y: '55%', color: '#fff' },
              { label: 'GSAP',       icon: '⚡',  x: '6%',  y: '65%', color: '#88ce02' },
              { label: 'Three.js',   icon: '◆',   x: '45%', y: '78%', color: '#049ef4' },
            ].map((b, i) => (
              <div key={i} className="absolute flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm" style={{ left: b.x, top: b.y }}>
                <span style={{ color: b.color, fontSize: 13 }}>{b.icon}</span>
                <span className="text-white text-xs font-semibold">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Layer 3 — Main content */}
          <div ref={layer3} className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white mb-5 shadow-lg shadow-cyan-500/30">J</div>
            <p className="text-cyan-400 text-xs font-mono tracking-widest mb-2">AVAILABLE FOR WORK</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
              James Carter<br />
              <span className="text-cyan-400">Frontend Engineer</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-sm mb-6">I build interactive web experiences using React, GSAP, and Three.js. 5 years, 60+ projects shipped.</p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors">View work ↗</button>
              <button className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5">Download CV</button>
            </div>
            <p className="text-gray-600 text-[10px] mt-4 absolute bottom-4">↓ scroll to explore</p>
          </div>
        </>
      )}
    </ParallaxContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 4 — Product Launch (like Apple product pages)
// ─────────────────────────────────────────────────────────────────────
function ProductLaunch() {
  return (
    <ParallaxContainer bg="#000000" speeds={[0.15, 0.45, 0.85]}>
      {({ layer1, layer2, layer3 }) => (
        <>
          {/* Layer 1 — Deep background: gradient + rings */}
          <div ref={layer1} className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, #1a0533 0%, #000 70%)' }} />
            {/* Concentric rings */}
            {[240, 340, 440, 540].map((r, i) => (
              <div key={i} className="absolute rounded-full border border-purple-500/10" style={{
                width: r, height: r,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }} />
            ))}
          </div>

          {/* Layer 2 — Mid: floating product specs */}
          <div ref={layer2} className="absolute inset-0 pointer-events-none">
            {[
              { label: 'Battery',  value: '48h',    unit: 'playback',  x: '4%',  y: '25%', icon: '🔋' },
              { label: 'Chip',     value: 'M3 Pro', unit: 'processor', x: '76%', y: '20%', icon: '⚡' },
              { label: 'Display',  value: '6.7"',   unit: 'Super OLED',x: '78%', y: '60%', icon: '✦' },
              { label: 'Camera',   value: '200MP',  unit: 'system',    x: '4%',  y: '65%', icon: '📷' },
            ].map((s, i) => (
              <div key={i} className="absolute px-4 py-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm text-center" style={{ left: s.x, top: s.y, minWidth: 110 }}>
                <span className="text-xl">{s.icon}</span>
                <p className="text-white font-black text-lg mt-1">{s.value}</p>
                <p className="text-purple-400 text-[9px] uppercase tracking-wider">{s.label}</p>
                <p className="text-gray-600 text-[9px]">{s.unit}</p>
              </div>
            ))}

            {/* Product image placeholder */}
            <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
              <div className="w-20 h-36 rounded-3xl border-2 border-purple-400/30 bg-gradient-to-b from-purple-900/40 to-purple-900/10 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                <span className="text-3xl">📱</span>
              </div>
            </div>
          </div>

          {/* Layer 3 — Foreground: headline */}
          <div ref={layer3} className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6 gap-3">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Introducing</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
              NovaPro 15
            </h1>
            <p className="text-gray-400 text-sm">The most powerful device we've ever made.</p>
            <div className="flex gap-3 mt-2">
              <button className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors">Pre-order — $999</button>
              <button className="px-6 py-2.5 rounded-full border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-500/10">Learn more ↓</button>
            </div>
            <p className="text-gray-600 text-[10px] mt-2 absolute bottom-4">↓ scroll to see specs float at different speeds</p>
          </div>
        </>
      )}
    </ParallaxContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────
type DemoTab = 'saas' | 'travel' | 'portfolio' | 'product'

export function ParallaxHero({
  accentColor = animationData.defaultProps.accentColor,
  isPreview = false,
}: {
  headline?: string
  subline?: string
  bgColor?: string
  accentColor?: string
  layerSpeed1?: number
  layerSpeed2?: number
  layerSpeed3?: number
  isPreview?: boolean
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<DemoTab>('saas')
  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) return (
    <div className="w-full h-48 bg-dark-600 rounded-xl flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ── PREVIEW ──────────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full h-full bg-[#04040f] relative overflow-hidden flex flex-col items-center justify-center gap-2 px-4 text-center">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(#6366f144 1px, transparent 1px), linear-gradient(90deg, #6366f144 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Floating card */}
        <div className="absolute top-4 right-6 px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-gray-400" style={{ transform: 'rotate(3deg)' }}>
          📈 +24%
        </div>
        <div className="absolute bottom-6 left-6 px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-gray-400" style={{ transform: 'rotate(-2deg)' }}>
          🚀 Ship faster
        </div>
        {/* Headline */}
        <div className="relative z-10">
          <p className="text-white text-base font-black leading-tight">Parallax<br /><span style={{ color: accentColor }}>Hero</span></p>
          <p className="text-gray-500 text-[9px] mt-1">scroll depth effect</p>
        </div>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ─────────────────────────────────────────────────
  const TABS: { key: DemoTab; emoji: string; label: string; desc: string }[] = [
    { key: 'saas',      emoji: '💻', label: 'SaaS',      desc: 'Stripe / Linear style' },
    { key: 'travel',    emoji: '🌍', label: 'Travel',    desc: 'Airbnb / Booking style' },
    { key: 'portfolio', emoji: '👤', label: 'Portfolio', desc: 'Dev portfolio' },
    { key: 'product',   emoji: '📱', label: 'Product',   desc: 'Apple style launch' },
  ]

  return (
    <div className="w-full space-y-3">
      {/* Tab selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? `${accentColor}22` : 'rgba(255,255,255,0.04)',
              borderColor:     activeTab === tab.key ? accentColor : 'rgba(255,255,255,0.1)',
              color:           activeTab === tab.key ? accentColor : '#6b7280',
            }}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-60 hidden sm:block">— {tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Demo */}
      {activeTab === 'saas'      && <SaaSLanding />}
      {activeTab === 'travel'    && <TravelHero />}
      {activeTab === 'portfolio' && <PortfolioHero />}
      {activeTab === 'product'   && <ProductLaunch />}

      <p className="text-gray-600 text-[10px] text-center">
        Each tab uses isolated scroll · 3 layers at different speeds · GSAP ScrollTrigger scrub
      </p>
    </div>
  )
}

registerAnimation({
  id: animationData.id,
  name: animationData.name,
  category: animationData.category as any,
  engine: animationData.engine as any,
  component: ParallaxHero,
  defaultProps: animationData.defaultProps,
  controls: animationData.controls as any,
  code: animationData.code,
  animxSyntax: animationData.animxSyntax,
  description: animationData.description,
  tags: animationData.tags,
  difficulty: animationData.difficulty as any,
})
