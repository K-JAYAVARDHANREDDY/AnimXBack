import { useEffect, useRef, useState, useCallback } from 'react'
import animationData from '../data/text-scramble.json'

// ── Core scramble hook ─────────────────────────────────────────────────
function useScramble(target: string, speed: number, chars: string) {
  const [display, setDisplay] = useState(target)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

// ── Main component ─────────────────────────────────────────────────────
export function TextScramble({
  text,
  /** Array of words to cycle through (takes precedence over single text) */
  words = animationData.defaultProps.words as string[],
  speed = animationData.defaultProps.speed || 50,
  scrambleChars = animationData.defaultProps.scrambleChars || "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+",
  color,
  className = "",
  autoRun = true,
  /** Auto-cycle through words array */
  autoPlay = true,
  /** Interval between word changes (ms) */
  cycleInterval = 3000,
  /** Font size in pixels or CSS value */
  fontSize,
  /** Font weight (100-900 or 'normal'|'bold') */
  fontWeight,
  /** Font family */
  fontFamily = 'monospace',
  /** Letter spacing */
  letterSpacing,
  /** Text transform: 'uppercase' | 'lowercase' | 'capitalize' | 'none' */
  textTransform,
  /** Enable hover to re-trigger animation */
  hoverTrigger = true,
  /** Custom inline styles */
  style,
}: {
  text?: string
  words?: string[]
  speed?: number
  scrambleChars?: string
  color?: string
  className?: string
  autoRun?: boolean
  autoPlay?: boolean
  cycleInterval?: number
  fontSize?: number | string
  fontWeight?: number | string
  fontFamily?: string
  letterSpacing?: string
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  hoverTrigger?: boolean
  style?: React.CSSProperties
}) {
  // If single text is provided, use it; otherwise use words array
  const wordList = text ? [text] : words
  const [wordIndex, setWordIndex] = useState(0)
  const currentWord = wordList[wordIndex] || "SCRAMBLE"
  
  const { display, run } = useScramble(currentWord, speed, scrambleChars)
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-cycle through words
  useEffect(() => {
    if (!autoPlay || wordList.length <= 1) return
    
    cycleRef.current = setInterval(() => {
      setWordIndex(prev => (prev + 1) % wordList.length)
    }, cycleInterval)
    
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current)
    }
  }, [autoPlay, cycleInterval, wordList.length])

  // Run scramble when word changes
  useEffect(() => {
    if (autoRun) run()
  }, [autoRun, currentWord, run])

  return (
    <span
      onMouseEnter={hoverTrigger ? run : undefined}
      className={`cursor-default select-none transition-colors ${className}`}
      style={{ 
        color, 
        fontSize, 
        fontWeight, 
        fontFamily, 
        letterSpacing,
        textTransform,
        ...style 
      }}
    >
      {display}
    </span>
  )
}

export { animationData as metadata }
