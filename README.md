# AnimX 🚀

Write Once, **Animate** Anywhere.

AnimX is a production-ready Web Animation framework built for extreme scale and developer ergonomics. It bridges the gap between generic component libraries and deep physics simulation engines.

### 📦 Packages

AnimX is structured as a monorepo containing two core packages:
- **`@animx-jaya/core`**: The foundational DOM animation engine powered by GSAP. Handles frame-perfect time dilation, particle physics, spatial depth (God Mode), and FLIP layouts, Scroll Storytelling, and Magnetic cursors (Practical UX).
- **`@animx-jaya/animations`**: A registry of 16 highly polished, React-native components (e.g. ParallaxHero, PaperFoldScroll, NeonGlow, MagneticCursor) that use the core engine out-of-the-box.

---

## ⚡ AnimX Core Engine ("God Mode") APIs

With the `v0.2.0` release, `@animx-jaya/core` introduces physics algorithms rarely found outside of WebGL rendered directly on DOM nodes natively:

#### ⏱️ Global Time Warp
Instantly scale time for every animation on the page natively using GSAP Global Timeline manipulation.
```typescript
AnimX.time().slowMotion(0.1) // 10x slower
AnimX.time().fastForward(4)  // 4x faster
AnimX.time().normal()
```

#### 💥 Native DOM Particles
Shatter any standard HTML Div/Button into physics-driven particles bouncing algorithmically.
```typescript
AnimX.particles('#submit-btn').explode({ count: 40, spread: 200, color: '#00f5ff' })
AnimX.particles(document.body).rain({ count: 200, color: 'blue' })
```

#### 🧊 Spatial 3D Extrusion
Extrude flat 2D elements into layered 3D depth and track gyroscope or mouse perspective inherently.
```typescript
AnimX.spatial('#card')
  .depth(12)
  .trackMousePerspective()
```

#### ✨ Generative Motion
Move elements organically using procedural algorithmic noise rather than A-to-B keyframes.
```typescript
AnimX.generative('.firefly').wander({ speed: 4, bounds: 80 })
```

---

## 🛠️ Practical "Everyday UX" APIs

Remove the boilerplate from daily UI development with pure single-line operations.

#### 📜 Scroll Storytelling
Instantly tie intersection observers and scroll-bound timelines with offset math.
```typescript
// Fade up on Enter
AnimX.scroll('.card').reveal({ distance: 50 })

// Parallax scrolling
AnimX.scroll('.hero-bg').parallax(1.5)
```

#### 🔀 First-Last-Invert-Play (FLIP) Engine
Animate DOM hierarchy changes elegantly. Perfect for React array modifications.
```typescript
AnimX.layout('#grid').flip(() => {
  setItems(shuffledItems) // Synchronous DOM reflow captured automatically
})
```

#### 🧲 Magnetic Cursors
Premium agency micro-interactions mapping Spring physics to pointer boundaries.
```typescript
AnimX.magnetic('#nav-button').interact(50 /* pull strength */)
```

#### 🔐 Advanced Typography Engine
Scripted ASCII loops and terminal typewriter effects over normal strings.
```typescript
AnimX.text('#title').scramble('ACCESS GRANTED', 1.5)
```

---

## 💻 Running the Repository Locally

The project uses TurboRepo and NPM Workspaces.
1. `npm install`
2. Next.js Dashboard: `cd apps/web && npm run dev` (Runs on `http://localhost:3000`)
3. Vite Core Demo: `cd animx-demo && npm run dev`

### Built With:
- React 18, Next.js 14
- GSAP, Framer Motion, Three.js
- Tailwind CSS

© AnimX - Made with ♥ for developers.
