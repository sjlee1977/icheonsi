import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
}

export default function TermsPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <header className="page-header">
        <h1 className="page-title">이용약관</h1>
        <p className="page-desc">이천시 서비스 이용약관</p>
      </header>

      <div style={{ lineHeight: '1.8', color: 'var(--text)', fontSize: '0.95rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>제1조 (목적)</h2>
        <p>이 약관은 이천시(이하 "서비스")이 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>제2조 (서비스 이용)</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>서비스는 이천시 지역 정보 제공 및 커뮤니티 기능을 제공합니다.</li>
          <li>회원은 소셜 로그인(카카오, 구글)을 통해 가입할 수 있습니다.</li>
          <li>서비스는 베타 운영 중으로 기능이 변경될 수 있습니다.</li>
        </ul>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>제3조 (금지 행위)</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>타인의 명예를 훼손하거나 불쾌감을 주는 게시물 작성</li>
          <li>개인정보 무단 수집 및 유포</li>
          <li>서비스의 정상적인 운영을 방해하는 행위</li>
          <li>법령에 위반되는 행위</li>
        </ul>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>제4조 (서비스 변경 및 중단)</h2>
        <p>운영상, 기술상의 이유로 서비스를 변경하거나 일시 중단할 수 있으며, 이에 대한 별도 보상은 하지 않습니다.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>제5조 (면책)</h2>
        <p>이천시은 실시간 정보(날씨, 교통 등)의 정확성을 보장하지 않으며, 정보 이용으로 인한 손해에 대해 책임지지 않습니다.</p>

        <p style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'var(--muted)' }}>시행일: 2026년 1월 1일</p>
      </div>
    </div>
  )
}
