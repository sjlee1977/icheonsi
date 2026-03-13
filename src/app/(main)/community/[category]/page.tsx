import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  free: { label: '자유게시판', icon: '💬' },
  hynix: { label: '하이닉스 게시판', icon: '🏭' },
  complaint: { label: '민원 2.0', icon: '📢' },
  newtown: { label: '신도시 정착', icon: '🏡' },
  local_info: { label: '이천 소식', icon: '📰' },
  market_info: { label: '장터 정보', icon: '🌾' },
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const cat = CATEGORIES[category]
  if (!cat) return { title: '게시판' }
  return {
    title: cat.label,
    description: `이천시.com ${cat.label}`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const cat = CATEGORIES[category]

  if (!cat) {
    notFound()
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← 커뮤니티 홈
          </Link>
        </div>
        <span className="page-badge">COMMUNITY</span>
        <h1 className="page-title">
          <span className="mr-2">{cat.icon}</span>
          {cat.label}
        </h1>
        <p className="page-desc">{cat.label} 게시판입니다.</p>
      </header>

      <section className="posts-section">
        <div className="posts-placeholder">
          <p>아직 등록된 게시글이 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">첫 번째 주인공이 되어보세요!</p>
          <div className="mt-6">
            <Link href="/login" className="btn-primary-sm">글쓰기</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
