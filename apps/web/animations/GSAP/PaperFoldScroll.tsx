'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/paper-fold-scroll.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Section {
  id: number
  title: string
  content: string
  bgColor: string
  textColor: string
  bgImage?: string
}

const defaultSections: Section[] = animationData.defaultProps.sections as Section[]

// ── Preview — auto-animating fold cycle ───────────────────────────────
function PreviewMode({ sections }: { sections: Section[] }) {
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const tlRef     = useRef<gsap.core.Timeline | null>(null)
  const visible   = sections.slice(0, 3)

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length < 2) return

    // Reset all cards to stacked position
    gsap.set(cards, { scale: 1, x: 0, y: 0, rotation: 0, opacity: 1, transformOrigin: 'top left' })
    cards.forEach((card, i) => {
      gsap.set(card, {
        scale:    1 - i * 0.07,
        y:        i * 14,
        x:        i * 6,
        rotation: -i * 3,
        opacity:  1 - i * 0.2,
        zIndex:   cards.length - i,
      })
    })

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
    tlRef.current = tl

    // Fold the top card away (scale down, move top-left, fade)
    tl.to(cards[0], {
      scale:    0.65,
      x:        '-38%',
      y:        '-38%',
      rotation: -12,
      opacity:  0,
      duration: 0.7,
      ease:     'power2.inOut',
    })

    // Simultaneously shift remaining cards forward
    cards.slice(1).forEach((card, i) => {
      tl.to(card, {
        scale:    1 - i * 0.07,
        y:        i * 14,
        x:        i * 6,
        rotation: -i * 3,
        opacity:  1 - i * 0.2,
        zIndex:   cards.length - i,
        duration: 0.7,
        ease:     'power2.inOut',
      }, '<')
    })

    // Pause to show new top card
    tl.to({}, { duration: 1.2 })

    // Reset — bring folded card back to bottom of stack
    tl.set(cards[0], {
      scale:    1 - (cards.length - 1) * 0.07,
      x:        (cards.length - 1) * 6,
      y:        (cards.length - 1) * 14,
      rotation: -(cards.length - 1) * 3,
      opacity:  1 - (cards.length - 1) * 0.2,
      zIndex:   1,
    })

    // Shift everything else back
    cards.slice(1).forEach((card, i) => {
      tl.set(card, {
        scale:    1 - (i + 1) * 0.07,  // push down one level
        y:        (i + 1) * 14,
        x:        (i + 1) * 6,
        rotation: -(i + 1) * 3,
        opacity:  1 - (i + 1) * 0.2,
        zIndex:   cards.length - (i + 1),
      })
    })

    // Bring new top card to front smoothly
    tl.to(cards[1], {
      scale: 1, x: 0, y: 0, rotation: 0, opacity: 1,
      zIndex: cards.length,
      duration: 0.5, ease: 'power2.out',
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      {visible.map((section, i) => (
        <div
          key={section.id}
          ref={el => { cardRefs.current[i] = el }}
          className="absolute inset-2 rounded-xl overflow-hidden flex flex-col justify-end"
          style={{
            backgroundColor: section.bgColor,
            backgroundImage: section.bgImage ? `url(${section.bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {section.bgImage && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 p-3">
            <div className="font-black text-sm leading-tight truncate" style={{ color: section.textColor }}>
              {section.title}
            </div>
            <div className="text-[9px] mt-0.5 opacity-60 truncate" style={{ color: section.textColor }}>
              {section.content}
            </div>
          </div>
        </div>
      ))}

      {/* Label */}
      <div className="absolute top-2 right-2 z-50 text-[8px] font-semibold bg-black/50 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm tracking-widest uppercase pointer-events-none">
        Paper Fold
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function PaperFoldScroll({
  sections  = defaultSections,
  foldDirection = (animationData.defaultProps as any).foldDirection || 'top-left',
  isPreview = false,
}: {
  sections?:  Section[]
  foldDirection?: string
  isPreview?: boolean
}) {
  const [isMounted, setIsMounted] = useState(false)
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (isPreview || !isMounted || !scrollWrapperRef.current) return
    const ctx = gsap.context(() => {
      sectionsRef.current.forEach(section => {
        if (!section) return
        
        let transformOrigin = 'top left'
        let rotateX = -15, rotateY = -15, x = '-40%', y = '-40%'
        
        switch (foldDirection) {
          case 'top-right': transformOrigin = 'top right'; rotateX = -15; rotateY = 15; x = '40%'; y = '-40%'; break;
          case 'bottom-left': transformOrigin = 'bottom left'; rotateX = 15; rotateY = -15; x = '-40%'; y = '40%'; break;
          case 'bottom-right': transformOrigin = 'bottom right'; rotateX = 15; rotateY = 15; x = '40%'; y = '40%'; break;
          case 'top-left': default: transformOrigin = 'top left'; rotateX = -15; rotateY = -15; x = '-40%'; y = '-40%'; break;
        }

        gsap.to(section, {
          scrollTrigger: { trigger: section, scroller: scrollWrapperRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          scale: 0.8, rotateX, rotateY, x, y,
          transformOrigin, ease: 'none',
        })
        gsap.to(section, {
          scrollTrigger: { trigger: section, scroller: scrollWrapperRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          opacity: 0.3, ease: 'none',
        })
      })
    })
    return () => ctx.revert()
  }, [isPreview, isMounted, sections])

  // ── PREVIEW ───────────────────────────────────────────────────────
  if (isPreview) return <PreviewMode sections={sections && sections.length > 0 ? sections : defaultSections} />

  // ── Loading ───────────────────────────────────────────────────────
  if (!isMounted) return (
    <div className="w-full h-[500px] bg-dark-600 rounded-xl flex items-center justify-center">
      <p className="text-gray-400">Loading animation...</p>
    </div>
  )

  const activeSections = sections && sections.length > 0 ? sections : defaultSections

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">
      <p className="text-xs text-gray-500">↕ Scroll inside the box to see the paper fold effect</p>

      <div ref={scrollWrapperRef} className="relative w-full rounded-xl overflow-y-scroll" style={{ height: '500px' }}>
        {activeSections.map((section, index) => (
          <div
            key={section.id ?? index}
            ref={el => { if (el) sectionsRef.current[index] = el }}
            className="relative flex items-center justify-center"
            style={{
              height: '500px', backgroundColor: section.bgColor,
              backgroundImage: section.bgImage ? `url(${section.bgImage})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              perspective: '1000px', transformStyle: 'preserve-3d',
              position: 'sticky', top: 0,
            }}
          >
            {section.bgImage && <div className="absolute inset-0 bg-black/50" />}
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: section.textColor }}>{section.title}</h2>
              <p className="text-lg md:text-xl" style={{ color: section.textColor, opacity: 0.8 }}>{section.content}</p>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm opacity-50" style={{ color: section.textColor }}>{index + 1} / {activeSections.length}</div>
            </div>
            {index === 0 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ color: section.textColor, opacity: 0.6 }}>
                <span className="text-xs uppercase tracking-wider">Scroll Down</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

registerAnimation({
  id: animationData.id, name: animationData.name,
  category: animationData.category as any, engine: animationData.engine as any,
  component: PaperFoldScroll, defaultProps: animationData.defaultProps,
  controls: animationData.controls as any, code: animationData.code,
  animxSyntax: animationData.animxSyntax, description: animationData.description,
  tags: animationData.tags, difficulty: animationData.difficulty as any,
})