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
}: {
  text?:          string
  scrubDuration?: number
  bgColor?:       string
  textColor?:     string
  isPreview?:     boolean
}) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const scrollInnerRef   = useRef<HTMLDivElement>(null)
  const stickyRef        = useRef<HTMLDivElement>(null)
  const textRef          = useRef<HTMLHeadingElement>(null)

  const [customText, setCustomText] = useState(text)
  const [tempText,   setTempText]   = useState(text)
  const [isEditing,  setIsEditing]  = useState(false)
  const [isMounted,  setIsMounted]  = useState(false)

  useEffect(() => { setIsMounted(true) }, [])
  useEffect(() => { setCustomText(text); setTempText(text) }, [text])

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
  }, [isPreview, isMounted, scrubDuration, customText])

  const handleApplyText = () => { setCustomText(tempText); setIsEditing(false) }

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

  // ── Loading ───────────────────────────────────────────────────────
  if (!isMounted) {
    return (
      <div className="w-full space-y-3">
        <div className="relative w-full overflow-hidden rounded-xl py-12" style={{ backgroundColor: bgColor }}>
          <h1 className="font-bold whitespace-nowrap uppercase" style={{ fontSize: '6rem', color: textColor, lineHeight: 1 } as React.CSSProperties}>
            {text} • {text} • {text} • {text}
          </h1>
        </div>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-md transition-colors">
          ✎ Edit Text
        </button>
      ) : (
        <div className="space-y-2 p-3 bg-dark-600/50 rounded-lg">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Custom Text:</label>
            <input
              type="text" value={tempText} onChange={e => setTempText(e.target.value)}
              placeholder="Enter your text"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              onKeyDown={e => { if (e.key === 'Enter') handleApplyText() }}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleApplyText} className="flex-1 px-3 py-1.5 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors">✓ Apply</button>
            <button onClick={() => { setTempText(customText); setIsEditing(false) }} className="flex-1 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded-md transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div ref={scrollWrapperRef} className="relative w-full rounded-xl overflow-y-scroll" style={{ height: '220px' }}>
        <div ref={scrollInnerRef} style={{ height: '660px' }}>
          <div ref={stickyRef} className="sticky top-0 w-full overflow-hidden py-12" style={{ backgroundColor: bgColor, height: '220px' }}>
            <h1
              ref={textRef}
              className="font-bold whitespace-nowrap uppercase will-change-transform"
              style={{ fontSize: '6rem', color: textColor, lineHeight: 1, WebkitTextStroke: '2px rgba(0,0,0,0.1)' } as React.CSSProperties}
            >
              {customText} • {customText} • {customText} • {customText} • {customText} • {customText}
            </h1>
            <div className="absolute bottom-2 right-3 text-[10px] opacity-40" style={{ color: textColor }}>↕ scroll here</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <p className="text-gray-500">Scroll inside the box above to animate</p>
        <p className="text-gray-500">Scrub: {scrubDuration}s</p>
      </div>
    </div>
  )
}

export { animationData as metadata }
