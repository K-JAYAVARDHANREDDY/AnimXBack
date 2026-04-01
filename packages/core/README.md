# @animx-jaya/core

> **AnimX** — Unified Animation API. Write Once, Animate Anywhere.

The core engine and type system for the AnimX animation framework. Provides a unified API to manage animations across GSAP, Framer Motion, CSS, and Tailwind.

## Installation

```bash
npm install @animx-jaya/core
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install gsap react
```

## Usage

```tsx
import { AnimX, AnimXEngine } from '@animx-jaya/core'
import type { Animation, AnimationMetadata } from '@animx-jaya/core'

// Create an engine instance
const engine = new AnimXEngine()

// Register and manage animations
engine.register(myAnimation)
const all = engine.getAll()
const filtered = engine.getByCategory('text')
```

## API

### `AnimXEngine`

The main engine class for registering and querying animations.

| Method | Description |
|--------|-------------|
| `register(animation)` | Register an animation with the engine |
| `getAll()` | Get all registered animations |
| `getById(id)` | Get a single animation by its ID |
| `getByCategory(category)` | Filter animations by category |
| `getByEngine(engine)` | Filter animations by engine type |

### Types

| Type | Description |
|------|-------------|
| `Animation` | Full animation object with component and metadata |
| `AnimationDTO` | Data transfer object for API responses |
| `AnimationSummaryDTO` | Lightweight summary for listing |
| `AnimationMetadata` | Metadata including name, description, category, etc. |
| `AnimationEngine` | `'gsap' \| 'framer-motion' \| 'css' \| 'tailwind'` |
| `AnimationCategory` | Category classification for animations |
| `DifficultyLevel` | `'beginner' \| 'intermediate' \| 'advanced'` |

## Related Packages

- [`@animx-jaya/animations`](https://www.npmjs.com/package/@animx-jaya/animations) — Ready-to-use animation components built on `@animx-jaya/core`

## License

MIT © [Jayavardhan Reddy](https://github.com/K-JAYAVARDHANREDDY)
