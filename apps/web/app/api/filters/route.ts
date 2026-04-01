import { NextResponse } from 'next/server'
import { FILTER_SECTIONS } from '@/lib/filterConfig'

// Statically generated — no dynamic data, so Next.js will cache this at build time.
export const dynamic = 'force-static'

/**
 * GET /api/filters
 *
 * Returns the filter taxonomy (categories, engines, difficulties, tags) used
 * by FilterPanel.  Moving this here removes ~3 KB of static config from the
 * client JS bundle.
 */
export async function GET() {
  return NextResponse.json(FILTER_SECTIONS, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
