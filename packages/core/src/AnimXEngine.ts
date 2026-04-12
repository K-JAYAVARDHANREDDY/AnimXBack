import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)/**
 * AnimX — Unified, Intent-Driven Animation Engine
 *
 * What makes AnimX different from GSAP / Framer / CSS animations:
 *
 *  1. INTENT SYSTEM   — Animate semantics, not mechanics. Tell AnimX *what feeling*
 *                        you want ("celebrate", "error", "success") and it figures out
 *                        the right multi-step, multi-property animation automatically.
 *
 *  2. REAL PHYSICS    — Spring, gravity, and orbit computed via actual differential
 *                        equations (Euler integration), not cubic-bezier approximations.
 *
 *  3. REACTIVE SIGNALS — Create a signal, set its value anywhere, and bound elements
 *                        update instantly without writing a single animation call.
 *
 *  4. FLUENT SEQUENCER — Declare complex multi-step timelines with a readable chain:
 *                        .add().parallel().stagger().wait().play()
 *
 *  5. MORPH           — Text, numbers, colors, and full CSS state transitions as
 *                        first-class primitives.
 *
 *  6. CHOREOGRAPH     — Groups of elements that *know about each other*, enabling
 *                        wave, converge, and cascade relational animations.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

type Selector = string | HTMLElement | Element

export type Intent =
  | 'celebrate'   // Explosive joy — bounce + color burst
  | 'error'       // Shake + red flash
  | 'success'     // Lift + green pulse
  | 'warn'        // Wobble + amber flash
  | 'attention'   // Ripple rings — "look at me"
  | 'loading'     // Skeleton shimmer loop
  | 'entrance'    // Staggered fade/slide in
  | 'exit'        // Staggered fade/slide out

export type Direction = 'up' | 'down' | 'left' | 'right'
export type Axis      = 'x' | 'y'

export interface SpringConfig {
  stiffness?: number   // k — how quickly it snaps back (default 120)
  damping?:   number   // c — resistance / oscillation (default 14)
  mass?:      number   // m — inertia (default 1)
  precision?: number   // stop threshold in pixels (default 0.5)
}

export interface GravityConfig {
  g?:     number   // acceleration px/s² (default 980, ≈ real gravity)
  bounce?: number  // restitution 0–1; 0 = no bounce, 1 = perfect (default 0.6)
  floor?:  number  // Y coordinate of floor in viewport px (default innerHeight)
}

export interface OrbitConfig {
  cx?:        number   // center X in viewport px (default window center)
  cy?:        number   // center Y in viewport px (default window center)
  radius:     number
  speed?:     number   // revolutions per second (default 0.4)
  startAngle?: number  // radians (default 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// AnimXSignal — Reactive value that drives any animation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A signal is a clamped [0, 1] reactive number. Set its value from anywhere
 * (scroll handler, WebSocket, user input, timer) and all bound animations
 * update instantly with no boilerplate.
 *
 * @example
 * const progress = AnimX.signal()
 * progress.fromScroll('#section')
 * AnimX.sync(progress).bind('#title', { opacity: [0, 1], y: [40, 0] })
 */
export class AnimXSignal {
  private _value = 0
  private _listeners: Set<(v: number) => void> = new Set()

  constructor(initial = 0) {
    this._value = Math.max(0, Math.min(1, initial))
  }

  get value(): number { return this._value }
  set value(v: number) {
    this._value = Math.max(0, Math.min(1, v))
    this._listeners.forEach(fn => fn(this._value))
  }

  subscribe(fn: (v: number) => void): () => void {
    this._listeners.add(fn)
    return () => this._listeners.delete(fn)
  }

  /** Auto-bind to scroll progress of an element entering/leaving the viewport */
  fromScroll(trigger?: string | HTMLElement): this {
    const getProgress = () => {
      const el: Element | null = trigger
        ? (typeof trigger === 'string' ? document.querySelector(trigger) : trigger)
        : document.documentElement
      if (!el) return
      const rect = el.getBoundingClientRect()
      const raw = 1 - (rect.top + rect.height * 0.3) / (window.innerHeight * 0.7 + rect.height * 0.3)
      this.value = Math.max(0, Math.min(1, raw))
    }
    window.addEventListener('scroll', getProgress, { passive: true })
    return this
  }

  /** Auto-bind to horizontal or vertical mouse position */
  fromMouse(axis: 'x' | 'y' = 'x'): this {
    const onMove = (e: MouseEvent) => {
      this.value = axis === 'x' ? e.clientX / window.innerWidth : e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return this
  }

  /** Auto-bind to a setInterval ticker that counts from 0→1 over `duration` ms */
  fromTimer(duration: number, loop = true): this {
    const start = Date.now()
    const tick  = () => {
      const elapsed = (Date.now() - start) % (loop ? duration : Infinity)
      this.value = Math.min(elapsed / duration, 1)
      if (this._value < 1 || loop) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return this
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AnimXSequence — Fluent declarative timeline builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A more ergonomic GSAP timeline with a readable, chainable API.
 * No need to think about raw position strings or label management.
 *
 * @example
 * AnimX.sequence()
 *   .from('#hero',     { y: 60, opacity: 0 }, 0.5)
 *   .wait(0.1)
 *   .parallel(['#btn-a', '#btn-b'], { scale: 0, opacity: 0 }, 0.4)
 *   .stagger('.card',  { y: 40, opacity: 0 }, 0.08)
 *   .play()
 */
export class AnimXSequence {
  readonly tl: gsap.core.Timeline
  private cursor = 0

  constructor(defaults?: gsap.TimelineVars) {
    this.tl = gsap.timeline({ paused: true, ...defaults })
  }

  /** Animate TO target from current state */
  add(selector: Selector | Selector[], vars: gsap.TweenVars, duration = 0.5): this {
    this.tl.to(this._resolve(selector) as any, { ...vars, duration }, this.cursor)
    this.cursor = this.tl.duration()
    return this
  }

  /** Animate FROM a state into current state */
  from(selector: Selector | Selector[], vars: gsap.TweenVars, duration = 0.5): this {
    this.tl.from(this._resolve(selector) as any, { ...vars, duration }, this.cursor)
    this.cursor = this.tl.duration()
    return this
  }

  /** Run multiple selectors simultaneously at the current cursor */
  parallel(selectors: (Selector | Selector[])[], vars: gsap.TweenVars, duration = 0.5): this {
    const pos = this.cursor
    selectors.forEach(s => this.tl.to(this._resolve(s) as any, { ...vars, duration }, pos))
    this.cursor = this.tl.duration()
    return this
  }

  /** Stagger a group of elements */
  stagger(selector: string | Selector[], vars: gsap.TweenVars, staggerAmount = 0.1, duration = 0.5): this {
    const els = typeof selector === 'string'
      ? Array.from(document.querySelectorAll(selector))
      : selector.map(s => this._resolveOne(s))
    this.tl.from(els, { ...vars, duration, stagger: staggerAmount }, this.cursor)
    this.cursor = this.tl.duration()
    return this
  }

  /** Insert a gap between steps */
  wait(seconds: number): this {
    this.cursor += seconds
    return this
  }

  /** Rewind cursor to an absolute time position */
  at(t: number): this {
    this.cursor = t
    return this
  }

  /** Nest another AnimXSequence inline */
  nest(seq: AnimXSequence): this {
    this.tl.add(seq.tl, this.cursor)
    this.cursor = this.tl.duration()
    return this
  }

  play()          { return this.tl.play() }
  pause()         { return this.tl.pause() }
  reverse()       { return this.tl.reverse() }
  restart()       { return this.tl.restart() }
  seek(t: number) { return this.tl.seek(t) }

  private _resolveOne(s: Selector): Element {
    if (typeof s === 'string') return document.querySelector(s) ?? document.createElement('div')
    return s
  }
  private _resolve(s: Selector | Selector[]): Element | Element[] {
    if (Array.isArray(s)) return s.map(x => this._resolveOne(x))
    return this._resolveOne(s)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PhysicsRunner — Real differential-equation based physics
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs actual spring-mass-damper and Newtonian gravity loops using
 * requestAnimationFrame, not GSAP easing curves.
 *
 * @example
 * AnimX.physics('#ball').spring({ stiffness: 200, damping: 10 }).to({ x: 300 }).play()
 * AnimX.physics('#ball').gravity({ g: 600, bounce: 0.7 }).drop()
 * AnimX.physics('#icon').orbit({ radius: 80, speed: 0.6 }).stop() // returns stopper
 */
class PhysicsRunner {
  private el: HTMLElement
  private rafId: number | null = null

  constructor(el: HTMLElement) { this.el = el }

  spring(cfg: SpringConfig = {}) {
    const { stiffness = 120, damping = 14, mass = 1, precision = 0.5 } = cfg
    return {
      to: (target: { x?: number; y?: number; scale?: number }) => ({
        play: () => {
          let curX = (gsap.getProperty(this.el, 'x') as number) || 0
          let curY = (gsap.getProperty(this.el, 'y') as number) || 0
          let vx = 0, vy = 0
          const tx = target.x ?? curX
          const ty = target.y ?? curY

          const tick = () => {
            const dt = (1 / 60) * AnimXEngine.globalTimeScale
            if (AnimXEngine.globalTimeScale !== 0) {
              const ax = (-stiffness * (curX - tx) - damping * vx) / mass
              const ay = (-stiffness * (curY - ty) - damping * vy) / mass
              vx += ax * dt;  vy += ay * dt
              curX += vx * dt; curY += vy * dt
            }

            gsap.set(this.el, { x: curX, y: curY })

            const settled = Math.abs(curX - tx) < precision
              && Math.abs(curY - ty) < precision
              && Math.abs(vx) < precision
              && Math.abs(vy) < precision

            if (settled) {
              gsap.set(this.el, { x: tx, y: ty })
              if (this.rafId) cancelAnimationFrame(this.rafId)
              return
            }
            this.rafId = requestAnimationFrame(tick)
          }
          this.rafId = requestAnimationFrame(tick)
        }
      })
    }
  }

  gravity(cfg: GravityConfig = {}) {
    const { g = 980, bounce = 0.6, floor } = cfg
    return {
      drop: () => {
        const rect       = this.el.getBoundingClientRect()
        const floorY     = (floor ?? window.innerHeight) - rect.bottom
        let   y          = 0
        let   vy         = 0
        const MIN_BOUNCE = 20 // px/s — stop bouncing below this

        const tick = () => {
          const dt = (1 / 60) * AnimXEngine.globalTimeScale
          if (AnimXEngine.globalTimeScale !== 0) {
            vy += g * dt
            y  += vy * dt
          }

          if (y >= floorY) {
            y  = floorY
            vy = -vy * bounce
            if (Math.abs(vy) < MIN_BOUNCE) {
              gsap.set(this.el, { y })
              if (this.rafId) cancelAnimationFrame(this.rafId)
              return
            }
          }
          gsap.set(this.el, { y })
          this.rafId = requestAnimationFrame(tick)
        }
        this.rafId = requestAnimationFrame(tick)
      }
    }
  }

  orbit(cfg: OrbitConfig) {
    const {
      cx         = window.innerWidth  / 2,
      cy         = window.innerHeight / 2,
      radius,
      speed      = 0.4,
      startAngle = 0,
    } = cfg

    const rect    = this.el.getBoundingClientRect()
    const originX = rect.left + rect.width  / 2
    const originY = rect.top  + rect.height / 2
    let   angle   = startAngle
    let   running = true

    const tick = () => {
      if (!running) return
      angle += speed * (Math.PI * 2) / 60 * AnimXEngine.globalTimeScale
      const x = cx - originX + Math.cos(angle) * radius
      const y = cy - originY + Math.sin(angle) * radius
      gsap.set(this.el, { x, y })
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)

    return { stop: () => { running = false; if (this.rafId) cancelAnimationFrame(this.rafId) } }
  }

  stop() { if (this.rafId) cancelAnimationFrame(this.rafId) }
}

// ─────────────────────────────────────────────────────────────────────────────
// ChoreographRunner — Relational multi-element animations
// ─────────────────────────────────────────────────────────────────────────────

class ChoreographRunner {
  private els: HTMLElement[]
  private rafId: number | null = null

  constructor(els: HTMLElement[]) { this.els = els }

  /** Sinusoidal wave that ripples through all elements */
  wave(amplitude = 24, frequency = 0.7) {
    let t = 0
    const tick = () => {
      t += 0.03 * AnimXEngine.globalTimeScale
      this.els.forEach((el, i) => {
        const phase = (i / this.els.length) * Math.PI * 2
        const y     = Math.sin(t * frequency * Math.PI * 2 + phase) * amplitude
        gsap.set(el, { y })
      })
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
    return { stop: () => { if (this.rafId) cancelAnimationFrame(this.rafId) } }
  }

  /** Elements gravitationally converge toward a shared target point */
  converge(target: { x: number; y: number }, strength = 0.06) {
    const states = this.els.map(el => {
      const r = el.getBoundingClientRect()
      return { x: 0, y: 0, vx: 0, vy: 0, ox: r.left + r.width / 2, oy: r.top + r.height / 2 }
    })

    const tick = () => {
      states.forEach((s, i) => {
        if (AnimXEngine.globalTimeScale !== 0) {
          const dx = target.x - (s.ox + s.x)
          const dy = target.y - (s.oy + s.y)
          s.vx += dx * strength * AnimXEngine.globalTimeScale
          s.vy += dy * strength * AnimXEngine.globalTimeScale
          s.vx *= 0.85    // dampen
          s.vy *= 0.85
          s.x  += s.vx
          s.y  += s.vy
        }
        gsap.set(this.els[i], { x: s.x, y: s.y })
      })
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
    return { stop: () => { if (this.rafId) cancelAnimationFrame(this.rafId) } }
  }

  /** Staggered cascade — like dominoes falling */
  cascade(vars: gsap.TweenVars, staggerDelay = 0.12) {
    return {
      play: () => gsap.from(this.els, { ...vars, stagger: staggerDelay, ease: 'back.out(1.5)', duration: 0.6 })
    }
  }

  stop() { if (this.rafId) cancelAnimationFrame(this.rafId) }
}

// ─────────────────────────────────────────────────────────────────────────────
// GOD MODE CAPABILITIES (Time, Particles, Spatial, Generative)
// ─────────────────────────────────────────────────────────────────────────────

export class AnimXTimeController {
  slowMotion(scale = 0.2) {
    AnimXEngine.globalTimeScale = scale
    gsap.globalTimeline.timeScale(scale)
    return this
  }
  fastForward(scale = 2) {
    AnimXEngine.globalTimeScale = scale
    gsap.globalTimeline.timeScale(scale)
    return this
  }
  reverse() {
    // Note: Reverse on physics isn't purely symmetrical, but we invert velocities/time vectors.
    AnimXEngine.globalTimeScale = -1
    gsap.globalTimeline.reverse()
    return this
  }
  normal() {
    AnimXEngine.globalTimeScale = 1
    gsap.globalTimeline.timeScale(1).play()
    return this
  }
  pause() {
    AnimXEngine.globalTimeScale = 0
    gsap.globalTimeline.pause()
    return this
  }
}

export class AnimXParticleSystem {
  constructor(private selector: string | HTMLElement) {}

  /** Shatter an element into a particle physics burst */
  explode(options: { count?: number; spread?: number; color?: string } = {}) {
    const el = AnimXEngine.getInstance()._getElObj(this.selector)
    if (!el) return this

    const { count = 30, spread = 150, color } = options
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    gsap.set(el, { opacity: 0 }) // hide original

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div')
        p.style.position = 'fixed'
        p.style.left = `${cx}px`
        p.style.top = `${cy}px`
        p.style.width = `${Math.random() * 8 + 4}px`
        p.style.height = p.style.width
        p.style.backgroundColor = color || window.getComputedStyle(el).backgroundColor || '#ff477e'
        p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
        p.style.pointerEvents = 'none'
        p.style.zIndex = '9999'
        document.body.appendChild(p)

        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * spread
        
        gsap.to(p, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance + (Math.random() * 100), // pseudo gravity
            rotation: Math.random() * 360,
            opacity: 0,
            duration: Math.random() * 0.8 + 0.6,
            ease: "circ.out",
            onComplete: () => p.remove()
        })
    }
    return this
  }

  /** Blanket the screen in falling particles associated with this element's context */
  rain(options: { count?: number, color?: string } = {}) {
    const { count = 50, color = '#00f5ff' } = options
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div')
      p.style.position = 'fixed'
      p.style.left = `${Math.random() * window.innerWidth}px`
      p.style.top = `-20px`
      p.style.width = `4px`
      p.style.height = `${Math.random() * 15 + 5}px`
      p.style.backgroundColor = color
      p.style.borderRadius = '2px'
      p.style.pointerEvents = 'none'
      p.style.zIndex = '9999'
      document.body.appendChild(p)

      gsap.to(p, {
          y: window.innerHeight + 50,
          opacity: 0,
          duration: Math.random() * 1 + 0.5,
          delay: Math.random() * 2,
          ease: "power1.in",
          onComplete: () => p.remove()
      })
    }
    return this
  }
}

export class AnimXSpatialEngine {
  constructor(private selector: string | HTMLElement) {}

  /** Extrude a flat element into layered 3D depth */
  depth(layers = 10) {
      const el = AnimXEngine.getInstance()._getElObj(this.selector)
      if (!el) return this
      
      el.style.transformStyle = 'preserve-3d'
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
      
      for(let i = 1; i <= layers; i++) {
         const clone = el.cloneNode(true) as HTMLElement
         clone.style.position = 'absolute'
         clone.style.left = '0'
         clone.style.top = '0'
         clone.style.transform = `translateZ(${-i}px)`
         clone.style.opacity = `${1 - (i / layers) * 0.6}`
         clone.style.pointerEvents = 'none'
         clone.removeAttribute('id')
         el.appendChild(clone)
      }
      return this
  }

  /** Automatically tilt element based on mouse perspective */
  trackMousePerspective() {
      const el = AnimXEngine.getInstance()._getElObj(this.selector)
      if (!el) return this

      el.style.transformStyle = 'preserve-3d'
      const parent = el.parentElement
      if (parent) gsap.set(parent, { perspective: 1000 })
      
      window.addEventListener('mousemove', (e) => {
         const x = (e.clientX / window.innerWidth - 0.5) * 40
         const y = (e.clientY / window.innerHeight - 0.5) * -40
         gsap.to(el, { rotationY: x, rotationX: y, ease: 'power2.out', duration: 0.5 })
      })
      return this
  }
}

export class AnimXGenerativeSystem {
   constructor(private selector: string | HTMLElement) {}

   /** Moves the element organically in a bounded area */
   wander(options: { speed?: number, bounds?: number } = {}) {
       const el = AnimXEngine.getInstance()._getElObj(this.selector)
       if (!el) return this

       const { speed = 1, bounds = 50 } = options
       let tx = Math.random() * 1000
       let ty = Math.random() * 1000
       
       const tick = () => {
           if (AnimXEngine.globalTimeScale !== 0) {
               const x = Math.sin(tx) * Math.cos(tx * 0.5) * bounds
               const y = Math.cos(ty) * Math.sin(ty * 0.5) * bounds
               
               gsap.set(el, { x, y })
               
               // Move through time
               tx += 0.02 * speed * AnimXEngine.globalTimeScale
               ty += 0.02 * speed * AnimXEngine.globalTimeScale
           }
           requestAnimationFrame(tick)
       }
       requestAnimationFrame(tick)
       return this
   }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRACTICAL UX CAPABILITIES (Scroll, Magnetic, FLIP layout, Typography)
// ─────────────────────────────────────────────────────────────────────────────

export class AnimXScrollEngine {
  constructor(private selector: string | HTMLElement) {}

  /** Automatically reveal elements when they scroll into the viewport */
  reveal(options: { distance?: number, direction?: Direction, duration?: number, stagger?: number } = {}) {
    const el = AnimXEngine.getInstance()._getElObj(this.selector)
    if (!el) return this

    const { distance = 50, direction = 'up', duration = 0.8, stagger = 0.1 } = options
    const p = AnimXEngine.getInstance().slideProps(direction, distance) || { from: { y: distance }, to: { y: 0 }}
    
    gsap.fromTo(el, 
      { ...p.from, opacity: 0 }, 
      { ...p.to, opacity: 1, duration, stagger, ease: 'power2.out', scrollTrigger: { trigger: el, start: "top 85%" } }
    )
    return this
  }

  /** Tie arbitrary GSAP properties directly to the scrollbar position */
  scrub(vars: gsap.TweenVars) {
    const el = AnimXEngine.getInstance()._getElObj(this.selector)
    if (!el) return this

    gsap.to(el, { ...vars, scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 10%", scrub: 1 } })
    return this
  }

  /** Smooth background parallax effect on scroll */
  parallax(speed = 0.5) {
     const el = AnimXEngine.getInstance()._getElObj(this.selector)
     if (!el) return this

     gsap.fromTo(el, 
        { y: -100 * speed },
        {
          y: 100 * speed,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
        }
     )
     return this
  }
}

export class AnimXMagneticEngine {
  constructor(private selector: string | HTMLElement) {}
  
  /** Attract an element towards the mouse cursor on hover (premium micro-interaction) */
  interact(power = 40) {
    const el = AnimXEngine.getInstance()._getElObj(this.selector)
    if (!el) return this
    
    const onMove = (e: MouseEvent) => {
       const rect = el.getBoundingClientRect()
       const hx = rect.left + rect.width / 2
       const hy = rect.top + rect.height / 2
       const dx = (e.clientX - hx) / (rect.width / 2)
       const dy = (e.clientY - hy) / (rect.height / 2)
       gsap.to(el, { x: dx * power, y: dy * power, duration: 0.4, ease: "power2.out", overwrite: "auto" })
    }
    
    const onLeave = () => {
       gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)", overwrite: "auto" })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    
    return {
      destroy: () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    }
  }
}

export class AnimXLayoutEngine {
  constructor(private selector: string | HTMLElement) {}
  
  /** Execute the FLIP (First, Last, Invert, Play) sequence to animate arbitrary DOM hierarchy changes gracefully */
  flip(stateChangeFunc: () => void) {
    const root = AnimXEngine.getInstance()._getElObj(this.selector)
    if (!root) return this
    
    // First
    const children = Array.from(root.children) as HTMLElement[]
    const firstRects = new Map<HTMLElement, DOMRect>()
    children.forEach(c => firstRects.set(c, c.getBoundingClientRect()))
    
    // Apply state change synchronously
    stateChangeFunc()
    
    // Allow DOM to update layout, then read Last and animate
    requestAnimationFrame(() => {
      // Last & Invert & Play
      children.forEach(c => {
        const first = firstRects.get(c)
        if (!first) return
        const last = c.getBoundingClientRect()
        
        const dx = first.left - last.left
        const dy = first.top - last.top
        const dw = first.width / last.width
        const dh = first.height / last.height
        
        if (dx || dy || dw !== 1 || dh !== 1) {
           // Invert
           gsap.set(c, { x: dx, y: dy, scaleX: dw, scaleY: dh, transformOrigin: "top left" })
           // Play
           gsap.to(c, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: "power3.inOut" })
        }
      })
    })
    
    return this
  }
}

export class AnimXTypographyEngine {
  constructor(private selector: string | HTMLElement) {}
  
  /** Retro typewriter text decoding */
  typewriter(text: string, speed = 50) {
     const el = AnimXEngine.getInstance()._getElObj(this.selector)
     if (!el) return this
     
     el.textContent = ""
     let i = 0
     const tick = () => {
        if (i < text.length) {
            el.textContent += text.charAt(i)
            i++
            setTimeout(tick, speed)
        }
     }
     tick()
     return this
  }

  /** Hacker-style deciphering scramble */
  scramble(text: string, duration = 1.5) {
     const el = AnimXEngine.getInstance()._getElObj(this.selector)
     if (!el) return this
     
     const chars = "!<>-_\\\\/[]{}=+*^?#"
     let frame = 0
     const totalFrames = (duration * 60)
     
     const tick = () => {
        let output = ""
        const progress = frame / totalFrames
        
        for (let i = 0; i < text.length; i++) {
           if (i < text.length * progress) {
               output += text[i]
           } else {
               output += chars[Math.floor(Math.random() * chars.length)]
           }
        }
        el.textContent = output
        
        if (frame < totalFrames) {
            frame++
            requestAnimationFrame(tick)
        } else {
            el.textContent = text
        }
     }
     requestAnimationFrame(tick)
     return this
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AnimXEngine — The unified, intent-driven animation API
// ─────────────────────────────────────────────────────────────────────────────

export class AnimXEngine {
  static globalTimeScale = 1
  private static instance: AnimXEngine

  private defaultDuration = 1
  private defaultEase     = 'power2.out'

  constructor() {
    AnimXEngine.instance = this
  }

  static getInstance() {
    if (!AnimXEngine.instance) AnimXEngine.instance = new AnimXEngine()
    return AnimXEngine.instance
  }

  _getElObj(selector: string | HTMLElement): HTMLElement | null {
    if (typeof selector === 'string') {
      return document.querySelector(selector) as HTMLElement
    }
    return selector as HTMLElement
  }

  // ── GOD MODE API ─────────────────────────────────────────────────────────

  /** Global time dilation controller (Bullet time, Reverse, Fast Forward) */
  time() {
    return new AnimXTimeController()
  }

  /** DOM native particle physics engine */
  particles(selector: string | HTMLElement) {
    return new AnimXParticleSystem(selector)
  }

  /** 3D Spatial Z-Space Engine */
  spatial(selector: string | HTMLElement) {
    return new AnimXSpatialEngine(selector)
  }

  /** Generative motion engine (Procedural noise paths) */
  generative(selector: string | HTMLElement) {
    return new AnimXGenerativeSystem(selector)
  }

  // ── PRACTICAL UX API ───────────────────────────────────────────────────────

  /** Scroll-driven storytelling engine (Reveal, Scrub, Parallax) */
  scroll(selector: string | HTMLElement) {
    return new AnimXScrollEngine(selector)
  }

  /** Premium UX micro-interactions (Magnetic cursors) */
  magnetic(selector: string | HTMLElement) {
    return new AnimXMagneticEngine(selector)
  }

  /** DOM Morphing/Sorting (FLIP algorithm) engine */
  layout(selector: string | HTMLElement) {
    return new AnimXLayoutEngine(selector)
  }

  /** Advanced string typography manipulation */
  text(selector: string | HTMLElement) {
    return new AnimXTypographyEngine(selector)
  }

  // ── Backward-compatible primitives ──────────────────────────────────────

  fade(selector: string | HTMLElement) {
    const element = this.getElement(selector)
    return {
      in: (duration = this.defaultDuration, options = {}) => ({
        play: () => gsap.to(element, { opacity: 1, duration, ease: this.defaultEase, ...options }),
        withSlide: (direction: Direction, distance = 50) => ({
          play: () => {
            const p = this.slideProps(direction, distance)
            return gsap.fromTo(element, { opacity: 0, ...p.from }, { opacity: 1, ...p.to, duration, ease: this.defaultEase, ...options })
          }
        })
      }),
      out: (duration = this.defaultDuration, options = {}) => ({
        play: () => gsap.to(element, { opacity: 0, duration, ease: this.defaultEase, ...options })
      })
    }
  }

  slide(selector: string | HTMLElement) {
    const element = this.getElement(selector)
    return {
      in:  (direction: Direction, distance = 100, duration = this.defaultDuration) => ({
        play: () => {
          const p = this.slideProps(direction, distance)
          return gsap.fromTo(element, { ...p.from, opacity: 0 }, { ...p.to, opacity: 1, duration, ease: this.defaultEase })
        }
      }),
      out: (direction: Direction, distance = 100, duration = this.defaultDuration) => ({
        play: () => {
          const p = this.slideProps(direction, distance)
          return gsap.to(element, { ...p.from, opacity: 0, duration, ease: this.defaultEase })
        }
      }),
    }
  }

  scale(selector: string | HTMLElement) {
    const element = this.getElement(selector)
    return {
      in:    (duration = this.defaultDuration) => ({
        play: () => gsap.fromTo(element, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration, ease: 'back.out(1.7)' })
      }),
      out:   (duration = this.defaultDuration) => ({
        play: () => gsap.to(element, { scale: 0, opacity: 0, duration, ease: 'back.in(1.7)' })
      }),
      pulse: (amount = 1.1, duration = 0.3) => ({
        play: () => gsap.to(element, { scale: amount, duration, ease: 'power1.inOut', yoyo: true, repeat: 1 })
      }),
    }
  }

  rotate(selector: string | HTMLElement) {
    const element = this.getElement(selector)
    return {
      continuous: (duration = 2, direction: 'clockwise' | 'counterclockwise' = 'clockwise') => ({
        play: () => gsap.to(element, { rotation: direction === 'clockwise' ? 360 : -360, duration, ease: 'none', repeat: -1 })
      }),
      flip: (axis: Axis = 'y', duration = 0.6) => ({
        play: () => gsap.to(element, {
          rotationY: axis === 'y' ? 180 : 0,
          rotationX: axis === 'x' ? 180 : 0,
          duration, ease: 'power2.inOut'
        })
      }),
    }
  }

  stagger(selector: string, fromVars = {}, options = {}) {
    return {
      play: () => gsap.from(selector, {
        ...fromVars, stagger: 0.1, duration: this.defaultDuration, ease: this.defaultEase, ...options
      })
    }
  }

  timeline(options = {}) {
    return gsap.timeline(options)
  }

  onScroll(selector: string | HTMLElement) {
    const element = this.getElement(selector)
    return {
      fadeIn: () => ({
        play: (options = {}) => gsap.fromTo(element,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, scrollTrigger: { trigger: element, start: 'top 80%', toggleActions: 'play none none reverse', ...options } }
        )
      }),
      pin: () => ({
        play: (options = {}) => gsap.to(element, {
          scrollTrigger: { trigger: element, pin: true, start: 'top top', end: '+=500', ...options }
        })
      }),
    }
  }

  hover(selector: string | HTMLElement) {
    const element = this.getElement(selector) as HTMLElement
    return {
      lift:  (distance = 10) => {
        element.addEventListener('mouseenter', () => gsap.to(element, { y: -distance, duration: 0.3, ease: 'power2.out' }))
        element.addEventListener('mouseleave', () => gsap.to(element, { y: 0,          duration: 0.3, ease: 'power2.out' }))
      },
      scale: (amount = 1.05) => {
        element.addEventListener('mouseenter', () => gsap.to(element, { scale: amount, duration: 0.3, ease: 'power2.out' }))
        element.addEventListener('mouseleave', () => gsap.to(element, { scale: 1,      duration: 0.3, ease: 'power2.out' }))
      },
    }
  }

  // ── NEW: Intent System ───────────────────────────────────────────────────
  /**
   * Express *what feeling* you want to create.
   * AnimX composes the right multi-step, multi-property animation automatically.
   *
   * "You tell it the story. It figures out the choreography."
   *
   * @example
   * AnimX.intent('celebrate', '#submit-btn').play()
   * AnimX.intent('error',     formEl).play()
   */
  intent(mood: Intent, selector: string | HTMLElement | HTMLElement[]) {
    const elements: HTMLElement[] = Array.isArray(selector)
      ? selector
      : [this.getElement(selector) as HTMLElement]

    const inject = (el: HTMLElement, css: string, remove = true) => {
      const div      = document.createElement('div')
      div.style.cssText = css
      el.style.position = el.style.position || 'relative'
      el.appendChild(div)
      if (remove) return div
      return div
    }

    const plays: Record<Intent, () => void> = {

      // 🎉 Celebrate — springy bounce + golden burst + ripple ring
      celebrate: () => {
        elements.forEach(el => {
          const tl = gsap.timeline()
          tl.to(el,   { scale: 1.35, duration: 0.18, ease: 'back.out(3)' })
          tl.to(el,   { scale: 0.9,  duration: 0.10 })
          tl.to(el,   { scale: 1.15, duration: 0.14, ease: 'power2.out' })
          tl.to(el,   { scale: 1,    duration: 0.4,  ease: 'elastic.out(1.2, 0.4)' })

          const burst = inject(el,
            'position:absolute;inset:-6px;border-radius:inherit;pointer-events:none;z-index:9999;' +
            'background:radial-gradient(circle,rgba(255,215,0,0.7),rgba(255,100,0,0.3),transparent 70%);'
          )
          gsap.fromTo(burst,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1.5, duration: 0.4, ease: 'power2.out',
              onComplete() { gsap.to(burst, { opacity: 0, scale: 2.2, duration: 0.35, ease: 'power2.in', onComplete() { burst.remove() } }) } }
          )

          const ring = inject(el,
            'position:absolute;inset:-4px;border-radius:inherit;pointer-events:none;z-index:9998;' +
            'border:2.5px solid rgba(255,215,0,0.8);'
          )
          gsap.fromTo(ring,
            { scale: 1, opacity: 0.9 },
            { scale: 2, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ring.remove() }
          )
        })
      },

      // ❌ Error — tight horizontal shake + crimson flash
      error: () => {
        elements.forEach(el => {
          gsap.timeline()
            .to(el, { x: -10, duration: 0.055 })
            .to(el, { x:  10, duration: 0.055 })
            .to(el, { x:  -8, duration: 0.055 })
            .to(el, { x:   8, duration: 0.055 })
            .to(el, { x:  -4, duration: 0.055 })
            .to(el, { x:   0, duration: 0.06  })

          const flash = inject(el,
            'position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:9999;' +
            'background:rgba(255,56,56,0.4);'
          )
          gsap.fromTo(flash,
            { opacity: 0 },
            { opacity: 1, duration: 0.12, yoyo: true, repeat: 3, ease: 'none', onComplete: () => flash.remove() }
          )
        })
      },

      // ✅ Success — upward lift + spring settle + green glow ring
      success: () => {
        elements.forEach(el => {
          gsap.timeline()
            .fromTo(el, { y: 10, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.28, ease: 'back.out(2.5)' })
            .to(el,     { scale: 1.06, duration: 0.14 }, '-=0.05')
            .to(el,     { scale: 1,    duration: 0.35, ease: 'elastic.out(1, 0.5)' })

          const glow = inject(el,
            'position:absolute;inset:-3px;border-radius:inherit;pointer-events:none;z-index:9998;' +
            'box-shadow:0 0 0 2px rgba(0,220,100,0.8),0 0 24px 4px rgba(0,220,100,0.4);'
          )
          gsap.fromTo(glow,
            { opacity: 0 },
            { opacity: 1, duration: 0.28, yoyo: true, repeat: 1, ease: 'none', onComplete: () => glow.remove() }
          )
        })
      },

      // ⚠️ Warn — rotational wobble + amber pulse
      warn: () => {
        elements.forEach(el => {
          gsap.timeline()
            .to(el, { rotation: -5, duration: 0.09 })
            .to(el, { rotation:  5, duration: 0.09 })
            .to(el, { rotation: -3, duration: 0.09 })
            .to(el, { rotation:  3, duration: 0.09 })
            .to(el, { rotation:  0, duration: 0.2, ease: 'elastic.out(1, 0.5)' })

          const flash = inject(el,
            'position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:9999;' +
            'background:rgba(255,180,0,0.3);'
          )
          gsap.fromTo(flash,
            { opacity: 0 },
            { opacity: 1, duration: 0.18, yoyo: true, repeat: 2, ease: 'none', onComplete: () => flash.remove() }
          )
        })
      },

      // 👁 Attention — concentric ripple rings + gentle scale pulse
      attention: () => {
        elements.forEach(el => {
          gsap.fromTo(el, { scale: 1 }, { scale: 1.07, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 3 })

          for (let i = 0; i < 3; i++) {
            const ring = inject(el,
              'position:absolute;inset:-2px;border-radius:inherit;pointer-events:none;z-index:9998;' +
              'border:2px solid rgba(0,195,255,0.7);'
            )
            gsap.fromTo(ring,
              { scale: 1, opacity: 0.8 },
              { scale: 2, opacity: 0, duration: 1, delay: i * 0.3, ease: 'power2.out', onComplete: () => ring.remove() }
            )
          }
        })
      },

      // ⏳ Loading — elegant skeleton shimmer (looping, call .stop() to end)
      loading: () => {
        elements.forEach(el => {
          const shimmer = inject(el,
            'position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:9998;overflow:hidden;'
          )
          const bar = document.createElement('div')
          bar.style.cssText =
            'position:absolute;top:0;left:-100%;width:60%;height:100%;' +
            'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);'
          shimmer.appendChild(bar)
          gsap.to(bar, { left: '150%', duration: 1.4, ease: 'none', repeat: -1 })
        })
      },

      // ✨ Entrance — staggered fade + slide in
      entrance: () => {
        elements.forEach((el, i) => {
          gsap.fromTo(el,
            { y: 44, opacity: 0, scale: 0.96 },
            { y: 0,  opacity: 1, scale: 1, duration: 0.55, delay: i * 0.08, ease: 'power3.out' }
          )
        })
      },

      // 💨 Exit — staggered fade + slide up
      exit: () => {
        elements.forEach((el, i) => {
          gsap.to(el, { y: -28, opacity: 0, scale: 0.95, duration: 0.38, delay: i * 0.06, ease: 'power2.in' })
        })
      },
    }

    return { play: () => plays[mood]?.() }
  }

  // ── NEW: Physics ─────────────────────────────────────────────────────────
  /**
   * Run real spring-mass-damper or Newtonian gravity computations on an element.
   * These are actual differential equations, not easing-curve approximations.
   *
   * @example
   * AnimX.physics('#card').spring({ stiffness: 200, damping: 10 }).to({ x: 300 }).play()
   * AnimX.physics('#coin').gravity({ bounce: 0.75 }).drop()
   * const orb = AnimX.physics('#dot').orbit({ radius: 80 })
   * orb.stop()
   */
  physics(selector: string | HTMLElement) {
    return new PhysicsRunner(this.getElement(selector) as HTMLElement)
  }

  // ── NEW: Reactive Signals ────────────────────────────────────────────────
  /**
   * Create a reactive [0, 1] signal.
   * Bind it to scroll, mouse, a timer, or set it manually from anywhere.
   * Elements bound via .sync() update instantly with no extra code.
   *
   * @example
   * const sig = AnimX.signal()
   * sig.fromScroll('#hero')
   * AnimX.sync(sig).bind('#text', { opacity: [0, 1], y: [40, 0] })
   */
  signal(initial = 0): AnimXSignal {
    return new AnimXSignal(initial)
  }

  /**
   * Bind a signal to element properties.
   * Each entry in `mapping` is `{ cssProperty: [fromValue, toValue] }`.
   * The element interpolates linearly as the signal goes 0 → 1.
   *
   * @example
   * const mouse = AnimX.signal().fromMouse('x')
   * AnimX.sync(mouse).bind('#cursor', { x: [-50, 50], scale: [0.8, 1.2] })
   */
  sync(signal: AnimXSignal) {
    return {
      bind: (selector: string | HTMLElement, mapping: Record<string, [number, number]>) => {
        const el = this.getElement(selector)
        const unsubscribe = signal.subscribe(v => {
          const props: Record<string, number> = {}
          for (const [key, [from, to]] of Object.entries(mapping)) {
            props[key] = from + (to - from) * v
          }
          gsap.set(el, props)
        })
        return { unbind: unsubscribe }
      }
    }
  }

  // ── NEW: Fluent Sequencer ─────────────────────────────────────────────────
  /**
   * Build a complex multi-step timeline declaratively.
   * Chain .from().parallel().stagger().wait() instead of fighting GSAP position strings.
   *
   * @example
   * AnimX.sequence()
   *   .from('#logo',  { scale: 0, opacity: 0 })
   *   .wait(0.15)
   *   .stagger('.nav-item', { y: 20, opacity: 0 })
   *   .parallel(['#btn-a', '#btn-b'], { scale: 0.8, opacity: 0 })
   *   .play()
   */
  sequence(defaults?: gsap.TimelineVars): AnimXSequence {
    return new AnimXSequence(defaults)
  }

  // ── NEW: Morph ────────────────────────────────────────────────────────────
  /**
   * First-class text, number, color, and multi-property state transitions.
   *
   * @example
   * AnimX.morph('#heading').text('Hello', 'Welcome')
   * AnimX.morph('#counter').number(0, 1000, { format: n => `${n.toFixed(0)} users` })
   * AnimX.morph('#badge').color('#ff0000', '#00cc55')
   */
  morph(selector: string | HTMLElement) {
    const el = this.getElement(selector) as HTMLElement
    return {

      /** Cross-fade text content with a slide transition */
      text: (from: string, to: string, opts: { duration?: number; ease?: string } = {}) => ({
        play: () => {
          const { duration = 0.8, ease = 'power2.inOut' } = opts
          el.textContent = from
          const tl = gsap.timeline()
          tl.to(el, { opacity: 0, y: -8, duration: duration * 0.4, ease: 'power2.in', onComplete: () => { el.textContent = to } })
          tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: duration * 0.6, ease })
          return tl
        }
      }),

      /** Count from `from` to `to`, formatting on every frame */
      number: (from: number, to: number, opts: { duration?: number; format?: (n: number) => string } = {}) => ({
        play: () => {
          const { duration = 1.5, format = (n: number) => Math.round(n).toLocaleString() } = opts
          const proxy = { value: from }
          return gsap.to(proxy, {
            value: to, duration, ease: 'power2.out',
            onUpdate: () => { el.textContent = format(proxy.value) },
            onStart:  () => { el.textContent = format(from) },
          })
        }
      }),

      /** Animate a CSS color property from one value to another */
      color: (
        from: string,
        to:   string,
        property: 'color' | 'backgroundColor' | 'borderColor' = 'color',
        opts: { duration?: number } = {}
      ) => ({
        play: () => gsap.fromTo(el, { [property]: from }, { [property]: to, duration: opts.duration ?? 0.5, ease: 'power2.inOut' })
      }),

      /** Animate between any two sets of GSAP-compatible CSS properties */
      between: (fromProps: gsap.TweenVars, toProps: gsap.TweenVars, opts: { duration?: number } = {}) => ({
        play: () => gsap.fromTo(el, fromProps, { ...toProps, duration: opts.duration ?? 0.6, ease: 'power2.inOut' })
      }),
    }
  }

  // ── NEW: Choreograph ─────────────────────────────────────────────────────
  /**
   * Animate a group of elements as a relational unit.
   * Elements "know" about each other and move accordingly.
   *
   * @example
   * AnimX.choreograph(['.dot-a', '.dot-b', '.dot-c'])
   *   .wave(30, 0.8)
   *
   * AnimX.choreograph(document.querySelectorAll('.card'))
   *   .cascade({ y: 60, opacity: 0 }, 0.1)
   *   .play()
   */
  choreograph(selectors: (string | HTMLElement)[] | NodeListOf<Element>) {
    let elements: HTMLElement[]
    if (selectors instanceof NodeList) {
      elements = Array.from(selectors) as HTMLElement[]
    } else {
      elements = (selectors as (string | HTMLElement)[]).map(s => this.getElement(s) as HTMLElement)
    }
    return new ChoreographRunner(elements)
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private getElement(selector: string | HTMLElement): Element | HTMLElement {
    if (typeof selector === 'string') {
      const el = document.querySelector(selector)
      if (!el) { console.warn(`AnimX: element "${selector}" not found`); return document.createElement('div') }
      return el
    }
    return selector
  }

  slideProps(direction: Direction, distance: number) {
    return {
      up:    { from: { y:  distance }, to: { y: 0 } },
      down:  { from: { y: -distance }, to: { y: 0 } },
      left:  { from: { x:  distance }, to: { x: 0 } },
      right: { from: { x: -distance }, to: { x: 0 } },
    }[direction]
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Singleton export
// ─────────────────────────────────────────────────────────────────────────────

const AnimX = AnimXEngine.getInstance()
export default AnimX
