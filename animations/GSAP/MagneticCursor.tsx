'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/magnetic-cursor.json'

// ── Magnetic wrapper ──────────────────────────────────────────────────
function Magnetic({
  children,
  strength = 0.4,
  radius = 120,
  disabled = false,
}: {
  children: React.ReactNode
  strength?: number
  radius?: number
  disabled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) return
    const el = ref.current
    if (!el) return

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < radius) {
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      }
    }

    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
    }

    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength, radius, disabled])

  return (
    <div ref={ref} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  )
}

// ── Static preview — no magnetic, just a clean frozen UI snapshot ─────
function PreviewStatic({ bgColor }: { bgColor: string }) {
  return (
    <div className="w-full h-full bg-[#0a0a0f] flex flex-col items-center justify-center gap-3 px-4">
      {/* Mini nav */}
      <div className="flex items-center gap-4">
        {['Home', 'Work', 'About'].map(item => (
          <span key={item} className="text-[11px] text-gray-400 font-medium cursor-default">
            {item}
          </span>
        ))}
      </div>

      {/* Badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-medium"
        style={{ borderColor: `${bgColor}50`, color: bgColor, backgroundColor: `${bgColor}12` }}
      >
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: bgColor }} />
        Available for projects
      </div>

      {/* Headline */}
      <div className="text-center">
        <div className="text-sm font-black text-white leading-tight">Magnetic</div>
        <div className="text-sm font-black leading-tight" style={{ color: bgColor }}>Cursor</div>
      </div>

      {/* CTA button */}
      <button
        className="px-5 py-2 rounded-full text-[10px] font-bold text-white"
        style={{ background: `linear-gradient(135deg, ${bgColor}, #9b5cf6)` }}
      >
        Hover to feel the pull →
      </button>

      <p className="text-gray-600 text-[8px] uppercase tracking-wider">magnetic on hover</p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function MagneticCursor({
  strength  = animationData.defaultProps.strength,
  radius    = animationData.defaultProps.radius,
  bgColor   = animationData.defaultProps.bgColor,
  isPreview = false,
}: {
  strength?:  number
  radius?:    number
  bgColor?:   string
  isPreview?: boolean
  labelText?: string
  textColor?: string
}) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) return (
    <div className="w-full h-full bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ── PREVIEW — static, no magnetic effect ─────────────────────────
  if (isPreview) return <PreviewStatic bgColor={bgColor} />

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  // Compact single-screen layout — no overflow, everything fits in the
  // live preview box without needing to scroll.
  return (
    <div
      className="w-full rounded-xl overflow-hidden bg-[#0a0a0f] flex flex-col"
      style={{ minHeight: 460 }}
    >
      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
        <Magnetic strength={0.3} radius={80}>
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-[10px]"
              style={{ background: `linear-gradient(135deg, ${bgColor}, #9b5cf6)` }}
            >S</div>
            <span className="text-white font-bold text-sm tracking-tight">Studio</span>
          </div>
        </Magnetic>

        <div className="flex items-center gap-5">
          {['Work', 'Services', 'About'].map(item => (
            <Magnetic key={item} strength={0.5} radius={60}>
              <span className="text-gray-400 hover:text-white text-xs font-medium transition-colors cursor-pointer">
                {item}
              </span>
            </Magnetic>
          ))}
        </div>

        <Magnetic strength={0.4} radius={80}>
          <button
            className="px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer"
            style={{ borderColor: `${bgColor}66`, color: bgColor }}
          >
            Let's talk
          </button>
        </Magnetic>
      </nav>

      {/* ── Hero — takes remaining space ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8 gap-5">

        {/* Badge */}
        <Magnetic strength={0.3} radius={90}>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-medium cursor-default"
            style={{ borderColor: `${bgColor}40`, color: bgColor, backgroundColor: `${bgColor}10` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: bgColor }} />
            Available for projects
          </div>
        </Magnetic>

        {/* Headline */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
            We craft digital<br />
            <span style={{ color: bgColor }}>experiences</span>
          </h1>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
            Award-winning studio for brand identity, web & motion.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Magnetic strength={strength} radius={radius}>
            <button
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${bgColor}, #9b5cf6)`,
                boxShadow: `0 6px 24px ${bgColor}40`,
              }}
            >
              View our work →
            </button>
          </Magnetic>

          <Magnetic strength={strength * 0.7} radius={radius * 0.85}>
            <button className="px-6 py-2.5 rounded-full text-xs font-semibold text-gray-300 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              Watch showreel
            </button>
          </Magnetic>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-1">
          {[{ label: 'Projects', value: '120+' }, { label: 'Clients', value: '48' }, { label: 'Awards', value: '12' }].map((stat, i) => (
            <div key={i} className="flex items-center gap-5">
              {i > 0 && <div className="w-px h-5 bg-white/10" />}
              <Magnetic strength={0.3} radius={50}>
                <div className="text-center cursor-default">
                  <div className="text-white font-black text-base">{stat.value}</div>
                  <div className="text-gray-600 text-[9px] uppercase tracking-wider">{stat.label}</div>
                </div>
              </Magnetic>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {['𝕏', 'in', '⬡', '◎'].map((icon, i) => (
            <Magnetic key={i} strength={0.6} radius={50}>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer text-xs">
                {icon}
              </div>
            </Magnetic>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-700 text-[9px] pb-3">
        Move your cursor over any element ↑
      </p>
    </div>
  )
}

registerAnimation({
  id:           animationData.id,
  name:         animationData.name,
  category:     animationData.category as any,
  engine:       animationData.engine as any,
  component:    MagneticCursor,
  defaultProps: animationData.defaultProps,
  controls:     animationData.controls as any,
  code:         animationData.code,
  animxSyntax:  animationData.animxSyntax,
  description:  animationData.description,
  tags:         animationData.tags,
  difficulty:   animationData.difficulty as any,
})