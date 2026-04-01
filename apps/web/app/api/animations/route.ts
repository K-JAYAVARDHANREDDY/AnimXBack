import { NextRequest, NextResponse } from 'next/server'
import { getAllAnimations, getAnimationSummaries } from '@/lib/animationsLoader'
import type { AnimationDTO, AnimationSummaryDTO, AnimationCategory, AnimationEngine, DifficultyLevel } from '@/types/animation.types'

/**
 * GET /api/animations
 *
 * Returns slim AnimationSummaryDTO[] by default (no code / controls / animxSyntax).
 * Pass ?full=true to get the complete AnimationDTO[] (e.g. for export).
 *
 * Filter params (all optional, combinable):
 *   engine     – e.g. ?engine=gsap          (repeatable: ?engine=gsap&engine=css)
 *   category   – e.g. ?category=Scroll      (repeatable)
 *   difficulty – e.g. ?difficulty=easy      (repeatable)
 *   tags       – comma-separated            e.g. ?tags=hover,3d
 *   q          – full-text search           e.g. ?q=parallax
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const full = searchParams.get('full') === 'true'

    // Use slim loader by default; full loader only when ?full=true
    let animations: AnimationDTO[] | AnimationSummaryDTO[] = full
      ? await getAllAnimations()
      : await getAnimationSummaries()

    // ── Filters ────────────────────────────────────────────────────────────
    const engines      = searchParams.getAll('engine')     as AnimationEngine[]
    const categories   = searchParams.getAll('category')   as AnimationCategory[]
    const difficulties = searchParams.getAll('difficulty') as DifficultyLevel[]
    const tagsParam    = searchParams.get('tags')
    const q            = searchParams.get('q')

    if (engines.length > 0) {
      animations = animations.filter(a => engines.includes((a as AnimationSummaryDTO).engine))
    }

    if (categories.length > 0) {
      animations = animations.filter(a => categories.includes((a as AnimationSummaryDTO).category))
    }

    if (difficulties.length > 0) {
      animations = animations.filter(a => difficulties.includes((a as AnimationSummaryDTO).difficulty))
    }

    if (tagsParam) {
      const tags = tagsParam.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      animations = animations.filter(a =>
        tags.every(tag => ((a as AnimationSummaryDTO).tags ?? []).map(t => t.toLowerCase()).includes(tag))
      )
    }

    if (q) {
      const lower = q.toLowerCase()
      animations = animations.filter(a => {
        const s = a as AnimationSummaryDTO
        return (
          s.name.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower) ||
          (s.tags ?? []).some(t => t.toLowerCase().includes(lower))
        )
      })
    }

    return NextResponse.json(animations, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err) {
    console.error('[GET /api/animations]', err)
    return NextResponse.json({ error: 'Failed to load animations' }, { status: 500 })
  }
}
