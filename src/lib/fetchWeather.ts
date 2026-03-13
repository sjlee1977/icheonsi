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

export interface WeatherResult {
  temp: number | string
  humidity: number | string
  windSpeed: number | string
  status: string
  error?: string
}

export async function fetchWeather(): Promise<WeatherResult> {
  const apiKey = process.env.PUBLIC_DATA_API_KEY
  if (!apiKey) return { temp: '--', humidity: '--', windSpeed: '--', status: '맑음', error: 'no key' }

  const { base_date, base_time } = getBaseDateTime()
  const url =
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst` +
    `?serviceKey=${apiKey}` +
    `&pageNo=1&numOfRows=10&dataType=JSON` +
    `&base_date=${base_date}&base_time=${base_time}` +
    `&nx=${NX}&ny=${NY}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000) // 3초 타임아웃
    const res = await fetch(url, { next: { revalidate: 600 }, signal: controller.signal })
    clearTimeout(timeout)
    const text = await res.text()
    if (text.startsWith('<')) return { temp: '--', humidity: '--', windSpeed: '--', status: '맑음', error: 'XML 응답' }

    const data = JSON.parse(text)
    const resultCode = data?.response?.header?.resultCode
    if (resultCode && resultCode !== '00') return { temp: '--', humidity: '--', windSpeed: '--', status: '맑음', error: `기상청 오류` }

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
  } catch {
    return { temp: '--', humidity: '--', windSpeed: '--', status: '맑음', error: '불러오기 실패' }
  }
}
