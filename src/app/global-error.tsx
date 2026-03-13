'use client'

import { useEffect, useState } from 'react'

export default function GlobalError({ reset }: { reset: () => void }) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          const url = new URL(window.location.href)
          const retry = parseInt(url.searchParams.get('_retry') || '0', 10)
          if (retry < 3) {
            url.searchParams.set('_retry', String(retry + 1))
            url.searchParams.set('_t', String(Date.now()))
            window.location.replace(url.toString())
          }
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>🔄</div>
        <div style={{ fontSize: '1rem', color: '#444' }}>업데이트 적용 중...</div>
        <div style={{ fontSize: '0.85rem', color: '#999' }}>{countdown}초 후 자동 새로고침</div>
        <button onClick={() => reset()} style={{ marginTop: '0.5rem', padding: '0.5rem 1.5rem', background: '#5A8572', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          지금 새로고침
        </button>
      </body>
    </html>
  )
}
