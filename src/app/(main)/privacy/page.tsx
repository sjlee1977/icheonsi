import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="page-container" style={{ maxWidth: '720px' }}>
      <header className="page-header">
        <h1 className="page-title">개인정보처리방침</h1>
        <p className="page-desc">이천시 개인정보처리방침</p>
      </header>

      <div style={{ lineHeight: '1.8', color: 'var(--text)', fontSize: '0.95rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>1. 수집하는 개인정보</h2>
        <p>이천시은 서비스 제공을 위해 다음과 같은 정보를 수집합니다.</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>카카오 또는 구글 소셜 로그인 시: 이름, 이메일 주소, 프로필 사진</li>
          <li>서비스 이용 시: 작성한 게시글 및 댓글</li>
        </ul>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>2. 개인정보 이용 목적</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>회원 식별 및 서비스 제공</li>
          <li>커뮤니티 서비스 운영</li>
          <li>서비스 개선 및 통계 분석</li>
        </ul>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>3. 개인정보 보유 기간</h2>
        <p>회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>4. 개인정보 제3자 제공</h2>
        <p>이천시은 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의한 경우는 예외로 합니다.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>5. 문의</h2>
        <p>개인정보 관련 문의는 서비스 내 문의 채널을 통해 접수해 주세요.</p>

        <p style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'var(--muted)' }}>시행일: 2026년 1월 1일</p>
      </div>
    </div>
  )
}
