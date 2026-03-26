'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Code2, Link2, ExternalLink } from 'lucide-react'
import type { Animation } from '@/types/animation.types'

interface ShareModalProps {
  animation: Animation
  onClose: () => void
}

type Tab = 'link' | 'iframe' | 'script'

export function ShareModal({ animation, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('link')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://animx.dev'
  const shareUrl = `${baseUrl}/animation/${animation.id}`
  const embedUrl = `${baseUrl}/embed/${animation.id}`

  const snippets: Record<Tab, { label: string; code: string }> = {
    link: {
      label: 'Shareable Link',
      code: shareUrl,
    },
    iframe: {
      label: 'Embed (iframe)',
      code: `<iframe\n  src="${embedUrl}"\n  width="640"\n  height="480"\n  frameborder="0"\n  allowfullscreen\n  title="${animation.name} — AnimX"\n></iframe>`,
    },
    script: {
      label: 'AnimX CLI',
      code: `npx animx add ${animation.id}`,
    },
  }

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {}
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg bg-dark-600 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white">Share & Embed</h2>
              <p className="text-xs text-gray-400 mt-0.5">{animation.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 px-6">
            {([
              { key: 'link' as Tab, icon: Link2, label: 'Link' },
              { key: 'iframe' as Tab, icon: Code2, label: 'iFrame' },
              { key: 'script' as Tab, icon: ExternalLink, label: 'CLI' },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-xs text-gray-400">{snippets[activeTab].label}</p>

            {/* Code block */}
            <div className="relative group">
              <pre className="bg-dark-500 rounded-xl p-4 text-xs text-gray-300 font-mono overflow-x-auto border border-white/10 whitespace-pre-wrap break-all">
                {snippets[activeTab].code}
              </pre>
              <button
                onClick={() => copy(activeTab, snippets[activeTab].code)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
              >
                {copiedKey === activeTab
                  ? <Check className="w-3.5 h-3.5 text-green-400" />
                  : <Copy className="w-3.5 h-3.5" />
                }
              </button>
            </div>

            {/* Preview link for iframe */}
            {activeTab === 'iframe' && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Preview embed in new tab
              </a>
            )}

            {/* Copy full link button */}
            <button
              onClick={() => copy('full', snippets[activeTab].code)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {copiedKey === 'full'
                ? <><Check className="w-4 h-4" /> Copied!</>
                : <><Copy className="w-4 h-4" /> Copy {snippets[activeTab].label}</>
              }
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
