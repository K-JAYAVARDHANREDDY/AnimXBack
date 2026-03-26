'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/text-scramble.json'

// ── Core scramble hook ─────────────────────────────────────────────────
function useScramble(target: string, speed: number, chars: string) {
  const [display, setDisplay] = useState(target)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const run = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    let iteration = 0

    intervalRef.current = setInterval(() => {
      setDisplay(
        target
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < iteration) return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      iteration += 1 / 3
      if (iteration >= target.length) {
        clearInterval(intervalRef.current!)
        setDisplay(target)
      }
    }, speed)
  }, [target, speed, chars])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return { display, run }
}

// ── Single scramble word display ──────────────────────────────────────
function ScrambleWord({
  word,
  speed,
  chars,
  color,
  size = 'text-5xl',
  autoRun = false,
}: {
  word: string
  speed: number
  chars: string
  color: string
  size?: string
  autoRun?: boolean
}) {
  const { display, run } = useScramble(word, speed, chars)

  useEffect(() => {
    if (autoRun) run()
  }, [autoRun, word])

  return (
    <span
      onMouseEnter={run}
      className={`${size} font-black tracking-widest cursor-default select-none font-mono transition-colors`}
      style={{ color }}
    >
      {display}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────────────────
export function TextScramble({
  words = animationData.defaultProps.words,
  speed = animationData.defaultProps.speed,
  autoPlay = animationData.defaultProps.autoPlay,
  textColor = animationData.defaultProps.textColor,
  scrambleChars = animationData.defaultProps.scrambleChars,
  isPreview = false,
}: {
  words?: string[]
  speed?: number
  autoPlay?: boolean
  textColor?: string
  scrambleChars?: string
  isPreview?: boolean
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [cycleDisplay, setCycleDisplay] = useState(words[0])
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const wordTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => { setIsMounted(true) }, [])

  // Auto-cycling scramble for the big hero word
  const scrambleWord = useCallback((word: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    let iteration = 0

    intervalRef.current = setInterval(() => {
      setCycleDisplay(
        word.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iteration) return char
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        }).join('')
      )
      iteration += 1 / 3
      if (iteration >= word.length) {
        clearInterval(intervalRef.current!)
        setCycleDisplay(word)
      }
    }, speed)
  }, [speed, scrambleChars])

  useEffect(() => {
    if (!isMounted || !autoPlay) return

    scrambleWord(words[currentWordIndex])

    wordTimerRef.current = setInterval(() => {
      setCurrentWordIndex(i => {
        const next = (i + 1) % words.length
        scrambleWord(words[next])
        return next
      })
    }, 2500)

    return () => {
      if (wordTimerRef.current) clearInterval(wordTimerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isMounted, autoPlay, words, currentWordIndex, scrambleWord])

  if (!isMounted) return (
    <div className="w-full h-48 bg-dark-600 rounded-xl flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ── PREVIEW ──────────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-dark-600 gap-2 px-4">
        <span
          className="text-3xl font-black tracking-widest font-mono"
          style={{ color: textColor }}
        >
          {cycleDisplay}
        </span>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider">hover to scramble</p>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ─────────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">
      <div className="w-full rounded-xl bg-dark-600 overflow-hidden">

        {/* ── Hero cycling word ── */}
        <div className="flex flex-col items-center justify-center py-16 px-6 border-b border-white/10">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Auto cycling</p>
          <span
            className="text-6xl md:text-7xl font-black tracking-widest font-mono leading-none"
            style={{ color: textColor }}
          >
            {cycleDisplay}
          </span>
          <div className="flex gap-1.5 mt-4">
            {words.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: i === currentWordIndex ? textColor : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        </div>

        {/* ── Hover to scramble grid ── */}
        <div className="p-8">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 text-center">
            Hover each word to scramble
          </p>
          <div className="flex flex-col gap-6">
            {words.map((word, i) => (
              <div key={i} className="flex items-center gap-4">
                {/* Index */}
                <span className="text-gray-600 text-xs font-mono w-5 text-right flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* Divider */}
                <div className="w-px h-6 bg-white/10 flex-shrink-0" />
                {/* Scramble word */}
                <ScrambleWord
                  word={word}
                  speed={speed}
                  chars={scrambleChars}
                  color={textColor}
                  size="text-3xl md:text-4xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Scramble chars demo ── */}
        <div className="px-8 pb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Scramble character set</p>
            <p className="text-gray-400 text-xs font-mono break-all leading-relaxed">
              {scrambleChars}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

registerAnimation({
  id: animationData.id,
  name: animationData.name,
  category: animationData.category as any,
  engine: animationData.engine as any,
  component: TextScramble,
  defaultProps: animationData.defaultProps,
  controls: animationData.controls as any,
  code: animationData.code,
  animxSyntax: animationData.animxSyntax,
  description: animationData.description,
  tags: animationData.tags,
  difficulty: animationData.difficulty as any,
})
