import { ComponentType } from 'react';

export type AnimationEngine = 'gsap' | 'css' | 'three' | 'tailwind' | 'framer';

export type AnimationCategory = 
  | 'Entrance' 
  | 'Exit' 
  | 'Attention' 
  | 'Scroll' 
  | 'Hover' 
  | '3D' 
  | 'Text' 
  | 'Background';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface ControlDefinition {
  key: string;
  label: string;
  type: 'range' | 'select' | 'color' | 'toggle' | 'text' | 'json';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: any;
}

export interface Animation {
  id: string;
  name: string;
  category: AnimationCategory;
  engine: AnimationEngine;
  component: ComponentType<any>;
  defaultProps: Record<string, any>;
  controls?: ControlDefinition[];
  code: string;
  animxSyntax: string;
  description: string;
  tags: string[];
  difficulty: DifficultyLevel;
}

/**
 * Full JSON-serialisable shape returned by the API.
 * Identical to Animation but without the React component.
 */
export type AnimationDTO = Omit<Animation, 'component'>

/**
 * Slim shape used by GET /api/animations (list).
 * Strips heavy fields only needed on the detail page.
 */
export type AnimationSummaryDTO = Pick<
  AnimationDTO,
  'id' | 'name' | 'description' | 'category' | 'engine' | 'difficulty' | 'tags' | 'defaultProps'
>

export interface FetchAnimationParams {
  q?: string
  categories?: AnimationCategory[]
  engines?: AnimationEngine[]
  difficulties?: DifficultyLevel[]
  tags?: string[]
}

export interface AnimationRegistryState {
  /** Slim summary DTOs returned by the list API — what the card grid renders. */
  animations: AnimationSummaryDTO[];
  /** React components for the animations, registered by the animation modules. */
  components: Record<string, ComponentType<any>>;
  categories: AnimationCategory[];
  engines: AnimationEngine[];
  registerAnimation: (animation: Animation) => void;
  fetchAnimations: (params?: FetchAnimationParams) => Promise<void>;
  getAnimationById: (id: string) => AnimationSummaryDTO | undefined;
  getAnimationsByCategory: (category: AnimationCategory) => AnimationSummaryDTO[];
  getAnimationsByEngine: (engine: AnimationEngine) => AnimationSummaryDTO[];
  searchAnimations: (query: string) => AnimationSummaryDTO[];
}