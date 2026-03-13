import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const MARKET_CATEGORIES: Record<string, { label: string; icon: string }> = {
  rice: { label: '이천쌀 직거래', icon: '🌾' },
  produce: { label: '농산물', icon: '🥦' },
  electronics: { label: '전자기기', icon: '📱' },
  furniture: { label: '가구·인테리어', icon: '🪑' },
  kids: { label: '유아·아동', icon: '👶' },
  other: { label: '기타', icon: '📦' },
  all: { label: '전체 보기', icon: '🔍' },
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const cat = MARKET_CATEGORIES[category]
  if (!cat) return { title: '장터' }
  return {
    title: cat.label,
    description: `이천 장터 - ${cat.label}`,
  }
}

export default async function MarketCategoryPage({ params }: PageProps) {
  const { category } = await params
  const cat = MARKET_CATEGORIES[category]

  if (!cat) {
    notFound()
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/market" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← 장터 홈
          </Link>
        </div>
        <span className="page-badge">MARKET</span>
        <h1 className="page-title">
          <span className="mr-2">{cat.icon}</span>
          {cat.label}
        </h1>
        <p className="page-desc">{cat.label} 물건을 확인하세요.</p>
      </header>

      <div className="market-actions">
        <Link href="/market/new" className="btn-primary">
          + 물건 팔기
        </Link>
      </div>

      <section className="items-section">
        <div className="items-placeholder">
          <p>등록된 물건이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">첫 번째 판매자가 되어보세요!</p>
        </div>
      </section>
    </div>
  )
}
