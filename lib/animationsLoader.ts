/**
 * Server-only utility.
 * Fetches data from Azure Cosmos DB.
 * Should only be imported inside Route Handlers (app/api/...) or Server Components.
 */

import { getContainer } from './cosmosClient';
import type { AnimationDTO, AnimationSummaryDTO } from '@/types/animation.types';

/** Return all animations. Results are sorted by name. */
export async function getAllAnimations(): Promise<AnimationDTO[]> {
  try {
    const container = await getContainer();
    const { resources } = await container.items.query<AnimationDTO>("SELECT * from c").fetchAll();
    return resources.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to fetch all animations from Cosmos DB", err);
    return [];
  }
}

/** Return slim summaries for the list API (strips code / controls / animxSyntax). */
export async function getAnimationSummaries(): Promise<AnimationSummaryDTO[]> {
  try {
    const container = await getContainer();
    const querySpec = {
      query: "SELECT c.id, c.name, c.description, c.category, c.engine, c.difficulty, c.tags, c.defaultProps from c"
    };
    const { resources } = await container.items.query<AnimationSummaryDTO>(querySpec).fetchAll();
    return resources.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to fetch animation summaries from Cosmos DB", err);
    return [];
  }
}

/** Return a single animation by ID, or null if not found. */
export async function getAnimationById(id: string): Promise<AnimationDTO | null> {
  try {
    const container = await getContainer();
    // Assuming partition key is '/id'
    const { resource } = await container.item(id, id).read<AnimationDTO>();
    return resource || null;
  } catch (err: any) {
    if (err.code === 404) return null;
    console.error(`Failed to fetch animation by id (${id}) from Cosmos DB`, err);
    return null;
  }
}
