import { Sparkles, Home } from 'lucide-react'
import { AnimationGridSkeleton } from '@/components/AnimationCardSkeleton'
import Link from 'next/link'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-dark-500 text-white">
      {/* ── Top bar skeleton ── */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md bg-dark-500/90 border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-4 flex-shrink-0 group hover:-translate-y-1 transition-transform duration-200">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#22d3ee] via-[#818cf8] to-[#a855f7] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight hidden sm:block">AnimX</span>
          </Link>
          
          <div className="w-[1px] h-6 bg-white/10 mx-2 hidden sm:block" />
          
          {/* Search bar skeleton */}
          <div className="flex-1 max-w-xl relative hidden sm:block opacity-50">
             <div className="w-full h-10 bg-white/5 border border-white/10 rounded-xl" />
          </div>
          
          <div className="flex-1 sm:hidden"></div>
          
          {/* Filter button skeleton */}
          <div className="w-24 h-10 bg-white/5 border border-white/10 rounded-xl hidden sm:block opacity-50" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-2">
           <div className="w-48 h-8 rounded-xl bg-white/5 animate-pulse" />
           <div className="w-32 h-4 rounded-xl bg-white/5 animate-pulse" />
        </div>
        <AnimationGridSkeleton count={12} />
      </div>
    </div>
  )
}
