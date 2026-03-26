'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { registerAnimation } from '@/core/AnimationRegistry'
import animationData from '@/data/animations/svg-path-drawing.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin()
}

async function loadOpentype(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).opentype) { resolve((window as any).opentype); return }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js'
    s.onload = () => resolve((window as any).opentype)
    s.onerror = () => reject(new Error('Failed to load opentype.js'))
    document.head.appendChild(s)
  })
}

const FONTS = [
  { label: 'Pacifico', style: 'cursive',    url: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/pacifico/Pacifico-Regular.ttf' },
  { label: 'Bebas',    style: 'display',    url: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bebasneue/BebasNeue-Regular.ttf' },
  { label: 'Montserrat', style: 'sans-serif', url: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/montserrat/static/Montserrat-Bold.ttf' },
]

type AnimMode = 'word' | 'letter'
type Status   = 'idle' | 'loading' | 'ready' | 'error'

interface LetterPath { d: string; viewBox: string; char: string }

const fontCache: Record<string, any> = {}

async function textToPaths(text: string, fontUrl: string): Promise<{ letterPaths: LetterPath[]; wordPath: string; wordViewBox: string }> {
  const opentype = await loadOpentype()
  if (!fontCache[fontUrl]) {
    fontCache[fontUrl] = await new Promise((res, rej) =>
      opentype.load(fontUrl, (err: any, font: any) => err ? rej(err) : res(font))
    )
  }
  const font = fontCache[fontUrl]
  const fontSize = 96
  const PADDING  = 12
  const letterPaths: LetterPath[] = []
  let cursorX = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === ' ') { cursorX += fontSize * 0.35; continue }
    const path = font.getPath(char, cursorX, fontSize, fontSize)
    const bb   = path.getBoundingBox()
    letterPaths.push({
      char, d: path.toPathData(2),
      viewBox: `${(bb.x1 - PADDING).toFixed(1)} ${(bb.y1 - PADDING).toFixed(1)} ${(bb.x2 - bb.x1 + PADDING * 2).toFixed(1)} ${(bb.y2 - bb.y1 + PADDING * 2).toFixed(1)}`,
    })
    const glyph = font.charToGlyph(char)
    cursorX += (glyph.advanceWidth / font.unitsPerEm) * fontSize
  }

  const wordPath = font.getPath(text, 0, fontSize, fontSize)
  const wbb      = wordPath.getBoundingBox()
  return {
    letterPaths,
    wordPath:    wordPath.toPathData(2),
    wordViewBox: `${(wbb.x1 - PADDING).toFixed(1)} ${(wbb.y1 - PADDING).toFixed(1)} ${(wbb.x2 - wbb.x1 + PADDING * 2).toFixed(1)} ${(wbb.y2 - wbb.y1 + PADDING * 2).toFixed(1)}`,
  }
}

function animatePaths(svg: SVGSVGElement, duration: number, mode: AnimMode, staggerDelay: number) {
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'))
  if (!paths.length) return
  paths.forEach(p => { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }) })
  if (mode === 'word') {
    gsap.to(paths, { strokeDashoffset: 0, duration, ease: 'power2.inOut', stagger: 0.04 })
  } else {
    paths.forEach((p, i) => gsap.to(p, { strokeDashoffset: 0, duration, ease: 'power2.inOut', delay: i * (duration + staggerDelay) }))
  }
}

function PreviewDrawer({ strokeColor, strokeWidth, duration }: { strokeColor: string; strokeWidth: number; duration: number }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [wordPath,    setWordPath]    = useState<string | null>(null)
  const [wordViewBox, setWordViewBox] = useState('0 0 400 120')

  useEffect(() => {
    textToPaths('ANIMX', FONTS[1].url)
      .then(({ wordPath, wordViewBox }) => { setWordPath(wordPath); setWordViewBox(wordViewBox) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!wordPath || !svgRef.current) return
    const t = setTimeout(() => animatePaths(svgRef.current!, duration, 'letter', 0.05), 100)
    return () => clearTimeout(t)
  }, [wordPath, duration])

  return (
    <div className="w-full h-full bg-[#080810] flex items-center justify-center px-4">
      {wordPath ? (
        <svg ref={svgRef} viewBox={wordViewBox} fill="none" style={{ width: '100%', maxHeight: 80, overflow: 'visible' }}>
          <path d={wordPath} stroke={strokeColor} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ) : (
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: strokeColor }} />
      )}
    </div>
  )
}

function WordDrawer({ strokeColor, strokeWidth, duration }: { strokeColor: string; strokeWidth: number; duration: number }) {
  const [inputVal,     setInputVal]     = useState('ANIMATE')
  const [fontIdx,      setFontIdx]      = useState(0)
  const [animMode,     setAnimMode]     = useState<AnimMode>('letter')
  const [staggerDelay, setStaggerDelay] = useState(0.08)
  const [status,       setStatus]       = useState<Status>('idle')
  const [isAnimating,  setIsAnimating]  = useState(false)
  const [letterPaths,  setLetterPaths]  = useState<LetterPath[]>([])
  const [wordPath,     setWordPath]     = useState<string | null>(null)
  const [wordViewBox,  setWordViewBox]  = useState('0 0 600 120')
  const letterSvgRefs = useRef<(SVGSVGElement | null)[]>([])
  const wordSvgRef    = useRef<SVGSVGElement>(null)

  async function generate(text: string, fIdx: number) {
    if (!text.trim()) return
    setStatus('loading'); setIsAnimating(false); gsap.killTweensOf('path')
    try {
      const result = await textToPaths(text.toUpperCase().slice(0, 12), FONTS[fIdx].url)
      setLetterPaths(result.letterPaths); setWordPath(result.wordPath); setWordViewBox(result.wordViewBox)
      letterSvgRefs.current = new Array(result.letterPaths.length).fill(null)
      setStatus('ready')
    } catch { setStatus('error') }
  }

  useEffect(() => { generate(inputVal, fontIdx) }, [])
  useEffect(() => {
    if (status !== 'ready') return
    const t = setTimeout(() => runAnimation(), 120)
    return () => clearTimeout(t)
  }, [status, animMode])

  function runAnimation() {
    gsap.killTweensOf('path')
    if (animMode === 'word' && wordSvgRef.current) {
      setIsAnimating(true)
      animatePaths(wordSvgRef.current, duration, 'word', 0)
      setTimeout(() => setIsAnimating(false), duration * 1000 + 200)
    } else if (animMode === 'letter') {
      const svgs = letterSvgRefs.current.filter(Boolean) as SVGSVGElement[]
      if (!svgs.length) return
      setIsAnimating(true)
      svgs.forEach((svg, i) => {
        const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'))
        paths.forEach(p => { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }) })
        gsap.to(paths, { strokeDashoffset: 0, duration, ease: 'power2.inOut', delay: i * (duration + staggerDelay) })
      })
      setTimeout(() => setIsAnimating(false), (svgs.length * (duration + staggerDelay) + duration) * 1000 + 200)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#0a0a12' }}>
      <div className="px-5 py-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-white text-sm font-bold">SVG Path Drawing</p>
            <p className="text-gray-500 text-xs mt-0.5">Type any word — watch it draw stroke by stroke</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {([{ key: 'word', label: '⟶ Whole Word' }, { key: 'letter', label: '✦ Letter by Letter' }] as const).map(m => (
              <button key={m.key} onClick={() => setAnimMode(m.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ backgroundColor: animMode === m.key ? strokeColor : 'transparent', color: animMode === m.key ? '#fff' : '#6b7280' }}
              >{m.label}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="text" value={inputVal} maxLength={12}
            onChange={e => setInputVal(e.target.value.slice(0, 12))}
            onKeyDown={e => e.key === 'Enter' && generate(inputVal, fontIdx)}
            placeholder="Type a word…"
            className="flex-1 min-w-[160px] px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold focus:outline-none"
          />
          {FONTS.map((f, i) => (
            <button key={i} onClick={() => { setFontIdx(i); generate(inputVal, i) }}
              className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={{
                backgroundColor: fontIdx === i ? `${strokeColor}22` : 'rgba(255,255,255,0.04)',
                borderColor:     fontIdx === i ? strokeColor : 'rgba(255,255,255,0.1)',
                color:           fontIdx === i ? strokeColor : '#6b7280',
              }}
            >{f.label}</button>
          ))}
          <button onClick={() => generate(inputVal, fontIdx)} disabled={status === 'loading'}
            className="px-5 py-2 rounded-xl text-sm font-bold text-black disabled:opacity-40"
            style={{ backgroundColor: strokeColor }}
          >{status === 'loading' ? '…' : 'Draw →'}</button>
          <button onClick={runAnimation} disabled={status !== 'ready' || isAnimating}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
          >↺ Replay</button>
        </div>
        {animMode === 'letter' && (
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs w-36 flex-shrink-0">Letter gap — {(staggerDelay * 1000).toFixed(0)}ms</span>
            <input type="range" min={0} max={0.5} step={0.01} value={staggerDelay}
              onChange={e => setStaggerDelay(+e.target.value)} className="flex-1" style={{ accentColor: strokeColor }} />
          </div>
        )}
      </div>

      <div className="bg-[#05050e] flex flex-col items-center justify-center px-6 py-10 gap-6" style={{ minHeight: 220 }}>
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: strokeColor }} />
            <p className="text-gray-500 text-xs">Loading font…</p>
          </div>
        )}
        {status === 'error' && <p className="text-red-400 text-xs">Failed to load font. Check your network connection.</p>}
        {status === 'ready' && animMode === 'word' && wordPath && (
          <svg ref={wordSvgRef} viewBox={wordViewBox} fill="none" style={{ width: '100%', maxHeight: 140, overflow: 'visible' }}>
            <path d={wordPath} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
        {status === 'ready' && animMode === 'letter' && letterPaths.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, flexWrap: 'wrap', width: '100%' }}>
            {letterPaths.map((lp, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <svg ref={el => { letterSvgRefs.current[i] = el }} viewBox={lp.viewBox} fill="none"
                  style={{ height: 100, width: 'auto', overflow: 'visible', flexShrink: 0 }}>
                  <path d={lp.d} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span style={{ color: `${strokeColor}55`, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.1em' }}>{lp.char}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between">
        <p className="text-gray-700 text-[10px]">Powered by opentype.js · {FONTS[fontIdx].label} · {inputVal.toUpperCase().slice(0,12).length} chars</p>
        <p className="text-gray-700 text-[10px]">strokeDashoffset · GSAP power2.inOut</p>
      </div>
    </div>
  )
}

export function SvgPathDrawing({
  strokeColor = animationData.defaultProps.strokeColor,
  strokeWidth = animationData.defaultProps.strokeWidth,
  duration    = animationData.defaultProps.duration,
  isPreview   = false,
}: {
  strokeColor?: string
  strokeWidth?: number
  duration?:    number
  shape?:       string
  isPreview?:   boolean
}) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) return (
    <div className="w-full h-full bg-dark-600 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: strokeColor }} />
    </div>
  )

  if (isPreview) return <PreviewDrawer strokeColor={strokeColor} strokeWidth={strokeWidth} duration={duration} />
  return <WordDrawer strokeColor={strokeColor} strokeWidth={strokeWidth} duration={duration} />
}

registerAnimation({
  id:           animationData.id,
  name:         animationData.name,
  category:     animationData.category as any,
  engine:       animationData.engine as any,
  component:    SvgPathDrawing,
  defaultProps: animationData.defaultProps,
  controls:     animationData.controls as any,
  code:         animationData.code,
  animxSyntax:  animationData.animxSyntax,
  description:  animationData.description,
  tags:         animationData.tags,
  difficulty:   animationData.difficulty as any,
})