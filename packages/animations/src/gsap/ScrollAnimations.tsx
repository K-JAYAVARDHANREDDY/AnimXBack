import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import animationData from '../data/horizontal-scroll-text.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HorizontalScrollText({
  text          = animationData.defaultProps.text,
  scrubDuration = animationData.defaultProps.scrubDuration,
  bgColor       = animationData.defaultProps.bgColor,
  textColor     = animationData.defaultProps.textColor,
  isPreview     = false,
  /** Font size for the scrolling text */
  fontSize = '6rem',
  /** Font weight */
  fontWeight = 700,
  /** Letter spacing */
  letterSpacing,
  /** Text stroke width */
  textStrokeWidth = 2,
  /** Text stroke color */
  textStrokeColor = 'rgba(0,0,0,0.1)',
  /** Separator between repeated text */
  separator = ' • ',
  /** Number of times to repeat the text */
  repeatCount = 6,
  /** Container height */
  height = 220,
  /** Padding vertical */
  paddingY = '3rem',
  /** Border radius */
  borderRadius = '0.75rem',
  /** Show scroll hint */
  showScrollHint = true,
}: {
  text?:          string
  scrubDuration?: number
  bgColor?:       string
  textColor?:     string
  isPreview?:     boolean
  fontSize?:      string
  fontWeight?:    number
  letterSpacing?: string
  textStrokeWidth?: number
  textStrokeColor?: string
  separator?:     string
  repeatCount?:   number
  height?:        number
  paddingY?:      string
  borderRadius?:  string
  showScrollHint?: boolean
}) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const scrollInnerRef   = useRef<HTMLDivElement>(null)
  const stickyRef        = useRef<HTMLDivElement>(null)
  const textRef          = useRef<HTMLHeadingElement>(null)

  const [isMounted,  setIsMounted]  = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (isPreview || !isMounted || !scrollWrapperRef.current || !textRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
          trigger:  stickyRef.current,
          scroller: scrollWrapperRef.current,
          start:    'top top',
          end:      'bottom top',
          scrub:    scrubDuration,
        },
      })
    })
    return () => ctx.revert()
  }, [isPreview, isMounted, scrubDuration, text])

  // ── PREVIEW — static image snapshot of the animation ─────────────
  if (isPreview) {
    const repeated = `${text} • ${text} • ${text} • `
    return (
      <div
        className="w-full h-full flex items-center overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Text shifted left 25% — looks like it's mid-scroll */}
        <div
          className="whitespace-nowrap font-black uppercase flex-shrink-0 select-none"
          style={{
            fontSize: '1.3rem',
            color: textColor,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            transform: 'translateX(-22%)',
            WebkitTextStroke: '1px rgba(0,0,0,0.12)',
          } as React.CSSProperties}
        >
          {repeated}{repeated}
        </div>
      </div>
    )
  }

  const repeatedText = Array(repeatCount).fill(text).join(separator)

  // ── Loading ───────────────────────────────────────────────────────
  if (!isMounted) {
    return (
      <div className="w-full space-y-3">
        <div className="relative w-full overflow-hidden" style={{ backgroundColor: bgColor, padding: paddingY, borderRadius }}>
          <h1 className="font-bold whitespace-nowrap uppercase" style={{ fontSize, fontWeight, color: textColor, lineHeight: 1, letterSpacing } as React.CSSProperties}>
            {repeatedText}
          </h1>
        </div>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">
      <div ref={scrollWrapperRef} className="relative w-full overflow-y-scroll" style={{ height, borderRadius }}>
        <div ref={scrollInnerRef} style={{ height: height * 3 }}>
          <div ref={stickyRef} className="sticky top-0 w-full overflow-hidden" style={{ backgroundColor: bgColor, height, padding: paddingY }}>
            <h1
              ref={textRef}
              className="whitespace-nowrap uppercase will-change-transform"
              style={{ fontSize, fontWeight, color: textColor, lineHeight: 1, letterSpacing, WebkitTextStroke: `${textStrokeWidth}px ${textStrokeColor}` } as React.CSSProperties}
            >
              {repeatedText}
            </h1>
            {showScrollHint && (
              <div className="absolute bottom-2 right-3 text-[10px] opacity-40" style={{ color: textColor }}>↕ scroll here</div>
            )}
          </div>
        </div>
      </div>

      {showScrollHint && (
        <div className="flex items-center justify-between text-xs">
          <p className="text-gray-500">Scroll inside the box above to animate</p>
          <p className="text-gray-500">Scrub: {scrubDuration}s</p>
        </div>
      )}
    </div>
  )
}

export { animationData as metadata }
