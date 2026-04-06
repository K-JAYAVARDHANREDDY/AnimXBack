import { useState } from 'react'
import { motion } from 'framer-motion'
import animationData from '../data/card-flip-3d.json'

type FlipDir = 'horizontal' | 'vertical'

interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  direction: FlipDir
  duration: number
  width?: number
  height?: number
  trigger?: 'hover' | 'click'
  perspective?: number
  ease?: readonly [number, number, number, number]
}

function FlipCard({ front, back, direction, duration, width = 200, height = 260, trigger = 'hover', perspective = 1000, ease = [0.76, 0, 0.24, 1] }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  const rotateKey = direction === 'horizontal' ? 'rotateY' : 'rotateX'

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width, height, perspective }}
      onMouseEnter={() => trigger === 'hover' && setFlipped(true)}
      onMouseLeave={() => trigger === 'hover' && setFlipped(false)}
      onClick={() => trigger === 'click' && setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ [rotateKey]: flipped ? 180 : 0 }}
        transition={{ duration, ease }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        {/* Back face */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: `${rotateKey === 'rotateY' ? 'rotateY' : 'rotateX'}(180deg)`,
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}

// ── Demo card content ─────────────────────────────────────────────────
const CARDS = [
  {
    frontBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    backBg: 'linear-gradient(135deg, #9b5cf6 0%, #6366f1 100%)',
    frontEmoji: '🃏',
    frontTitle: 'Hover me',
    backTitle: 'Card Back!',
    backText: 'Built with Framer Motion',
    trigger: 'hover' as const,
  },
  {
    frontBg: 'linear-gradient(135deg, #0a1628 0%, #0d2240 100%)',
    backBg: 'linear-gradient(135deg, #00c3ff 0%, #0066ff 100%)',
    frontEmoji: '🎴',
    frontTitle: 'Click me',
    backText: 'Flip on click!',
    backTitle: '✓ Clicked!',
    trigger: 'click' as const,
  },
  {
    frontBg: 'linear-gradient(135deg, #1a0f28 0%, #2d1b45 100%)',
    backBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    frontEmoji: '🎭',
    frontTitle: 'Profile',
    backTitle: 'John Doe',
    backText: 'Senior Animator',
    trigger: 'hover' as const,
  },
]

export function CardFlip3D({
  flipDirection = animationData.defaultProps.flipDirection as FlipDir,
  duration = animationData.defaultProps.duration,
  accentColor = animationData.defaultProps.accentColor,
  trigger = (animationData.defaultProps as any).trigger || "hover",
  isPreview = false,
  /** Card width in pixels */
  cardWidth = 200,
  /** Card height in pixels */
  cardHeight = 260,
  /** Perspective value for 3D effect */
  perspective = 1000,
  /** Border radius in pixels */
  borderRadius = 16,
  /** Custom front content (React node) */
  frontContent,
  /** Custom back content (React node) */
  backContent,
  /** Front card background */
  frontBg = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  /** Back card background */
  backBg,
  /** Front card title */
  frontTitle = 'Hover me',
  /** Back card title */
  backTitle = 'Flipped!',
  /** Front card emoji/icon */
  frontEmoji = '🃏',
  /** Back card text */
  backText = 'Built with Framer Motion',
  /** Easing curve */
  ease = [0.76, 0, 0.24, 1] as const,
  /** Show demo cards in detail view */
  showDemoCards = true,
}: {
  flipDirection?: FlipDir
  duration?: number
  accentColor?: string
  trigger?: 'hover' | 'click'
  isPreview?: boolean
  cardWidth?: number
  cardHeight?: number
  perspective?: number
  borderRadius?: number
  frontContent?: React.ReactNode
  backContent?: React.ReactNode
  frontBg?: string
  backBg?: string
  frontTitle?: string
  backTitle?: string
  frontEmoji?: string
  backText?: string
  ease?: readonly [number, number, number, number]
  showDemoCards?: boolean
}) {
  const resolvedBackBg = backBg || `linear-gradient(135deg, ${accentColor}, #6366f1)`
  // ── PREVIEW ─────────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full h-full bg-dark-600 flex items-center justify-center">
        <FlipCard
          direction={flipDirection}
          duration={duration}
          width={90}
          height={120}
          trigger="hover"
          perspective={perspective}
          ease={ease}
          front={
            frontContent || (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: frontBg }}>
                <span className="text-2xl">{frontEmoji}</span>
                <span className="text-white text-[10px] font-semibold">hover</span>
              </div>
            )
          }
          back={
            backContent || (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: resolvedBackBg }}>
                <span className="text-2xl">✨</span>
                <span className="text-white text-[10px] font-semibold">flip!</span>
              </div>
            )
          }
        />
      </div>
    )
  }

  // ── FULL DETAIL PAGE ─────────────────────────────────────────────────
  return (
    <div className="w-full rounded-xl bg-dark-600 p-8 space-y-8">
      <div className="text-center space-y-1">
        <p className="text-gray-500 text-xs uppercase tracking-widest">3D Card Flip · Framer Motion</p>
        <p className="text-gray-400 text-sm">Hover or click to flip</p>
      </div>

      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Custom card if frontContent/backContent provided */}
        {(frontContent || backContent) && (
          <div className="flex flex-col items-center gap-3">
            <FlipCard
              direction={flipDirection}
              duration={duration}
              width={cardWidth}
              height={cardHeight}
              trigger={trigger}
              perspective={perspective}
              ease={ease}
              front={
                frontContent || (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 border border-white/10" style={{ background: frontBg, borderRadius }}>
                    <span className="text-4xl">{frontEmoji}</span>
                    <span className="text-white text-sm font-semibold">{frontTitle}</span>
                  </div>
                )
              }
              back={
                backContent || (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: resolvedBackBg, borderRadius }}>
                    <span className="text-white text-base font-bold">{backTitle}</span>
                    <div className="w-8 h-px bg-white/30" />
                    <span className="text-white/80 text-xs text-center px-4">{backText}</span>
                  </div>
                )
              }
            />
            <p className="text-gray-600 text-[10px] capitalize">{trigger}</p>
          </div>
        )}

        {/* Demo cards */}
        {showDemoCards && !frontContent && !backContent && CARDS.map((card, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <FlipCard
              direction={flipDirection}
              duration={duration}
              width={cardWidth}
              height={cardHeight}
              trigger={trigger}
              perspective={perspective}
              ease={ease}
              front={
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-3 border border-white/10"
                  style={{ background: card.frontBg, borderRadius }}
                >
                  <span className="text-4xl">{card.frontEmoji}</span>
                  <span className="text-white text-sm font-semibold">{card.frontTitle}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider">
                    {card.trigger}
                  </span>
                </div>
              }
              back={
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{ background: card.backBg, borderRadius }}
                >
                  <span className="text-white text-base font-bold">{card.backTitle}</span>
                  <div className="w-8 h-px bg-white/30" />
                  <span className="text-white/80 text-xs text-center px-4">{card.backText}</span>
                </div>
              }
            />
            <p className="text-gray-600 text-[10px] capitalize">{card.trigger}</p>
          </div>
        ))}
      </div>

      {/* Direction info */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Direction</p>
          <p className="text-white text-sm font-semibold capitalize">{flipDirection}</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Duration</p>
          <p className="text-white text-sm font-semibold">{duration}s</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider">Engine</p>
          <p className="text-pink-400 text-sm font-semibold">Framer</p>
        </div>
      </div>
    </div>
  )
}

export { animationData as metadata }
