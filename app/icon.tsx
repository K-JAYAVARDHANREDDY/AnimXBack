// app/icon.tsx
// Exact AnimX logo — Sparkles (lucide-react) icon inside gradient rounded box
// Matches the landing page logo: w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500

import { ImageResponse } from 'next/og'

export const size = { width: 256, height: 256 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 256,
          height: 256,
          borderRadius: 60,
          background: 'linear-gradient(135deg, #22d3ee 0%, #818cf8 55%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main 4-pointed star */}
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          {/* Plus — top right */}
          <path d="M20 3v4" />
          <path d="M22 5h-4" />
          {/* Small plus — bottom left */}
          <path d="M4 17v2" />
          <path d="M5 18H3" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
