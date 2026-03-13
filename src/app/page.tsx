export const dynamic = 'force-dynamic'

import Providers from '@/components/layout/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BentoClient from '@/components/home/BentoClient'
import Link from 'next/link'

export default function Home() {
  return (
    <Providers>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-text">
              <div className="badge-live">
                <span className="pulse" />
                ICHEONSI.COM BETA
              </div>
              <h1 className="hero-title">
                이천 살면<br />
                <span className="text-gradient">이거 하나면</span> 돼.
              </h1>
              <p className="hero-desc">
                쌀과 도자기의 도시를 넘어 — SK하이닉스 직장인부터 신도시 유입 인구까지
                한 곳에서 만나는 진짜 디지털 광장.
              </p>
              <div className="hero-actions">
                <Link href="/now" className="btn-primary">
                  지금 이천 보기
                </Link>
                <Link href="/community" className="btn-outline">
                  커뮤니티 입장
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-value">22.7만</span>
                  <span className="stat-label">이천시 총 인구</span>
                </div>
                <div className="stat">
                  <span className="stat-value">5개</span>
                  <span className="stat-label">핵심 서비스</span>
                </div>
                <div className="stat">
                  <span className="stat-value">BETA</span>
                  <span className="stat-label">서비스 운영 중</span>
                </div>
              </div>
            </div>

            {/* Bento 미리보기 — 실데이터 연동 */}
            <div className="hero-visual">
              <BentoClient />
            </div>
          </div>
        </section>

        {/* OH! — 이천시.com이란 */}
        <section className="land-section off">
          <div className="land-container">
            <div className="land-eyebrow">OH!</div>
            <div className="land-sublabel">이게 뭐야</div>
            <div className="land-grid">
              <div>
                <h2 className="land-heading">
                  이천 사람을 위한,<br />
                  이천 사람에 의한<br />
                  디지털 동네.
                </h2>
              </div>
              <div>
                <p className="land-body">
                  이천시.com은 SK하이닉스 직장인, 마장·중리 신도시 입주민, 지역 자영업자,
                  그리고 오랜 이천 토박이가 모두 함께 쓰는 플랫폼입니다.<br /><br />
                  날씨, 경강선, 병원, 복지 혜택, 동네 커뮤니티까지 — 이천에서 살아가는 데
                  필요한 모든 정보를 한 곳에서 확인하세요.
                </p>
                <div className="land-cols" style={{ marginTop: '32px' }}>
                  <div>
                    <div className="land-col-title">실시간 정보</div>
                    <div className="land-col-body">날씨, 경강선 열차, 병원·약국 현황을 실시간으로 확인</div>
                  </div>
                  <div>
                    <div className="land-col-title">지역 커뮤니티</div>
                    <div className="land-col-body">하이닉스 게시판, 자유게시판, 민원 2.0까지 우리 동네 이야기</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hm... — 서비스 */}
        <section className="land-section">
          <div className="land-container">
            <div className="land-eyebrow">Hm...</div>
            <div className="land-sublabel">어떤 서비스가 있나요</div>
            <div className="service-grid">
              <Link href="/now" className="service-card">
                <div className="service-icon">🌤</div>
                <h3>이천 나우</h3>
                <p>날씨, 경강선, 병원·약국 실시간 정보</p>
              </Link>
              <Link href="/community" className="service-card">
                <div className="service-icon">💬</div>
                <h3>우리 동네</h3>
                <p>하이닉스 게시판, 민원 2.0, 자유게시판</p>
              </Link>
              <Link href="/market" className="service-card">
                <div className="service-icon">🌾</div>
                <h3>이천 장터</h3>
                <p>이천쌀 직거래, 지역 중고거래</p>
              </Link>
              <Link href="/welfare" className="service-card">
                <div className="service-icon">🏛</div>
                <h3>복지 허브</h3>
                <p>나에게 맞는 이천시 복지 혜택 찾기</p>
              </Link>
              <Link href="/guide" className="service-card">
                <div className="service-icon">🏡</div>
                <h3>정착 가이드</h3>
                <p>마장·중리 신도시 입주민 필수 정보</p>
              </Link>
            </div>
          </div>
        </section>

        {/* So... — 지금 시작 */}
        <section className="land-section dark">
          <div className="land-container">
            <div className="land-eyebrow" style={{ color: 'white' }}>So...</div>
            <div className="land-sublabel">지금 바로 시작하세요</div>
            <div className="land-grid">
              <div>
                <h2 className="land-heading">
                  30초면 충분해요.<br />
                  카카오로 바로 시작.
                </h2>
                <p className="land-body" style={{ marginTop: '20px', marginBottom: '32px' }}>
                  별도 앱 설치 없이, 카카오 또는 구글 계정으로
                  바로 이천시.com의 모든 서비스를 이용하세요.
                </p>
                <Link href="/login" className="btn-yellow btn-lg">
                  무료로 시작하기
                </Link>
              </div>
              <div className="highlight-grid">
                <div className="highlight-card">
                  <div className="highlight-icon">📍</div>
                  <h3>실시간 이천 정보</h3>
                  <p>날씨부터 경강선 다음 열차까지, 지금 이천의 상황을 한눈에</p>
                  <Link href="/now">바로가기 →</Link>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">🏘</div>
                  <h3>동네 커뮤니티</h3>
                  <p>이웃과 소통하고 지역 정보를 공유하는 이천만의 공간</p>
                  <Link href="/community">입장하기 →</Link>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">🌾</div>
                  <h3>이천쌀 직거래</h3>
                  <p>산지 직접 구매로 더 신선하고 저렴한 이천 명품쌀</p>
                  <Link href="/market">장터 가기 →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Providers>
  )
}
