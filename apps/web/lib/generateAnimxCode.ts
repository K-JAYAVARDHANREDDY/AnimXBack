/**
 * generateAnimxCode — Produces real, working React JSX code from control panel values.
 *
 * When a developer customizes an animation on the AnimX website, this function
 * generates the exact import + JSX they'd paste into their project using
 * @animx-jaya/animations.
 */

// ── Per-animation config ─────────────────────────────────────────────
interface AnimCodeConfig {
  /** Named export from @animx-jaya/animations */
  componentName: string
  /** Maps JSON control key → actual React prop name (only when they differ) */
  propRenames?: Record<string, string>
  /** Props to always omit from generated code (internal only) */
  omitProps?: string[]
  /** Default values — if user value matches, the prop is omitted for cleaner code */
  defaults: Record<string, any>
}

const ANIMATION_CONFIGS: Record<string, AnimCodeConfig> = {
  'text-scramble': {
    componentName: 'TextScramble',
    propRenames: { textColor: 'color', words: undefined as any }, // words → use first word as "text"
    omitProps: ['isPreview'],
    defaults: {
      speed: 40,
      autoPlay: true,
      textColor: '#00c3ff',
      scrambleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&',
      words: ['ANIMATE', 'CREATE', 'INSPIRE', 'DESIGN', 'BUILD'],
    },
  },

  'counter-animation': {
    componentName: 'CounterAnimation',
    omitProps: ['isPreview', 'ease'],
    defaults: {
      duration: 2.5,
      heading: 'By the Numbers',
      subheading: 'Every metric counts',
      accentColor: '#00c3ff',
      counters: [
        { label: 'Animations', value: 120, suffix: '+', prefix: '' },
        { label: 'Downloads', value: 48500, suffix: 'K', prefix: '' },
        { label: 'Happy Devs', value: 99, suffix: '%', prefix: '' },
        { label: 'GitHub Stars', value: 12, suffix: 'K', prefix: '' },
      ],
    },
  },

  'horizontal-scroll-text': {
    componentName: 'HorizontalScrollText',
    omitProps: ['isPreview'],
    defaults: {
      text: 'EXPERIENCES',
      scrubDuration: 2,
      bgColor: '#00ffff',
      textColor: '#000000',
    },
  },

  'infinite-text-marquee': {
    componentName: 'InfiniteTextMarquee',
    omitProps: ['isPreview'],
    defaults: {
      topText: 'INNOVATION • CREATIVITY • DESIGN',
      bottomText: 'ANIMATION • DEVELOPMENT • BRANDING',
      speed: 50,
    },
  },

  'magnetic-cursor': {
    componentName: 'MagneticCursor',
    omitProps: ['isPreview'],
    defaults: {
      strength: 0.4,
      radius: 120,
      labelText: 'Get Started →',
      bgColor: '#6366f1',
      textColor: '#ffffff',
    },
  },

  'paper-fold-scroll': {
    componentName: 'PaperFoldScroll',
    omitProps: ['isPreview'],
    defaults: {
      sections: [
        { id: 0, title: 'Welcome', content: 'Scroll down to see the paper fold effect', bgColor: '#1a1a2e', textColor: '#ffffff' },
        { id: 1, title: 'Innovation', content: 'Watch as pages fold like paper', bgColor: '#16213e', textColor: '#ffffff' },
        { id: 2, title: 'Creativity', content: 'Smooth scroll-triggered animations', bgColor: '#0f3460', textColor: '#ffffff' },
        { id: 3, title: 'Excellence', content: 'Create your own sections', bgColor: '#533483', textColor: '#ffffff' },
      ],
      foldDirection: 'top-left',
    },
  },

  'parallax-hero': {
    componentName: 'ParallaxHero',
    omitProps: ['isPreview'],
    defaults: {
      headline: 'BEYOND\nLIMITS',
      subline: 'Scroll to explore the depth',
      bgColor: '#0a0a0f',
      accentColor: '#00c3ff',
      layerSpeed1: 0.3,
      layerSpeed2: 0.6,
      layerSpeed3: 0.9,
    },
  },

  'scroll-expand-media': {
    componentName: 'ScrollExpandMedia',
    omitProps: ['isPreview'],
    defaults: {
      mediaUrl: '',
      mediaType: 'image',
      initialScale: 0.5,
      borderRadius: 32,
    },
  },

  'svg-path-drawing': {
    componentName: 'SvgPathDrawing',
    omitProps: ['isPreview'],
    defaults: {
      strokeColor: '#00c3ff',
      strokeWidth: 2,
      duration: 2,
      fillColor: 'none',
      shape: 'logo',
      ease: 'power2.inOut',
    },
  },

  'testimonial-stack-parallax': {
    componentName: 'TestimonialStackCards',
    omitProps: ['isPreview'],
    defaults: {
      bgTextFirst: "What's",
      bgTextSecond: 'Everyone',
      bgTextThird: 'Talking',
      textColor: '#1a1a1a',
      accentColor: '#FF6B6B',
      cards: [
        { id: 0, name: 'Sarah K.', role: 'Product Designer', quote: 'Absolutely game-changing.', bg: '#FF6B6B', textColor: '#fff', accentColor: '#FFE66D' },
        { id: 1, name: 'James T.', role: 'Frontend Engineer', quote: 'I shipped 3x faster using AnimX.', bg: '#FFE66D', textColor: '#1a1a1a', accentColor: '#FF6B6B' },
        { id: 2, name: 'Priya M.', role: 'Creative Director', quote: 'Finally, animations that look exactly like the design.', bg: '#A855F7', textColor: '#fff', accentColor: '#FFE66D' },
      ],
    },
  },

  'card-flip-3d': {
    componentName: 'CardFlip3D',
    omitProps: ['isPreview'],
    defaults: {
      flipDirection: 'horizontal',
      duration: 0.6,
      accentColor: '#9b5cf6',
      trigger: 'hover',
    },
  },

  'fullscreen-card-swipe': {
    componentName: 'FullscreenCardSwipe',
    omitProps: ['isPreview'],
    defaults: {
      initialPages: [
        { id: 0, label: '01', title: 'Where It\nAll Begins', subtitle: 'Every journey starts with a single step into the unknown.', bg: '#0d0d14', accent: '#e8ff3c', textColor: '#f0ede8', image: undefined, imagePosition: 'center', overlayOpacity: 0.4 },
        { id: 1, label: '02', title: 'Feel the\nRhythm', subtitle: 'Movement is not just physical — it\'s a state of mind.', bg: '#f0ede8', accent: '#1a1aff', textColor: '#0a0a0f', image: undefined, imagePosition: 'center', overlayOpacity: 0.4 },
        { id: 2, label: '03', title: 'Layers\nWithin', subtitle: 'Beneath the surface lies a world waiting to be explored.', bg: '#1a1aff', accent: '#e8ff3c', textColor: '#f0ede8', image: undefined, imagePosition: 'center', overlayOpacity: 0.4 },
      ],
    },
  },

  'neon-glow': {
    componentName: 'NeonGlow',
    omitProps: ['isPreview'],
    defaults: {
      glowColor: '#00c3ff',
      text: 'NEON',
      flickerSpeed: '2s',
    },
  },

  'stagger-pulse': {
    componentName: 'StaggerPulse',
    omitProps: ['isPreview'],
    defaults: {
      accentColor: '#0ea5e9',
      gridSize: 5,
      animationType: 'pulse',
    },
  },
}

// ── Serialization helpers ────────────────────────────────────────────

function serializePropValue(value: any): string {
  if (typeof value === 'string') return `"${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

function formatPropLine(name: string, value: any): string {
  if (typeof value === 'string') {
    return `  ${name}="${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return `  ${name}={${value}}`
  }
  if (Array.isArray(value) || typeof value === 'object') {
    const json = JSON.stringify(value, null, 2)
    // For short arrays/objects, inline them
    if (json.length < 60) {
      return `  ${name}={${JSON.stringify(value)}}`
    }
    // For long ones, use multi-line with proper indent
    const indented = json.split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n')
    return `  ${name}={${indented}}`
  }
  return `  ${name}={${serializePropValue(value)}}`
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object' || a === null || b === null) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  return keysA.every(key => deepEqual(a[key], b[key]))
}

// ── Main export ──────────────────────────────────────────────────────

/**
 * Generate real, working React code from control panel values.
 *
 * @param animationId  — the animation's JSON id (e.g., 'text-scramble')
 * @param currentProps — the current values from the control panel state
 * @returns a string of valid React/JSX code with import
 */
export function generateAnimxCode(
  animationId: string,
  currentProps: Record<string, any>,
): string {
  const config = ANIMATION_CONFIGS[animationId]
  if (!config) {
    // Fallback for unknown animations
    return `// Code generation not available for ${animationId}`
  }

  const { componentName, propRenames = {}, omitProps = [], defaults } = config

  // Special handling for text-scramble: "words" array → "text" prop (first word)
  const resolvedProps: Record<string, any> = { ...currentProps }

  // Build prop lines — only include props that differ from defaults
  const propLines: string[] = []

  for (const [key, value] of Object.entries(resolvedProps)) {
    // Skip internal props
    if (omitProps.includes(key)) continue

    // We no longer skip if value matches default. We want to show all props explicitly
    // so developers know exactly what can be customized.

    // Determine the actual prop name
    let propName = key
    if (propRenames && key in propRenames) {
      const renamed = propRenames[key]
      if (renamed === undefined) continue // explicitly omitted via rename
      propName = renamed
    }

    propLines.push(formatPropLine(propName, value))
  }

  // Build the final code
  const importLine = `import { ${componentName} } from '@animx-jaya/animations'`

  if (propLines.length === 0) {
    return `${importLine}\n\n<${componentName} />`
  }

  return `${importLine}\n\n<${componentName}\n${propLines.join('\n')}\n/>`
}

export { ANIMATION_CONFIGS }
