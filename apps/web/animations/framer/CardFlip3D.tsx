'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/card-flip-3d.json'

type FlipDir = 'horizontal' | 'vertical'

interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  direction: FlipDir
  duration: number
  width?: number
  height?: number
  trigger?: 'hover' | 'click'
}

function FlipCard({ front, back, direction, duration, width = 200, height = 260, trigger = 'hover' }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  const rotateKey = direction === 'horizontal' ? 'rotateY' : 'rotateX'

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width, height, perspective: 1000 }}
      onMouseEnter={() => trigger === 'hover' && setFlipped(true)}
      onMouseLeave={() => trigger === 'hover' && setFlipped(false)}
      onClick={() => trigger === 'click' && setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ [rotateKey]: flipped ? 180 : 0 }}
        transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
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
  trigger = (animationData.defaultProps as any).trigger || 'hover',
  isPreview = false,
}: {
  flipDirection?: FlipDir
  duration?: number
  accentColor?: string
  trigger?: 'hover' | 'click'
  isPreview?: boolean
}) {
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
          front={
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              <span className="text-2xl">🃏</span>
              <span className="text-white text-[10px] font-semibold">hover</span>
            </div>
          }
          back={
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${accentColor}, #6366f1)` }}>
              <span className="text-2xl">✨</span>
              <span className="text-white text-[10px] font-semibold">flip!</span>
            </div>
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
        {CARDS.map((card, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <FlipCard
              direction={flipDirection}
              duration={duration}
              trigger={trigger}
              front={
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-3 border border-white/10"
                  style={{ background: card.frontBg }}
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
                  style={{ background: card.backBg }}
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

registerAnimation({
  id: animationData.id,
  name: animationData.name,
  category: animationData.category as any,
  engine: animationData.engine as any,
  component: CardFlip3D,
  defaultProps: animationData.defaultProps,
  controls: animationData.controls as any,
  code: animationData.code,
  animxSyntax: animationData.animxSyntax,
  description: animationData.description,
  tags: animationData.tags,
  difficulty: animationData.difficulty as any,
})
