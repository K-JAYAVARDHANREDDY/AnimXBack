import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, X, Plus, Trash2, Edit2, Check } from 'lucide-react'
import animationData from '../data/paper-fold-scroll.json'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Section {
  id: number
  title: string
  content: string
  bgColor: string
  textColor: string
  bgImage?: string
}

const defaultSections: Section[] = animationData.defaultProps.sections

// ── Preview — auto-animating fold cycle ───────────────────────────────
function PreviewMode({ sections }: { sections: Section[] }) {
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const tlRef     = useRef<gsap.core.Timeline | null>(null)
  const visible   = sections.slice(0, 3)

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length < 2) return

    // Reset all cards to stacked position
    gsap.set(cards, { scale: 1, x: 0, y: 0, rotation: 0, opacity: 1, transformOrigin: 'top left' })
    cards.forEach((card, i) => {
      gsap.set(card, {
        scale:    1 - i * 0.07,
        y:        i * 14,
        x:        i * 6,
        rotation: -i * 3,
        opacity:  1 - i * 0.2,
        zIndex:   cards.length - i,
      })
    })

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
    tlRef.current = tl

    // Fold the top card away (scale down, move top-left, fade)
    tl.to(cards[0], {
      scale:    0.65,
      x:        '-38%',
      y:        '-38%',
      rotation: -12,
      opacity:  0,
      duration: 0.7,
      ease:     'power2.inOut',
    })

    // Simultaneously shift remaining cards forward
    cards.slice(1).forEach((card, i) => {
      tl.to(card, {
        scale:    1 - i * 0.07,
        y:        i * 14,
        x:        i * 6,
        rotation: -i * 3,
        opacity:  1 - i * 0.2,
        zIndex:   cards.length - i,
        duration: 0.7,
        ease:     'power2.inOut',
      }, '<')
    })

    // Pause to show new top card
    tl.to({}, { duration: 1.2 })

    // Reset — bring folded card back to bottom of stack
    tl.set(cards[0], {
      scale:    1 - (cards.length - 1) * 0.07,
      x:        (cards.length - 1) * 6,
      y:        (cards.length - 1) * 14,
      rotation: -(cards.length - 1) * 3,
      opacity:  1 - (cards.length - 1) * 0.2,
      zIndex:   1,
    })

    // Shift everything else back
    cards.slice(1).forEach((card, i) => {
      tl.set(card, {
        scale:    1 - (i + 1) * 0.07,  // push down one level
        y:        (i + 1) * 14,
        x:        (i + 1) * 6,
        rotation: -(i + 1) * 3,
        opacity:  1 - (i + 1) * 0.2,
        zIndex:   cards.length - (i + 1),
      })
    })

    // Bring new top card to front smoothly
    tl.to(cards[1], {
      scale: 1, x: 0, y: 0, rotation: 0, opacity: 1,
      zIndex: cards.length,
      duration: 0.5, ease: 'power2.out',
    })

    return () => { tl.kill() }
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      {visible.map((section, i) => (
        <div
          key={section.id}
          ref={el => { cardRefs.current[i] = el }}
          className="absolute inset-2 rounded-xl overflow-hidden flex flex-col justify-end"
          style={{
            backgroundColor: section.bgColor,
            backgroundImage: section.bgImage ? `url(${section.bgImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {section.bgImage && <div className="absolute inset-0 bg-black/40" />}
          <div className="relative z-10 p-3">
            <div className="font-black text-sm leading-tight truncate" style={{ color: section.textColor }}>
              {section.title}
            </div>
            <div className="text-[9px] mt-0.5 opacity-60 truncate" style={{ color: section.textColor }}>
              {section.content}
            </div>
          </div>
        </div>
      ))}

      {/* Label */}
      <div className="absolute top-2 right-2 z-50 text-[8px] font-semibold bg-black/50 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm tracking-widest uppercase pointer-events-none">
        Paper Fold
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export function PaperFoldScroll({
  sections  = defaultSections,
  isPreview = false,
}: {
  sections?:  Section[]
  isPreview?: boolean
}) {
  const [customSections, setCustomSections] = useState<Section[]>(sections)
  const [isEditing,      setIsEditing]      = useState(false)
  const [editingId,      setEditingId]      = useState<number | null>(null)
  const [editForm,       setEditForm]       = useState<Partial<Section>>({})
  const [isMounted,      setIsMounted]      = useState(false)

  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const sectionsRef      = useRef<HTMLDivElement[]>([])

  useEffect(() => { setIsMounted(true) }, [])
  useEffect(() => { setCustomSections(sections) }, [sections])

  useEffect(() => {
    if (isPreview || !isMounted || !scrollWrapperRef.current) return
    const ctx = gsap.context(() => {
      sectionsRef.current.forEach(section => {
        if (!section) return
        gsap.to(section, {
          scrollTrigger: { trigger: section, scroller: scrollWrapperRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          scale: 0.8, rotateX: -15, rotateY: -15, x: '-40%', y: '-40%',
          transformOrigin: 'top left', ease: 'none',
        })
        gsap.to(section, {
          scrollTrigger: { trigger: section, scroller: scrollWrapperRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          opacity: 0.3, ease: 'none',
        })
      })
    })
    return () => ctx.revert()
  }, [isPreview, isMounted, customSections])

  function addSection() {
    const newId = customSections.length
    setCustomSections([...customSections, {
      id: newId, title: 'New Section', content: 'Add your content here',
      bgColor: '#1a1a2e', textColor: '#ffffff',
    }])
  }

  function deleteSection(id: number) {
    if (customSections.length <= 1) return
    setCustomSections(customSections.filter(s => s.id !== id).map((s, i) => ({ ...s, id: i })))
  }

  function startEdit(id: number) {
    const s = customSections.find(s => s.id === id)
    if (s) { setEditingId(id); setEditForm(s) }
  }

  function saveEdit() {
    if (editingId === null) return
    setCustomSections(customSections.map(s => s.id === editingId ? { ...s, ...editForm } : s))
    setEditingId(null); setEditForm({})
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }

  function cancelEdit() { setEditingId(null); setEditForm({}) }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setEditForm({ ...editForm, bgImage: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  // ── PREVIEW ───────────────────────────────────────────────────────
  if (isPreview) return <PreviewMode sections={defaultSections} />

  // ── Loading ───────────────────────────────────────────────────────
  if (!isMounted) return (
    <div className="w-full h-[500px] bg-dark-600 rounded-xl flex items-center justify-center">
      <p className="text-gray-400">Loading animation...</p>
    </div>
  )

  // ── FULL DETAIL PAGE ──────────────────────────────────────────────
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2 flex-wrap">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg text-xs font-medium transition-colors">
            ✎ Edit Sections
          </button>
        ) : (
          <>
            <button onClick={addSection} className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add Section
            </button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-medium transition-colors">
              ✓ Done Editing
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500">↕ Scroll inside the box to see the paper fold effect</p>

      {editingId !== null && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-600 rounded-xl p-6 max-w-md w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Edit Section {editingId + 1}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Content</label>
                <textarea value={editForm.content || ''} onChange={e => setEditForm({ ...editForm, content: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Background Color</label>
                  <input type="color" value={editForm.bgColor || '#1a1a2e'} onChange={e => setEditForm({ ...editForm, bgColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text Color</label>
                  <input type="color" value={editForm.textColor || '#ffffff'} onChange={e => setEditForm({ ...editForm, textColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Background Image (Optional)</label>
                {editForm.bgImage ? (
                  <div className="relative">
                    <img src={editForm.bgImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <button onClick={() => setEditForm({ ...editForm, bgImage: undefined })} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="block w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm cursor-pointer hover:bg-white/10 transition-colors text-center">
                      <Upload className="w-4 h-4 inline mr-2" />Upload Image
                    </label>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"><Check className="w-4 h-4" />Save</button>
                <button onClick={cancelEdit} className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"><X className="w-4 h-4" />Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollWrapperRef} className="relative w-full rounded-xl overflow-y-scroll" style={{ height: '500px' }}>
        {customSections.map((section, index) => (
          <div
            key={section.id}
            ref={el => { if (el) sectionsRef.current[index] = el }}
            className="relative flex items-center justify-center"
            style={{
              height: '500px', backgroundColor: section.bgColor,
              backgroundImage: section.bgImage ? `url(${section.bgImage})` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              perspective: '1000px', transformStyle: 'preserve-3d',
              position: 'sticky', top: 0,
            }}
          >
            {section.bgImage && <div className="absolute inset-0 bg-black/50" />}
            {isEditing && (
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button onClick={() => startEdit(section.id)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                {customSections.length > 1 && <button onClick={() => deleteSection(section.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>}
              </div>
            )}
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: section.textColor }}>{section.title}</h2>
              <p className="text-lg md:text-xl" style={{ color: section.textColor, opacity: 0.8 }}>{section.content}</p>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm opacity-50" style={{ color: section.textColor }}>{index + 1} / {customSections.length}</div>
            </div>
            {index === 0 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" style={{ color: section.textColor, opacity: 0.6 }}>
                <span className="text-xs uppercase tracking-wider">Scroll Down</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { animationData as metadata }
