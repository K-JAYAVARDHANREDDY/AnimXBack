import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import animationData from '../data/fullscreen-card-swipe.json'

const EASE = [0.76, 0, 0.24, 1] as const
const DURATION = 0.7

const defaultPages = animationData.defaultProps.initialPages

const variants = {
  enter: (direction: number) => ({ y: direction > 0 ? '100%' : '-100%' }),
  center: { y: '0%' },
  exit:  (direction: number) => ({ y: direction > 0 ? '-100%' : '100%' }),
}

interface Page {
  id: number
  label: string
  title: string
  subtitle: string
  bg: string
  accent: string
  textColor: string
  /** Optional background image URL - takes precedence over bg color */
  image?: string
  /** Image position (default: 'center') */
  imagePosition?: string
  /** Overlay opacity for text readability (0-1, default: 0.4) */
  overlayOpacity?: number
}

// ── Preview card — auto-cycles through pages ──────────────────────────
function PreviewCard({ pages }: { pages: Page[] }) {
  const [index, setIndex]         = useState(0)
  const [direction, setDirection] = useState(1)
  const isAnimating               = useRef(false)
  const page                      = pages[index]
  const total                     = pages.length

  // Auto-cycle every 1.8s
  useEffect(() => {
    const t = setInterval(() => {
      if (isAnimating.current) return
      isAnimating.current = true
      setDirection(1)
      setIndex(i => (i + 1) % total)
    }, 1800)
    return () => clearInterval(t)
  }, [total])

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: EASE }}
          onAnimationComplete={() => { isAnimating.current = false }}
          className="absolute inset-0 flex flex-col justify-end"
          style={{
            background: page.image 
              ? `url(${page.image}) ${page.imagePosition || 'center'} / cover no-repeat`
              : page.bg,
            padding: '12px 14px',
            position: 'relative',
          }}
        >
          {/* Dark overlay for image backgrounds */}
          {page.image && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `rgba(0,0,0,${page.overlayOpacity ?? 0.4})`,
              pointerEvents: 'none',
            }} />
          )}

          {/* Ghost number */}
          <div style={{
            position: 'absolute', top: -8, right: 4,
            fontWeight: 900, fontSize: 72,
            color: page.accent, opacity: 0.06,
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            fontFamily: 'serif',
          }}>
            {page.label}
          </div>

          {/* Right accent line */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 2, height: '25%',
            background: page.accent, opacity: 0.5,
          }} />

          {/* Page counter */}
          <div style={{
            position: 'absolute', top: 10, left: 14,
            fontSize: 8, letterSpacing: '0.22em',
            color: page.accent, opacity: 0.8,
            fontFamily: 'monospace',
          }}>
            {page.label} / {String(total).padStart(2, '0')}
          </div>

          {/* Title */}
          <div style={{
            fontWeight: 900, fontSize: 15,
            lineHeight: 1.1, color: page.textColor,
            whiteSpace: 'pre-line', letterSpacing: '-0.02em',
            marginBottom: 5, fontFamily: 'serif',
          }}>
            {page.title.split('\n')[0]}
          </div>

          {/* Accent divider */}
          <div style={{
            width: 24, height: 2,
            background: page.accent,
            borderRadius: 2, marginBottom: 5,
          }} />

          {/* Subtitle — first line only */}
          <div style={{
            fontSize: 8, lineHeight: 1.5,
            color: page.textColor, opacity: 0.5,
            fontFamily: 'monospace',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}>
            {page.subtitle}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot nav */}
      <div style={{
        position: 'absolute', right: 6, top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4, zIndex: 10,
      }}>
        {pages.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height:     i === index ? 14 : 4,
              background: i === index ? pages[index].accent : 'rgba(128,128,128,0.4)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ width: 2, borderRadius: 2 }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '100%', height: 2,
        background: 'rgba(255,255,255,0.06)', zIndex: 10,
      }}>
        <motion.div
          animate={{ width: total > 1 ? `${(index / (total - 1)) * 100}%` : '100%' }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ height: '100%', background: pages[index].accent }}
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function FullscreenCardSwipe({
  initialPages = defaultPages,
  isPreview    = false,
}: {
  initialPages?: Page[]
  isPreview?:    boolean
}) {
  const [pages, setPages]               = useState<Page[]>(initialPages)
  const [index, setIndex]               = useState(0)
  const [direction, setDirection]       = useState(1)
  const [isEditing, setIsEditing]       = useState(false)
  const [editingPageId, setEditingPageId] = useState<number | null>(null)
  const [editForm, setEditForm]         = useState<Partial<Page>>({})

  const isAnimating  = useRef(false)
  const accDelta     = useRef(0)
  const touchStartY  = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = pages.length
  const page  = pages[index]

  // ── Preview mode ──────────────────────────────────────────────────
  if (isPreview) {
    return <PreviewCard pages={initialPages} />
  }

  function goNext() {
    if (index < total - 1 && !isAnimating.current) {
      isAnimating.current = true
      setDirection(1)
      setIndex(i => i + 1)
    }
  }

  function goPrev() {
    if (index > 0 && !isAnimating.current) {
      isAnimating.current = true
      setDirection(-1)
      setIndex(i => i - 1)
    }
  }

  function jumpTo(i: number) {
    if (i === index || isAnimating.current) return
    isAnimating.current = true
    setDirection(i > index ? 1 : -1)
    setIndex(i)
  }

  function addPage() {
    const newId = pages.length
    const newPage: Page = {
      id: newId, label: String(newId + 1).padStart(2, '0'),
      title: 'New Page\nTitle', subtitle: 'Add your subtitle here',
      bg: '#0d0d14', accent: '#e8ff3c', textColor: '#f0ede8',
    }
    setPages([...pages, newPage])
  }

  function deletePage(id: number) {
    if (pages.length <= 1) return
    const newPages = pages.filter(p => p.id !== id).map((p, i) => ({
      ...p, id: i, label: String(i + 1).padStart(2, '0'),
    }))
    setPages(newPages)
    if (index >= newPages.length) setIndex(newPages.length - 1)
  }

  function startEdit(pageId: number) {
    const p = pages.find(p => p.id === pageId)
    if (p) { setEditingPageId(pageId); setEditForm(p) }
  }

  function saveEdit() {
    if (editingPageId === null) return
    setPages(pages.map(p => p.id === editingPageId ? { ...p, ...editForm } : p))
    setEditingPageId(null); setEditForm({})
  }

  function cancelEdit() { setEditingPageId(null); setEditForm({}) }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (isAnimating.current) return
      accDelta.current += e.deltaY
      if (accDelta.current > 50)       { accDelta.current = 0; goNext() }
      else if (accDelta.current < -50) { accDelta.current = 0; goPrev() }
    }
    function onTouchStart(e: TouchEvent) { touchStartY.current = e.touches[0].clientY }
    function onTouchEnd(e: TouchEvent) {
      if (isAnimating.current) return
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (diff > 40) goNext(); else if (diff < -40) goPrev()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [index, total])

  return (
    <div className="w-full space-y-3">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <p className="text-xs text-gray-500">↕ Scroll inside the box to swipe pages</p>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
        style={{ height: '520px' }}
      >
        {/* Edit Controls */}
        {isEditing ? (
          <div className="absolute top-4 left-4 right-4 z-[200] flex gap-2 flex-wrap">
            <button onClick={addPage} className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add Page
            </button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-medium transition-colors">
              ✓ Done Editing
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="absolute top-4 left-4 z-[200] px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium backdrop-blur-sm transition-colors">
            ✎ Edit Pages
          </button>
        )}

        {/* Edit Modal */}
        {editingPageId !== null && (
          <div className="absolute inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-dark-600 rounded-xl p-6 max-w-md w-full border border-white/10 overflow-y-auto max-h-full">
              <h3 className="text-xl font-bold text-white mb-4">Edit Page {editForm.label}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Title (use \n for line break)</label>
                  <input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Subtitle</label>
                  <textarea value={editForm.subtitle || ''} onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none" rows={2} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Background Image URL (optional - overrides bg color)</label>
                  <input type="text" value={editForm.image || ''} onChange={e => setEditForm({ ...editForm, image: e.target.value || undefined })} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
                </div>
                {editForm.image && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Image Position</label>
                      <select value={editForm.imagePosition || 'center'} onChange={e => setEditForm({ ...editForm, imagePosition: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Overlay Opacity</label>
                      <input type="range" min="0" max="1" step="0.1" value={editForm.overlayOpacity ?? 0.4} onChange={e => setEditForm({ ...editForm, overlayOpacity: parseFloat(e.target.value) })} className="w-full" />
                      <span className="text-xs text-gray-500">{editForm.overlayOpacity ?? 0.4}</span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  {[['Background', 'bg', '#0d0d14'], ['Accent', 'accent', '#e8ff3c'], ['Text', 'textColor', '#f0ede8']].map(([label, key, def]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-400 mb-1">{label}</label>
                      <input type="color" value={(editForm as any)[key] || def} onChange={e => setEditForm({ ...editForm, [key]: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"><Check className="w-4 h-4" />Save</button>
                  <button onClick={cancelEdit} className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"><X className="w-4 h-4" />Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Page Transitions */}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: DURATION, ease: EASE }}
            onAnimationComplete={() => { isAnimating.current = false; accDelta.current = 0 }}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              background: page.image 
                ? `url(${page.image}) ${page.imagePosition || 'center'} / cover no-repeat`
                : page.bg, 
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(32px, 5vh, 60px) clamp(24px, 5vw, 72px)',
              willChange: 'transform',
            }}
          >
            {/* Dark overlay for image backgrounds */}
            {page.image && (
              <div style={{
                position: 'absolute', inset: 0,
                background: `rgba(0,0,0,${page.overlayOpacity ?? 0.4})`,
                pointerEvents: 'none',
              }} />
            )}

            <div style={{ position: 'absolute', top: 'clamp(20px, 3vh, 40px)', left: 'clamp(24px, 5vw, 72px)', fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.28em', color: page.accent, opacity: 0.8, zIndex: 1 }}>
              {page.label} / {String(total).padStart(2, '0')}
            </div>

            {isEditing && (
              <div className="absolute top-16 left-6 flex gap-2">
                <button onClick={() => startEdit(page.id)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                {pages.length > 1 && <button onClick={() => deletePage(page.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>}
              </div>
            )}

            <div style={{ position: 'absolute', top: -20, right: '2vw', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(100px, 15vw, 200px)', color: page.accent, opacity: 0.045, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 1 }}>
              {page.label}
            </div>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '30%', background: page.accent, opacity: 0.3, zIndex: 1 }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1.0, color: page.textColor, whiteSpace: 'pre-line', letterSpacing: '-0.03em', marginBottom: 'clamp(14px, 2vh, 24px)', zIndex: 1, position: 'relative' }}>
              {page.title}
            </div>
            <div style={{ width: 52, height: 3, background: page.accent, borderRadius: 2, marginBottom: 'clamp(12px, 2vh, 20px)', zIndex: 1, position: 'relative' }} />
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(11px, 1vw, 14px)', lineHeight: 1.85, color: page.textColor, opacity: 0.55, maxWidth: 380, zIndex: 1, position: 'relative' }}>
              {page.subtitle}
            </div>

            {index === 0 && (
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} style={{ position: 'absolute', bottom: 'clamp(20px, 3vh, 40px)', right: 'clamp(24px, 5vw, 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: page.accent, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.24em', opacity: 0.6, zIndex: 1 }}>
                <span>SCROLL</span>
                <div style={{ width: 1, height: 32, background: page.accent, opacity: 0.5 }} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dot nav */}
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 100 }}>
          {pages.map((_, i) => (
            <motion.button key={i} onClick={() => jumpTo(i)}
              animate={{ height: i === index ? 28 : 6, background: i === index ? pages[index].accent : 'rgba(128,128,128,0.45)', opacity: i === index ? 1 : 0.6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ width: 3, borderRadius: 2, cursor: 'pointer', border: 'none' }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: 'rgba(255,255,255,0.06)', zIndex: 100 }}>
          <motion.div
            animate={{ width: total > 1 ? `${(index / (total - 1)) * 100}%` : '100%' }}
            transition={{ duration: DURATION, ease: EASE }}
            style={{ height: '100%', background: pages[index].accent }}
          />
        </div>
      </div>
    </div>
  )
}

export { animationData as metadata }
