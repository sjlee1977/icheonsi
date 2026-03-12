import { NextResponse } from 'next/server'
import { getNextTrainsFromIcheon } from '@/lib/gyeonggang-timetable'

export async function GET() {
  const result = getNextTrainsFromIcheon()
  return NextResponse.json(result, {
    headers: {
      // 1분 캐시 (매분 갱신)
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  })
}
