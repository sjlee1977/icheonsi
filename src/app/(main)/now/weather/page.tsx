'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface WeatherData {
  temp: number | string
  humidity: number | string
  windSpeed: number | string
  status: string
  error?: string
}

const WEATHER_ICONS: Record<string, string> = {
  맑음: '☀️', 비: '🌧️', '비/눈': '🌨️', 눈: '❄️',
  소나기: '⛈️', 빗방울: '🌦️', 빗방울눈날림: '🌨️', 눈날림: '🌨️',
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch('/api/weather')
      setWeather(await res.json())
    } catch {
      setWeather({ temp: '--', humidity: '--', windSpeed: '--', status: '오류', error: '불러오기 실패' })
    } finally {
      setLoading(false)
      const now = new Date()
      setLastUpdated(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 기준`)
    }
  }, [])

  useEffect(() => {
    fetchWeather()
    const iv = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(iv)
  }, [fetchWeather])

  const icon = WEATHER_ICONS[weather?.status ?? ''] ?? '🌤️'

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">ICHEON NOW</span>
        <h1 className="page-title">이천 날씨</h1>
        <p className="page-desc">이천시 실시간 기상 정보 · 기상청 초단기실황</p>
        {lastUpdated && (
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{lastUpdated}</p>
        )}
      </header>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/now" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>← 이천 나우로 돌아가기</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>날씨 정보 불러오는 중…</div>
      ) : weather?.error && weather.temp === '--' ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <p>날씨 정보를 불러올 수 없습니다.</p>
          <button onClick={fetchWeather} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>다시 시도</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '480px' }}>
          {/* 메인 온도 카드 */}
          <section className="now-card weather-card" style={{ padding: '2rem' }}>
            <div className="card-label">{icon} 현재 날씨 · 이천시</div>
            <div className="card-value" style={{ fontSize: '4rem', fontWeight: 900 }}>{weather?.temp}°C</div>
            <div className="card-sub" style={{ fontSize: '1.2rem' }}>{weather?.status}</div>
          </section>

          {/* 상세 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <section className="now-card" style={{ padding: '1.25rem' }}>
              <div className="card-label">💧 습도</div>
              <div className="card-value">{weather?.humidity}%</div>
            </section>
            <section className="now-card" style={{ padding: '1.25rem' }}>
              <div className="card-label">💨 풍속</div>
              <div className="card-value">{weather?.windSpeed}<span style={{ fontSize: '1rem', fontWeight: 400 }}>m/s</span></div>
            </section>
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', marginTop: '0.5rem' }}>
            기상청 초단기실황 · 이천시 격자(nx=68, ny=107) 기준 · 10분마다 갱신
          </p>
        </div>
      )}
    </div>
  )
}
