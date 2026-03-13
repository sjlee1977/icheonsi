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
        {/* ChunkLoadError: 캐시 우회 쿼리 파라미터로 재시도, bfcache 복원 시 강제 새로고침 */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // bfcache 복원 시 강제 새로고침 (뒤로가기 후 청크 불일치 방지)
            window.addEventListener('pageshow', function(e) {
              if (e.persisted) { window.location.reload(); }
            });

            // URL 파라미터 제거 (정상 로드 후 URL 정리)
            window.addEventListener('load', function() {
              try {
                var url = new URL(window.location.href);
                var changed = false;
                if (url.searchParams.has('_retry')) { url.searchParams.delete('_retry'); changed = true; }
                if (url.searchParams.has('_t')) { url.searchParams.delete('_t'); changed = true; }
                if (changed) history.replaceState(null, '', url.toString());
              } catch(e) {}
            });

            // ChunkLoadError: 3초 대기 후 타임스탬프 URL로 캐시 완전 우회 (React가 잡기 전 단계)
            var handled = false;
            function onChunkError() {
              if (handled) return;
              handled = true;
              setTimeout(function() {
                try {
                  var url = new URL(window.location.href);
                  var retry = parseInt(url.searchParams.get('_retry') || '0', 10);
                  if (retry < 3) {
                    url.searchParams.set('_retry', String(retry + 1));
                    url.searchParams.set('_t', String(Date.now()));
                    window.location.replace(url.toString());
                  }
                } catch(e) { window.location.reload(); }
              }, 3000);
            }

            window.addEventListener('error', function(e) {
              var msg = (e && e.message) || '';
              if (/chunk/i.test(msg)) { onChunkError(); }
            });
            window.addEventListener('unhandledrejection', function(e) {
              if (!e || !e.reason) return;
              var name = String(e.reason.name || '');
              var msg = String(e.reason.message || '');
              if (/chunk/i.test(name) || /chunk/i.test(msg)) { onChunkError(); }
            });
          })();
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
