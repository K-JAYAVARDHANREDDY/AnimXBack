'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useCallback, useState } from 'react'
import { useAnimationRegistry } from '@/core/AnimationRegistry'
import { AnimationDetail } from '@/components/AnimationDetail'
import { ChevronLeft, ChevronRight, Home, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { AnimationDTO } from '@/types/animation.types'

import { ANIMATION_IMPORTS } from '@/core/animationImports'

export default function AnimationPage() {
  const params  = useParams()
  const router  = useRouter()
  const id      = params.id as string
  const { animations } = useAnimationRegistry()

  const [isReady, setIsReady]           = useState(false)
  // Full DTO fetched directly from /api/animations/[id] (has code, controls, animxSyntax)
  const [fullAnimation, setFullAnimation] = useState<AnimationDTO | null>(null)
  
  // Timer to delay the appearance of the loading spinner to prevent glitchy flashing
  const [showLoader, setShowLoader]     = useState(false)

  useEffect(() => {
    setIsReady(false)
    setFullAnimation(null)
    setShowLoader(false)

    // Delay spinner appearance by 150ms
    const timer = setTimeout(() => setShowLoader(true), 150)

    // 1. Fetch full DTO from the API (always returns all fields)
    const fetchFull = fetch(`/api/animations/${id}`)
      .then(r => r.ok ? r.json() as Promise<AnimationDTO> : Promise.reject(r.status))
      .then(data => setFullAnimation(data))
      .catch(() => {})

    // 2. Load the requested animation component immediately
    const primary = ANIMATION_IMPORTS[id]
    const loadComponent = primary ? primary().catch(() => {}) : Promise.resolve()

    // Ready once both the component import and the API fetch complete
    Promise.all([fetchFull, loadComponent]).finally(() => {
      setIsReady(true)
      clearTimeout(timer)
    })

    // 4. Load all others in the background — no await, doesn't block UI
    Object.entries(ANIMATION_IMPORTS).forEach(([key, fn]) => {
      if (key !== id) fn().catch(() => {})
    })
    
    return () => clearTimeout(timer)
  }, [id])

  // sessionStorage key — must match page.tsx
const KEY_DASHBOARD = 'animx-dashboard-entered' //Used in sessionStorage to track if user already entered dashboard.

 const goToLandingPage = () => {
    sessionStorage.removeItem(KEY_DASHBOARD)
    // KEY_SPLASH stays → lands on landing page, not splash animation
    window.location.href = '/'
  }

  const currentIndex  = animations.findIndex(a => a.id === id)
  const prevAnimation = currentIndex > 0 ? animations[currentIndex - 1] : null
  const nextAnimation = currentIndex < animations.length - 1 ? animations[currentIndex + 1] : null

  const handleKeyNav = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if (e.key === 'ArrowLeft'  && prevAnimation) router.push(`/animation/${prevAnimation.id}`)
    if (e.key === 'ArrowRight' && nextAnimation) router.push(`/animation/${nextAnimation.id}`)
    if (e.key === 'Escape' || e.key === 'Backspace') router.push('/dashboard')
  }, [prevAnimation, nextAnimation, router])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNav)
    return () => window.removeEventListener('keydown', handleKeyNav)
  }, [handleKeyNav])

  useEffect(() => {
    if (isReady && !fullAnimation) router.push('/dashboard')
  }, [isReady, fullAnimation, router])

  if (!isReady || !fullAnimation) {
    if (!showLoader) {
      return <div className="min-h-screen bg-dark-500" />;
    }
  
    return (
      <div className="min-h-screen bg-dark-500 flex flex-col items-center justify-center gap-5">
        <motion.div
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22d3ee] via-[#818cf8] to-[#a855f7] flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-7 h-7 text-white" />
        </motion.div>
        <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Loading animation…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <div className="sticky top-0 z-50 bg-dark-500/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs min-w-0">
                 {/* Logo */}
          {/* Logo */}
          <Link href="/" onClick={goToLandingPage} className="mr-4 flex-shrink-0">
            <motion.div
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-black text-lg tracking-tight hidden sm:block">AnimX</span>
            </motion.div>
          </Link>

            <Link href="/dashboard" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors flex-shrink-0">
              <Home className="w-3 h-3" />
              <span>Dashboard</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <span className="text-gray-400 flex-shrink-0">{fullAnimation.category}</span>
            <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <span className="text-primary-400 font-medium truncate">{fullAnimation.name}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-gray-600 hidden sm:block">← → to navigate</span>
            <button
              onClick={() => prevAnimation && router.push(`/animation/${prevAnimation.id}`)}
              disabled={!prevAnimation}
              title={prevAnimation ? `← ${prevAnimation.name}` : undefined}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{prevAnimation?.name.slice(0, 12) || 'Prev'}</span>
            </button>
            <span className="text-gray-600 text-xs">{currentIndex + 1} / {animations.length}</span>
            <button
              onClick={() => nextAnimation && router.push(`/animation/${nextAnimation.id}`)}
              disabled={!nextAnimation}
              title={nextAnimation ? `${nextAnimation.name} →` : undefined}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
            >
              <span className="hidden sm:block">{nextAnimation?.name.slice(0, 12) || 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <AnimationDetail animation={fullAnimation} />
    </div>
  )
}

