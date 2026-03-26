'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { RotateCcw } from 'lucide-react'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/counter-animation.json'

interface Counter {
  label: string
  value: number
  suffix: string
  prefix: string
}

// ── Single stat card ──────────────────────────────────────────────────
function StatCard({
  counter,
  accentColor,
  delay,
  size,
  duration,
  replayKey,
}: {
  counter:     Counter
  accentColor: string
  delay:       number
  size:        'sm' | 'lg'
  duration:    number          // ← now passed in, not hardcoded
  replayKey:   number
}) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setDisplay(0)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const t = setTimeout(() => {
      const target = counter.value
      const start  = performance.now()

      function tick(now: number) {
        const p = Math.min((now - start) / duration, 1)
        setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => { clearTimeout(t); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [replayKey, counter.value, delay, duration])  // ← duration in deps too

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-white/8
      bg-white/[0.04] hover:bg-white/[0.07] transition-colors
      ${size === 'sm' ? 'py-3 px-2' : 'py-8 px-4'}`}
    >
      <span
        className={`font-black tabular-nums leading-none ${size === 'sm' ? 'text-base' : 'text-4xl'}`}
        style={{ color: accentColor }}
      >
        {counter.prefix}{display.toLocaleString()}{counter.suffix}
      </span>
      <div
        className={`rounded-full my-1.5 ${size === 'sm' ? 'w-4 h-[2px]' : 'w-8 h-[3px]'}`}
        style={{ background: accentColor, opacity: 0.4 }}
      />
      <span
        className={`font-semibold text-gray-400 uppercase tracking-widest text-center leading-tight
          ${size === 'sm' ? 'text-[8px]' : 'text-[11px]'}`}
      >
        {counter.label}
      </span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function CounterAnimation({
  duration    = animationData.defaultProps.duration,   // seconds from JSON
  counters    = animationData.defaultProps.counters as Counter[],
  accentColor = animationData.defaultProps.accentColor,
  isPreview   = false,
}: {
  duration?:    number
  counters?:    Counter[]
  accentColor?: string
  isPreview?:   boolean
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const [spinning, setSpinning]   = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  const handleReplay = useCallback(() => {
    setSpinning(true)
    setReplayKey(k => k + 1)
    setTimeout(() => setSpinning(false), 700)
  }, [])

  if (!isMounted) return (
    <div className="w-full h-48 bg-dark-600 rounded-xl flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Convert seconds → milliseconds for requestAnimationFrame
  const durationMs = duration * 1000

  // ── PREVIEW ───────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
        {counters.slice(0, 4).map((c, i) => (
          <StatCard
            key={i}
            counter={c}
            accentColor={accentColor}
            delay={i * 100}
            size="sm"
            duration={durationMs}
            replayKey={replayKey}
          />
        ))}
      </div>
    )
  }

  // ── DETAIL PAGE ───────────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">
      <div className="w-full rounded-xl bg-dark-600 p-6 space-y-5">

        {/* Header + Replay */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">By the Numbers</h2>
            <p className="text-gray-500 text-xs mt-0.5">Every metric counts</p>
          </div>

          <button
            onClick={handleReplay}
            title="Replay animation"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border
              border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white
              transition-all active:scale-95"
          >
            <RotateCcw
              className="w-3.5 h-3.5 transition-transform duration-700"
              style={{ transform: spinning ? 'rotate(-360deg)' : 'rotate(0deg)' }}
            />
            Replay
          </button>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {counters.slice(0, 4).map((c, i) => (
            <StatCard
              key={i}
              counter={c}
              accentColor={accentColor}
              delay={i * 150}
              size="lg"
              duration={durationMs}
              replayKey={replayKey}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

registerAnimation({
  id:           animationData.id,
  name:         animationData.name,
  category:     animationData.category as any,
  engine:       animationData.engine as any,
  component:    CounterAnimation,
  defaultProps: animationData.defaultProps,
  controls:     animationData.controls as any,
  code:         animationData.code,
  animxSyntax:  animationData.animxSyntax,
  description:  animationData.description,
  tags:         animationData.tags,
  difficulty:   animationData.difficulty as any,
})