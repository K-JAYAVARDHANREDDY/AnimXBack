'use client'

import { useState } from 'react'
import { Copy, Check, Code2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface CodeViewerProps {
  fullCode: string
  animxSyntax: string
}

type Tab = 'full' | 'animx'

export function CodeViewer({ fullCode, animxSyntax }: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('animx')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const codeToCopy = activeTab === 'full' ? fullCode : animxSyntax
    await navigator.clipboard.writeText(codeToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const code = activeTab === 'full' ? fullCode : animxSyntax

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('animx')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'animx'
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AnimX Syntax
        </button>

        <button
          onClick={() => setActiveTab('full')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'full'
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Full Code
        </button>

        <div className="flex-1" />

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg font-medium bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <pre className="code-block max-h-[500px] overflow-auto">
          <code className="text-sm text-gray-300 whitespace-pre-wrap break-words">
            {code}
          </code>
        </pre>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-dark-600/90 to-transparent pointer-events-none rounded-b-xl" />
      </motion.div>

      {/* AnimX Info Banner */}
      {activeTab === 'animx' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 border-l-4 border-primary-500"
        >
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-primary-400">AnimX Syntax: </span>
            Our unified API that works across all animation libraries.
            Write once, animate anywhere! 🚀
          </p>
        </motion.div>
      )}
    </div>
  )
}