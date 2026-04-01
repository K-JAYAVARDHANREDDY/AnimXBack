'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Search, Sparkles, Check, ChevronRight,
  Layers, Zap, Tag, BarChart2, Heart, ChevronDown,
  GripHorizontal, Maximize2,
} from 'lucide-react'
import type { AnimationCategory, AnimationEngine } from '@/types/animation.types'

// ── Types ──────────────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface FilterState {
  categories:   AnimationCategory[]
  engines:      AnimationEngine[]
  difficulties: Difficulty[]
  tags:         string[]
  favoritesOnly: boolean
}

export const EMPTY_FILTERS: FilterState = {
  categories: [], engines: [], difficulties: [], tags: [], favoritesOnly: false,
}

export type SectionId = 'category' | 'engine' | 'difficulty' | 'tags'

// ── FILTER_SECTIONS is now fetched from /api/filters ───────────────────
// The shape mirrors the JSON returned by that route.
export interface FilterParent {
  id: string
  label: string
  icon: string
  children: { id: string; label: string }[]
}

export interface FilterSection {
  id: SectionId
  label: string
  icon: React.ElementType
  color: string
  parents: FilterParent[]
}

// Icon map to convert API string → Lucide component
const SECTION_ICONS: Record<string, React.ElementType> = {
  category:   Layers,
  engine:     Zap,
  difficulty: BarChart2,
  tags:       Tag,
}

const ENGINE_COLORS: Record<string, string> = {
  gsap: '#88ce02', framer: '#ec4899', three: '#06b6d4', css: '#f59e0b', tailwind: '#6366f1',
}
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444',
}

// ── Panel size constraints ─────────────────────────────────────────────
const MIN_W = 420
const MAX_W = 900
const MIN_H = 300

// ── Props ──────────────────────────────────────────────────────────────
interface FilterPanelProps {
  initialFilterSections: Omit<FilterSection, 'icon'>[]
  isOpen:        boolean
  onClose:       () => void
  filters:       FilterState
  onChange:      (f: FilterState) => void
  totalCount:    number
  filteredCount: number
  allTags:       string[]
  isDark:        boolean
  anchorRef:     React.RefObject<HTMLButtonElement | null>
}

// ── Helpers ────────────────────────────────────────────────────────────
function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]
}
function getParentColor(section: FilterSection, parentId: string): string {
  if (section.id === 'engine')     return ENGINE_COLORS[parentId]     ?? section.color
  if (section.id === 'difficulty') return DIFFICULTY_COLORS[parentId] ?? section.color
  return section.color
}
function countSelected(section: FilterSection, filters: FilterState): number {
  switch (section.id) {
    case 'category':   return filters.categories.length
    case 'engine':     return filters.engines.length
    case 'difficulty': return filters.difficulties.length
    case 'tags':       return filters.tags.length
    default:           return 0
  }
}
function isChildSelected(section: FilterSection, childId: string, filters: FilterState): boolean {
  switch (section.id) {
    case 'category':   return filters.categories.includes(childId as AnimationCategory)
    case 'engine':     return filters.engines.includes(childId as AnimationEngine)
    case 'difficulty': return filters.difficulties.includes(childId as Difficulty)
    case 'tags':       return filters.tags.includes(childId)
    default:           return false
  }
}
function toggleChild(section: FilterSection, childId: string, filters: FilterState): FilterState {
  switch (section.id) {
    case 'category':   return { ...filters, categories:   toggle(filters.categories,   childId as AnimationCategory) }
    case 'engine':     return { ...filters, engines:      toggle(filters.engines,      childId as AnimationEngine) }
    case 'difficulty': return { ...filters, difficulties: toggle(filters.difficulties, childId as Difficulty) }
    case 'tags':       return { ...filters, tags:         toggle(filters.tags,         childId) }
    default:           return filters
  }
}
function areAllChildrenSelected(section: FilterSection, parentId: string, filters: FilterState): boolean {
  const parent = section.parents.find(p => p.id === parentId)
  if (!parent) return false
  return parent.children.every(c => isChildSelected(section, c.id, filters))
}
function selectAllChildren(section: FilterSection, parentId: string, filters: FilterState, select: boolean): FilterState {
  const parent = section.parents.find(p => p.id === parentId)
  if (!parent) return filters
  let f = filters
  for (const child of parent.children) {
    const already = isChildSelected(section, child.id, f)
    if (select && !already) f = toggleChild(section, child.id, f)
    if (!select && already) f = toggleChild(section, child.id, f)
  }
  return f
}

// ── Main FilterPanel ───────────────────────────────────────────────────
export function FilterPanel({
  initialFilterSections, isOpen, onClose, filters, onChange,
  totalCount, filteredCount, isDark, anchorRef,
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Hydrate icons synchronously
  const filterSections = initialFilterSections.map(s => ({
    ...s,
    icon: SECTION_ICONS[s.id] ?? Layers,
  })) as FilterSection[]

  // ── Position & size state ──────────────────────────────────────────
  const [pos,  setPos]  = useState({ x: 200, y: 72 })
  const [size, setSize] = useState({ w: 700, h: 0 }) // h:0 = auto

  // ── Drag state (refs so they don't cause re-renders mid-drag) ──────
  const dragging   = useRef(false)
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  // ── Resize state ───────────────────────────────────────────────────
  const resizing    = useRef(false)
  const resizeOrigin = useRef({ mx: 0, my: 0, w: 0, h: 0 })

  // ── Set initial position when panel opens ─────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const rect   = anchorRef.current?.getBoundingClientRect()
    const top    = (rect?.bottom ?? 64) + 8
    const btnLeft = rect?.left ?? 200
    const panelW  = Math.min(700, window.innerWidth - 32)
    const maxLeft = window.innerWidth - panelW - 16
    setPos({ x: Math.max(16, Math.min(btnLeft, maxLeft)), y: top })
    setSize({ w: panelW, h: 0 })
  }, [isOpen, anchorRef])

  // ── Global pointer events for drag ────────────────────────────────
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return
      const dx = e.clientX - dragOrigin.current.mx
      const dy = e.clientY - dragOrigin.current.my
      const newX = Math.max(0, Math.min(window.innerWidth  - size.w,      dragOrigin.current.px + dx))
      const newY = Math.max(0, Math.min(window.innerHeight - 120,         dragOrigin.current.py + dy))
      setPos({ x: newX, y: newY })
    }
    function onUp() { dragging.current = false; document.body.style.userSelect = '' }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [size.w])

  // ── Global pointer events for resize ──────────────────────────────
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!resizing.current) return
      const dx  = e.clientX - resizeOrigin.current.mx
      const dy  = e.clientY - resizeOrigin.current.my
      const newW = Math.max(MIN_W, Math.min(MAX_W, resizeOrigin.current.w + dx))
      const newH = resizeOrigin.current.h + dy
      setSize({ w: newW, h: Math.max(MIN_H, newH) })
    }
    function onUp() { resizing.current = false; document.body.style.cursor = ''; document.body.style.userSelect = '' }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [])

  const startDrag = useCallback((e: React.PointerEvent) => {
    // Don't drag if clicking a button inside the header
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    dragging.current   = true
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
    document.body.style.userSelect = 'none'
  }, [pos])

  const startResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizing.current   = true
    const currentH     = panelRef.current?.offsetHeight ?? 500
    resizeOrigin.current = { mx: e.clientX, my: e.clientY, w: size.w, h: currentH }
    document.body.style.cursor    = 'se-resize'
    document.body.style.userSelect = 'none'
  }, [size.w])

  // ── Outside click ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    function handle(e: MouseEvent) {
      if (dragging.current || resizing.current) return
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isOpen, onClose])

  // ── Escape key ────────────────────────────────────────────────────
  useEffect(() => {
    function handle(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  // ── Accordion / pane state ────────────────────────────────────────
  const [openSection,  setOpenSection]  = useState<SectionId | null>('category')
  const [activeParent, setActiveParent] = useState<Record<SectionId, string | null>>({
    category: 'motion', engine: 'gsap', difficulty: 'easy', tags: 'scroll-tags',
  })

  const toggleSection = useCallback((id: SectionId) => {
    setOpenSection(prev => prev === id ? null : id)
  }, [])

  const activeCount =
    filters.categories.length + filters.engines.length +
    filters.difficulties.length + filters.tags.length +
    (filters.favoritesOnly ? 1 : 0)

  const bodyMaxH = size.h > 0 ? size.h - 180 : 420

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            className="fixed z-50"
            style={{
              top:    pos.y,
              left:   pos.x,
              width:  size.w,
              height: size.h > 0 ? size.h : 'auto',
              minWidth:  MIN_W,
              maxWidth:  MAX_W,
              minHeight: MIN_H,
            }}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -10,  scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full"
              style={{
                background:  isDark ? '#111118' : '#ffffff',
                border:      isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.1)',
                boxShadow:   '0 32px 80px rgba(0,0,0,0.6)',
              }}
            >

              {/* ── Drag Handle Header ── */}
              <div
                onPointerDown={startDrag}
                className="flex items-center justify-between px-5 py-4 select-none"
                style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
                  cursor: 'grab',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Drag dots indicator */}
                  <div className="flex flex-col gap-[3px] opacity-30 pointer-events-none">
                    {[0,1,2].map(r => (
                      <div key={r} className="flex gap-[3px]">
                        {[0,1].map(c => <div key={c} className="w-[3px] h-[3px] rounded-full" style={{ background: isDark ? 'white' : 'black' }} />)}
                      </div>
                    ))}
                  </div>

                  <span className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                    Filters
                  </span>
                  {activeCount > 0 && (
                    <motion.span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {activeCount} active
                    </motion.span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeCount > 0 && (
                    <motion.button
                      onClick={() => onChange(EMPTY_FILTERS)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    >
                      Clear Filters
                    </motion.button>
                  )}
                  <motion.button
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  >
                    <X style={{ width: 12, height: 12, color: isDark ? '#6b7280' : '#9ca3af' }} />
                  </motion.button>
                </div>
              </div>

              {/* ── Favorites row ── */}
              <div
                className="px-5 py-3 flex-shrink-0"
                style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}
              >
                <motion.button
                  onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all"
                  style={filters.favoritesOnly ? {
                    background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)',
                  } : {
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    border:     isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <Heart style={{ width: 14, height: 14, color: filters.favoritesOnly ? '#f472b6' : '#6b7280' }} className={filters.favoritesOnly ? 'fill-pink-400' : ''} />
                    <span className="text-sm font-semibold" style={{ color: filters.favoritesOnly ? '#f472b6' : (isDark ? '#9ca3af' : '#6b7280') }}>
                      Favorites only
                    </span>
                  </div>
                  <div
                    className="w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0"
                    style={{ background: filters.favoritesOnly ? '#ec4899' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: filters.favoritesOnly ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </motion.button>
              </div>

              {/* ── Accordion sections ── */}
              <div className="overflow-y-auto flex-1" style={{ maxHeight: bodyMaxH }}>
                {filterSections.map(section => {
                  const SectionIcon  = section.icon
                  const sectionOpen  = openSection === section.id
                  const count        = countSelected(section, filters)
                  const activeP      = activeParent[section.id]
                  const activePData  = section.parents.find(p => p.id === activeP)

                  return (
                    <div
                      key={section.id}
                      style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-5 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-7 h-7 rounded-xl flex items-center justify-center"
                            style={{ background: `${section.color}15`, border: `1px solid ${section.color}30` }}
                            animate={{ rotate: sectionOpen ? 5 : 0 }}
                          >
                            <SectionIcon style={{ width: 13, height: 13, color: section.color }} />
                          </motion.div>
                          <span className="text-sm font-bold" style={{ color: isDark ? (sectionOpen ? 'white' : '#9ca3af') : (sectionOpen ? '#111' : '#6b7280') }}>
                            {section.label}
                          </span>
                          {count > 0 && (
                            <motion.span
                              className="text-[10px] font-black px-1.5 py-0.5 rounded-md"
                              style={{ background: `${section.color}15`, color: section.color }}
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                            >
                              {count}
                            </motion.span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {count > 0 && (
                            <span className="text-[11px] font-semibold" style={{ color: section.color }}>Apply All</span>
                          )}
                          <motion.div animate={{ rotate: sectionOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown style={{ width: 14, height: 14, color: isDark ? '#4b5563' : '#9ca3af' }} />
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {sectionOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div
                              className="flex mx-4 mb-4 overflow-hidden rounded-2xl"
                              style={{
                                border:     isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
                                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                              }}
                            >
                              {/* LEFT: parent list */}
                              <div
                                className="flex flex-col py-2 flex-shrink-0"
                                style={{
                                  width: 180,
                                  borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
                                }}
                              >
                                {section.parents.map(parent => {
                                  const isActive    = activeP === parent.id
                                  const parentColor = getParentColor(section, parent.id)
                                  const someSelected = parent.children.some(c => isChildSelected(section, c.id, filters))

                                  return (
                                    <button
                                      key={parent.id}
                                      onClick={() => setActiveParent(prev => ({ ...prev, [section.id]: parent.id }))}
                                      className="relative flex items-center gap-3 px-4 py-3 text-left transition-all"
                                      style={isActive ? { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' } : {}}
                                    >
                                      {isActive && (
                                        <motion.div
                                          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                                          style={{ background: parentColor }}
                                          layoutId={`parent-bar-${section.id}`}
                                        />
                                      )}
                                      <span className="text-base leading-none">{parent.icon}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold leading-tight truncate" style={{ color: isActive ? (isDark ? 'white' : '#111') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                          {parent.label}
                                        </p>
                                        {someSelected && (
                                          <p className="text-[10px] mt-0.5" style={{ color: parentColor }}>
                                            {parent.children.filter(c => isChildSelected(section, c.id, filters)).length} selected
                                          </p>
                                        )}
                                      </div>
                                      <ChevronRight style={{ width: 12, height: 12, flexShrink: 0, color: isActive ? (isDark ? '#9ca3af' : '#6b7280') : 'transparent' }} />
                                    </button>
                                  )
                                })}
                              </div>

                              {/* RIGHT: children */}
                              <div className="flex-1 py-3 px-3 min-w-0">
                                {activePData && (() => {
                                  const parentColor = getParentColor(section, activePData.id)
                                  const allSelected = areAllChildrenSelected(section, activePData.id, filters)
                                  return (
                                    <AnimatePresence mode="wait">
                                      <motion.div
                                        key={activePData.id}
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <button
                                          onClick={() => onChange(selectAllChildren(section, activePData.id, filters, !allSelected))}
                                          className="w-full flex items-center gap-3 px-2 py-2 rounded-xl mb-1 transition-all"
                                          style={{ background: allSelected ? `${parentColor}10` : 'transparent' }}
                                        >
                                          <div
                                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                                            style={allSelected ? { background: parentColor, border: `1.5px solid ${parentColor}` } : { border: isDark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid rgba(0,0,0,0.2)', background: 'transparent' }}
                                          >
                                            {allSelected && <Check style={{ width: 9, height: 9, color: 'white' }} />}
                                          </div>
                                          <span className="text-xs font-bold" style={{ color: allSelected ? parentColor : (isDark ? '#9ca3af' : '#6b7280') }}>Select All</span>
                                        </button>
                                        <div className="mx-2 mb-2" style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                                        {activePData.children.map(child => {
                                          const selected = isChildSelected(section, child.id, filters)
                                          return (
                                            <motion.button
                                              key={child.id}
                                              onClick={() => onChange(toggleChild(section, child.id, filters))}
                                              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all"
                                              style={selected ? { background: `${parentColor}08` } : {}}
                                              whileHover={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' } as any}
                                              whileTap={{ scale: 0.98 }}
                                            >
                                              <motion.div
                                                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                                                style={selected ? { background: parentColor, border: `1.5px solid ${parentColor}` } : { border: isDark ? '1.5px solid rgba(255,255,255,0.15)' : '1.5px solid rgba(0,0,0,0.2)', background: 'transparent' }}
                                                animate={selected ? { scale: [1, 1.2, 1] } : {}}
                                                transition={{ duration: 0.2 }}
                                              >
                                                {selected && (
                                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                                                    <Check style={{ width: 9, height: 9, color: 'white' }} />
                                                  </motion.div>
                                                )}
                                              </motion.div>
                                              <span className="text-xs font-medium text-left" style={{ color: selected ? (isDark ? 'white' : '#111') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                                {child.label}
                                              </span>
                                            </motion.button>
                                          )
                                        })}
                                      </motion.div>
                                    </AnimatePresence>
                                  )
                                })()}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              {/* ── Footer ── */}
              <div
                className="flex items-center justify-between px-5 py-4 flex-shrink-0 relative"
                style={{
                  borderTop:  isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
                  background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                }}
              >
                <p className="text-xs" style={{ color: isDark ? '#4b5563' : '#9ca3af' }}>
                  Showing{' '}
                  <span className="font-bold" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>{filteredCount}</span>
                  {' '}of{' '}
                  <span className="font-bold" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>{totalCount}</span>
                  {' '}animations
                </p>
                <motion.button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles style={{ width: 13, height: 13 }} />
                  Apply
                </motion.button>

                {/* ── Resize handle — bottom-right corner ── */}
                <div
                  onPointerDown={startResize}
                  className="absolute bottom-2 right-2 w-5 h-5 flex items-end justify-end cursor-se-resize opacity-40 hover:opacity-100 transition-opacity"
                  title="Drag to resize"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M11 1L1 11M11 6L6 11M11 11L11 11" stroke={isDark ? 'white' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Active chips strip ─────────────────────────────────────────────────
const ENGINE_LABELS: Record<AnimationEngine, string> = {
  gsap: 'GSAP', framer: 'Framer Motion', three: 'Three.js', css: 'CSS', tailwind: 'Tailwind',
}

export function ActiveFilterChips({
  filters, onChange, isDark,
}: { filters: FilterState; onChange: (f: FilterState) => void; isDark: boolean }) {
  const chips: { label: string; color: string; onRemove: () => void }[] = [
    ...filters.categories.map(c => ({ label: c, color: '#6366f1', onRemove: () => onChange({ ...filters, categories: filters.categories.filter(x => x !== c) }) })),
    ...filters.engines.map(e => ({ label: ENGINE_LABELS[e], color: ENGINE_COLORS[e], onRemove: () => onChange({ ...filters, engines: filters.engines.filter(x => x !== e) }) })),
    ...filters.difficulties.map(d => ({ label: d.charAt(0).toUpperCase() + d.slice(1), color: DIFFICULTY_COLORS[d], onRemove: () => onChange({ ...filters, difficulties: filters.difficulties.filter(x => x !== d) }) })),
    ...filters.tags.map(t => ({ label: `#${t}`, color: '#a855f7', onRemove: () => onChange({ ...filters, tags: filters.tags.filter(x => x !== t) }) })),
    ...(filters.favoritesOnly ? [{ label: '❤️ Favorites', color: '#ec4899', onRemove: () => onChange({ ...filters, favoritesOnly: false }) }] : []),
  ]

  if (chips.length === 0) return null

  return (
    <motion.div
      className="flex flex-wrap items-center gap-1.5 px-4 py-2"
      style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase mr-1" style={{ color: isDark ? '#374151' : '#d1d5db' }}>
        Active:
      </span>
      <AnimatePresence>
        {chips.map(({ label, color, onRemove }) => (
          <motion.div
            key={label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
            style={{ background: `${color}15`, border: `1px solid ${color}28`, color }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {label}
            <button onClick={onRemove} className="hover:opacity-60 transition-opacity">
              <X style={{ width: 9, height: 9 }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button onClick={() => onChange(EMPTY_FILTERS)} className="text-[10px] font-bold ml-1 transition-colors" style={{ color: '#ef4444' }} whileHover={{ scale: 1.05 }}>
        Clear all
      </motion.button>
    </motion.div>
  )
}
