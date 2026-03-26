/**
 * Server-only utility.
 * Fetches data from local JSON files.
 * Should only be imported inside Route Handlers (app/api/...) or Server Components.
 */

import fs from 'fs/promises';
import path from 'path';
import type { AnimationDTO, AnimationSummaryDTO } from '@/types/animation.types';

const dataDirectory = path.join(process.cwd(), 'data/animations');

/** Return all animations. Results are sorted by name. */
export async function getAllAnimations(): Promise<AnimationDTO[]> {
  try {
    const filenames = await fs.readdir(dataDirectory);
    const animations: AnimationDTO[] = [];
    
    for (const filename of filenames) {
      if (!filename.endsWith('.json')) continue;
      const filePath = path.join(dataDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      animations.push(JSON.parse(fileContents));
    }
    
    return animations.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to read animations from disk", err);
    return [];
  }
}

/** Return slim summaries for the list API (strips code / controls / animxSyntax). */
export async function getAnimationSummaries(): Promise<AnimationSummaryDTO[]> {
  try {
    const animations = await getAllAnimations();
    return animations.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      category: a.category,
      engine: a.engine,
      difficulty: a.difficulty,
      tags: a.tags,
      defaultProps: a.defaultProps
    }));
  } catch (err) {
    console.error("Failed to generate animation summaries", err);
    return [];
  }
}

/** Return a single animation by ID, or null if not found. */
export async function getAnimationById(id: string): Promise<AnimationDTO | null> {
  try {
    const filePath = path.join(dataDirectory, `${id}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (err: any) {
    if (err.code === 'ENOENT') return null;
    console.error(`Failed to read animation by id (${id})`, err);
    return null;
  }
}
