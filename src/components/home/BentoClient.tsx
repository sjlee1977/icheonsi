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

interface MedicalItem {
  id: string
  name: string
  tel: string
  open: boolean
}

interface MedNowData {
  pharmacy: MedicalItem[]
  hospital: MedicalItem[]
  isRealTime: boolean
}

const WEATHER_ICONS: Record<string, string> = {
  맑음: '☀️', 비: '🌧️', '비/눈': '🌨️', 눈: '❄️',
  소나기: '⛈️', 빗방울: '🌦️', 빗방울눈날림: '🌨️', 눈날림: '🌨️',
}

export default function BentoClient() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [subway, setSubway] = useState<SubwayData | null>(null)
  const [medNow, setMedNow] = useState<MedNowData | null>(null)
  const [medIdx, setMedIdx] = useState(0)

  useEffect(() => {
    const fetchWeather = () => fetch('/api/weather').then(r => r.json()).then(setWeather).catch(() => null)
    const fetchSubway = () => fetch('/api/subway').then(r => r.json()).then(setSubway).catch(() => null)
    const fetchMedNow = () => fetch('/api/med-now').then(r => r.json()).then(setMedNow).catch(() => null)

    fetchWeather()
    fetchSubway()
    fetchMedNow()

    const weatherIv = setInterval(fetchWeather, 600_000)
    const subwayIv = setInterval(fetchSubway, 60_000)
    const medDataIv = setInterval(fetchMedNow, 300_000)
    const medIdxIv = setInterval(() => {
      setMedIdx(prev => prev + 1)
    }, 3000)

    return () => {
      clearInterval(weatherIv)
      clearInterval(subwayIv)
      clearInterval(medDataIv)
      clearInterval(medIdxIv)
    }
  }, [])

  const nextTrain = (() => {
    if (!subway) return null
    const all = [...(subway.toPangyo ?? []), ...(subway.toYeoju ?? [])]
      .sort((a, b) => a.minutesLeft - b.minutesLeft)
    return all[0] ?? null
  })()

  const weatherIcon = WEATHER_ICONS[weather?.status ?? ''] ?? '🌤️'

  const currentPharmacy = medNow?.pharmacy?.length 
    ? medNow.pharmacy[medIdx % medNow.pharmacy.length] 
    : null
  
  const currentHospital = medNow?.hospital?.length 
    ? medNow.hospital[medIdx % medNow.hospital.length] 
    : null

  return (
    <div className="bento-grid">
      {/* 날씨 */}
      <Link href="/now/weather" className="bento-card weather-bento">
        <div className="bento-card-header">
          <span className="bento-label">WEATHER {weatherIcon}</span>
        </div>
        <div className="bento-main">
          <span className="truncate">
            {weather ? (weather.error ? '--°C' : `${weather.temp}°C`) : '--°C'}
          </span>
        </div>
        <div className="bento-sub">
          <span className="truncate">
            {weather?.error ? '데이터 오류' : (weather?.status ?? '불러오는 중...')}
          </span>
        </div>
      </Link>

      {/* 경강선 */}
      <Link href="/now/subway" className="bento-card subway-bento">
        <div className="bento-card-header">
          <span className="bento-label">SUBWAY 🚃</span>
        </div>
        <div className="bento-main">
          {nextTrain
            ? (nextTrain.minutesLeft === 0 ? '곧 출발' : `${nextTrain.minutesLeft}분 후`)
            : '--분 후'}
        </div>
        <div className="bento-sub">
          <span className="truncate">
            {nextTrain
              ? `${nextTrain.destination} · ${nextTrain.departureTime}`
              : '경강선 이천역'}
          </span>
        </div>
      </Link>

      {/* 약국 */}
      <Link href="/now/pharmacy" className="bento-card pharmacy-bento">
        <div className="bento-card-header">
          <span className="bento-label">PHARMACY 💊</span>
          {currentPharmacy?.open && <span className="badge-open">영업중</span>}
        </div>
        <div className="bento-main">
          <span className="truncate w-full">
            {currentPharmacy?.name || '이천 정보'}
          </span>
        </div>
        <div className="bento-sub">
          <span className="truncate">
            {currentPharmacy ? `📞 ${currentPharmacy.tel}` : '약국 정보 →'}
          </span>
        </div>
      </Link>

      {/* 병원 */}
      <Link href="/now/hospital" className="bento-card hospital-bento">
        <div className="bento-card-header">
          <span className="bento-label">HOSPITAL 🏥</span>
          {currentHospital?.open && <span className="badge-open">영업중</span>}
        </div>
        <div className="bento-main">
          <span className="truncate w-full">
            {currentHospital?.name || '이천 정보'}
          </span>
        </div>
        <div className="bento-sub">
          <span className="truncate">
            {currentHospital ? `📞 ${currentHospital.tel}` : '병원 정보 →'}
          </span>
        </div>
      </Link>

      {/* 하이닉스 게시판 */}
      <Link href="/community" className="bento-card hynix-bento">
        <div className="bento-card-header">
          <span className="bento-label">HYNIX 💼</span>
        </div>
        <div className="bento-main">
          <span className="truncate">SK</span>
        </div>
        <div className="bento-sub">
          <span className="truncate">직장인 게시판 →</span>
        </div>
      </Link>

      {/* 커뮤니티 */}
      <Link href="/community" className="bento-card community-bento">
        <div className="bento-card-header">
          <span className="bento-label">COMMUNITY 💬</span>
        </div>
        <div className="bento-main">
          <span className="truncate">동네</span>
        </div>
        <div className="bento-sub">
          <span className="truncate">우리 동네 이야기 →</span>
        </div>
      </Link>
    </div>
  )
}
