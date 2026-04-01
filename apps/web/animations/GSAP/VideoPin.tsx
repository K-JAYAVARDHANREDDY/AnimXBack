'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerAnimation } from '@/core/AnimationRegistry'
import { Edit2, Check, X } from 'lucide-react'
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

const defaultCards: TestimonialCard[] = [
  { id: 0, name: 'Sarah K.',  role: 'Product Designer',  quote: 'Absolutely game-changing. Animations are silky smooth and the code is clean.', bg: '#FF6B6B', textColor: '#fff',     accentColor: '#FFE66D' },
  { id: 1, name: 'James T.',  role: 'Frontend Engineer', quote: 'I shipped 3x faster using AnimX. The GSAP integrations are next level.',       bg: '#FFE66D', textColor: '#1a1a1a', accentColor: '#FF6B6B' },
  { id: 2, name: 'Priya M.',  role: 'Creative Director', quote: 'Finally, animations that look exactly like the design — no compromises.',       bg: '#A855F7', textColor: '#fff',     accentColor: '#FFE66D' },
]

const CARD_SLOTS      = [
  { landX: '-105%', startX: '-200%', startY: '160%' },
  { landX: '0%',    startX: '0%',    startY: '160%' },
  { landX: '105%',  startX: '200%',  startY: '160%' },
]
const PANEL_HEIGHT    = 560
const SCROLL_PER_CARD = 320
const TOTAL_INNER     = PANEL_HEIGHT + defaultCards.length * SCROLL_PER_CARD

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
        {defaultCards.map((card, i) => (
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
export function TestimonialStackCards({ isPreview = false }: { isPreview?: boolean }) {
  const [isMounted,   setIsMounted]   = useState(false)
  const [isEditing,   setIsEditing]   = useState(false)
  const [editingText, setEditingText] = useState(false)
  const [bgText,      setBgText]      = useState({ first: "What's", second: 'Everyone', third: 'Talking' })
  const [tempText,    setTempText]    = useState(bgText)

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
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-xs font-medium transition-colors">
            ✎ Edit Text
          </button>
        ) : (
          <>
            <button onClick={() => setEditingText(true)} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
              <Edit2 className="w-3 h-3" /> Edit Background Text
            </button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-medium transition-colors">
              ✓ Done
            </button>
          </>
        )}
        <span className="text-xs text-gray-500 ml-auto">↕ Scroll inside the box</span>
      </div>

      {editingText && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-600 rounded-xl p-6 max-w-sm w-full border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Edit Background Text</h3>
            <div className="space-y-3">
              {(['first', 'second', 'third'] as const).map((key, i) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1">Line {i + 1}</label>
                  <input type="text" value={tempText[key]} onChange={e => setTempText({ ...tempText, [key]: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setBgText(tempText); setEditingText(false) }} className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><Check className="w-4 h-4" />Save</button>
                <button onClick={() => { setTempText(bgText); setEditingText(false) }} className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"><X className="w-4 h-4" />Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollWrapperRef} className="w-full rounded-xl overflow-y-scroll" style={{ height: `${PANEL_HEIGHT}px` }}>
        <div ref={scrollInnerRef} style={{ height: `${TOTAL_INNER}px` }}>
          <div ref={stickyRef} className="sticky top-0 overflow-hidden bg-[#f0e8d8]" style={{ height: `${PANEL_HEIGHT}px` }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
              <h1 ref={bgText1Ref} className="font-black text-black/10 leading-[0.85] whitespace-nowrap" style={{ fontSize: 'clamp(64px, 15vw, 140px)' }}>{bgText.first}</h1>
              <h1 ref={bgText2Ref} className="font-black text-black/15 leading-[0.85] whitespace-nowrap" style={{ fontSize: 'clamp(64px, 15vw, 140px)' }}>{bgText.second}</h1>
              <h1 ref={bgText3Ref} className="font-black text-black/10 leading-[0.85] whitespace-nowrap" style={{ fontSize: 'clamp(64px, 15vw, 140px)' }}>{bgText.third}</h1>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              {defaultCards.map((card, index) => (
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
                  <div className="text-4xl font-black leading-none" style={{ color: card.accentColor, opacity: 0.7 }}>"</div>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: card.textColor }}>{card.quote}</p>
                  <div>
                    <div className="w-6 h-0.5 mb-2 rounded-full" style={{ backgroundColor: card.accentColor }} />
                    <p className="text-xs font-bold" style={{ color: card.textColor }}>{card.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: card.accentColor }}>{card.role}</p>
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
  controls:     animationData.controls,
  code:         animationData.code,
  animxSyntax:  animationData.animxSyntax,
  description:  animationData.description,
  tags:         animationData.tags,
  difficulty:   animationData.difficulty as any,
})