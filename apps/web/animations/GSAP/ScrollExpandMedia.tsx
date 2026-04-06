'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerAnimation } from '../../core/AnimationRegistry'
import { Upload, X } from 'lucide-react'
import animationData from '@/data/animations/scroll-expand-media.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const demoImage = 'data:image/svg+xml,%3Csvg width="800" height="600" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300c3ff;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%239b00ff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23ff0095;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23grad)" /%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="white" font-weight="bold"%3EAnimX%3C/text%3E%3Ctext x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.8"%3EScroll to Expand%3C/text%3E%3C/svg%3E'

// ── Preview — looping scale animation that shows the expand effect ────
function PreviewMode({ mediaUrl }: { mediaUrl: string }) {
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mediaRef.current
    if (!el) return

    // Loop: small + rounded → full + square → back, mimicking the scroll effect
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.6 })
    tl.fromTo(
      el,
      { scale: 0.55, borderRadius: '24px' },
      { scale: 1, borderRadius: '0px', duration: 1.6, ease: 'power2.inOut' }
    )
    return () => { tl.kill() }
  }, [])

  return (
    <div className="w-full h-full overflow-hidden rounded-lg bg-dark-600 relative">
      <div ref={mediaRef} className="w-full h-full">
        <img src={mediaUrl} alt="Scroll expand preview" className="w-full h-full object-cover" />
      </div>
      {/* Subtle label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-[9px] font-semibold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none tracking-widest uppercase">
        Scroll to Expand
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function ScrollExpandMedia({
  mediaUrl  = animationData.defaultProps.mediaUrl,
  mediaType = animationData.defaultProps.mediaType as 'image' | 'video',
  isPreview = false,
}: {
  mediaUrl?:  string
  mediaType?: 'image' | 'video'
  isPreview?: boolean
}) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const scrollInnerRef   = useRef<HTMLDivElement>(null)
  const stickyRef        = useRef<HTMLDivElement>(null)
  const mediaRef         = useRef<HTMLDivElement>(null)

  const [uploadedMedia, setUploadedMedia] = useState<string>(mediaUrl)
  const [uploadedType,  setUploadedType]  = useState<'image' | 'video'>(mediaType)
  const [useDemo,       setUseDemo]       = useState(true)
  const [isMounted,     setIsMounted]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setIsMounted(true) }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url  = URL.createObjectURL(file)
    const type = file.type.startsWith('video/') ? 'video' : 'image'
    setUploadedMedia(url)
    setUploadedType(type)
    setUseDemo(false)
  }

  const handleRemoveMedia = () => {
    setUploadedMedia('')
    setUseDemo(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const currentMedia = useDemo ? demoImage : uploadedMedia
  const currentType  = useDemo ? 'image'   : uploadedType

  // ── GSAP scroll animation (detail page only) ──────────────────────
  useEffect(() => {
    if (isPreview || !isMounted || !scrollWrapperRef.current || !mediaRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mediaRef.current,
        { scale: 0.5, borderRadius: '32px' },
        {
          scale: 1, borderRadius: '0px', ease: 'none',
          scrollTrigger: {
            trigger: stickyRef.current,
            scroller: scrollWrapperRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [isPreview, isMounted, currentMedia])

  // ── PREVIEW ───────────────────────────────────────────────────────
  if (isPreview) {
    return <PreviewMode mediaUrl={demoImage} />
  }

  // ── Loading ───────────────────────────────────────────────────────
  if (!isMounted) {
    return (
      <div className="w-full space-y-3">
        <div className="w-full min-h-[300px] bg-dark-600 rounded-xl overflow-hidden">
          <img src={demoImage} alt="Media preview" className="w-full h-full object-cover" />
        </div>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">

      {/* Upload Controls */}
      <div className="flex gap-2 items-center">
        <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="media-upload-expand" />
        <label htmlFor="media-upload-expand" className="cursor-pointer px-3 py-1.5 text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-md transition-colors flex items-center gap-2">
          <Upload className="w-3 h-3" />
          Upload Custom Media
        </label>
        {!useDemo && (
          <button onClick={handleRemoveMedia} className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md transition-colors flex items-center gap-2">
            <X className="w-3 h-3" />
            Use Demo
          </button>
        )}
        <span className="text-xs text-gray-500">{useDemo ? '(Demo Image)' : '(Custom Media)'}</span>
      </div>

      <p className="text-xs text-gray-500">↕ Scroll inside the box to expand the media</p>

      <div ref={scrollWrapperRef} className="relative w-full rounded-xl overflow-y-scroll" style={{ height: '360px' }}>
        <div ref={scrollInnerRef} style={{ height: '1080px' }}>
          <div ref={stickyRef} className="sticky top-0 w-full bg-dark-600" style={{ height: '360px', overflow: 'hidden' }}>
            <div ref={mediaRef} className="w-full h-full">
              {currentType === 'image' ? (
                <img src={currentMedia} alt="Media preview" className="w-full h-full object-cover" />
              ) : (
                <video src={currentMedia} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              )}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
              ↓ Scroll to expand ↓
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
  component:    ScrollExpandMedia,
  defaultProps: animationData.defaultProps,
  controls:     animationData.controls as any,
  code:         animationData.code,
  animxSyntax:  animationData.animxSyntax,
  description:  animationData.description,
  tags:         animationData.tags,
  difficulty:   animationData.difficulty as any,
})