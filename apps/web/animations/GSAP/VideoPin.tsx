'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/testimonial-stack-parallax.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface TestimonialCard {
  id: number
  name: string
  role: string
  quote: string
  bg: string
  textColor: string
  accentColor: string
}

const CARD_SLOTS      = [
  { landX: '-105%', startX: '-200%', startY: '160%' },
  { landX: '0%',    startX: '0%',    startY: '160%' },
  { landX: '105%',  startX: '200%',  startY: '160%' },
]
const PANEL_HEIGHT    = 560
const SCROLL_PER_CARD = 320

// ── Preview — 3 fanned cards, fits any card height ────────────────────
function PreviewMode() {
  // fan: left card tilted left, center upright, right tilted right
  const transforms = [
    'translateX(-38px) translateY(8px)  rotate(-8deg)',
    'translateX(0px)   translateY(0px)  rotate(0deg)',
    'translateX(38px)  translateY(8px)  rotate(8deg)',
  ]
  const zIndexes = [1, 3, 2]

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: '#f0e8d8' }}>

      {/* Ghost background text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span className="font-black leading-none" style={{ fontSize: '2.8rem', color: 'rgba(0,0,0,0.07)' }}>What's</span>
        <span className="font-black leading-none" style={{ fontSize: '2.8rem', color: 'rgba(0,0,0,0.10)' }}>Everyone</span>
      </div>

      {/* Cards fanned in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {(animationData.defaultProps.cards as TestimonialCard[]).map((card, i) => (
          <div
            key={card.id}
            className="absolute rounded-xl shadow-lg flex flex-col justify-between"
            style={{
              width:           68,
              height:          96,
              backgroundColor: card.bg,
              padding:         '8px',
              transform:       transforms[i],
              zIndex:          zIndexes[i],
            }}
          >
            <div className="font-black leading-none text-base" style={{ color: card.accentColor, opacity: 0.8 }}>"</div>
            <p className="font-semibold leading-tight" style={{ fontSize: '6.5px', color: card.textColor }}>
              {card.quote.slice(0, 30)}…
            </p>
            <div>
              <div className="w-4 mb-0.5 rounded-full" style={{ height: '1.5px', backgroundColor: card.accentColor }} />
              <p className="font-bold leading-none" style={{ fontSize: '6.5px', color: card.textColor }}>{card.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold uppercase tracking-widest" style={{ fontSize: '7px', color: 'rgba(0,0,0,0.28)' }}>
        Scroll to reveal
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function TestimonialStackCards({ 
  isPreview = false,
  textColor   = animationData.defaultProps.textColor,
  accentColor = animationData.defaultProps.accentColor,
  bgTextFirst  = animationData.defaultProps.bgTextFirst as string,
  bgTextSecond = animationData.defaultProps.bgTextSecond as string,
  bgTextThird  = animationData.defaultProps.bgTextThird as string,
  cards        = animationData.defaultProps.cards as TestimonialCard[]
}: { 
  isPreview?: boolean
  textColor?: string
  accentColor?: string
  bgTextFirst?: string
  bgTextSecond?: string
  bgTextThird?: string
  cards?: TestimonialCard[]
}) {
  const [isMounted, setIsMounted]   = useState(false)
  const TOTAL_INNER = PANEL_HEIGHT + cards.length * SCROLL_PER_CARD

  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const scrollInnerRef   = useRef<HTMLDivElement>(null)
  const stickyRef        = useRef<HTMLDivElement>(null)
  const cardRefs         = useRef<(HTMLDivElement | null)[]>([])
  const bgText1Ref       = useRef<HTMLHeadingElement>(null)
  const bgText2Ref       = useRef<HTMLHeadingElement>(null)
  const bgText3Ref       = useRef<HTMLHeadingElement>(null)

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (!isMounted || !scrollWrapperRef.current || isPreview) return
    const scroller = scrollWrapperRef.current

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.set(card, { x: CARD_SLOTS[i].startX, y: CARD_SLOTS[i].startY, opacity: 0 })
    })

    const ctx = gsap.context(() => {
      gsap.to(bgText1Ref.current, { xPercent: 30,  ease: 'none', scrollTrigger: { trigger: stickyRef.current, scroller, start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to(bgText2Ref.current, { xPercent: -20, ease: 'none', scrollTrigger: { trigger: stickyRef.current, scroller, start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to(bgText3Ref.current, { xPercent: 25,  ease: 'none', scrollTrigger: { trigger: stickyRef.current, scroller, start: 'top top', end: 'bottom top', scrub: 1 } })

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.to(card, {
          x: CARD_SLOTS[i].landX, y: '0%', opacity: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: scrollInnerRef.current, scroller,
            start: `top+=${i * SCROLL_PER_CARD} top`,
            end:   `top+=${(i + 1) * SCROLL_PER_CARD} top`,
            scrub: 0.8,
          },
        })
      })
    })

    return () => { ctx.revert(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [isMounted, isPreview])

  // ── PREVIEW ───────────────────────────────────────────────────────
  if (isPreview) return <PreviewMode />

  // ── Loading ───────────────────────────────────────────────────────
  if (!isMounted) return (
    <div className="w-full rounded-xl bg-[#f0e8d8] flex items-center justify-center" style={{ height: PANEL_HEIGHT }}>
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  )

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-gray-500 ml-auto">↕ Scroll inside the box</span>
      </div>

      <div ref={scrollWrapperRef} className="w-full rounded-xl overflow-y-scroll" style={{ height: `${PANEL_HEIGHT}px` }}>
        <div ref={scrollInnerRef} style={{ height: `${TOTAL_INNER}px` }}>
          <div ref={stickyRef} className="sticky top-0 overflow-hidden bg-[#f0e8d8]" style={{ height: `${PANEL_HEIGHT}px` }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
              <h1 ref={bgText1Ref} className="font-black text-black/10 leading-[0.85] whitespace-nowrap" style={{ fontSize: 'clamp(64px, 15vw, 140px)' }}>{bgTextFirst}</h1>
              <h1 ref={bgText2Ref} className="font-black text-black/15 leading-[0.85] whitespace-nowrap" style={{ fontSize: 'clamp(64px, 15vw, 140px)' }}>{bgTextSecond}</h1>
              <h1 ref={bgText3Ref} className="font-black text-black/10 leading-[0.85] whitespace-nowrap" style={{ fontSize: 'clamp(64px, 15vw, 140px)' }}>{bgTextThird}</h1>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  ref={el => { cardRefs.current[index] = el }}
                  className="absolute rounded-2xl shadow-2xl flex flex-col justify-between"
                  style={{
                    width: '155px', height: '220px',
                    backgroundColor: card.bg, padding: '20px',
                    rotate: `${index === 0 ? '-3deg' : index === 2 ? '3deg' : '0deg'}`,
                  }}
                >
                  <div className="text-4xl font-black leading-none" style={{ color: accentColor || card.accentColor, opacity: 0.7 }}>"</div>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: textColor || card.textColor }}>{card.quote}</p>
                  <div>
                    <div className="w-6 h-0.5 mb-2 rounded-full" style={{ backgroundColor: accentColor || card.accentColor }} />
                    <p className="text-xs font-bold" style={{ color: textColor || card.textColor }}>{card.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: accentColor || card.accentColor }}>{card.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
              <p className="text-black/30 text-[11px] uppercase tracking-widest">scroll to reveal</p>
              <div className="w-px h-5 bg-black/20 animate-bounce" />
            </div>
          </div>
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
  component:    TestimonialStackCards,
  defaultProps: animationData.defaultProps,
  controls:     animationData.controls as any,
  code:         animationData.code,
  animxSyntax:  animationData.animxSyntax,
  description:  animationData.description,
  tags:         animationData.tags,
  difficulty:   animationData.difficulty as any,
})