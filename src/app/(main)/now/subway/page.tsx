'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface TrainInfo {
  destination: string
  departureTime: string
  minutesLeft: number
  isLastTrain: boolean
}

interface SubwayData {
  toPangyo: TrainInfo[]
  toYeoju: TrainInfo[]
  isWeekend: boolean
  note: string
}

function minutesLabel(min: number): string {
  if (min === 0) return '곧 출발'
  return `${min}분 후`
}

const STATIONS = ['판교', '경기광주', '초월', '곤지암', '신둔도예촌', '이천', '부발', '세종대왕릉', '여주']

export default function SubwayPage() {
  const [subwayData, setSubwayData] = useState<SubwayData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubway = useCallback(async () => {
    try {
      const res = await fetch('/api/subway')
      setSubwayData(await res.json())
    } catch { /* 무시 */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchSubway()
    const iv = setInterval(fetchSubway, 60_000)
    return () => clearInterval(iv)
  }, [fetchSubway])

  const nextPangyoTrain = subwayData?.toPangyo?.length ? subwayData.toPangyo[0] : null
  const nextYeojuTrain = subwayData?.toYeoju?.length ? subwayData.toYeoju[0] : null

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">ICHEON NOW</span>
        <h1 className="page-title">경강선 이천역</h1>
        <p className="page-desc">이천역 출발 시간표 · 다음 열차 안내</p>
      </header>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/now" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>← 이천 나우로 돌아가기</Link>
      </div>

      {/* 다음 열차 요약 */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <section className="now-card subway-card" style={{ padding: '1.5rem' }}>
            <div className="card-label" style={{ color: '#F97316' }}>← 판교행 방면</div>
            {nextPangyoTrain ? (
              <>
                <div className="card-value" style={{ fontSize: '2rem' }}>{minutesLabel(nextPangyoTrain.minutesLeft)}</div>
                <div className="card-sub">{nextPangyoTrain.departureTime} 출발</div>
                {nextPangyoTrain.isLastTrain && <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>막차</div>}
              </>
            ) : (
             <div className="card-value" style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>운행 종료</div>
            )}
          </section>

          <section className="now-card subway-card" style={{ padding: '1.5rem', borderTopColor: 'var(--accent)' }}>
            <div className="card-label" style={{ color: 'var(--accent)' }}>여주행 방면 →</div>
            {nextYeojuTrain ? (
              <>
                <div className="card-value" style={{ fontSize: '2rem' }}>{minutesLabel(nextYeojuTrain.minutesLeft)}</div>
                <div className="card-sub">{nextYeojuTrain.departureTime} 출발</div>
                {nextYeojuTrain.isLastTrain && <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>막차</div>}
              </>
            ) : (
             <div className="card-value" style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>운행 종료</div>
            )}
          </section>
        </div>
      )}

      {/* 노선 시각화 */}
      <div className="train-tracker" style={{ marginBottom: '1.5rem' }}>
        <div className="tracker-header">
          <span className="live-badge">{subwayData?.isWeekend ? '주말' : '평일'}</span>
          <span>이천역 출발 기준</span>
        </div>
        <div className="track-visual" style={{ margin: '16px 0' }}>
          <div className="track-line" />
          <div className="stations">
            {STATIONS.map((name) => (
              <div key={name} className={`station ${name === '이천' ? 'active' : ''}`}>
                <div className="station-dot" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시간표 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>불러오는 중…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* 판교 방면 */}
          <div className="now-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '12px', color: '#F97316', fontSize: '0.95rem' }}>← 판교 방면 (상행)</div>
            {subwayData?.toPangyo.length ? subwayData.toPangyo.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: i === 0 ? 700 : 400 }}>{t.departureTime}</span>
                <span style={{ color: i === 0 ? '#F97316' : 'var(--muted)' }}>
                  {minutesLabel(t.minutesLeft)}{t.isLastTrain && ' 🔴'}
                </span>
              </div>
            )) : <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>운행 종료</p>}
          </div>

          {/* 여주 방면 */}
          <div className="now-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--accent)', fontSize: '0.95rem' }}>여주 방면 (하행) →</div>
            {subwayData?.toYeoju.length ? subwayData.toYeoju.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: i === 0 ? 700 : 400 }}>{t.departureTime}</span>
                <span style={{ color: i === 0 ? 'var(--accent)' : 'var(--muted)' }}>
                  {minutesLabel(t.minutesLeft)}{t.isLastTrain && ' 🔴'}
                </span>
              </div>
            )) : <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>운행 종료</p>}
          </div>
        </div>
      )}

      {subwayData?.note && (
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '1rem', textAlign: 'center' }}>
          ℹ️ {subwayData.note}
        </p>
      )}
    </div>
  )
}
