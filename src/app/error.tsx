'use client'

import { useEffect, useState } from 'react'

function isChunkError(error: Error) {
  return /chunk/i.test(error.name) || /chunk/i.test(error.message || '')
}

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const [countdown, setCountdown] = useState(3)

  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()
  const retryCount = parseInt(params.get('_retry') || '0', 10)
  const isChunk = isChunkError(error)
  const canRetry = isChunk && retryCount < 3

  useEffect(() => {
    if (!canRetry) return
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          const url = new URL(window.location.href)
          url.searchParams.set('_retry', String(retryCount + 1))
          url.searchParams.set('_t', String(Date.now()))
          window.location.replace(url.toString())
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [canRetry, retryCount])

  if (canRetry) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>🔄</div>
        <div style={{ fontSize: '1rem', color: '#444' }}>업데이트 적용 중...</div>
        <div style={{ fontSize: '0.85rem', color: '#999' }}>{countdown}초 후 자동 새로고침</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.2rem' }}>오류가 발생했습니다</h2>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={() => reset()} style={{ padding: '0.5rem 1.5rem', background: '#5A8572', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          다시 시도
        </button>
        <button onClick={() => { window.location.href = '/' }} style={{ padding: '0.5rem 1.5rem', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          홈으로
        </button>
      </div>
    </div>
  )
}
