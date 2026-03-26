'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { CodeViewer } from './CodeViewer'
import { ControlPanel } from './ControlPanel'
import { useAnimationRegistry } from '@/core/AnimationRegistry'
import type { AnimationDTO } from '../types/animation.types'

interface AnimationDetailProps {
  animation: AnimationDTO
}

const engineColors = {
  gsap:    'text-green-400 bg-green-500/10 border-green-500/30',
  css:     'text-blue-400 bg-blue-500/10 border-blue-500/30',
  three:   'text-purple-400 bg-purple-500/10 border-purple-500/30',
  tailwind:'text-sky-400 bg-sky-500/10 border-sky-500/30',
  framer:  'text-pink-400 bg-pink-500/10 border-pink-500/30',
}

const difficultyColors = {
  easy:   'text-green-400 bg-green-500/10 border-green-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  hard:   'text-red-400 bg-red-500/10 border-red-500/30',
}

// sessionStorage key — must match page.tsx
const KEY_DASHBOARD = 'animx-dashboard-entered'

export function AnimationDetail({ animation }: AnimationDetailProps) {
  const router = useRouter()
  const [animationProps, setAnimationProps] = useState(animation.defaultProps)

  // The store holds slim DTOs; the live React component is registered separately
  // by the dynamic import in the animation page. Look it up by ID.
  const Component = useAnimationRegistry(s => s.components[animation.id])

  // Ensure the dashboard key is set before navigating back,
  // so page.tsx always lands on the dashboard stage, never the landing page.
  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '-2s' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-dark-500/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button — always returns to dashboard */}
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold text-white mb-3">{animation.name}</h1>
            <p className="text-gray-400 text-lg mb-5">{animation.description}</p>

            {/* Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 text-sm rounded-lg border font-medium ${engineColors[animation.engine]}`}>
                {animation.engine.toUpperCase()}
              </span>
              <span className={`px-3 py-1 text-sm rounded-lg border font-medium ${difficultyColors[animation.difficulty]}`}>
                {animation.difficulty}
              </span>
              <span className="px-3 py-1 text-sm rounded-lg border border-white/10 text-gray-300 bg-white/5">
                {animation.category}
              </span>
              {animation.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm rounded-lg border border-white/10 text-gray-400 bg-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Preview + Controls */}
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live Preview
                </h2>
                <div className="bg-dark-500/50 rounded-xl p-12 flex items-center justify-center min-h-[280px]">
                  {Component ? (
                    <Component {...animationProps} />
                  ) : (
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </motion.div>
                      <p className="text-xs text-gray-500 font-mono">Loading preview…</p>
                    </div>
                  )}
                </div>
              </div>

              <ControlPanel
                controls={animation.controls}
                values={animationProps}
                onChange={setAnimationProps}
              />
            </div>

            {/* Right: Code */}
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                  Code
                </h2>
                <CodeViewer
                  fullCode={animation.code}
                  animxSyntax={animation.animxSyntax}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
