import { useState, useEffect } from 'react'
import animationData from '../data/stagger-pulse.json'

// ── Inject keyframes once into the document ───────────────────────────
const KEYFRAMES = `
  @keyframes sp-bounce {
    0%, 100% { transform: translateY(0px); animation-timing-function: cubic-bezier(0.8,0,1,1); }
    50% { transform: translateY(-8px); animation-timing-function: cubic-bezier(0,0,0.2,1); }
  }
  @keyframes sp-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  @keyframes sp-ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  @keyframes sp-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes sp-wave {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1.2); }
  }
`

function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById('sp-keyframes')) return
    const style = document.createElement('style')
    style.id = 'sp-keyframes'
    style.textContent = KEYFRAMES
    document.head.appendChild(style)
  }, [])
}

// ── Bounce dot ────────────────────────────────────────────────────────
function BounceDot({ color, delay }: { color: string; delay: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        animation: `sp-bounce 0.8s infinite`,
        animationDelay: `${delay}ms`,
      }}
    />
  )
}

// ── Ping dot ──────────────────────────────────────────────────────────
function PingDot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, flexShrink: 0 }}>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: color,
          opacity: 0.7,
          animation: 'sp-ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
        }}
      />
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    </span>
  )
}

// ── Pulse block ────────────────────────────────────────────────────────
function PulseBlock({ width, height = 8, delay, radius = 4 }: { width: number | string; height?: number; delay: number; radius?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: 'rgba(255,255,255,0.12)',
        animation: `sp-pulse 1.4s ease-in-out infinite`,
        animationDelay: `${delay}ms`,
      }}
    />
  )
}

// ── Typing indicator ─────────────────────────────────────────────────
function TypingDots({ color = '#9ca3af', staggerDelay = 150 }: { color?: string, staggerDelay?: number }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '10px 14px',
      backgroundColor: 'rgba(255,255,255,0.08)',
      borderRadius: '18px 18px 18px 4px',
      width: 'fit-content',
    }}>
      <BounceDot color={color} delay={0} />
      <BounceDot color={color} delay={staggerDelay} />
      <BounceDot color={color} delay={staggerDelay * 2} />
    </div>
  )
}

// ── Notification bell with ping badge ────────────────────────────────
function NotificationBell({ count, color }: { count: number; color: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
      }}>🔔</div>
      {count > 0 && (
        <span style={{ position: 'absolute', top: -4, right: -4 }}>
          <PingDot color={color} size={16} />
        </span>
      )}
    </div>
  )
}

// ── Wave bars (music visualizer style) ───────────────────────────────
function WaveBars({ color, gridSize = 10, staggerDelay = 80 }: { color: string, gridSize?: number, staggerDelay?: number }) {
  void staggerDelay;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
      {[0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.75, 0.45, 0.85].slice(0, gridSize).map((scale, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: 32 * scale,
            borderRadius: 3,
            backgroundColor: color,
            animation: 'sp-wave 0.9s ease-in-out infinite',
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </div>
  )
}

// ── Skeleton post card ────────────────────────────────────────────────
function SkeletonPost({ delay = 0, staggerDelay = 40 }: { delay?: number, staggerDelay?: number }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <PulseBlock width={36} height={36} delay={delay} radius={18} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 2 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <PulseBlock width="30%" height={10} delay={delay + staggerDelay} />
          <PulseBlock width="15%" height={10} delay={delay + staggerDelay * 2.5} />
        </div>
        <PulseBlock width="95%" height={8} delay={delay + staggerDelay * 3} />
        <PulseBlock width="80%" height={8} delay={delay + staggerDelay * 4} />
        <PulseBlock width="55%" height={8} delay={delay + staggerDelay * 5} />
      </div>
    </div>
  )
}

type DemoTab = 'chat' | 'feed' | 'dashboard' | 'status'
type AnimKind = 'bounce' | 'pulse' | 'ping' | 'spin' | 'wave'
type ShapeKind = 'circle' | 'square' | 'rounded' | 'bar' | 'ring'

// ── Main component ─────────────────────────────────────────────────────
export function StaggerPulse({
  accentColor = animationData.defaultProps.accentColor,
  gridSize = (animationData.defaultProps as any).gridSize || 5,
  animationType = (animationData.defaultProps as any).animationType || "pulse",
  staggerDelay = (animationData.defaultProps as any).staggerDelay || 80,
  isPreview = false,
  /** Background color */
  bgColor = '#111118',
  /** Container border radius */
  borderRadius = 12,
  /** Default animation speed (ms) */
  defaultSpeed = 800,
  /** Default number of columns */
  defaultCols = 6,
  /** Default number of rows */
  defaultRows = 3,
  /** Default element size (px) */
  defaultElemSize = 20,
  /** Default stagger pattern */
  defaultPattern = 'grid' as 'grid' | 'diagonal' | 'random' | 'ripple',
  /** Default animation kind */
  defaultAnimKind = 'bounce' as AnimKind,
  /** Default shape kind */
  defaultShapeKind = 'circle' as ShapeKind,
  /** Show tabs */
  showTabs = true,
  /** Default tab */
  defaultTab = 'chat' as DemoTab,
  /** Skeleton load delay (ms) */
  skeletonLoadDelay = 2500,
  /** Show footer */
  showFooter = true,
  /** Ping dot size */
  pingDotSize = 10,
  /** Typing dots color */
  typingDotsColor = '#9ca3af',
  /** Online status color */
  onlineStatusColor = '#22c55e',
}: {
  accentColor?: string
  gridSize?: number
  animationType?: string
  staggerDelay?: number
  isPreview?: boolean
  bgColor?: string
  borderRadius?: number
  defaultSpeed?: number
  defaultCols?: number
  defaultRows?: number
  defaultElemSize?: number
  defaultPattern?: 'grid' | 'diagonal' | 'random' | 'ripple'
  defaultAnimKind?: AnimKind
  defaultShapeKind?: ShapeKind
  showTabs?: boolean
  defaultTab?: DemoTab
  skeletonLoadDelay?: number
  showFooter?: boolean
  pingDotSize?: number
  typingDotsColor?: string
  onlineStatusColor?: string
}) {
  useInjectStyles()

  const [activeTab, setActiveTab] = useState<DemoTab>(defaultTab)
  void { animationType, bgColor, borderRadius, defaultSpeed, defaultCols, defaultRows, defaultElemSize, defaultPattern, defaultAnimKind, defaultShapeKind, showTabs, showFooter, pingDotSize, typingDotsColor, onlineStatusColor };
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const t = setTimeout(() => setLoaded(true), skeletonLoadDelay)
    return () => clearTimeout(t)
  }, [activeTab, skeletonLoadDelay])

  // ── PREVIEW ──────────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#111118',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '0 16px',
      }}>
        {/* Row 1: typing dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            backgroundColor: 'rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#a5b4fc',
          }}>S</div>
          <TypingDots color="#9ca3af" />
        </div>

        {/* Row 2: ping + notification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PingDot color="#22c55e" size={10} />
            <span style={{ color: '#22c55e', fontSize: 10 }}>3 online</span>
          </div>
          <NotificationBell count={4} color={accentColor} />
        </div>

        {/* Row 3: skeleton lines */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <PulseBlock width="75%" height={8} delay={0} />
          <PulseBlock width="55%" height={8} delay={120} />
          <PulseBlock width="65%" height={8} delay={240} />
        </div>
      </div>
    )
  }

  // ── FULL DETAIL PAGE ─────────────────────────────────────────────────
  const TABS: { key: DemoTab; label: string; emoji: string }[] = [

    { key: 'chat', label: 'Chat App', emoji: '💬' },
    { key: 'feed', label: 'Social Feed', emoji: '📱' },
    { key: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { key: 'status', label: 'Live Status', emoji: '🟢' },
  ]

  return (
    <>
    <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ backgroundColor: '#111118' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors"
            style={{
              color: activeTab === tab.key ? '#fff' : '#6b7280',
              borderBottom: activeTab === tab.key ? `2px solid ${accentColor}` : '2px solid transparent',
              background: 'none',
            }}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Chat ── */}
      {activeTab === 'chat' && (
        <div style={{ height: 380, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>P</div>
              <span style={{ position: 'absolute', bottom: -1, right: -1 }}>
                <PingDot color="#22c55e" size={9} />
              </span>
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Priya Dahl</p>
              <p style={{ color: '#22c55e', fontSize: 10 }}>online</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            {[
              { from: 'P', text: 'Hey, can you review the landing page?', mine: false, time: '2:41 PM' },
              { from: 'Y', text: 'Sure! Sending feedback now.', mine: true, time: '2:42 PM' },
              { from: 'P', text: 'Also pushed the fix to staging 🚀', mine: false, time: '2:43 PM' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, flexDirection: m.mine ? 'row-reverse' : 'row' }}>
                {!m.mine && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#a5b4fc', flexShrink: 0, marginTop: 2 }}>
                    {m.from}
                  </div>
                )}
                <div style={{
                  maxWidth: '68%', padding: '8px 12px', fontSize: 12,
                  borderRadius: m.mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: m.mine ? '#4f46e5' : 'rgba(255,255,255,0.08)',
                  color: m.mine ? '#fff' : '#d1d5db',
                }}>
                  {m.text}
                  <p style={{ fontSize: 9, marginTop: 4, opacity: 0.5 }}>{m.time}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#a5b4fc', flexShrink: 0 }}>P</div>
              <TypingDots staggerDelay={staggerDelay} />
              <span style={{ color: '#4b5563', fontSize: 10, marginBottom: 4 }}>typing…</span>
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}>
              <span style={{ color: '#4b5563', fontSize: 12, flex: 1 }}>Type a message…</span>
              <span style={{ color: '#4b5563', fontSize: 14 }}>↵</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Social Feed ── */}
      {activeTab === 'feed' && (
        <div style={{ height: 380 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>For You</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PingDot color="#22c55e" size={8} />
                <span style={{ color: '#6b7280', fontSize: 10 }}>Live</span>
              </div>
              <NotificationBell count={4} color={accentColor} />
            </div>
          </div>

          {loaded ? (
            <div style={{ overflowY: 'auto', height: 326 }}>
              {[
                { name: 'Sarah Kim', handle: '@sarahkim', time: '2m', text: 'Just shipped a new animation library 🎉 Magnetic buttons, particle spheres, skeleton loaders and more.', likes: 142 },
                { name: 'Marcus Lee', handle: '@mlee_dev', time: '15m', text: 'Hot take: Tailwind animate-pulse alone handles 80% of loading states. No extra libs needed.', likes: 891 },
                { name: 'Priya Dahl', handle: '@priyadahl', time: '1h', text: 'GSAP ScrollTrigger + isolated scroll containers = no more scroll hijacking.', likes: 234 },
              ].map((post, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#9b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{post.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{post.name}</span>
                      <span style={{ color: '#4b5563', fontSize: 10 }}>{post.handle} · {post.time}</span>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>{post.text}</p>
                    <div style={{ display: 'flex', gap: 20, marginTop: 8, color: '#4b5563', fontSize: 10 }}>
                      <span>💬 Reply</span>
                      <span>❤️ {post.likes}</span>
                      <span>🔁 Share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <SkeletonPost delay={0} />
              <SkeletonPost delay={200} />
              <SkeletonPost delay={400} />
            </div>
          )}
        </div>
      )}

      {/* ── Dashboard ── */}
      {activeTab === 'dashboard' && (
        <div style={{ height: 380 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Analytics</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {loaded ? <PingDot color="#22c55e" size={8} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'sp-pulse 1s infinite' }} />}
              <span style={{ color: '#6b7280', fontSize: 10 }}>{loaded ? 'Live' : 'Loading…'}</span>
            </div>
          </div>

          {loaded ? (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Users', value: '48,291', change: '+12%', up: true },
                  { label: 'Revenue', value: '$94.2K', change: '+8.1%', up: true },
                  { label: 'Bounce', value: '24.3%', change: '-3.2%', up: false },
                ].map((s, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#6b7280', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                    <p style={{ color: '#fff', fontWeight: 900, fontSize: 18, marginTop: 4 }}>{s.value}</p>
                    <p style={{ fontSize: 10, fontWeight: 600, color: s.up ? '#4ade80' : '#f87171' }}>{s.change}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#9ca3af', fontSize: 11, marginBottom: 12 }}>Weekly traffic</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                  {[60, 45, 80, 35, 90, 55, 70].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', backgroundColor: accentColor, opacity: 0.5 + i * 0.07 }} />
                  ))}
                </div>
              </div>
              {/* Wave bars decoration */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ color: '#4b5563', fontSize: 10 }}>Live audio</span>
                <WaveBars color={accentColor} gridSize={gridSize * 2} staggerDelay={staggerDelay} />
              </div>
            </div>
          ) : (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <PulseBlock width="60%" height={8} delay={i * 100} />
                    <PulseBlock width="80%" height={24} delay={i * 100 + 80} />
                    <PulseBlock width="40%" height={8} delay={i * 100 + 160} />
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <PulseBlock width="30%" height={10} delay={0} />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60, marginTop: 12 }}>
                  {[60, 45, 80, 35, 90, 55, 70].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', backgroundColor: 'rgba(255,255,255,0.1)', animation: `sp-pulse 1.4s ease-in-out infinite`, animationDelay: `${i * 80}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Status ── */}
      {activeTab === 'status' && (
        <div style={{ height: 380, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PingDot color="#22c55e" size={12} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>All Systems Operational</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'API', status: 'operational', uptime: '99.99%' },
              { name: 'Dashboard', status: 'operational', uptime: '100%' },
              { name: 'CDN', status: 'degraded', uptime: '98.2%' },
              { name: 'Webhooks', status: 'operational', uptime: '99.8%' },
              { name: 'Database', status: 'operational', uptime: '100%' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PingDot color={s.status === 'operational' ? '#22c55e' : '#f59e0b'} size={9} />
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, backgroundColor: s.status === 'operational' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: s.status === 'operational' ? '#4ade80' : '#fbbf24' }}>
                    {s.status}
                  </span>
                  <span style={{ color: '#4b5563', fontSize: 10, fontFamily: 'monospace' }}>{s.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ color: '#4b5563', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>90-day uptime</p>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(90)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 20,
                    borderRadius: 2,
                    backgroundColor: i === 67 || i === 31 ? '#f59e0b' : '#22c55e',
                    opacity: 0.6,
                    animation: `sp-pulse 2s ease-in-out infinite`,
                    animationDelay: `${(i % 15) * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: 10 }}>
          {loaded ? 'Content loaded · Switch tabs to replay skeleton' : 'Loading… (2.5s skeleton)'}
        </p>
      </div>
    </div>

    {/* ── Customisable Stagger Playground ── */}
    <StaggerPlayground accentColor={accentColor} />
    </>
  )
}

// ── Stagger Playground ────────────────────────────────────────────────
const ANIM_OPTIONS: { key: AnimKind; label: string; desc: string }[] = [
  { key: 'bounce', label: 'Bounce', desc: 'Up/down spring' },
  { key: 'pulse', label: 'Pulse', desc: 'Fade in/out' },
  { key: 'ping',  label: 'Ping',  desc: 'Expanding ring' },
  { key: 'spin',  label: 'Spin',  desc: 'Rotate 360°' },
  { key: 'wave',  label: 'Wave',  desc: 'Scale Y wave' },
]

const SHAPE_OPTIONS: { key: ShapeKind; label: string }[] = [
  { key: 'circle',  label: '●' },
  { key: 'square',  label: '■' },
  { key: 'rounded', label: '▪' },
  { key: 'bar',     label: '▬' },
  { key: 'ring',    label: '○' },
]

function getAnimStyle(kind: AnimKind, speed: number, delay: number): React.CSSProperties {
  const dur = `${speed}ms`
  const base: React.CSSProperties = { animationDelay: `${delay}ms`, animationIterationCount: 'infinite' }
  switch (kind) {
    case 'bounce': return { ...base, animation: `sp-bounce ${dur} ease-in-out infinite`, animationDelay: `${delay}ms` }
    case 'pulse':  return { ...base, animation: `sp-pulse ${dur} ease-in-out infinite`, animationDelay: `${delay}ms` }
    case 'ping':   return { ...base, animation: `sp-ping ${dur} cubic-bezier(0,0,0.2,1) infinite`, animationDelay: `${delay}ms` }
    case 'spin':   return { ...base, animation: `sp-spin ${dur} linear infinite`, animationDelay: `${delay}ms` }
    case 'wave':   return { ...base, animation: `sp-wave ${dur} ease-in-out infinite`, animationDelay: `${delay}ms` }
  }
}

function getShapeStyle(kind: ShapeKind, color: string, size: number): React.CSSProperties {
  const base: React.CSSProperties = { backgroundColor: color, flexShrink: 0 }
  switch (kind) {
    case 'circle':  return { ...base, width: size, height: size, borderRadius: '50%' }
    case 'square':  return { ...base, width: size, height: size, borderRadius: 3 }
    case 'rounded': return { ...base, width: size, height: size, borderRadius: size / 3 }
    case 'bar':     return { ...base, width: size * 2.5, height: size * 0.45, borderRadius: size }
    case 'ring':    return { width: size, height: size, borderRadius: '50%', border: `2px solid ${color}`, backgroundColor: 'transparent', flexShrink: 0 }
  }
}

function StaggerPlayground({ accentColor }: { accentColor: string }) {
  const [animKind, setAnimKind]   = useState<AnimKind>('bounce')
  const [shapeKind, setShapeKind] = useState<ShapeKind>('circle')
  const [color, setColor]         = useState(accentColor)
  const [cols, setCols]           = useState(6)
  const [rows, setRows]           = useState(3)
  const [stagger, setStagger]     = useState(80)
  const [speed, setSpeed]         = useState(800)
  const [elemSize, setElemSize]   = useState(20)
  const [pattern, setPattern]     = useState<'grid' | 'diagonal' | 'random' | 'ripple'>('grid')

  const total = cols * rows

  // Compute delay per index based on pattern
  function getDelay(index: number): number {
    const col = index % cols
    const row = Math.floor(index / cols)
    switch (pattern) {
      case 'grid':     return index * stagger
      case 'diagonal': return (col + row) * stagger
      case 'random':   return Math.floor(Math.sin(index * 137.5) * 500 + 500) % (total * stagger / 2)
      case 'ripple': {
        const cx = (cols - 1) / 2
        const cy = (rows - 1) / 2
        const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2)
        return Math.round(dist * stagger * 2)
      }
    }
  }

  const btnBase: React.CSSProperties = {
    padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
    cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.15s',
  }
  const btnActive  = (active: boolean): React.CSSProperties => ({
    ...btnBase,
    backgroundColor: active ? color : 'rgba(255,255,255,0.05)',
    color: active ? '#fff' : '#9ca3af',
    borderColor: active ? color : 'rgba(255,255,255,0.1)',
  })

  const labelStyle: React.CSSProperties = { color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }
  const rowStyle: React.CSSProperties   = { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }
  const sliderStyle: React.CSSProperties = { width: '100%', accentColor: color, cursor: 'pointer' }

  return (
    <div style={{ marginTop: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0e0e16', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Stagger Playground</p>
          <p style={{ color: '#4b5563', fontSize: 10, marginTop: 2 }}>Customise every parameter and see it live</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {SHAPE_OPTIONS.map(s => (
            <button key={s.key} style={btnActive(shapeKind === s.key)} onClick={() => setShapeKind(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>

        {/* Animation type */}
        <div style={rowStyle}>
          <p style={labelStyle}>Animation</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {ANIM_OPTIONS.map(a => (
              <button key={a.key} style={btnActive(animKind === a.key)} onClick={() => setAnimKind(a.key)} title={a.desc}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stagger pattern */}
        <div style={rowStyle}>
          <p style={labelStyle}>Pattern</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(['grid', 'diagonal', 'ripple', 'random'] as const).map(p => (
              <button key={p} style={btnActive(pattern === p)} onClick={() => setPattern(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div style={rowStyle}>
          <p style={labelStyle}>Color</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              style={{ width: 36, height: 28, borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', backgroundColor: 'transparent', padding: 2 }} />
            <span style={{ color: '#6b7280', fontSize: 11, fontFamily: 'monospace' }}>{color}</span>
          </div>
        </div>

        {/* Grid cols */}
        <div style={rowStyle}>
          <p style={labelStyle}>Columns — {cols}</p>
          <input type="range" min={2} max={10} value={cols} onChange={e => setCols(+e.target.value)} style={sliderStyle} />
        </div>

        {/* Grid rows */}
        <div style={rowStyle}>
          <p style={labelStyle}>Rows — {rows}</p>
          <input type="range" min={1} max={6} value={rows} onChange={e => setRows(+e.target.value)} style={sliderStyle} />
        </div>

        {/* Stagger delay */}
        <div style={rowStyle}>
          <p style={labelStyle}>Stagger — {stagger}ms</p>
          <input type="range" min={10} max={400} step={10} value={stagger} onChange={e => setStagger(+e.target.value)} style={sliderStyle} />
        </div>

        {/* Speed */}
        <div style={rowStyle}>
          <p style={labelStyle}>Speed — {speed}ms</p>
          <input type="range" min={200} max={2000} step={50} value={speed} onChange={e => setSpeed(+e.target.value)} style={sliderStyle} />
        </div>

        {/* Size */}
        <div style={rowStyle}>
          <p style={labelStyle}>Size — {elemSize}px</p>
          <input type="range" min={8} max={40} step={2} value={elemSize} onChange={e => setElemSize(+e.target.value)} style={sliderStyle} />
        </div>

      </div>

      {/* ── Live Preview Grid ── */}
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, backgroundColor: '#080810' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${elemSize}px)`,
          gap: Math.max(6, elemSize * 0.4),
        }}>
          {[...Array(total)].map((_, i) => {
            const delay = getDelay(i)
            const shapeStyle = getShapeStyle(shapeKind, color, elemSize)
            const animStyle  = getAnimStyle(animKind, speed, delay)

            // ping needs wrapper with relative + absolute
            if (animKind === 'ping') {
              return (
                <span key={i} style={{ position: 'relative', display: 'inline-flex', width: elemSize, height: elemSize, flexShrink: 0 }}>
                  <span style={{ position: 'absolute', inset: 0, ...getShapeStyle(shapeKind, color, elemSize), opacity: 0.75, ...getAnimStyle('ping', speed, delay) }} />
                  <span style={{ position: 'relative', ...shapeStyle }} />
                </span>
              )
            }

            return (
              <div key={i} style={{ ...shapeStyle, ...animStyle }} />
            )
          })}
        </div>
      </div>

      {/* Footer stats */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Elements', value: total },
          { label: 'Total duration', value: `${((total - 1) * stagger + speed).toLocaleString()}ms` },
          { label: 'Pattern', value: pattern },
          { label: 'Animation', value: `sp-${animKind}` },
        ].map(s => (
          <div key={s.label}>
            <p style={{ color: '#4b5563', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ color: '#9ca3af', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export { animationData as metadata }
