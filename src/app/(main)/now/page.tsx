export const dynamic = 'force-dynamic'

import { fetchWeather } from '@/lib/fetchWeather'
import { getNextTrainsFromIcheon } from '@/lib/gyeonggang-timetable'
import NowClient from './NowClient'

export default async function NowPage() {
  const [initialWeather, initialSubway] = await Promise.all([
    fetchWeather(),
    Promise.resolve(getNextTrainsFromIcheon()),
  ])

  return <NowClient initialWeather={initialWeather} initialSubway={initialSubway} />
}
