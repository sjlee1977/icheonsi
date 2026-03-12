import { NextResponse } from 'next/server'

// 건강보험심사평가원 의료기관 정보 API
// 이천시: sidoCd=310000(경기) / sgguCd=312100(이천시)
// 약국: pharmacyInfoService/getParmacyBasisList
// 병원: hospInfoServicev2/getHospBasisList

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') ?? 'hospital'

  const apiKey = process.env.PUBLIC_DATA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured', list: [] }, { status: 500 })
  }

  const isPharmacy = type === 'pharmacy'
  const endpoint = isPharmacy
    ? 'pharmacyInfoService/getParmacyBasisList'
    : 'hospInfoServicev2/getHospBasisList'

  const url =
    `http://apis.data.go.kr/B551182/${endpoint}` +
    `?serviceKey=${apiKey}` +
    `&sidoCd=310000&sgguCd=312100` +
    `&pageNo=1&numOfRows=30&_type=json`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    const text = await res.text()

    if (text.startsWith('<')) {
      console.error(`[Hospital/${type}] XML error:`, text.slice(0, 300))
      return NextResponse.json({ list: [], error: 'API 오류' }, { status: 502 })
    }

    const data = JSON.parse(text)

    const resultCode = data?.response?.header?.resultCode
    if (resultCode && resultCode !== '00') {
      const msg = data?.response?.header?.resultMsg ?? 'Unknown'
      console.error(`[Hospital/${type}] API error ${resultCode}: ${msg}`)
      return NextResponse.json({ list: [], error: msg }, { status: 502 })
    }

    const raw = data?.response?.body?.items?.item ?? []
    const items: Record<string, string>[] = Array.isArray(raw) ? raw : [raw]

    const list = items.map((item) => ({
      id: item.ykiho ?? String(Math.random()),
      name: item.yadmNm ?? '',
      address: item.addr ?? '',
      tel: item.telno ?? '',
      lat: parseFloat(item.YPos ?? '0'),
      lng: parseFloat(item.XPos ?? '0'),
      type: item.clCdNm ?? (isPharmacy ? '약국' : '병원'),
    })).filter((item) => item.name)

    return NextResponse.json(
      { list, total: list.length },
      { headers: { 'Cache-Control': 'public, max-age=1800, stale-while-revalidate=300' } }
    )
  } catch (err) {
    console.error(`[Hospital/${type}] error:`, err)
    return NextResponse.json({ list: [], error: '의료기관 데이터를 불러올 수 없습니다.' }, { status: 502 })
  }
}
