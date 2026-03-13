'use client'

import { useEffect } from 'react'

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    // 배포 후 구버전 청크 로딩 실패 시 자동 새로고침
    if (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to load chunk')
    ) {
      window.location.reload()
    }
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      gap: '1rem',
      fontFamily: 'sans-serif',
    }}>
      <h2 style={{ fontSize: '1.2rem' }}>오류가 발생했습니다</h2>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.5rem 1.5rem',
          background: '#5A8572',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        새로고침
      </button>
    </div>
  )
}
