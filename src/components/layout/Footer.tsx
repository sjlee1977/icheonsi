import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              이천시
            </div>
            <p>이천의 모든 사람과 정보를 하나로 잇습니다.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>서비스</h4>
              <Link href="/now">이천 나우</Link>
              <Link href="/community">우리 동네</Link>
              <Link href="/market">이천 장터</Link>
              <Link href="/welfare">복지 허브</Link>
              <Link href="/guide">정착 가이드</Link>
            </div>
            <div className="footer-col">
              <h4>정보</h4>
              <Link href="/privacy">개인정보처리방침</Link>
              <Link href="/terms">이용약관</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ICHEONSI · 이천의 진짜 디지털 광장</p>
        </div>
      </div>
    </footer>
  )
}
