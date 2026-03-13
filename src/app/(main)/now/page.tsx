'use client'

import { useEffect, useState, useCallback } from 'react'

// ───────────── 타입 ─────────────
interface WeatherData {
  temp: number | string
  humidity: number | string
  windSpeed: number | string
  status: string
  error?: string
}

interface MedicalItem {
  id: string
  name: string
  address: string
  tel: string
  type: string
}

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

// ───────────── 날씨 아이콘 ─────────────
const WEATHER_ICONS: Record<string, string> = {
  맑음: '☀️', 비: '🌧️', '비/눈': '🌨️', 눈: '❄️',
  소나기: '⛈️', 빗방울: '🌦️', 빗방울눈날림: '🌨️', 눈날림: '🌨️',
}

function minutesLabel(min: number): string {
  if (min === 0) return '곧 출발'
  return `${min}분 후`
}

export default function NowPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [hospitals, setHospitals] = useState<MedicalItem[]>([])
  const [pharmacies, setPharmacies] = useState<MedicalItem[]>([])
  const [subwayData, setSubwayData] = useState<SubwayData | null>(null)
  const [mapTab, setMapTab] = useState<'pharmacy' | 'hospital'>('pharmacy')
  const [loading, setLoading] = useState({ weather: true, medical: true, subway: true })
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch('/api/weather')
      setWeather(await res.json())
    } catch {
      setWeather({ temp: '--', humidity: '--', windSpeed: '--', status: '오류', error: '불러오기 실패' })
    } finally {
      setLoading(prev => ({ ...prev, weather: false }))
    }
  }, [])

  const fetchMedical = useCallback(async () => {
    try {
      const [hospRes, pharmRes] = await Promise.all([
        fetch('/api/hospitals?type=hospital'),
        fetch('/api/hospitals?type=pharmacy'),
      ])
      setHospitals((await hospRes.json()).list ?? [])
      setPharmacies((await pharmRes.json()).list ?? [])
    } catch { /* 빈 배열 유지 */ }
    finally { setLoading(prev => ({ ...prev, medical: false })) }
  }, [])

  const fetchSubway = useCallback(async () => {
    try {
      const res = await fetch('/api/subway')
      setSubwayData(await res.json())
    } catch { /* 무시 */ }
    finally { setLoading(prev => ({ ...prev, subway: false })) }
  }, [])

  useEffect(() => {
    fetchWeather()
    fetchMedical()
    fetchSubway()

    const now = new Date()
    setLastUpdated(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 기준`)

    const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000)
    const subwayInterval = setInterval(fetchSubway, 60 * 1000) // 1분마다

    // 초기 hash 기반 탭 설정 (스크롤은 데이터 로딩 후에 처리)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#pharmacy') setMapTab('pharmacy')
      else if (hash === '#hospital') setMapTab('hospital')
    }

    return () => { clearInterval(weatherInterval); clearInterval(subwayInterval) }
  }, [fetchWeather, fetchSubway])

  // 의료 데이터 로딩 완료 후 hash 스크롤
  useEffect(() => {
    if (loading.medical) return
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash === '#pharmacy' || hash === '#hospital') {
      const elem = document.querySelector('.map-section')
      elem?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [loading.medical])

  const weatherIcon = WEATHER_ICONS[weather?.status ?? ''] ?? '🌤️'
  const activeList = mapTab === 'pharmacy' ? pharmacies : hospitals

  // 경강선 카드: 가장 빠른 다음 열차 (판교/여주 중 빠른 것)
  const nextTrain = (() => {
    if (!subwayData) return null
    const all = [...subwayData.toPangyo, ...subwayData.toYeoju]
      .sort((a, b) => a.minutesLeft - b.minutesLeft)
    return all[0] ?? null
  })()

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">ICHEON NOW</span>
        <h1 className="page-title">이천 나우</h1>
        <p className="page-desc">날씨, 교통, 병원, 약국 — 지금 이천의 모든 것</p>
        {lastUpdated && (
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            {lastUpdated}
          </p>
        )}
      </header>

      {/* ── 상단 카드 그리드 ── */}
      <div className="now-grid">

        {/* 날씨 */}
        <section className="now-card weather-card">
          <div className="card-label">{weatherIcon} 날씨</div>
          {loading.weather ? (
            <div className="card-value" style={{ fontSize: '1.2rem' }}>로딩 중…</div>
          ) : weather?.error && weather.temp === '--' ? (
            <div className="card-value" style={{ fontSize: '1rem', color: 'var(--muted)' }}>오류</div>
          ) : (
            <>
              <div className="card-value">{weather?.temp}°C</div>
              <div className="card-sub">{weather?.status}</div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                <span>습도 {weather?.humidity}%</span>
                <span>풍속 {weather?.windSpeed}m/s</span>
              </div>
            </>
          )}
        </section>

        {/* 경강선 요약 카드 */}
        <section className="now-card subway-card">
          <div className="card-label">🚃 경강선 이천역</div>
          {loading.subway ? (
            <div className="card-value" style={{ fontSize: '1.2rem' }}>로딩 중…</div>
          ) : nextTrain ? (
            <>
              <div className="card-value" style={{ fontSize: '1.4rem' }}>
                {minutesLabel(nextTrain.minutesLeft)}
              </div>
              <div className="card-sub">{nextTrain.destination} 방면 · {nextTrain.departureTime} 출발</div>
              {nextTrain.isLastTrain && (
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>막차</div>
              )}
            </>
          ) : (
            <div className="card-value" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>운행 종료</div>
          )}
        </section>

        {/* 이천사랑상품권 */}
        <section className="now-card currency-card">
          <div className="card-label">💳 이천사랑상품권</div>
          <div className="card-value">10%</div>
          <div className="card-sub">구매 인센티브</div>
          <a
            href="https://www.icheon.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'inline-block' }}
          >
            이천시청 바로가기 →
          </a>
        </section>

        {/* 약국 */}
        <section className="now-card pharmacy-card">
          <div className="card-label">💊 약국 정보</div>
          {loading.medical ? (
            <div className="card-value" style={{ fontSize: '1.2rem' }}>로딩 중…</div>
          ) : (
            <>
              <div className="card-value">{pharmacies.length}곳</div>
              <div className="card-sub">이천시 등록 약국</div>
            </>
          )}
        </section>
      </div>

      {/* ── 경강선 시간표 섹션 ── */}
      <section className="train-section">
        <h2 className="section-title">경강선 이천역 출발 시간표</h2>
        <div className="train-tracker">
          <div className="tracker-header">
            <span className="live-badge">{subwayData?.isWeekend ? '주말' : '평일'}</span>
            <span>이천역 출발 기준 · 다음 열차 3편</span>
          </div>

          {/* 노선 시각화 */}
          <div className="track-visual" style={{ margin: '16px 0' }}>
            <div className="track-line" />
            <div className="stations">
              {['판교', '경기광주', '초월', '곤지암', '신둔도예촌', '이천', '부발', '세종대왕릉', '여주'].map((name) => (
                <div key={name} className={`station ${name === '이천' ? 'active' : ''}`}>
                  <div className="station-dot" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {loading.subway ? (
            <p className="tracker-status">불러오는 중…</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              {/* 판교 방면 */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>
                  ← 판교 방면 (상행)
                </div>
                {subwayData?.toPangyo.length ? subwayData.toPangyo.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '0.9rem',
                  }}>
                    <span style={{ fontWeight: i === 0 ? 700 : 400 }}>{t.departureTime}</span>
                    <span style={{ color: i === 0 ? 'var(--primary)' : 'var(--muted)' }}>
                      {minutesLabel(t.minutesLeft)}
                      {t.isLastTrain && ' 🔴막차'}
                    </span>
                  </div>
                )) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>운행 종료</p>
                )}
              </div>

              {/* 여주 방면 */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
                  여주 방면 (하행) →
                </div>
                {subwayData?.toYeoju.length ? subwayData.toYeoju.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                    fontSize: '0.9rem',
                  }}>
                    <span style={{ fontWeight: i === 0 ? 700 : 400 }}>{t.departureTime}</span>
                    <span style={{ color: i === 0 ? 'var(--accent)' : 'var(--muted)' }}>
                      {minutesLabel(t.minutesLeft)}
                      {t.isLastTrain && ' 🔴막차'}
                    </span>
                  </div>
                )) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>운행 종료</p>
                )}
              </div>
            </div>
          )}

          {subwayData?.note && (
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '12px', textAlign: 'center' }}>
              ℹ️ {subwayData.note}
            </p>
          )}
        </div>
      </section>

      {/* ── 병원·약국 목록 ── */}
      <section className="map-section">
        <h2 className="section-title">병원·약국 정보</h2>
        <div className="map-controls">
          <button className={`map-btn ${mapTab === 'pharmacy' ? 'active' : ''}`} onClick={() => setMapTab('pharmacy')}>
            💊 약국
          </button>
          <button className={`map-btn ${mapTab === 'hospital' ? 'active' : ''}`} onClick={() => setMapTab('hospital')}>
            🏥 병원
          </button>
        </div>

        {loading.medical ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>데이터 불러오는 중…</div>
        ) : activeList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <p>데이터를 불러올 수 없습니다.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>PUBLIC_DATA_API_KEY를 확인하세요.</p>
          </div>
        ) : (
          <div className="medical-list">
            {activeList.map((item) => (
              <div key={item.id} className="medical-item">
                <div className="medical-item-header">
                  <span className="medical-name">{item.name}</span>
                  <span className="medical-type">{item.type}</span>
                </div>
                <div className="medical-address">📍 {item.address}</div>
                {item.tel && (
                  <div className="medical-tel">
                    <a href={`tel:${item.tel}`}>📞 {item.tel}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
