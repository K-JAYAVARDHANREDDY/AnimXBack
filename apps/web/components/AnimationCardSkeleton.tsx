'use client'

export function AnimationCardSkeleton() {
  return (
    <div className="glass-card p-4 rounded-xl border border-white/20 bg-black/25 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-cyan-400/40 rounded-md w-3/4 glow" />
          <div className="h-2 bg-pink-400/30 rounded-md w-full glow" />
          <div className="h-2 bg-purple-400/30 rounded-md w-2/3 glow" />
        </div>
        <div className="w-4 h-4 bg-yellow-400/40 rounded ml-2 flex-shrink-0 glow" />
      </div>

      {/* Preview area */}
      <div
        className="rounded-lg mb-3 relative overflow-hidden bg-white/5 shadow-inner"
        style={{ height: '160px' }}
      >
        {/* Neon shimmer sweep */}
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.2) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 mb-3">
        <div className="h-4 w-10 bg-green-400/30 rounded-md glow" />
        <div className="h-4 w-14 bg-pink-400/30 rounded-md glow" />
        <div className="h-4 w-8 bg-purple-400/30 rounded-md glow" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="h-3 w-12 bg-cyan-400/40 rounded-md glow" />
        <div className="h-4 w-10 bg-pink-400/30 rounded-md glow" />
      </div>
    </div>
  )
}

// Grid of skeletons shown while animations load
export function AnimationGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AnimationCardSkeleton key={i} />
      ))}
    </div>
  )
}