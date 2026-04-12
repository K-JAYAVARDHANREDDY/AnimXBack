'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ANIMATION_IMPORTS } from '@/core/animationImports'
import { useAnimationRegistry } from '@/core/AnimationRegistry'
import type { AnimationDTO } from '@/types/animation.types'

/**
 * /embed/[id]
 *
 * A minimal, chrome-free page designed to be loaded inside an <iframe>.
 * Loads the animation component and renders it with its default props.
 * No navigation, no controls, no header — just the animation.
 */
export default function EmbedPage() {
  const params = useParams()
  const id = params.id as string

  const [isReady, setIsReady] = useState(false)
  const [animation, setAnimation] = useState<AnimationDTO | null>(null)

  // Load animation data + component in parallel
  useEffect(() => {
    if (!id) return

    const fetchData = fetch(`/api/animations/${id}`)
      .then(r => (r.ok ? (r.json() as Promise<AnimationDTO>) : Promise.reject(r.status)))
      .then(data => setAnimation(data))
      .catch(() => {})

    const loadComponent = ANIMATION_IMPORTS[id]
      ? ANIMATION_IMPORTS[id]().catch(() => {})
      : Promise.resolve()

    Promise.all([fetchData, loadComponent]).finally(() => setIsReady(true))
  }, [id])

  // Pull the live React component from the registry (registered by the import above)
  const Component = useAnimationRegistry(s => s.components[id])

  if (!isReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0e1a',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #00c3ff, #9b00ff)',
            animation: 'spin 1.5s linear infinite',
          }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7280', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading…
        </p>
      </div>
    )
  }

  if (!isReady || !animation || !Component) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0e1a',
          color: '#6b7280',
          fontSize: 14,
          fontFamily: 'monospace',
        }}
      >
        Animation not found.
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        background: '#0a0e1a',
      }}
    >
      {/* Subtle background glow — matches AnimX aesthetic */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(0,195,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(155,0,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* "Powered by AnimX" watermark */}
      <a
        href={`${typeof window !== 'undefined' ? window.location.origin : ''}/animation/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 12,
          right: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          textDecoration: 'none',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
          zIndex: 50,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,195,255,0.7)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            fill="currentColor"
          />
        </svg>
        Powered by AnimX
      </a>

      {/* The animation itself */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 800 }}>
        <Component {...animation.defaultProps} />
      </div>
    </div>
  )
}
