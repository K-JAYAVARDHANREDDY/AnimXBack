'use client'

import { useState } from 'react'
import { Copy, Check, Sparkles, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeViewerProps {
  code: string
}

// Minimal JSX syntax highlighter — no external deps
function highlightCode(code: string): React.ReactNode[] {
  const lines = code.split('\n')
  return lines.map((line, lineIdx) => {
    const nodes: React.ReactNode[] = []
    let remaining = line

    // Helper to push a styled span
    const push = (text: string, color: string, key: string) => {
      nodes.push(<span key={key} style={{ color }}>{text}</span>)
    }

    let i = 0
    while (remaining.length > 0) {
      // import keyword
      if (remaining.startsWith('import ')) {
        push('import', '#c792ea', `${lineIdx}-${i++}-kw`)
        remaining = remaining.slice(6)
        continue
      }
      // from keyword
      if (remaining.startsWith(' from ')) {
        push(' from ', '#c792ea', `${lineIdx}-${i++}-from`)
        remaining = remaining.slice(6)
        continue
      }
      // string literals (single or double quoted)
      const strMatch = remaining.match(/^(['"`])([^'"`]*)\1/)
      if (strMatch) {
        push(strMatch[0], '#c3e88d', `${lineIdx}-${i++}-str`)
        remaining = remaining.slice(strMatch[0].length)
        continue
      }
      // JSX opening tag like <TextScramble or </ or />
      const jsxTagOpen = remaining.match(/^<\/?[A-Z][A-Za-z0-9]*/)
      if (jsxTagOpen) {
        push(jsxTagOpen[0], '#89ddff', `${lineIdx}-${i++}-tag`)
        remaining = remaining.slice(jsxTagOpen[0].length)
        continue
      }
      // JSX close tag token /> or >
      if (remaining.startsWith('/>') || remaining.startsWith('>')) {
        const tok = remaining.startsWith('/>') ? '/>' : '>'
        push(tok, '#89ddff', `${lineIdx}-${i++}-close`)
        remaining = remaining.slice(tok.length)
        continue
      }
      // prop name (word before =)
      const propMatch = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_]*)=/)
      if (propMatch) {
        push(propMatch[1], '#f78c6c', `${lineIdx}-${i++}-prop`)
        remaining = remaining.slice(propMatch[1].length)
        continue
      }
      // {, }, [, ] — structural braces
      if ('{}[]'.includes(remaining[0])) {
        push(remaining[0], '#ffcb6b', `${lineIdx}-${i++}-brace`)
        remaining = remaining.slice(1)
        continue
      }
      // numbers
      const numMatch = remaining.match(/^-?\d+(\.\d+)?/)
      if (numMatch) {
        push(numMatch[0], '#f78c6c', `${lineIdx}-${i++}-num`)
        remaining = remaining.slice(numMatch[0].length)
        continue
      }
      // true/false/null
      const boolMatch = remaining.match(/^(true|false|null)/)
      if (boolMatch) {
        push(boolMatch[0], '#f78c6c', `${lineIdx}-${i++}-bool`)
        remaining = remaining.slice(boolMatch[0].length)
        continue
      }
      // Consume one char as plain text
      push(remaining[0], '#cdd3de', `${lineIdx}-${i++}-plain`)
      remaining = remaining.slice(1)
    }

    return (
      <div key={lineIdx} className="leading-relaxed">
        {nodes}
      </div>
    )
  })
}

export function CodeViewer({ code }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isImportCode = code.startsWith('import ')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg font-medium bg-gradient-to-r from-primary-500 to-accent-500 text-white flex items-center gap-2 text-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AnimX Code
          </div>
          {isImportCode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
              <Package className="w-3 h-3" />
              @animx-jaya/animations
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg font-medium bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 text-sm border border-white/10 hover:border-white/20"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 text-green-400"
              >
                <Check className="w-3.5 h-3.5" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code Block */}
      <motion.div
        key={code}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <pre
          className="rounded-xl p-5 overflow-auto max-h-[520px] text-sm font-mono leading-relaxed"
          style={{ backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <code>{highlightCode(code)}</code>
        </pre>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d1117]/80 to-transparent pointer-events-none rounded-b-xl" />
      </motion.div>

      {/* Plug & Play Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-xl border-l-4 border-primary-500 bg-primary-500/5"
      >
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-primary-400">Plug & Play: </span>
          Customize the controls above, then copy this code directly into your React project.
          Works instantly with <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-primary-300">@animx-jaya/animations</code>.
        </p>
      </motion.div>
    </div>
  )
}