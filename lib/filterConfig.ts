import type { SectionId, FilterParent } from '@/components/FilterPanel'

type FilterConfigSection = {
  id: SectionId
  label: string
  color: string
  parents: FilterParent[]
}

export const FILTER_SECTIONS: FilterConfigSection[] = [
  {
    id: 'category', label: 'Category', color: '#6366f1',
    parents: [
      { id: 'motion',      label: 'Motion',      icon: '🎬', children: [{ id: 'Entrance', label: 'Entrance' }, { id: 'Exit', label: 'Exit' }, { id: 'Attention', label: 'Attention' }] },
      { id: 'interaction', label: 'Interaction', icon: '👆', children: [{ id: 'Hover', label: 'Hover' }, { id: 'Scroll', label: 'Scroll' }] },
      { id: 'visual',      label: 'Visual',      icon: '✨', children: [{ id: '3D', label: '3D' }, { id: 'Text', label: 'Text' }, { id: 'Background', label: 'Background' }] },
    ],
  },
  {
    id: 'engine', label: 'Engine', color: '#22d3ee',
    parents: [
      { id: 'gsap',    label: 'GSAP',          icon: '⚡', children: [{ id: 'scroll-trigger', label: 'ScrollTrigger' }, { id: 'timelines', label: 'Timelines' }, { id: 'physics', label: 'Physics' }] },
      { id: 'framer',  label: 'Framer Motion', icon: '🎯', children: [{ id: 'spring', label: 'Spring' }, { id: 'layout', label: 'Layout' }, { id: 'presence', label: 'Presence' }] },
      { id: 'three',   label: 'Three.js',      icon: '🔮', children: [{ id: 'webgl', label: 'WebGL' }, { id: 'particles', label: 'Particles' }] },
      { id: 'css',     label: 'CSS',           icon: '🎨', children: [{ id: 'keyframes', label: '@keyframes' }, { id: 'zero-js', label: 'Zero JS' }] },
      { id: 'tailwind',label: 'Tailwind',      icon: '💨', children: [{ id: 'utility', label: 'Utility-first' }, { id: 'stagger', label: 'Stagger' }] },
    ],
  },
  {
    id: 'difficulty', label: 'Difficulty', color: '#f59e0b',
    parents: [
      { id: 'easy',   label: 'Easy',   icon: '🟢', children: [{ id: 'beginner', label: 'Beginner friendly' }, { id: 'no-library', label: 'No library needed' }] },
      { id: 'medium', label: 'Medium', icon: '🟡', children: [{ id: 'some-knowledge', label: 'Some animation knowledge' }, { id: 'library-needed', label: 'Library setup needed' }] },
      { id: 'hard',   label: 'Hard',   icon: '🔴', children: [{ id: 'advanced', label: 'Advanced implementation' }, { id: 'webgl-req', label: 'WebGL / 3D knowledge' }] },
    ],
  },
  {
    id: 'tags', label: 'Tags', color: '#a855f7',
    parents: [
      { id: 'scroll-tags',  label: 'Scroll',      icon: '📜', children: [{ id: 'scroll', label: '#scroll' }, { id: 'parallax', label: '#parallax' }, { id: 'pin', label: '#pin' }] },
      { id: 'ui-tags',      label: 'UI Elements', icon: '🖥️', children: [{ id: 'card', label: '#card' }, { id: 'cursor', label: '#cursor' }, { id: 'button', label: '#button' }] },
      { id: 'text-tags',    label: 'Text & Type', icon: '✍️', children: [{ id: 'text', label: '#text' }, { id: 'marquee', label: '#marquee' }, { id: 'counter', label: '#counter' }] },
      { id: 'effects-tags', label: 'Effects',     icon: '🌟', children: [{ id: 'particles', label: '#particles' }, { id: 'glow', label: '#glow' }, { id: '3d', label: '#3d' }] },
    ],
  },
]
