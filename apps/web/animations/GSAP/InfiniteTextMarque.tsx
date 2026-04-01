'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { registerAnimation } from '../../core/AnimationRegistry'
import animationData from '@/data/animations/infinite-text-marque.json'

export function InfiniteTextMarquee({
  topText = animationData.defaultProps.topText,
  bottomText = animationData.defaultProps.bottomText,
  speed = animationData.defaultProps.speed
}: {
  topText?: string
  bottomText?: string
  speed?: number
}) {
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const [customTopText, setCustomTopText] = useState(topText)
  const [customBottomText, setCustomBottomText] = useState(bottomText)
  const [tempTopText, setTempTopText] = useState(topText)
  const [tempBottomText, setTempBottomText] = useState(bottomText)
  const [isEditing, setIsEditing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const topAnimationRef = useRef<gsap.core.Tween | null>(null)
  const bottomAnimationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setCustomTopText(topText)
    setCustomBottomText(bottomText)
    setTempTopText(topText)
    setTempBottomText(bottomText)
  }, [topText, bottomText])

  // Effect 1: Create animations only when text changes or first mount
  useEffect(() => {
    if (!isMounted || !topRowRef.current || !bottomRowRef.current) return

    if (topAnimationRef.current) topAnimationRef.current.kill()
    if (bottomAnimationRef.current) bottomAnimationRef.current.kill()

    topAnimationRef.current = gsap.to(topRowRef.current, {
      x: '-50%',
      duration: speed,
      ease: 'none',
      repeat: -1,
    })

    gsap.set(bottomRowRef.current, { x: '-50%' })
    bottomAnimationRef.current = gsap.to(bottomRowRef.current, {
      x: '0%',
      duration: speed,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      if (topAnimationRef.current) topAnimationRef.current.kill()
      if (bottomAnimationRef.current) bottomAnimationRef.current.kill()
    }
  }, [isMounted, customTopText, customBottomText])

  // Effect 2: Update speed ONLY — no kill/restart, just update duration live
  useEffect(() => {
    if (!topAnimationRef.current || !bottomAnimationRef.current) return
    topAnimationRef.current.duration(speed)
    bottomAnimationRef.current.duration(speed)
  }, [speed])

  const renderText = (text: string) => {
    return Array(20).fill(text).join(' • ')
  }

  const handleApplyText = () => {
    setCustomTopText(tempTopText)
    setCustomBottomText(tempBottomText)
    setIsEditing(false)
  }

  if (!isMounted) {
    return (
      <div className="w-full space-y-3">
        <div className="w-full overflow-hidden bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 py-4 rounded-xl">
          <div className="relative overflow-hidden mb-3">
            <div className="flex whitespace-nowrap">
              <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                {renderText(topText)}
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex whitespace-nowrap">
              <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                {renderText(bottomText)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Edit Controls */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-md transition-colors"
        >
          ✎ Edit Text
        </button>
      ) : (
        <div className="space-y-2 p-3 bg-dark-600/50 rounded-lg">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Top Row (moves left ←):</label>
            <input
              type="text"
              value={tempTopText}
              onChange={(e) => setTempTopText(e.target.value)}
              placeholder="Top row text (use • between words)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Bottom Row (moves right →):</label>
            <input
              type="text"
              value={tempBottomText}
              onChange={(e) => setTempBottomText(e.target.value)}
              placeholder="Bottom row text (use • between words)"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApplyText}
              className="flex-1 px-3 py-1.5 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
            >
              ✓ Apply Changes
            </button>
            <button
              onClick={() => {
                setTempTopText(customTopText)
                setTempBottomText(customBottomText)
                setIsEditing(false)
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Marquee Container */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 py-4 rounded-xl">
        {/* Top Row - Moving LEFT */}
        <div className="relative overflow-hidden mb-3">
          <div ref={topRowRef} className="flex whitespace-nowrap will-change-transform">
            <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              {renderText(customTopText)}
            </span>
          </div>
        </div>

        {/* Bottom Row - Moving RIGHT */}
        <div className="relative overflow-hidden">
          <div ref={bottomRowRef} className="flex whitespace-nowrap will-change-transform">
            <span className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              {renderText(customBottomText)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <p className="text-gray-500">← Top moves left | Bottom moves right →</p>
        <p className="text-gray-500">
          Speed: {speed}s &nbsp;·&nbsp;
          {speed <= 30 ? '🐇 Fast' : speed <= 60 ? '🚶 Medium' : '🐢 Slow'}
        </p>
      </div>
    </div>
  )
}

// Register Animation from JSON
registerAnimation({
  id: animationData.id,
  name: animationData.name,
  category: animationData.category as any,
  engine: animationData.engine as any,
  component: InfiniteTextMarquee,
  defaultProps: animationData.defaultProps,
  controls: animationData.controls as any,
  code: animationData.code,
  animxSyntax: animationData.animxSyntax,
  description: animationData.description,
  tags: animationData.tags,
  difficulty: animationData.difficulty as any,
})
