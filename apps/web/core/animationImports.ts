// Map animation id → its dynamic import function
export const ANIMATION_IMPORTS: Record<string, () => Promise<any>> = {
  'infinite-text-marquee':    () => import('@/animations/GSAP/InfiniteTextMarque'),
  'horizontal-scroll-text':  () => import('@/animations/GSAP/ScrollAnimations'),
  'scroll-expand-media':     () => import('@/animations/GSAP/ScrollExpandMedia'),
  'fullscreen-card-swipe':   () => import('@/animations/framer/FullscreenCardSwipe'),
  'paper-fold-scroll':       () => import('@/animations/GSAP/PaperFoldScroll'),
  'testimonial-stack-parallax': () => import('@/animations/GSAP/VideoPin'),
  'magnetic-cursor':         () => import('@/animations/GSAP/MagneticCursor'),
  'text-scramble':           () => import('@/animations/GSAP/TextScramble'),
  'counter-animation':       () => import('@/animations/GSAP/CounterAnimation'),
  'parallax-hero':           () => import('@/animations/GSAP/ParallaxHero'),
  'svg-path-drawing':        () => import('@/animations/GSAP/SvgPathDrawing'),
  'card-flip-3d':            () => import('@/animations/framer/CardFlip3D'),
  'neon-glow':               () => import('@/animations/CSS/NeonGlow'),
  'stagger-pulse':           () => import('@/animations/tailwind/StaggerPulse'),
}
