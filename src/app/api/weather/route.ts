import { NextResponse } from 'next/server'
import { fetchWeather } from '@/lib/fetchWeather'

export async function GET() {
  const data = await fetchWeather()
  return NextResponse.json(
    data,
    { headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=60' } }
  )
}
