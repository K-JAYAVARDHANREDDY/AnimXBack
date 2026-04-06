import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import animationData from '../data/infinite-text-marque.json'

export function InfiniteTextMarquee({
  topText = animationData.defaultProps.topText as string,
  bottomText = animationData.defaultProps.bottomText as string,
  speed = animationData.defaultProps.speed,
  /** Background gradient or solid color */
  bgColor = 'linear-gradient(to right, rgba(99,102,241,0.1), rgba(168,85,247,0.1), rgba(99,102,241,0.1))',
  /** Text color */
  textColor = '#ffffff',
  /** Font size */
  fontSize = '1.5rem',
  /** Font weight */
  fontWeight = 700,
  /** Letter spacing */
  letterSpacing = '0.05em',
  /** Separator between repeated text */
  separator = ' • ',
  /** Number of times to repeat the text */
  repeatCount = 20,
  /** Gap between rows */
  rowGap = '0.75rem',
  /** Vertical padding */
  padding = '1rem',
  /** Border radius */
  borderRadius = '0.75rem',
  /** Show speed indicator */
  showSpeedIndicator = true,
}: {
  topText?: string
  bottomText?: string
  speed?: number
  bgColor?: string
  textColor?: string
  fontSize?: string
  fontWeight?: number
  letterSpacing?: string
  separator?: string
  repeatCount?: number
  rowGap?: string
  padding?: string
  borderRadius?: string
  showSpeedIndicator?: boolean
}) {
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const topAnimationRef = useRef<gsap.core.Tween | null>(null)
  const bottomAnimationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
  }, [isMounted, topText, bottomText])

  // Effect 2: Update speed ONLY — no kill/restart, just update duration live
  useEffect(() => {
    if (!topAnimationRef.current || !bottomAnimationRef.current) return
    topAnimationRef.current.duration(speed)
    bottomAnimationRef.current.duration(speed)
  }, [speed])

  const renderText = (text: string) => {
    return Array(repeatCount).fill(text).join(separator)
  }

  if (!isMounted) {
    return (
      <div className="w-full space-y-3">
        <div className="w-full overflow-hidden py-4 rounded-xl" style={{ background: bgColor, padding, borderRadius }}>
          <div className="relative overflow-hidden mb-3" style={{ marginBottom: rowGap }}>
            <div className="flex whitespace-nowrap">
              <span className="font-bold text-white uppercase tracking-wider" style={{ fontSize, fontWeight, letterSpacing, color: textColor }}>
                {renderText(topText)}
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex whitespace-nowrap">
              <span className="font-bold text-white uppercase tracking-wider" style={{ fontSize, fontWeight, letterSpacing, color: textColor }}>
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
      {/* Marquee Container */}
      <div className="w-full overflow-hidden" style={{ background: bgColor, padding, borderRadius }}>
        {/* Top Row - Moving LEFT */}
        <div className="relative overflow-hidden" style={{ marginBottom: rowGap }}>
          <div ref={topRowRef} className="flex whitespace-nowrap will-change-transform">
            <span className="font-bold uppercase" style={{ fontSize, fontWeight, letterSpacing, color: textColor }}>
              {renderText(topText)}
            </span>
          </div>
        </div>

        {/* Bottom Row - Moving RIGHT */}
        <div className="relative overflow-hidden">
          <div ref={bottomRowRef} className="flex whitespace-nowrap will-change-transform">
            <span className="font-bold uppercase" style={{ fontSize, fontWeight, letterSpacing, color: textColor }}>
              {renderText(bottomText)}
            </span>
          </div>
        </div>
      </div>

      {showSpeedIndicator && (
        <div className="flex items-center justify-between text-xs">
          <p className="text-gray-500">← Top moves left | Bottom moves right →</p>
          <p className="text-gray-500">
            Speed: {speed}s &nbsp;·&nbsp;
            {speed <= 30 ? '🐇 Fast' : speed <= 60 ? '🚶 Medium' : '🐢 Slow'}
          </p>
        </div>
      )}
    </div>
  )
}

export { animationData as metadata }
