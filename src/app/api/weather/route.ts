import { NextResponse } from 'next/server'

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
  // KST = UTC+9
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)

  let yyyy = kst.getUTCFullYear()
  let mm = kst.getUTCMonth() + 1
  let dd = kst.getUTCDate()
  let hh = kst.getUTCHours()
  const min = kst.getUTCMinutes()

  // 초단기실황: 매시 정각 발표, 45분 이전이면 이전 시각 사용
  if (min < 45) {
    hh -= 1
    if (hh < 0) {
      hh = 23
      // 날짜 하루 전으로 롤백
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

export async function GET() {
  const apiKey = process.env.PUBLIC_DATA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const { base_date, base_time } = getBaseDateTime()

  // URLSearchParams 대신 직접 URL 구성 (serviceKey 이중 인코딩 방지)
  const url =
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst` +
    `?serviceKey=${apiKey}` +
    `&pageNo=1&numOfRows=10&dataType=JSON` +
    `&base_date=${base_date}&base_time=${base_time}` +
    `&nx=${NX}&ny=${NY}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    const text = await res.text()

    // XML 오류 응답 처리 (공공데이터포털은 오류 시 XML 반환하는 경우 있음)
    if (text.startsWith('<')) {
      console.error('[Weather] XML error response:', text.slice(0, 200))
      return NextResponse.json({ error: 'API 오류 (XML 응답)', raw: text.slice(0, 200) }, { status: 502 })
    }

    const data = JSON.parse(text)

    // API 자체 오류 코드 확인
    const resultCode = data?.response?.header?.resultCode
    if (resultCode && resultCode !== '00') {
      const resultMsg = data?.response?.header?.resultMsg ?? 'Unknown'
      console.error(`[Weather] API error ${resultCode}: ${resultMsg}`)
      return NextResponse.json({ error: `기상청 오류: ${resultMsg}` }, { status: 502 })
    }

    const items: Array<{ category: string; obsrValue: string }> =
      data?.response?.body?.items?.item ?? []

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

    return NextResponse.json(
      { temp, humidity, windSpeed, status, base_date, base_time },
      { headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=60' } }
    )
  } catch (err) {
    console.error('[Weather] fetch error:', err)
    return NextResponse.json({ error: '날씨 데이터를 불러올 수 없습니다.' }, { status: 502 })
  }
}
