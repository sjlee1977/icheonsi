import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '우리 동네',
  description: '이천 주민들의 커뮤니티 공간',
}

const CATEGORIES = [
  { id: 'FREE', label: '자유게시판', icon: '💬', desc: '일상 이야기' },
  { id: 'HYNIX', label: '하이닉스 게시판', icon: '🏭', desc: '직장인 전용 소통 공간' },
  { id: 'COMPLAINT', label: '민원 2.0', icon: '📢', desc: '공감으로 만드는 정책 제안' },
  { id: 'NEWTOWN', label: '신도시 정착', icon: '🏡', desc: '마장·중리 지구 신규 입주민' },
  { id: 'LOCAL_INFO', label: '이천 소식', icon: '📰', desc: '지역 뉴스와 공지' },
]

export default function CommunityPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">COMMUNITY</span>
        <h1 className="page-title">우리 동네</h1>
        <p className="page-desc">이천 주민들이 모이는 진짜 소통 공간</p>
      </header>

      {/* 게시판 카테고리 */}
      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/community/${cat.id.toLowerCase()}`}
            className="category-card"
          >
            <span className="category-icon">{cat.icon}</span>
            <h3>{cat.label}</h3>
            <p>{cat.desc}</p>
            <span className="category-arrow">→</span>
          </Link>
        ))}
      </div>

      {/* 최근 인기글 */}
      <section className="hot-posts">
        <div className="section-header">
          <h2 className="section-title">🔥 지금 핫한 글</h2>
          <Link href="/community/all" className="see-all">전체 보기</Link>
        </div>
        <div className="posts-placeholder">
          <p>로그인 후 커뮤니티 글을 확인하세요.</p>
          <Link href="/login" className="btn-primary-sm">로그인하기</Link>
        </div>
      </section>
    </div>
  )
}
