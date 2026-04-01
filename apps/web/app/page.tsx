'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

// ── Lazy load each stage — nothing downloads until it's actually needed
const LandingAnimation = dynamic(
  () => import('@/components/LandingAnimation').then(m => ({ default: m.LandingAnimation })),
  { ssr: false, loading: () => <BootSpinner /> }
)

const LandingPage = dynamic(
  () => import('@/components/LandingPage').then(m => ({ default: m.LandingPage })),
  { ssr: false, loading: () => <BootSpinner /> }
)

type Stage = 'splash' | 'landing'

const KEY_SPLASH    = 'animx-splash-shown'
const KEY_DASHBOARD = 'animx-dashboard-entered'

// Spinner shown on first server paint — same on server AND client
// so there is zero hydration mismatch.
function BootSpinner() {
  return (
    <div className="min-h-screen bg-[#060610] flex flex-col items-center justify-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22d3ee] via-[#818cf8] to-[#a855f7] flex items-center justify-center">
        <Sparkles className="w-7 h-7 text-white" />
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  
  // ── null = "not yet determined" (server + first client paint) ─────
  // Both server and client render <BootSpinner /> for this state,
  // which eliminates the hydration mismatch completely.
  // useEffect runs only on the client and sets the real stage.
  const [stage, setStage] = useState<Stage | null>(null)

  // ── Determine stage client-side only ─────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(KEY_DASHBOARD) === 'true') {
      router.replace('/dashboard')
    } else if (sessionStorage.getItem(KEY_SPLASH) === 'true') {
      setStage('landing')
    } else {
      setStage('splash')
    }
  }, [router])

  const handleSplashComplete = () => {
    sessionStorage.setItem(KEY_SPLASH, 'true')
    setStage('landing')
  }

  const handleEnterDashboard = () => {
    sessionStorage.setItem(KEY_DASHBOARD, 'true')
    router.push('/dashboard')
  }

  // ── First paint (server + client) — identical on both sides ──────
  if (stage === null) return <BootSpinner />

  return (
    <AnimatePresence mode="wait">

      {stage === 'splash' && (
        <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <LandingAnimation onComplete={handleSplashComplete} />
        </motion.div>
      )}

      {stage === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <LandingPage onEnter={handleEnterDashboard} />
        </motion.div>
      )}

    </AnimatePresence>
  )
}