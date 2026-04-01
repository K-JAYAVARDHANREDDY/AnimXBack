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
  type: 'range' | 'select' | 'color' | 'toggle';
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

/**
 * Metadata shape — the JSON-serialisable parts of an animation
 * that can be shipped alongside the component in the npm package.
 */
export type AnimationMetadata = Omit<Animation, 'component'>
