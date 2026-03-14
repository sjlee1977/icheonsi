import { NextResponse } from 'next/server'

// 국립중앙의료원(B552659) API 사용
// 병원: HsptlAsembySearchService/getHsptlBasisList
// 약국: PhpacyAsembySearchService/getPhpacyBasisList

interface MedicalItem {
  id: string
  name: string
  tel: string
  address: string
  open: boolean
  naverUrl: string
}

function isOpenNow(item: any, day: number, currentTime: string): boolean {
  // day: 1(월) ~ 7(일), 8(공휴일)
  const startKeys = [`dutyTime${day}s`, `dutytime${day}s`]
  const endKeys = [`dutyTime${day}e`, `dutyTime${day}c`, `dutytime${day}e`, `dutytime${day}c`]
  
  let startTime = null
  for (const k of startKeys) { if (item[k]) { startTime = String(item[k]); break; } }
  
  let endTime = null
  for (const k of endKeys) { if (item[k]) { endTime = String(item[k]); break; } }
  
  if (!startTime || !endTime) return false
  
  const cur = parseInt(currentTime, 10)
  const start = parseInt(startTime, 10)
  const end = parseInt(endTime, 10)

  // 일반적인 경우 (예: 0900 ~ 1800)
  if (start < end) {
    return cur >= start && cur < end // 종료 시간 정각에는 닫는 것으로 간주 (보수적 필터링)
  }
  
  // 자정을 넘기는 경우 (예: 2200 ~ 0200)
  if (start > end) {
    return cur >= start || cur < end
  }

  // 24시간 영업 (예: 0000 ~ 2400 또는 0000 ~ 0000)
  if (start === end) {
    // API에 따라 0000~0000 등이 24시간일 수 있음
    return true 
  }
  
  return false
}

export async function GET() {
  const apiKey = process.env.PUBLIC_DATA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ pharmacy: [], hospital: [] })
  }

  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  // getDay() returns 0 for Sunday. We want 1 for Mon, 7 for Sun.
  const day = kst.getUTCDay() === 0 ? 7 : kst.getUTCDay()
  const hours = String(kst.getUTCHours()).padStart(2, '0')
  const minutes = String(kst.getUTCMinutes()).padStart(2, '0')
  const currentTime = `${hours}${minutes}`

  console.log(`[Med-Now] Current Day: ${day}, Time: ${currentTime}`)

  // 1. NMC API (B552657 - 실시간 운영정보 포함) 시도
  const fetchNMC = async (type: 'pharmacy' | 'hospital') => {
    const isPharmacy = type === 'pharmacy'
    const serviceName = isPharmacy ? 'ErmctInsttInfoInqireService' : 'HsptlAsembySearchService'
    const endpoint = isPharmacy ? 'getParmacyListInfoInqire' : 'getHsptlMdcncListInfoInqire'
    const url = `http://apis.data.go.kr/B552657/${serviceName}/${endpoint}` +
      `?serviceKey=${apiKey}&Q0=${encodeURIComponent('경기도')}&Q1=${encodeURIComponent('이천시')}&pageNo=1&numOfRows=500&_type=json`

    try {
      const res = await fetch(url)
      const text = await res.text()
      if (text.includes('Forbidden') || text.startsWith('<')) {
        throw new Error('NMC API Unauthorized or XML returned')
      }
      const data = JSON.parse(text)
      const raw = data?.response?.body?.items?.item ?? []
      const items = Array.isArray(raw) ? raw : [raw]
      
      const mapped = items
        .filter(item => item && item.dutyName)
        .map((item: any) => ({
          id: item.hpid || item.ykiho || Math.random().toString(),
          name: item.dutyName,
          tel: item.dutyTel1,
          address: item.dutyAddr,
          open: isOpenNow(item, day, currentTime),
          naverUrl: `https://map.naver.com/v5/search/${encodeURIComponent('이천 ' + item.dutyName)}`
        }))
        // 영업 중인 곳을 우선적으로 정렬
        .sort((a, b) => (a.open === b.open ? 0 : a.open ? -1 : 1))
      
      return mapped.length > 0 ? mapped : null
    } catch (e) {
      console.warn(`[Med-Now] NMC ${type} fallback:`, e instanceof Error ? e.message : e)
      return null
    }
  }

  // 2. HIRA API (기본 정보) 시도 (NMC 실패 시)
  const fetchHIRA = async (type: 'pharmacy' | 'hospital') => {
    const isPharmacy = type === 'pharmacy'
    const endpoint = isPharmacy ? 'pharmacyInfoService/getParmacyBasisList' : 'hospInfoServicev2/getHospBasisList'
    const url = `http://apis.data.go.kr/B551182/${endpoint}?serviceKey=${apiKey}&sidoCd=310000&sgguCd=312100&pageNo=1&numOfRows=10&_type=json`

    try {
      const res = await fetch(url)
      const data = await res.json()
      const raw = data?.response?.body?.items?.item ?? []
      const items = Array.isArray(raw) ? raw : [raw]
      
      return items.map((item: any) => ({
        id: item.ykiho || Math.random().toString(),
        name: item.yadmNm,
        tel: item.telno,
        address: item.addr,
        open: false, // 실시간 정보 없음 표시
        naverUrl: `https://map.naver.com/v5/search/${encodeURIComponent('이천 ' + item.yadmNm)}`
      })).filter(i => i.name)
    } catch (e) {
      console.error(`[Med-Now] HIRA ${type} error:`, e)
      return []
    }
  }

  let [pharmacy, hospital] = await Promise.all([
    fetchNMC('pharmacy'),
    fetchNMC('hospital')
  ])

  // NMC 실패 시 HIRA 리스트로 대체
  if (pharmacy === null) pharmacy = await fetchHIRA('pharmacy')
  if (hospital === null) hospital = await fetchHIRA('hospital')

  return NextResponse.json({
    pharmacy: pharmacy ?? [],
    hospital: hospital ?? [],
    updatedAt: kst.toISOString(),
    isRealTime: (pharmacy && pharmacy.length > 0 && pharmacy[0].open) || false
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=18000'
    }
  })
}
