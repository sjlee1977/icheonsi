// 경강선 이천역 시간표
// 출처: korailinfo.com 기준 (2025.04.14 업데이트)
// 실시간 API 미제공으로 시간표 기반 계산

// 이천역 출발 — 판교 방면 (상행) 평일
const TO_PANGYO_WEEKDAY = [
  '05:33',
  '06:03', '06:17', '06:30', '06:44', '06:56',
  '07:08', '07:22', '07:32', '07:40', '07:49', '07:58',
  '08:07', '08:20', '08:43',
  '09:11', '09:25', '09:45',
  '10:05', '10:25', '10:49',
  '11:11', '11:34', '11:50',
  '12:09', '12:29', '12:47',
  '13:08', '13:30', '13:49',
  '14:08', '14:27', '14:45',
  '15:06', '15:26', '15:46',
  '16:05', '16:26', '16:43', '16:57',
  '17:12', '17:27', '17:45', '17:57',
  '18:03', '18:21', '18:40', '18:58',
  '19:14', '19:30', '19:46',
  '20:06', '20:26', '20:45',
  '21:03', '21:22', '21:42',
  '22:03', '22:35',
  '23:15', '23:55',
  '00:55',
]

// 이천역 출발 — 판교 방면 (상행) 주말/공휴일
const TO_PANGYO_WEEKEND = [
  '05:45',
  '06:15', '06:34', '06:54',
  '07:20', '07:48',
  '08:15', '08:40',
  '09:05', '09:23', '09:47',
  '10:14', '10:40', '10:58',
  '11:15', '11:37', '11:59',
  '12:20', '12:45',
  '13:05', '13:25', '13:48',
  '14:09', '14:27', '14:45',
  '15:05', '15:25', '15:45',
  '16:06', '16:25', '16:45',
  '17:05', '17:25', '17:45',
  '18:10', '18:31', '18:51',
  '19:10', '19:30', '19:46',
  '20:13', '20:38',
  '21:03', '21:25',
  '22:30',
  '23:13', '23:40',
]

// 이천역 출발 — 여주 방면 (하행) 평일
const TO_YEOJU_WEEKDAY = [
  '06:05', '06:28', '06:52',
  '07:08', '07:22', '07:46', '07:49',
  '08:19', '08:42',
  '09:10', '09:29', '09:53',
  '10:30', '10:49',
  '11:09', '11:29', '11:49',
  '12:08', '12:30', '12:53',
  '13:11', '13:30',
  '14:06', '14:27', '14:49',
  '15:08', '15:48',
  '16:05', '16:25', '16:46',
  '17:06', '17:25', '17:45',
  '18:19', '18:49',
  '19:05', '19:23', '19:41', '19:59',
  '20:36', '20:55',
  '21:15', '21:35',
  '22:15', '22:35', '22:55',
  '23:35',
  '00:10',
]

// 이천역 출발 — 여주 방면 (하행) 주말/공휴일
const TO_YEOJU_WEEKEND = [
  '06:05', '06:35',
  '07:05', '07:35',
  '08:00', '08:25', '08:44',
  '09:35',
  '10:00', '10:25', '10:48',
  '11:10', '11:35',
  '12:00', '12:25', '12:46',
  '13:10', '13:29', '13:47',
  '14:07', '14:25', '14:45',
  '15:07', '15:28', '15:46',
  '16:05', '16:24', '16:45',
  '17:05', '17:25', '17:45',
  '18:25', '18:45',
  '19:05', '19:30', '19:55',
  '20:20', '20:40', '20:58',
  '21:45',
  '22:15', '22:35',
  '23:00', '23:25',
  '00:00',
]

export interface TrainInfo {
  destination: string
  departureTime: string
  minutesLeft: number
  isLastTrain: boolean
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  // 자정 이후(00:xx)는 24시간 이후로 처리
  return h === 0 ? 24 * 60 + m : h * 60 + m
}

function getNowKSTMinutes(): number {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const h = kst.getUTCHours()
  const m = kst.getUTCMinutes()
  // 자정 이후(00:xx)는 24시간 이후로 처리 (parseMinutes와 동일 기준)
  return h === 0 ? 24 * 60 + m : h * 60 + m
}

function isWeekendOrHoliday(): boolean {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const day = kst.getUTCDay()
  return day === 0 || day === 6
}

function getNextTrains(
  timetable: string[],
  destination: string,
  nowMin: number,
  count = 3
): TrainInfo[] {
  const results: TrainInfo[] = []
  for (let i = 0; i < timetable.length; i++) {
    const depMin = parseMinutes(timetable[i])
    const diff = depMin - nowMin
    if (diff >= 0 && diff <= 180) {
      results.push({
        destination,
        departureTime: timetable[i],
        minutesLeft: diff,
        isLastTrain: i === timetable.length - 1,
      })
      if (results.length >= count) break
    }
  }
  return results
}

export function getNextTrainsFromIcheon(): {
  toPangyo: TrainInfo[]
  toYeoju: TrainInfo[]
  isWeekend: boolean
  note: string
} {
  const weekend = isWeekendOrHoliday()
  const nowMin = getNowKSTMinutes()

  const pangyoTable = weekend ? TO_PANGYO_WEEKEND : TO_PANGYO_WEEKDAY
  const yeojuTable = weekend ? TO_YEOJU_WEEKEND : TO_YEOJU_WEEKDAY

  return {
    toPangyo: getNextTrains(pangyoTable, '판교', nowMin),
    toYeoju: getNextTrains(yeojuTable, '여주', nowMin),
    isWeekend: weekend,
    note: '시간표 기반 정보 (2025.04 코레일 기준) · 실시간 정보는 코레일톡 앱 확인',
  }
}
