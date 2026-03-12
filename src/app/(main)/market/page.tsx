import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이천 장터',
  description: '이천쌀 직거래부터 동네 중고거래까지',
}

const MARKET_CATEGORIES = [
  { id: 'RICE', label: '이천쌀 직거래', icon: '🌾', desc: '당일 도정 신선한 이천쌀' },
  { id: 'PRODUCE', label: '농산물', icon: '🥦', desc: '지역 농가 직거래' },
  { id: 'ELECTRONICS', label: '전자기기', icon: '📱', desc: '중고 전자제품' },
  { id: 'FURNITURE', label: '가구·인테리어', icon: '🪑', desc: '이사·이전 가구' },
  { id: 'KIDS', label: '유아·아동', icon: '👶', desc: '육아용품 나눔' },
  { id: 'OTHER', label: '기타', icon: '📦', desc: '그 외 물건' },
]

export default function MarketPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <span className="page-badge">MARKET</span>
        <h1 className="page-title">이천 장터</h1>
        <p className="page-desc">농가 직거래부터 동네 중고거래까지, 이천의 신뢰 마켓</p>
      </header>

      {/* 글쓰기 버튼 */}
      <div className="market-actions">
        <Link href="/market/new" className="btn-primary">
          + 물건 팔기
        </Link>
      </div>

      {/* 카테고리 */}
      <div className="category-grid market-cat">
        {MARKET_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/market/${cat.id.toLowerCase()}`}
            className="category-card"
          >
            <span className="category-icon">{cat.icon}</span>
            <h3>{cat.label}</h3>
            <p>{cat.desc}</p>
          </Link>
        ))}
      </div>

      {/* 최근 등록 */}
      <section className="recent-items">
        <div className="section-header">
          <h2 className="section-title">최근 등록된 물건</h2>
          <Link href="/market/all" className="see-all">전체 보기</Link>
        </div>
        <div className="items-placeholder">
          <p>아직 등록된 물건이 없습니다.</p>
          <p>첫 번째 판매자가 되어보세요!</p>
        </div>
      </section>
    </div>
  )
}
