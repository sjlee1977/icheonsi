'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

const navLinks = [
  { href: '/now', label: '이천 나우' },
  { href: '/community', label: '우리 동네' },
  { href: '/market', label: '이천 장터' },
  { href: '/welfare', label: '복지 허브' },
  { href: '/guide', label: '정착 가이드' },
]

const GRADE_LABELS: Record<string, string> = {
  SPROUT: '🌱 새싹',
  RESIDENT: '🏘 주민',
  LOCAL: '🌾 토박이',
  CHIEF: '👨‍💼 이장',
}

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        {/* 로고 */}
        <Link href="/" className="logo">
          <span className="logo-dot" />
          이천시
        </Link>

        {/* 데스크탑 링크 */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 우측 액션 */}
        <div className="nav-actions">
          {session ? (
            <div className="user-menu">
              <span className="user-grade">
                {GRADE_LABELS[session.user.grade ?? 'SPROUT']}
              </span>
              <button className="btn-user" onClick={() => signOut()}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className="btn-cta" onClick={() => signIn()}>
              로그인
            </button>
          )}

          {/* 모바일 햄버거 */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <button
              className="mobile-login"
              onClick={() => { signIn(); setMenuOpen(false) }}
            >
              로그인
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
