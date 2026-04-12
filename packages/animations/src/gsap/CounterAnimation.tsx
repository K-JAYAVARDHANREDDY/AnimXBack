import { useEffect, useRef, useState, useCallback } from 'react'
import { RotateCcw } from 'lucide-react'
import animationData from '../data/counter-animation.json'

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
  valueColor,
  labelColor,
  borderColor,
  valueFontSize,
  labelFontSize,
  cardPadding,
  cardBorderRadius,
  easing
}: {
  counter:     Counter
  accentColor: string
  delay:       number
  size:        'sm' | 'lg'
  duration:    number          // ← now passed in, not hardcoded
  replayKey:   number
  valueColor?: string
  labelColor?: string
  borderColor?: string
  valueFontSize?: string
  labelFontSize?: string
  cardPadding?: string
  cardBorderRadius?: string
  easing?: string
}) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  
  // To avoid unused var error for optional unused prop
  void easing;

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
    <div className={`flex flex-col items-center justify-center rounded-2xl border bg-white/[0.04] hover:bg-white/[0.07] transition-colors`}
         style={{ borderColor: borderColor || 'rgba(255,255,255,0.08)', borderRadius: size === 'lg' ? cardBorderRadius : '0.5rem', padding: size === 'lg' ? cardPadding : '0.75rem 0.5rem' }}
    >
      <span
        className={`font-black tabular-nums leading-none ${size === 'sm' ? 'text-base' : 'text-4xl'}`}
        style={{ color: valueColor || accentColor, fontSize: size === 'lg' ? valueFontSize : undefined }}
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
        style={{ color: labelColor || '#9ca3af', fontSize: size === 'lg' ? labelFontSize : undefined }}
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
  heading     = animationData.defaultProps.heading as string,
  subheading  = animationData.defaultProps.subheading as string,
  accentColor = animationData.defaultProps.accentColor,
  isPreview   = false,
  /** Background color of container */
  bgColor = '#1a1a2e',
  /** Text color for counter values */
  valueColor,
  /** Text color for labels */
  labelColor = '#9ca3af',
  /** Border color */
  borderColor = 'rgba(255,255,255,0.08)',
  /** Font size for counter values (detail view) */
  valueFontSize = '2.25rem',
  /** Font size for labels */
  labelFontSize = '0.6875rem',
  /** Grid columns (default: 2) */
  columns = 2,
  /** Gap between cards */
  gap = '1rem',
  /** Card padding */
  cardPadding = '2rem 1rem',
  /** Border radius of cards */
  cardBorderRadius = '1rem',
  /** Show replay button */
  showReplay = true,
  /** Stagger delay between counters (ms) */
  staggerDelay = 150,
  /** Easing function (CSS easing name) */
  easing = 'ease-out',
}: {
  duration?:    number
  counters?:    Counter[]
  heading?:     string
  subheading?:  string
  accentColor?: string
  isPreview?:   boolean
  bgColor?:     string
  valueColor?:  string
  labelColor?:  string
  borderColor?: string
  valueFontSize?: string
  labelFontSize?: string
  columns?:     number
  gap?:         string
  cardPadding?: string
  cardBorderRadius?: string
  showReplay?:  boolean
  staggerDelay?: number
  easing?:      string
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
            delay={i * staggerDelay}
            valueColor={valueColor}
            labelColor={labelColor}
            borderColor={borderColor}
            valueFontSize={valueFontSize}
            labelFontSize={labelFontSize}
            cardPadding={cardPadding}
            cardBorderRadius={cardBorderRadius}
            easing={easing}
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
      <div className="w-full rounded-xl p-6 space-y-5" style={{ backgroundColor: bgColor }}>

        {/* Header + Replay */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">{heading}</h2>
            <p className="text-gray-500 text-xs mt-0.5">{subheading}</p>
          </div>

          {showReplay && (
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
          )}
        </div>

        {/* 2×2 grid */}
        <div className="grid w-full mx-auto" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}>
          {counters.slice(0, 4).map((c, i) => (
            <StatCard
              key={i}
              counter={c}
              accentColor={accentColor}
              delay={i * staggerDelay}
              valueColor={valueColor}
              labelColor={labelColor}
              borderColor={borderColor}
              valueFontSize={valueFontSize}
              labelFontSize={labelFontSize}
              cardPadding={cardPadding}
              cardBorderRadius={cardBorderRadius}
              easing={easing}
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

export { animationData as metadata }
