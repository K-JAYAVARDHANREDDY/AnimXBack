import { create } from 'zustand'
import type {
  Animation,
  AnimationSummaryDTO,
  AnimationRegistryState,
  AnimationCategory,
  AnimationEngine,
  FetchAnimationParams,
} from '../types/animation.types'


export const useAnimationRegistry = create<AnimationRegistryState>((set, get) => ({
  animations: [],
  components: {},
  categories: ['Entrance', 'Exit', 'Attention', 'Scroll', 'Hover', '3D', 'Text', 'Background'],
  engines: ['gsap', 'css', 'three', 'tailwind', 'framer'],

  registerAnimation: (animation: Animation) => {
    // Store live components in a separate dictionary, while keeping animations list slim
    set((state) => {
      const exists = state.animations.find((a) => a.id === animation.id)
      if (exists) {
        return { components: { ...state.components, [animation.id]: animation.component } }
      }
      const { id, name, description, category, engine, difficulty, tags, defaultProps } = animation
      return {
        components: { ...state.components, [animation.id]: animation.component },
        animations: [...state.animations, { id, name, description, category, engine, difficulty, tags, defaultProps }],
      }
    })
  },

  /**
   * Fetch animations from the API, passing all active filters as query params.
   * The server does the filtering — the store holds only the current result set.
   */
  fetchAnimations: async (params?: FetchAnimationParams) => {
    try {
      const url = new URL('/api/animations', window.location.origin)

      if (params?.q)            url.searchParams.set('q', params.q)
      if (params?.tags?.length) url.searchParams.set('tags', params.tags.join(','))

      // Repeatable params — one key per value
      params?.engines?.forEach(e  => url.searchParams.append('engine',     e))
      params?.categories?.forEach(c => url.searchParams.append('category',   c))
      params?.difficulties?.forEach(d => url.searchParams.append('difficulty', d))

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const dtos: AnimationSummaryDTO[] = await res.json()

      set({ animations: dtos })
    } catch (err) {
      console.error('[AnimationRegistry] fetchAnimations failed:', err)
    }
  },

  getAnimationById: (id: string) => get().animations.find((a) => a.id === id),

  getAnimationsByCategory: (category: AnimationCategory) =>
    get().animations.filter((a) => a.category === category),

  getAnimationsByEngine: (engine: AnimationEngine) =>
    get().animations.filter((a) => a.engine === engine),

  searchAnimations: (query: string) => {
    const lowerQuery = query.toLowerCase()
    return get().animations.filter((a) =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery) ||
      a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))

export function registerAnimation(animation: Animation) {
  useAnimationRegistry.getState().registerAnimation(animation)
}

