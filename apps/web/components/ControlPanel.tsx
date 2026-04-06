  'use client'

  import { motion } from 'framer-motion'
  import { useState, useEffect } from 'react'
  import type { ControlDefinition } from '../types/animation.types'

  interface ControlPanelProps {
    controls?: ControlDefinition[]
    values: Record<string, any>
    onChange: (values: Record<string, any>) => void
  }

  function JsonControl({ value, onChange }: { value: any, onChange: (val: any) => void }) {
    const [textEditor, setTextEditor] = useState(() => JSON.stringify(value, null, 2))
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
      setTextEditor(JSON.stringify(value, null, 2))
      setHasError(false)
    }, [value])

    const handleBlur = () => {
      try {
        const parsed = JSON.parse(textEditor)
        setHasError(false)
        onChange(parsed)
        setTextEditor(JSON.stringify(parsed, null, 2))
      } catch {
        setHasError(true)
      }
    }

    return (
      <div className="space-y-1">
        <textarea
          value={textEditor}
          onChange={(e) => setTextEditor(e.target.value)}
          onBlur={handleBlur}
          className={`w-full h-40 px-3 py-2 bg-dark-600/50 border ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary-500'} rounded-lg text-white font-mono text-[11px] leading-relaxed focus:outline-none transition-colors resize-y`}
          spellCheck={false}
        />
        {hasError && <p className="text-[10px] text-red-400">Invalid JSON format</p>}
      </div>
    )
  }

  export function ControlPanel({ controls, values, onChange }: ControlPanelProps) {
    if (!controls || controls.length === 0) {
      return (
        <div className="glass-card p-6 text-center text-gray-400">
          <p>No adjustable parameters for this animation</p>
        </div>
      )
    }

    const handleChange = (key: string, value: any) => {
      onChange({ ...values, [key]: value })
    }

    const getUnit = (key: string) => {
      if (key.includes('duration')) return 's'
      if (key.includes('distance')) return 'px'
      if (key.includes('rotation')) return '°'
      return ''
    }

    const getProgress = (control: ControlDefinition, value: number) => {
      const min = control.min || 0
      const max = control.max || 100
      return ((value - min) / (max - min)) * 100
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 space-y-6"
      >
        {/* Header */}
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          Animation Controls
        </h3>

        {/* Controls */}
        {controls.map((control) => (
          <div key={control.key} className="space-y-2">
            {/* Label & Value */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                {control.label}
              </label>
              <span className="text-sm font-mono text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                {typeof values[control.key] === 'object' ? 'JSON' : values[control.key]}
                {typeof values[control.key] !== 'object' && getUnit(control.key)}
              </span>
            </div>

            {/* Range Slider */}
            {control.type === 'range' && (
              <div className="relative">
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={values[control.key] ?? control.default}
                  onChange={(e) => handleChange(control.key, parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,
                      #00c3ff 0%,
                      #9b00ff ${getProgress(control, values[control.key] ?? control.default)}%,
                      rgba(255,255,255,0.1) ${getProgress(control, values[control.key] ?? control.default)}%,
                      rgba(255,255,255,0.1) 100%)`
                  }}
                />
                {/* Min/Max labels */}
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{control.min}{getUnit(control.key)}</span>
                  <span className="text-xs text-gray-500">{control.max}{getUnit(control.key)}</span>
                </div>
              </div>
            )}

            {/* Select */}
            {control.type === 'select' && (
              <select
                value={values[control.key] ?? control.default}
                onChange={(e) => handleChange(control.key, e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
              >
                {control.options?.map((option) => (
                  <option key={option} value={option} className="bg-dark-600">
                    {option}
                  </option>
                ))}
              </select>
            )}

            {/* Toggle */}
            {control.type === 'toggle' && (
              <button
                onClick={() => handleChange(control.key, !values[control.key])}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                  values[control.key]
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {values[control.key] ? '✓ Enabled' : 'Disabled'}
              </button>
            )}

            {/* Color */}
            {control.type === 'color' && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={values[control.key] ?? control.default}
                  onChange={(e) => handleChange(control.key, e.target.value)}
                  className="w-12 h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-400">
                  {values[control.key] ?? control.default}
                </span>
              </div>
            )}

            {/* Text Input */}
            {control.type === 'text' && (
              <input
                type="text"
                value={values[control.key] ?? control.default}
                onChange={(e) => handleChange(control.key, e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            )}

            {/* JSON / Array Editor */}
            {control.type === 'json' && (
              <JsonControl
                value={values[control.key] ?? control.default}
                onChange={(val) => handleChange(control.key, val)}
              />
            )}
          </div>
        ))}
      </motion.div>
    )
  }