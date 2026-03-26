'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Code2, Heart, Share2, Sparkles } from 'lucide-react'
import type { AnimationSummaryDTO } from '@/types/animation.types'
import { useAnimationRegistry } from '@/core/AnimationRegistry'
import { AnimationErrorBoundary } from './AnimationErrorBoundary'
import { ShareModal } from './ShareModal'
import { ANIMATION_IMPORTS } from '@/core/animationImports'

interface AnimationCardProps {
  animation: AnimationSummaryDTO
  isFavorited?: boolean
  onToggleFavorite?: (id: string) => void
}

const engineColors = {
  gsap: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  css: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  three: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  tailwind: 'from-sky-500/20 to-blue-500/20 border-sky-500/30',
  framer: 'from-pink-500/20 to-rose-500/20 border-pink-500/30'
}

const engineTextColors = {
  gsap: 'text-green-400',
  css: 'text-blue-400',
  three: 'text-purple-400',
  tailwind: 'text-sky-400',
  framer: 'text-pink-400'
}

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
}

export function AnimationCard({
  animation,
  isFavorited = false,
  onToggleFavorite,
}: AnimationCardProps) {
  // Look up the live component from the registry — may be undefined if only a DTO is loaded
  const Component = useAnimationRegistry(s => s.components[animation.id])
  const [showShare, setShowShare] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Intersection Observer to trigger the dynamic import when the card enters the viewport
  // This produces a seamless scroll experience.
  useEffect(() => {
    if (Component) return // Already loaded

    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const importFn = ANIMATION_IMPORTS[animation.id]
        if (importFn) {
          importFn().catch(() => {})
        }
        observer.unobserve(el)
      }
    }, { rootMargin: '150px' })

    observer.observe(el)
    return () => observer.disconnect()
  }, [Component, animation.id])

  return (
    <>
      <Link href={`/animation/${animation.id}`}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className={`glass-card p-4 cursor-pointer group relative overflow-hidden bg-gradient-to-br ${engineColors[animation.engine]} border`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-accent-500/0 to-primary-500/0 group-hover:from-primary-500/10 group-hover:via-accent-500/10 group-hover:to-primary-500/10 transition-all duration-500" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary-300 transition-colors line-clamp-1">
                  {animation.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">{animation.description}</p>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShare(true) }}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors"
                  title="Share / Embed"
                >
                  <Share2 className="w-3.5 h-3.5 text-gray-500 hover:text-primary-400 transition-colors" />
                </button>
                {onToggleFavorite && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(animation.id) }}
                    className="p-1 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorited ? 'fill-red-400 text-red-400' : 'text-gray-500 hover:text-red-400'}`} />
                  </button>
                )}
                <Zap className="w-4 h-4 text-primary-400 group-hover:animate-pulse" />
              </div>
            </div>
            <div
              className="bg-dark-600/50 rounded-lg mb-3 backdrop-blur-sm relative"
              style={{ height: '160px', overflow: 'hidden' }}
            >
              {/* Block all scroll, hover, click interactions in preview */}
              <div className="absolute inset-0 z-10" style={{ pointerEvents: 'all' }} />
              {Component ? (
                <AnimationErrorBoundary animationName={animation.name}>
                  <div className="w-full h-full" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    <Component {...animation.defaultProps} isPreview={true} />
                  </div>
                </AnimationErrorBoundary>
              ) : (
                // Placeholder shown when only a slim DTO is in the store (no live component registered)
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
                  <Sparkles className="w-8 h-8 text-primary-400" />
                  <span className="text-xs text-gray-400 font-medium">{animation.engine.toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {animation.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-400 border border-white/10"
                >
                  {tag}
                </span>
              ))}
              {animation.tags.length > 3 && (
                <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/5 text-gray-400 border border-white/10">+{animation.tags.length - 3}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Code2 className={`w-3 h-3 ${engineTextColors[animation.engine]}`} />
                <span className={`font-medium ${engineTextColors[animation.engine]}`}>{animation.engine.toUpperCase()}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md border ${difficultyColors[animation.difficulty]}`}>{animation.difficulty}</span>
            </div>
          </div>
        </motion.div>
      </Link>
      {showShare && <ShareModal animation={animation as any} onClose={() => setShowShare(false)} />}
    </>
  )
}
