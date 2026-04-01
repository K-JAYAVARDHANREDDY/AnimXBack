'use client' //default all the components run at server side 'use client' makes the component run in client side

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // AnimatePresence -> animate elements when they mount/unmount
import Link from 'next/link'
import { Search, X, Sun, Moon, SlidersHorizontal, ChevronRight, Sparkles, Home } from 'lucide-react' // lucide react is an icon library
import { useAnimationRegistry } from '@/core/AnimationRegistry'
import { AnimationCard } from './AnimationCard'
import { AnimationGridSkeleton } from './AnimationCardSkeleton'
import { FilterPanel, ActiveFilterChips, EMPTY_FILTERS } from './FilterPanel'
import type { FilterState, FilterSection } from './FilterPanel'
import type { AnimationEngine, AnimationSummaryDTO } from '@/types/animation.types' //AnimationEngine is an union type being exported
import type { FetchAnimationParams } from '@/types/animation.types'

const ENGINES: AnimationEngine[] = ['gsap', 'framer', 'css', 'three', 'tailwind']
const FAVORITES_KEY = 'animx-favorites'

export function AnimXDashboard() {
  const storeAnimations = useAnimationRegistry(s => s.animations)
  const { fetchAnimations } = useAnimationRegistry()

  const [isLoading, setIsLoading] = useState(true)
  const [filterSections, setFilterSections] = useState<Omit<FilterSection, 'icon'>[]>([])

  // Fetch from our Next.js backend APIs on mount to decouple from direct server-side data loading
  useEffect(() => {
    Promise.all([
      fetch('/api/filters').then(res => res.json()),
      storeAnimations.length === 0 ? fetchAnimations() : Promise.resolve()
    ]).then(([filtersData]) => {
      setFilterSections(filtersData)
      setIsLoading(false)
    }).catch(err => {
      console.error("Failed to load backend data:", err)
      setIsLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const animations = storeAnimations

  // ── State ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]         = useState('')  //Stores search text.
  const [filters, setFilters]                 = useState<FilterState>(EMPTY_FILTERS) //Current filter selections.
  const [showFilterPanel, setShowFilterPanel] = useState(false) //Controls filter popup visibility.
  const [favorites, setFavorites]             = useState<Set<string>>(new Set()) //Stores favorite animation IDs.
  const [isDark, setIsDark]                   = useState(true) // Dark mode toggle.
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  // Debounce timer ref for the search input.
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Derived ───────────────────────────────────────────────────────
  const activeFilterCount = useMemo(() =>
    filters.categories.length +
    filters.engines.length +
    filters.difficulties.length +
    filters.tags.length +
    (filters.favoritesOnly ? 1 : 0),
  [filters])

  // ── Server-side filtering: re-fetch whenever filters or search changes ─
  // Favorites-only is always applied client-side (no API support needed).
  useEffect(() => {
    const params: FetchAnimationParams = {
      categories:   filters.categories,
      engines:      filters.engines,
      difficulties: filters.difficulties,
      tags:         filters.tags,
    }

    if (searchQuery.trim()) {
      // Debounce search to avoid a fetch on every keystroke
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = setTimeout(() => {
        fetchAnimations({ ...params, q: searchQuery.trim() })
      }, 300)
    } else {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      fetchAnimations(params)
    }

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery])

  // ── Apply client-side favorites filter on top of server results ───
  const displayed = useMemo(() =>
    filters.favoritesOnly
      ? animations.filter(a => favorites.has(a.id))
      : animations,
  [animations, filters.favoritesOnly, favorites])

  // ── Effects ───────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) setFavorites(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { //used for shortcuts in the search bar
        e.preventDefault()
        document.getElementById('animx-search')?.focus()
      }
      if (e.key === 'Escape') {
        setSearchQuery('')
        setShowFilterPanel(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Actions ───────────────────────────────────────────────────────
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  const clearAll = () => {
    setSearchQuery('')
    setFilters(EMPTY_FILTERS)
  }

  // ── Breadcrumb ────────────────────────────────────────────────────
  const breadcrumb = useMemo(() => [
    'Dashboard',
    filters.categories.length === 1 ? filters.categories[0] : filters.categories.length > 1 ? `${filters.categories.length} categories` : null,
    filters.engines.length === 1 ? filters.engines[0].toUpperCase() : filters.engines.length > 1 ? `${filters.engines.length} engines` : null,
    searchQuery.trim() ? `"${searchQuery.trim()}"` : null,
  ].filter(Boolean) as string[], [filters, searchQuery]) //A breadcrumb in web design is a navigation aid that shows the user's location in a website hierarchy and allows them to quickly go back to previous levels.

  // ── Page title ────────────────────────────────────────────────────
  const pageTitle = useMemo(() => {
    if (filters.favoritesOnly) return '❤️ Favorites'
    if (filters.categories.length === 1) return filters.categories[0]
    if (filters.categories.length > 1) return 'Multiple Categories'
    if (searchQuery.trim()) return `Results for "${searchQuery.trim()}"`
    return 'All Animations'
  }, [filters, searchQuery])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-dark-500 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* ── Top bar ── */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${isDark ? 'bg-dark-500/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-3">

          {/* Logo & Home Link */}
          <Link 
            href="/" 
            onClick={() => {
              try { sessionStorage.removeItem('animx-dashboard-entered') } catch (e) {}
            }}
            className="flex items-center gap-2 mr-4 flex-shrink-0 cursor-pointer hover:-translate-y-1 transition-transform duration-300 group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight hidden sm:block">AnimX</span>
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              id="animx-search"
              type="text"
              placeholder="Search by name, tag, description…  ctrl+K"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600'
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-white transition-colors" />
              </button>
            )}    {/* conditional Redering .. Render only when the searchBar has some value in it */} {/* It is used to clear the search button */}
          </div>

          {/* Filter button */}
          <motion.button
            ref={filterBtnRef}
            onClick={() => setShowFilterPanel(p => !p)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showFilterPanel || activeFilterCount > 0
                ? 'text-white border-transparent'
                : isDark
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
            }`}
            style={showFilterPanel || activeFilterCount > 0 ? {
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            } : {}}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Filters</span>
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.span
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[9px] font-black flex items-center justify-center"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Dark / Light mode */}
          <motion.button
            onClick={() => setIsDark(d => !d)}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10'
                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          {/* ── Home button — goes back to landing page (Option A) ── */}
        

        </div>

        {/* Active filter chips row */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <ActiveFilterChips filters={filters} onChange={setFilters} isDark={isDark} />
          )}
        </AnimatePresence>
      </header>

      {/* ── Filter popup ── */}
      <FilterPanel
        initialFilterSections={filterSections}
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onChange={setFilters}
        totalCount={animations.length}
        filteredCount={displayed.length}
        allTags={[]}
        isDark={isDark}
        anchorRef={filterBtnRef}
      />

      {/* ── Main content ── */}
      <main className="max-w-screen-2xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs mb-4 flex-wrap">
          {breadcrumb.map((crumb, i) => (
            <span key={`${crumb}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              <span className={i === breadcrumb.length - 1
                ? 'text-primary-400 font-semibold'
                : isDark ? 'text-gray-600' : 'text-gray-400'
              }>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {pageTitle}
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {`${displayed.length} animation${displayed.length !== 1 ? 's' : ''}`}
              {activeFilterCount > 0 && (
                <> · <span className="text-primary-400">{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span></>
              )}
            </p>
          </div>

          {(activeFilterCount > 0 || searchQuery) && (
            <motion.button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <X className="w-3 h-3" />
              Clear all
            </motion.button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="py-8">
            <AnimationGridSkeleton count={8} />
          </div>
        ) : displayed.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-32 gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </motion.div>
            <div className="text-center">
              <p className={`text-base font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No animations match your filters
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Try adjusting your search or removing some filters
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={clearAll}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Clear all filters
              </motion.button>
              <motion.button
                onClick={() => setShowFilterPanel(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Adjust filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {displayed.map((animation) => (
                <motion.div
                  key={animation.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimationCard
                    animation={animation}
                    isFavorited={favorites.has(animation.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* ── Footer ── */}
      <motion.footer
        className="relative z-10 border-t border-white/10 mt-20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(0,195,255,0.15) 0%, transparent 70%)', top: '50%', left: '20%' }}
            animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(155,0,255,0.15) 0%, transparent 70%)', top: '30%', right: '20%' }}
            animate={{ scale: [1.2, 0.9, 1.2], x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          {/* Big logo */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 15 }}
            >
              <motion.div
                className="relative w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-2xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ rotate: { duration: 0.8 }, scale: { duration: 0.3 } }}
              >
                <motion.div className="absolute inset-0 rounded-3xl border-4 border-primary-400" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                <motion.div className="absolute inset-0 rounded-3xl border-4 border-accent-400" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />
                <Sparkles className="w-16 h-16 text-white relative z-10" />
              </motion.div>
            </motion.div>

            <motion.div
              className="mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            >
              <h2 className="text-8xl md:text-9xl font-black">
                {['A', 'n', 'i', 'm', 'X'].map((letter, i) => (
                  <motion.span
                    key={`footer-letter-${i}`}
                    className="inline-block gradient-text"
                    variants={{ hidden: { opacity: 0, y: 50, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } } }}
                    whileHover={{ scale: 1.2, y: -10, transition: { duration: 0.2 } }}
                    style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h2>
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl text-gray-300 font-light mb-8"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Write Once,{' '}
              <span className="text-primary-400 font-semibold">Animate</span> Anywhere
            </motion.p>

            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent max-w-2xl mx-auto rounded-full"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ delay: 1, duration: 1.5 }}
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
          >
            {[
              { label: 'Animations',   value: animations.length, icon: '🎬' },
              { label: 'Engines',      value: ENGINES.length,    icon: '⚡' },
              { label: 'Filter Types', value: '4',               icon: '🎯' },
              { label: 'Ready to Use', value: '100%',            icon: '✨' },
            ].map((stat, i) => (
              <motion.div
                key={`stat-${stat.label}`}
                className="glass-card p-6 text-center rounded-xl border border-white/10"
                variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } } }}
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
              >
                <motion.div className="text-4xl mb-2" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
                  {stat.icon}
                </motion.div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech stack */}
          <motion.div className="mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}>
            <h3 className="text-center text-xl text-gray-400 mb-6">Powered by Industry-Leading Technologies</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['GSAP', 'Framer Motion', 'CSS Animations', 'Three.js', 'Tailwind'].map((tech, i) => (
                <motion.div
                  key={`tech-${tech}`}
                  className="px-6 py-3 bg-white/5 rounded-full border border-white/10"
                  initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,195,255,0.1)', borderColor: 'rgba(0,195,255,0.5)' }}
                >
                  <span className="text-sm font-medium text-gray-300">{tech}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/" onClick={() => {
              try { sessionStorage.removeItem('animx-dashboard-entered') } catch (e) {}
            }}>
              <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white hover:text-primary-400 transition-colors">AnimX</p>
                  <p className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved</p>
                </div>
              </motion.div>
            </Link>

            <div className="flex gap-6">
              {['Documentation', 'GitHub', 'Support'].map((link, i) => (
                <motion.a key={`footer-link-${link}`} href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.1 }} whileHover={{ y: -2 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <motion.p className="text-sm text-gray-500" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.2 }}>
              Made with{' '}
              <motion.span className="text-red-500" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>♥</motion.span>
              {' '}for developers
            </motion.p>
          </motion.div>
        </div>

        {/* Particles */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-primary-400 rounded-full"
              style={{ left: `${i * 10 + 5}%`, bottom: 0 }}
              animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.footer>

    </div>
  )
}
