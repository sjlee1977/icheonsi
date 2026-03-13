import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Noto_Serif_KR, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_KR({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

const notoSerif = Noto_Serif_KR({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: '이천시.com — 이천의 진짜 디지털 광장',
    template: '%s | 이천시.com',
  },
  description:
    '이천 살면 이거 하나면 돼. SK하이닉스 직장인, 신도시 유입 인구, 토박이 주민이 한 곳에서 만나는 이천의 진짜 디지털 광장.',
  keywords: ['이천시', '이천', 'SK하이닉스', '경강선', '이천 커뮤니티', '이천 장터'],
  authors: [{ name: '이천시.com' }],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://icheonsi.com',
    siteName: '이천시.com',
    title: '이천시.com — 이천의 진짜 디지털 광장',
    description: '이천의 모든 정보를 한 곳에서',
  },
}

export const viewport: Viewport = {
  themeColor: '#5A8572',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* ChunkLoadError: 배포 후 구버전 청크 404 시 자동 새로고침 (30초 쿨다운) */}
        <script dangerouslySetInnerHTML={{ __html: `
          function handleChunkError() {
            var now = Date.now();
            var last = parseInt(localStorage.getItem('chunk_reload_at') || '0', 10);
            if (now - last > 30000) {
              localStorage.setItem('chunk_reload_at', String(now));
              window.location.reload();
            }
          }
          window.addEventListener('error', function(e) {
            if (e && e.message && (
              e.message.indexOf('Loading chunk') !== -1 ||
              e.message.indexOf('ChunkLoadError') !== -1 ||
              e.message.indexOf('Failed to load chunk') !== -1
            )) { handleChunkError(); }
          });
          window.addEventListener('unhandledrejection', function(e) {
            if (e && e.reason && (
              e.reason.name === 'ChunkLoadError' ||
              (e.reason.message && e.reason.message.indexOf('chunk') !== -1)
            )) { handleChunkError(); }
          });
        `}} />
      </head>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
