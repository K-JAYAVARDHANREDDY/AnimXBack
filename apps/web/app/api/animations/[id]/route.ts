import { NextRequest, NextResponse } from 'next/server'
import { getAnimationById } from '@/lib/animationsLoader'

/**
 * GET /api/animations/[id]
 * Returns a single animation by its slug ID.
 * Returns 404 if not found.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const animation = await getAnimationById(id)

    if (!animation) {
      return NextResponse.json({ error: 'Animation not found' }, { status: 404 })
    }

    return NextResponse.json(animation, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error('[GET /api/animations/[id]]', err)
    return NextResponse.json({ error: 'Failed to load animation' }, { status: 500 })
  }
}
