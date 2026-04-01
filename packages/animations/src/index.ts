// @animx/animations — Ready-to-use animation components for React

// ── GSAP Animations ──────────────────────────────────────────────────
export { CounterAnimation, metadata as CounterAnimationMeta } from './gsap/CounterAnimation'
export { InfiniteTextMarquee, metadata as InfiniteTextMarqueeMeta } from './gsap/InfiniteTextMarque'
export { MagneticCursor, metadata as MagneticCursorMeta } from './gsap/MagneticCursor'
export { PaperFoldScroll, metadata as PaperFoldScrollMeta } from './gsap/PaperFoldScroll'
export { ParallaxHero, metadata as ParallaxHeroMeta } from './gsap/ParallaxHero'
export { HorizontalScrollText, metadata as HorizontalScrollTextMeta } from './gsap/ScrollAnimations'
export { ScrollExpandMedia, metadata as ScrollExpandMediaMeta } from './gsap/ScrollExpandMedia'
export { SvgPathDrawing, metadata as SvgPathDrawingMeta } from './gsap/SvgPathDrawing'
export { TextScramble, metadata as TextScrambleMeta } from './gsap/TextScramble'
export { TestimonialStackCards, metadata as TestimonialStackCardsMeta } from './gsap/VideoPin'

// ── Framer Motion Animations ────────────────────────────────────────
export { CardFlip3D, metadata as CardFlip3DMeta } from './framer/CardFlip3D'
export { FullscreenCardSwipe, metadata as FullscreenCardSwipeMeta } from './framer/FullscreenCardSwipe'

// ── CSS Animations ──────────────────────────────────────────────────
export { NeonGlow, metadata as NeonGlowMeta } from './css/NeonGlow'

// ── Tailwind Animations ─────────────────────────────────────────────
export { StaggerPulse, metadata as StaggerPulseMeta } from './tailwind/StaggerPulse'

// ── Full registry for programmatic access ────────────────────────────
import { CounterAnimation, metadata as _m1 } from './gsap/CounterAnimation'
import { InfiniteTextMarquee, metadata as _m2 } from './gsap/InfiniteTextMarque'
import { MagneticCursor, metadata as _m3 } from './gsap/MagneticCursor'
import { PaperFoldScroll, metadata as _m4 } from './gsap/PaperFoldScroll'
import { ParallaxHero, metadata as _m5 } from './gsap/ParallaxHero'
import { HorizontalScrollText, metadata as _m6 } from './gsap/ScrollAnimations'
import { ScrollExpandMedia, metadata as _m7 } from './gsap/ScrollExpandMedia'
import { SvgPathDrawing, metadata as _m8 } from './gsap/SvgPathDrawing'
import { TextScramble, metadata as _m9 } from './gsap/TextScramble'
import { TestimonialStackCards, metadata as _m10 } from './gsap/VideoPin'
import { CardFlip3D, metadata as _m11 } from './framer/CardFlip3D'
import { FullscreenCardSwipe, metadata as _m12 } from './framer/FullscreenCardSwipe'
import { NeonGlow, metadata as _m13 } from './css/NeonGlow'
import { StaggerPulse, metadata as _m14 } from './tailwind/StaggerPulse'
import type { ComponentType } from 'react'

export interface AnimationRegistryEntry {
  id: string
  component: ComponentType<any>
  metadata: Record<string, any>
}

/** All animations as a flat array for easy iteration / registration. */
export const ANIMATION_REGISTRY: AnimationRegistryEntry[] = [
  { id: _m1.id, component: CounterAnimation, metadata: _m1 },
  { id: _m2.id, component: InfiniteTextMarquee, metadata: _m2 },
  { id: _m3.id, component: MagneticCursor, metadata: _m3 },
  { id: _m4.id, component: PaperFoldScroll, metadata: _m4 },
  { id: _m5.id, component: ParallaxHero, metadata: _m5 },
  { id: _m6.id, component: HorizontalScrollText, metadata: _m6 },
  { id: _m7.id, component: ScrollExpandMedia, metadata: _m7 },
  { id: _m8.id, component: SvgPathDrawing, metadata: _m8 },
  { id: _m9.id, component: TextScramble, metadata: _m9 },
  { id: _m10.id, component: TestimonialStackCards, metadata: _m10 },
  { id: _m11.id, component: CardFlip3D, metadata: _m11 },
  { id: _m12.id, component: FullscreenCardSwipe, metadata: _m12 },
  { id: _m13.id, component: NeonGlow, metadata: _m13 },
  { id: _m14.id, component: StaggerPulse, metadata: _m14 },
]
