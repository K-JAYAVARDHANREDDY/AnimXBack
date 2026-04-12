import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AnimX Embed',
}

/**
 * Bare-bones layout for /embed/[id] so the iframe has no extra chrome.
 * globals.css is still inherited from the root layout but this layout
 * does NOT add any header/footer/nav.
 */
export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: '#0a0e1a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}
