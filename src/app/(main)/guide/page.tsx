import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '신도시 정착 가이드',
  description: '이천 마장·중리 지구 입주민을 위한 원스톱 정착 가이드',
}

const GUIDE_SECTIONS = [
  {
    icon: '🏫',
    title: '학교·어린이집',
    desc: '마장·중리 지구 학군 및 돌봄 시설 안내',
    href: '/guide/education',
  },
  {
    icon: '🏪',
    title: '생활 인프라',
    desc: '마트, 병원, 은행, 관공서 위치',
    href: '/guide/infrastructure',
  },
  {
    icon: '🚌',
    title: '교통 안내',
    desc: '버스 노선, 경강선, 주차장 정보',
    href: '/guide/transport',
  },
  {
    icon: '📋',
    title: '전입 신고',
    desc: '전입신고 절차 및 필요 서류 안내',
    href: '/guide/moving-in',
  },
  {
    icon: '🗑',
    title: '분리수거·쓰레기',
    desc: '수거 요일, 봉투 구매처, 대형폐기물',
    href: '/guide/waste',
  },
  {
    icon: '🌐',
    title: '지역 커뮤니티',
    desc: '아파트 단지별 카페·SNS 채널 모음',
    href: '/guide/community-links',
  },
]

export default function GuidePage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">SETTLEMENT GUIDE</span>
        <h1 className="page-title">신도시 정착 가이드</h1>
        <p className="page-desc">마장·중리 지구 입주민을 위한 원스톱 실전 정착 정보</p>
      </header>

      {/* 안내 배너 */}
      <div className="guide-banner">
        <span>🏡</span>
        <div>
          <strong>이천이 처음이신가요?</strong>
          <p>필요한 모든 정보를 여기서 찾으세요. 전입신고부터 생활 인프라까지.</p>
        </div>
      </div>

      {/* 가이드 섹션 */}
      <div className="guide-grid">
        {GUIDE_SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="guide-card">
            <span className="guide-icon">{section.icon}</span>
            <h3>{section.title}</h3>
            <p>{section.desc}</p>
            <span className="guide-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* 커뮤니티 연결 */}
      <section className="guide-cta">
        <h2>정착 후 동네 사람들과 연결되세요</h2>
        <p>우리 동네 게시판에서 같은 단지 이웃을 만나보세요.</p>
        <Link href="/community/newtown" className="btn-primary">
          신도시 정착 게시판 바로가기
        </Link>
      </section>
    </div>
  )
}
