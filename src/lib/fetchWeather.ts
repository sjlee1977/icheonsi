// 기상청 초단기실황조회 (getUltraSrtNcst)
// 이천시 격자 좌표: nx=68, ny=107
const NX = 68
const NY = 107

const PTY_LABELS: Record<string, string> = {
  '0': '맑음', '1': '비', '2': '비/눈', '3': '눈',
  '4': '소나기', '5': '빗방울', '6': '빗방울눈날림', '7': '눈날림',
}

function getBaseDateTime() {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)

  let yyyy = kst.getUTCFullYear()
  let mm = kst.getUTCMonth() + 1
  let dd = kst.getUTCDate()
  let hh = kst.getUTCHours()
  const min = kst.getUTCMinutes()

  if (min < 45) {
    hh -= 1
    if (hh < 0) {
      hh = 23
      const prev = new Date(Date.UTC(yyyy, mm - 1, dd) - 1)
      yyyy = prev.getUTCFullYear()
      mm = prev.getUTCMonth() + 1
      dd = prev.getUTCDate()
    }
  }

  return {
    base_date: `${yyyy}${String(mm).padStart(2, '0')}${String(dd).padStart(2, '0')}`,
    base_time: `${String(hh).padStart(2, '0')}00`,
  }
}

export interface ForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  humidity: number
  windSpeed: number
  status: string
}

export interface WeatherResult {
  temp: number | string
  humidity: number | string
  windSpeed: number | string
  status: string
  forecast?: ForecastDay[]
  error?: string
}

async function fetchForecast(): Promise<ForecastDay[]> {
  // 이천시 좌표
  const lat = 37.2723
  const lon = 127.435
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max&timezone=Asia/Seoul`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    const daily = data.daily

    return daily.time.map((time: string, i: number) => {
      // Open-Meteo WMO Code to Status Label
      const code = daily.weather_code[i]
      let status = '맑음'
      if (code >= 1 && code <= 3) status = '맑음' // 구름조금/흐림 포함
      if (code >= 51 && code <= 67) status = '비'
      if (code >= 71 && code <= 77) status = '눈'
      if (code >= 80 && code <= 82) status = '소나기'
      if (code >= 85 && code <= 86) status = '눈'
      if (code >= 95) status = '소나기'

      return {
        date: time,
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        humidity: Math.round(daily.relative_humidity_2m_mean[i]),
        windSpeed: daily.wind_speed_10m_max[i],
        status,
      }
    })
  } catch (err) {
    console.error('[ForecastAPI] Error:', err)
    return []
  }
}

export async function fetchWeather(): Promise<WeatherResult> {
  const apiKey = process.env.PUBLIC_DATA_API_KEY
  
  // 기상청 데이터 초기값
  let current: Partial<WeatherResult> = { temp: '--', humidity: '--', windSpeed: '--', status: '맑음' }
  let forecast: ForecastDay[] = []

  // 병렬로 데이터 호출
  const [weatherRes, forecastRes] = await Promise.allSettled([
    apiKey ? (async () => {
      const { base_date, base_time } = getBaseDateTime()
      const url =
        `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst` +
        `?serviceKey=${apiKey}` +
        `&pageNo=1&numOfRows=10&dataType=JSON` +
        `&base_date=${base_date}&base_time=${base_time}` +
        `&nx=${NX}&ny=${NY}`

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(url, { next: { revalidate: 600 }, signal: controller.signal })
      clearTimeout(timeout)
      const text = await res.text()
      if (text.startsWith('<')) throw new Error('XML Response')

      const data = JSON.parse(text)
      const resultCode = data?.response?.header?.resultCode
      if (resultCode && resultCode !== '00') throw new Error(`API Error ${resultCode}`)

      const items: Array<{ category: string; obsrValue: string }> = data?.response?.body?.items?.item ?? []
      let temp: number | string = '--'
      let humidity: number | string = '--'
      let windSpeed: number | string = '--'
      let status = '맑음'

      for (const item of items) {
        if (item.category === 'T1H') temp = parseFloat(item.obsrValue)
        if (item.category === 'REH') humidity = parseFloat(item.obsrValue)
        if (item.category === 'WSD') windSpeed = parseFloat(item.obsrValue)
        if (item.category === 'PTY') status = PTY_LABELS[item.obsrValue] ?? '맑음'
      }
      return { temp, humidity, windSpeed, status }
    })() : Promise.reject('No API Key'),
    fetchForecast()
  ])

  if (weatherRes.status === 'fulfilled') {
    current = weatherRes.value
  }
  if (forecastRes.status === 'fulfilled') {
    forecast = forecastRes.value
  }

  return {
    ...current as WeatherResult,
    forecast,
    error: weatherRes.status === 'rejected' ? '기상청 정보 실패' : undefined
  }
}
