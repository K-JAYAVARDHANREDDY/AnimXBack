'use client'

import { useState, useEffect, useRef } from 'react'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/neon-glow.json'

// ── Inject keyframes ───────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes ng-flicker {
    0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
    20%,24%,55% { opacity: 0.4; }
  }
  @keyframes ng-flicker-slow {
    0%,89%,91%,100% { opacity: 1; }
    90% { opacity: 0.5; }
  }
  @keyframes ng-pulse-glow {
    0%,100% { opacity: 1; filter: brightness(1); }
    50% { opacity: 0.7; filter: brightness(1.6); }
  }
  @keyframes ng-blink {
    0%,49% { opacity: 1; }
    50%,100% { opacity: 0; }
  }
  @keyframes ng-scan {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(400%); }
  }
  @keyframes ng-wave-x {
    0%,100% { transform: translateX(0); }
    50% { transform: translateX(6px); }
  }
  @keyframes ng-countdown {
    0% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
  }
  @keyframes ng-spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

function useNeonStyles() {
  useEffect(() => {
    if (document.getElementById('ng-keyframes')) return
    const s = document.createElement('style')
    s.id = 'ng-keyframes'
    s.textContent = KEYFRAMES
    document.head.appendChild(s)
  }, [])
}

// ── Neon text helper ──────────────────────────────────────────────────
function NeonText({
  children,
  color,
  size = 32,
  flicker = false,
  slow = false,
  style: extraStyle = {},
}: {
  children: React.ReactNode
  color: string
  size?: number
  flicker?: boolean
  slow?: boolean
  style?: React.CSSProperties
}) {
  const glow = `0 0 4px #fff, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`
  return (
    <span style={{
      color,
      fontSize: size,
      fontWeight: 900,
      fontFamily: 'monospace',
      letterSpacing: '0.08em',
      textShadow: glow,
      animation: flicker
        ? `${slow ? 'ng-flicker-slow' : 'ng-flicker'} ${slow ? '4s' : '2.5s'} infinite`
        : undefined,
      ...extraStyle,
    }}>
      {children}
    </span>
  )
}

// ── Neon border box ───────────────────────────────────────────────────
function NeonBox({
  children,
  color,
  style: extraStyle = {},
  pulse = false,
}: {
  children: React.ReactNode
  color: string
  style?: React.CSSProperties
  pulse?: boolean
}) {
  return (
    <div style={{
      border: `1px solid ${color}`,
      borderRadius: 8,
      boxShadow: `0 0 8px ${color}, 0 0 20px ${color}44, inset 0 0 8px ${color}22`,
      animation: pulse ? `ng-pulse-glow 2s ease-in-out infinite` : undefined,
      ...extraStyle,
    }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 1 — Gaming / Esports Hero
// ─────────────────────────────────────────────────────────────────────
function GamingHero({ color }: { color: string }) {
  const [hoveredBtn, setHoveredBtn] = useState<number | null>(null)

  return (
    <div style={{ backgroundColor: '#05050f', minHeight: 360, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Scanline effect */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '30%',
        background: `linear-gradient(transparent, ${color}08, transparent)`,
        animation: 'ng-scan 4s linear infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${color}15 1px, transparent 1px), linear-gradient(90deg, ${color}15 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: `1px solid ${color}30` }}>
        <NeonText color={color} size={18} flicker slow>NEXUS</NeonText>
        <div style={{ display: 'flex', gap: 24 }}>
          {['PLAY', 'TEAM', 'STORE', 'EVENTS'].map((item, i) => (
            <span key={i} style={{
              color: `${color}cc`, fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
              letterSpacing: '0.12em', cursor: 'pointer',
              textShadow: `0 0 8px ${color}88`,
              animation: 'ng-flicker-slow 6s infinite',
              animationDelay: `${i * 0.8}s`,
            }}>{item}</span>
          ))}
        </div>
        <NeonBox color={color} style={{ padding: '5px 14px', cursor: 'pointer' }}>
          <span style={{ color, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em' }}>SIGN IN</span>
        </NeonBox>
      </nav>

      {/* Hero content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 24px', gap: 16, textAlign: 'center' }}>
        {/* Season badge */}
        <NeonBox color={color} pulse style={{ padding: '4px 16px' }}>
          <span style={{ color, fontSize: 9, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.2em' }}>◈ SEASON 7 · NOW LIVE ◈</span>
        </NeonBox>

        {/* Main headline */}
        <div>
          <NeonText color={color} size={42} flicker style={{ display: 'block', lineHeight: 1 }}>ENTER</NeonText>
          <NeonText color="#ffffff" size={42} style={{ display: 'block', lineHeight: 1, textShadow: `0 0 20px #fff6` }}>THE GRID</NeonText>
        </div>

        <p style={{ color: `${color}99`, fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', maxWidth: 300 }}>
          COMPETE · SURVIVE · DOMINATE
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {['▶ PLAY NOW', '⬡ VIEW TEAMS'].map((label, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredBtn(i)}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                padding: '10px 20px', borderRadius: 4, cursor: 'pointer',
                fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                transition: 'all 0.2s',
                ...(i === 0 ? {
                  backgroundColor: hoveredBtn === 0 ? color : `${color}22`,
                  border: `1px solid ${color}`,
                  color: hoveredBtn === 0 ? '#000' : color,
                  boxShadow: hoveredBtn === 0 ? `0 0 20px ${color}, 0 0 40px ${color}66` : `0 0 8px ${color}44`,
                } : {
                  backgroundColor: 'transparent',
                  border: `1px solid ${color}55`,
                  color: `${color}aa`,
                  boxShadow: hoveredBtn === 1 ? `0 0 12px ${color}44` : 'none',
                }),
              }}
            >{label}</div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
          {[['2.4M', 'PLAYERS'], ['847K', 'ONLINE'], ['$500K', 'PRIZE POOL']].map(([val, label], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <NeonText color={color} size={18}>{val}</NeonText>
              <p style={{ color: `${color}66`, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.15em', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 2 — Coming Soon page
// ─────────────────────────────────────────────────────────────────────
function ComingSoon({ color }: { color: string }) {
  const [time, setTime] = useState({ d: 12, h: 7, m: 34, s: 59 })

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23; d-- }
        if (d < 0) { d = 0; h = 0; m = 0; s = 0 }
        return { d, h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ backgroundColor: '#04040c', minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Radial glow bg */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Logo */}
      <NeonBox color={color} style={{ padding: '8px 20px' }} pulse>
        <NeonText color={color} size={22} flicker slow>LAUNCHPAD</NeonText>
      </NeonBox>

      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: `${color}88`, fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.3em', marginBottom: 8 }}>SOMETHING BIG IS</p>
        <NeonText color={color} size={36} flicker style={{ display: 'block' }}>COMING SOON</NeonText>
      </div>

      {/* Countdown */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {[['d', time.d], ['h', time.h], ['m', time.m], ['s', time.s]].map(([label, val], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {i > 0 && <NeonText color={color} size={28} style={{ opacity: 0.5, animation: 'ng-blink 1s infinite' }}>:</NeonText>}
            <NeonBox color={color} style={{ padding: '12px 16px', textAlign: 'center', minWidth: 60 }}>
              <NeonText color={color} size={28}>{pad(val as number)}</NeonText>
              <p style={{ color: `${color}77`, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.2em', marginTop: 4 }}>{String(label).toUpperCase()}</p>
            </NeonBox>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: `${color}88`, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em' }}>LAUNCH PROGRESS</span>
          <span style={{ color, fontSize: 9, fontFamily: 'monospace' }}>78%</span>
        </div>
        <div style={{ height: 4, backgroundColor: `${color}22`, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: '78%', height: '100%', borderRadius: 2,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}88`,
            animation: 'ng-pulse-glow 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Email input */}
      <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 320 }}>
        <div style={{ flex: 1, border: `1px solid ${color}44`, borderRadius: 4, padding: '8px 12px', backgroundColor: `${color}08` }}>
          <span style={{ color: `${color}55`, fontSize: 11, fontFamily: 'monospace' }}>your@email.com</span>
        </div>
        <NeonBox color={color} style={{ padding: '8px 14px', cursor: 'pointer' }} pulse>
          <span style={{ color, fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }}>NOTIFY</span>
        </NeonBox>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 3 — Error / Alert states
// ─────────────────────────────────────────────────────────────────────
function AlertStates({ color }: { color: string }) {
  const ALERTS = [
    { type: 'error',   icon: '⚠', label: 'CRITICAL ERROR',   msg: 'Database connection failed. Retrying in 3s…', color: '#ef4444' },
    { type: 'warning', icon: '◈', label: 'HIGH MEMORY USAGE', msg: 'Memory at 94%. Consider scaling your instance.', color: '#f59e0b' },
    { type: 'success', icon: '✓', label: 'DEPLOYMENT COMPLETE', msg: 'v2.4.1 deployed to production successfully.', color: '#22c55e' },
    { type: 'info',    icon: '◎', label: 'MAINTENANCE WINDOW', msg: 'Scheduled downtime on Sun 02:00–04:00 UTC.', color },
  ]

  return (
    <div style={{ backgroundColor: '#04040c', minHeight: 360, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ marginBottom: 4 }}>
        <NeonText color={color} size={13} style={{ letterSpacing: '0.2em' }}>SYSTEM ALERTS</NeonText>
        <p style={{ color: `${color}55`, fontSize: 9, fontFamily: 'monospace', marginTop: 4 }}>4 active notifications</p>
      </div>

      {ALERTS.map((alert, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 6,
            border: `1px solid ${alert.color}44`,
            backgroundColor: `${alert.color}08`,
            boxShadow: `0 0 12px ${alert.color}22, inset 0 0 8px ${alert.color}08`,
            animation: alert.type === 'error' ? 'ng-pulse-glow 1.5s ease-in-out infinite' : 'ng-pulse-glow 3s ease-in-out infinite',
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {/* Icon */}
          <span style={{
            fontSize: 18, color: alert.color, flexShrink: 0,
            textShadow: `0 0 8px ${alert.color}, 0 0 16px ${alert.color}`,
            animation: alert.type === 'error' ? 'ng-flicker 2s infinite' : undefined,
          }}>{alert.icon}</span>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: alert.color, fontSize: 10, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', textShadow: `0 0 8px ${alert.color}88` }}>
                {alert.label}
              </span>
              <span style={{ color: `${alert.color}55`, fontSize: 9, fontFamily: 'monospace' }}>just now</span>
            </div>
            <p style={{ color: `${alert.color}aa`, fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>{alert.msg}</p>
          </div>

          {/* Dismiss */}
          <span style={{ color: `${alert.color}44`, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>✕</span>
        </div>
      ))}

      {/* Status bar */}
      <div style={{ marginTop: 4, padding: '8px 12px', borderRadius: 4, border: `1px solid ${color}22`, backgroundColor: `${color}05`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e', animation: 'ng-pulse-glow 1.5s infinite' }} />
          <span style={{ color: '#22c55e', fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em' }}>SYSTEM ONLINE</span>
        </div>
        <span style={{ color: `${color}44`, fontSize: 9, fontFamily: 'monospace' }}>UPTIME 99.98%</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// TAB 4 — Dev Terminal
// ─────────────────────────────────────────────────────────────────────
function DevTerminal({ color }: { color: string }) {
  const lines = [
    { prefix: '$', text: 'npx animx init my-project', color: '#9ca3af' },
    { prefix: '>', text: 'Scaffolding project…', color: `${color}cc` },
    { prefix: '✓', text: 'Created 14 files', color: '#22c55e' },
    { prefix: '>', text: 'Installing dependencies…', color: `${color}cc` },
    { prefix: '✓', text: 'npm install complete (2.3s)', color: '#22c55e' },
    { prefix: '>', text: 'Registering animations…', color: `${color}cc` },
    { prefix: '✓', text: 'MagneticCursor     registered', color: '#22c55e' },
    { prefix: '✓', text: 'TextScramble       registered', color: '#22c55e' },
    { prefix: '✓', text: 'ParticleSphere     registered', color: '#22c55e' },
    { prefix: '✓', text: 'NeonGlow           registered', color: color },
    { prefix: '$', text: 'animx dev', color: '#9ca3af' },
    { prefix: '◈', text: `Local:   http://localhost:3000`, color },
    { prefix: '◈', text: 'Network: http://192.168.1.5:3000', color: `${color}88` },
  ]

  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    setVisibleLines(0)
    let i = 0
    const t = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= lines.length) clearInterval(t)
    }, 180)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ backgroundColor: '#02020a', minHeight: 360, display: 'flex', flexDirection: 'column' }}>
      {/* Terminal titlebar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#0a0a14', borderBottom: `1px solid ${color}22` }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c, boxShadow: `0 0 4px ${c}` }} />
          ))}
        </div>
        <span style={{ color: `${color}66`, fontSize: 10, fontFamily: 'monospace', marginLeft: 8, letterSpacing: '0.05em' }}>
          animx — terminal — 80×24
        </span>
      </div>

      {/* Terminal body */}
      <div style={{ flex: 1, padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7, overflow: 'hidden' }}>
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, opacity: i < visibleLines ? 1 : 0 }}>
            <span style={{
              color: line.prefix === '$' ? color : line.prefix === '✓' ? '#22c55e' : line.prefix === '◈' ? color : '#4b5563',
              textShadow: line.prefix === '$' || line.prefix === '◈' ? `0 0 6px ${color}` : line.prefix === '✓' ? '0 0 6px #22c55e' : 'none',
              flexShrink: 0, width: 12,
            }}>{line.prefix}</span>
            <span style={{ color: line.color }}>{line.text}</span>
          </div>
        ))}

        {/* Blinking cursor */}
        {visibleLines >= lines.length && (
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ color, textShadow: `0 0 6px ${color}`, flexShrink: 0, width: 12 }}>$</span>
            <span style={{
              display: 'inline-block', width: 8, height: 14, backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
              animation: 'ng-blink 1s step-end infinite',
              marginTop: 2,
            }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────
type DemoTab = 'gaming' | 'coming-soon' | 'alerts' | 'terminal'

export function NeonGlow({
  glowColor = animationData.defaultProps.glowColor,
  isPreview = false,
}: {
  glowColor?: string
  text?: string
  isPreview?: boolean
}) {
  useNeonStyles()
  const [activeTab, setActiveTab] = useState<DemoTab>('gaming')

  // ── PREVIEW ──────────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#05050f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 12 }}>
        <NeonText color={glowColor} size={28} flicker>NEON</NeonText>
        <NeonBox color={glowColor} pulse style={{ padding: '4px 12px' }}>
          <span style={{ color: glowColor, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.2em' }}>◈ LIVE ◈</span>
        </NeonBox>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444', glowColor, '#22c55e'].map((c, i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c, boxShadow: `0 0 8px ${c}`, display: 'inline-block', animation: `ng-pulse-glow 1.5s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ─────────────────────────────────────────────────
  const TABS: { key: DemoTab; label: string; emoji: string; desc: string }[] = [
    { key: 'gaming',      emoji: '🎮', label: 'Gaming Hero',  desc: 'Esports landing page' },
    { key: 'coming-soon', emoji: '🚀', label: 'Coming Soon',  desc: 'Launch countdown' },
    { key: 'alerts',      emoji: '🚨', label: 'Alerts',       desc: 'System notifications' },
    { key: 'terminal',    emoji: '💻', label: 'Terminal',     desc: 'Dev CLI output' },
  ]

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ backgroundColor: '#05050f' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 4px', background: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.key ? `2px solid ${glowColor}` : '2px solid transparent',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.emoji}</span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: activeTab === tab.key ? glowColor : '#6b7280', letterSpacing: '0.05em' }}>{tab.label}</span>
            <span style={{ fontSize: 9, color: '#374151', display: 'none' }}>{tab.desc}</span>
          </button>
        ))}
      </div>

      {activeTab === 'gaming'      && <GamingHero color={glowColor} />}
      {activeTab === 'coming-soon' && <ComingSoon color={glowColor} />}
      {activeTab === 'alerts'      && <AlertStates color={glowColor} />}
      {activeTab === 'terminal'    && <DevTerminal color={glowColor} />}

      <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: 10, fontFamily: 'monospace' }}>
          100% CSS · @keyframes · text-shadow · box-shadow glow
        </p>
      </div>
    </div>
  )
}

registerAnimation({
  id: animationData.id,
  name: animationData.name,
  category: animationData.category as any,
  engine: animationData.engine as any,
  component: NeonGlow,
  defaultProps: animationData.defaultProps,
  controls: animationData.controls as any,
  code: animationData.code,
  animxSyntax: animationData.animxSyntax,
  description: animationData.description,
  tags: animationData.tags,
  difficulty: animationData.difficulty as any,
})
