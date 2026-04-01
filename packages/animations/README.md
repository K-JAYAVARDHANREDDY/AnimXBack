# @animx-jaya/animations

> A collection of **14+ ready-to-use animation components** for React — powered by GSAP, Framer Motion, CSS, and Tailwind.

Part of the [AnimX](https://github.com/K-JAYAVARDHANREDDY/AnimXBack) framework.

## Installation

```bash
npm install @animx-jaya/animations @animx-jaya/core
```

### Peer Dependencies

Install the peer dependencies for the animation engines you plan to use:

```bash
# For GSAP animations
npm install gsap

# For Framer Motion animations
npm install framer-motion

# All peer dependencies
npm install react react-dom gsap framer-motion lucide-react
```

## Included Animations

### GSAP Animations
| Component | Description |
|-----------|-------------|
| `CounterAnimation` | Animated number counter with easing |
| `InfiniteTextMarquee` | Infinite scrolling text marquee |
| `MagneticCursor` | Cursor that magnetically attracts elements |
| `PaperFoldScroll` | Paper folding effect on scroll |
| `ParallaxHero` | Parallax scrolling hero section |
| `HorizontalScrollText` | Horizontally scrolling text on scroll |
| `ScrollExpandMedia` | Media that expands as you scroll |
| `SvgPathDrawing` | Animated SVG path drawing |
| `TextScramble` | Text scramble / decode effect |
| `TestimonialStackCards` | Stacked card testimonials |

### Framer Motion Animations
| Component | Description |
|-----------|-------------|
| `CardFlip3D` | 3D card flip interaction |
| `FullscreenCardSwipe` | Fullscreen swipeable cards |

### CSS Animations
| Component | Description |
|-----------|-------------|
| `NeonGlow` | Neon glow text effect |

### Tailwind Animations
| Component | Description |
|-----------|-------------|
| `StaggerPulse` | Staggered pulse animation |

## Usage

### Individual Components

```tsx
import { TextScramble, ParallaxHero } from '@animx-jaya/animations'

function App() {
  return (
    <div>
      <ParallaxHero />
      <TextScramble />
    </div>
  )
}
```

### Animation Registry

Access all animations programmatically:

```tsx
import { ANIMATION_REGISTRY } from '@animx-jaya/animations'

// Iterate over all animations
ANIMATION_REGISTRY.forEach(({ id, component: Component, metadata }) => {
  console.log(`${metadata.name} — ${metadata.description}`)
})
```

### With Metadata

Each animation exports its metadata for programmatic use:

```tsx
import { TextScramble, TextScrambleMeta } from '@animx-jaya/animations'

console.log(TextScrambleMeta.name)        // "Text Scramble"
console.log(TextScrambleMeta.engine)      // "gsap"
console.log(TextScrambleMeta.difficulty)  // "intermediate"
```

## Related Packages

- [`@animx-jaya/core`](https://www.npmjs.com/package/@animx-jaya/core) — Core engine and type system

## License

MIT © [Jayavardhan Reddy](https://github.com/K-JAYAVARDHANREDDY)
