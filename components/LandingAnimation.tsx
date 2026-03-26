'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface LandingAnimationProps {
  onComplete: () => void
}

export function LandingAnimation({ onComplete }: LandingAnimationProps) {

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {

    if (!textRef.current) return

    const words = textRef.current.querySelectorAll('.word')

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: onComplete
        })
      }
    })

    tl.set(words, {
      opacity: 0,
      scale: 0.3,
      y: 100,
      rotation: () => gsap.utils.random(-180, 180)
    })

    .to(words, {
      opacity: 1,
      scale: 1,
      y: 0,
      rotation: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'back.out(1.7)'
    })

    .to({}, { duration: 1.5 })

    .to(words, {
      opacity: 0,
      scale: 2,
      y: () => gsap.utils.random(-200, 200),
      x: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-360, 360),
      duration: 0.8,
      stagger: 0.03,
      ease: 'power2.in'
    })

  }, { scope: containerRef })

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-dark-500 flex items-center justify-center overflow-hidden"
    >

      {/* Background glow */}

      <div className="absolute inset-0">

        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0,195,255,0.3) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(155,0,255,0.3) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

      </div>

      {/* Logo */}

      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl font-bold gradient-text">AnimX</h1>

      </motion.div>

      {/* Main text */}

      <div className="relative z-10 max-w-5xl px-6">

        <h2
          ref={textRef}
          className="text-center text-7xl md:text-8xl font-bold text-white leading-tight"
        >

          <span className="word inline-block mr-6">Write</span>
          <span className="word inline-block mr-6">Once,</span>

          <br />

          <span className="word inline-block mr-6 gradient-text">Animate</span>
          <span className="word inline-block gradient-text">Anywhere</span>

        </h2>

      </div>

      {/* Loading dots */}

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
      >

        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-primary-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

      </motion.div>

    </motion.div>
  )
}