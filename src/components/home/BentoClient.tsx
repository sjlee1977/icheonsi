'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WeatherData {
  temp: number | string
  status: string
  error?: string
}

interface TrainInfo {
  destination: string
  departureTime: string
  minutesLeft: number
}

interface SubwayData {
  toPangyo: TrainInfo[]
  toYeoju: TrainInfo[]
}

const WEATHER_ICONS: Record<string, string> = {
  맑음: '☀️', 비: '🌧️', '비/눈': '🌨️', 눈: '❄️',
  소나기: '⛈️', 빗방울: '🌦️', 빗방울눈날림: '🌨️', 눈날림: '🌨️',
}

export default function BentoClient() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [subway, setSubway] = useState<SubwayData | null>(null)

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(setWeather)
      .catch(() => null)

    fetch('/api/subway')
      .then(r => r.json())
      .then(setSubway)
      .catch(() => null)

    const iv = setInterval(() => {
      fetch('/api/subway').then(r => r.json()).then(setSubway).catch(() => null)
    }, 60_000)
    return () => clearInterval(iv)
  }, [])

  const nextTrain = (() => {
    if (!subway) return null
    const all = [...(subway.toPangyo ?? []), ...(subway.toYeoju ?? [])]
      .sort((a, b) => a.minutesLeft - b.minutesLeft)
    return all[0] ?? null
  })()

  const weatherIcon = WEATHER_ICONS[weather?.status ?? ''] ?? '🌤️'

  return (
    <div className="bento-grid">
      {/* 날씨 */}
      <Link href="/now" className="bento-card weather-bento">
        <span className="bento-label">WEATHER {weatherIcon}</span>
        <div className="bento-main">
          {weather ? (weather.error ? '--°C' : `${weather.temp}°C`) : '--°C'}
        </div>
        <span className="bento-sub">
          {weather?.error ? '데이터 오류' : (weather?.status ?? '불러오는 중...')}
        </span>
      </Link>

      {/* 경강선 */}
      <Link href="/now" className="bento-card subway-bento">
        <span className="bento-label">SUBWAY 🚃</span>
        <div className="bento-main">
          {nextTrain
            ? (nextTrain.minutesLeft === 0 ? '곧 출발' : `${nextTrain.minutesLeft}분 후`)
            : '--분 후'}
        </div>
        <span className="bento-sub">
          {nextTrain
            ? `${nextTrain.destination} · ${nextTrain.departureTime}`
            : '경강선 이천역'}
        </span>
      </Link>

      {/* 이천사랑상품권 */}
      <div className="bento-card currency-bento">
        <span className="bento-label">이천사랑상품권</span>
        <div className="bento-main">10%</div>
        <span className="bento-sub">구매 인센티브 제공 중</span>
      </div>

      {/* 의료·보건 약국 */}
      <Link href="/now/pharmacy" className="bento-card pharmacy-bento">
        <span className="bento-label">PHARMACY 💊</span>
        <div className="bento-main">이천</div>
        <span className="bento-sub">약국 정보 →</span>
      </Link>

      {/* 의료·보건 병원 */}
      <Link href="/now/hospital" className="bento-card hospital-bento">
        <span className="bento-label">HOSPITAL 🏥</span>
        <div className="bento-main">이천</div>
        <span className="bento-sub">병원 정보 →</span>
      </Link>

      {/* 하이닉스 게시판 */}
      <Link href="/community" className="bento-card hynix-bento">
        <span className="bento-label">HYNIX 💼</span>
        <div className="bento-main">SK</div>
        <span className="bento-sub">직장인 게시판 →</span>
      </Link>

      {/* 커뮤니티 */}
      <Link href="/community" className="bento-card community-bento">
        <span className="bento-label">COMMUNITY 💬</span>
        <div className="bento-main">동네</div>
        <span className="bento-sub">우리 동네 이야기 →</span>
      </Link>
    </div>
  )
}
