'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginClient() {
  return (
    <div className="login-page">
      <div className="login-box">
        {/* 로고 */}
        <Link href="/" className="login-logo">
          <span className="logo-dot" />
          이천시<span>.com</span>
        </Link>

        <h1 className="login-title">로그인</h1>
        <p className="login-desc">이천의 모든 정보와 커뮤니티를 이용하려면 로그인하세요.</p>

        <div className="login-buttons">
          {/* 카카오 로그인 */}
          <button
            className="btn-kakao"
            onClick={() => signIn('kakao', { callbackUrl: '/' })}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C5.582 2 2 4.896 2 8.444c0 2.276 1.49 4.27 3.74 5.41L4.86 17.2a.375.375 0 00.553.408l4.244-2.822c.11.007.224.01.343.01 4.418 0 8-2.896 8-6.444S14.418 2 10 2z"
                fill="currentColor"
              />
            </svg>
            카카오로 로그인
          </button>

          {/* 구글 로그인 */}
          <button
            className="btn-google"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-1.99 3.02v2.5h3.22c1.89-1.74 2.98-4.3 2.98-7.31z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.96-.9 6.62-2.46l-3.22-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.8-1.76-5.59-4.12H1.1v2.58A10 10 0 0010 20z" fill="#34A853"/>
              <path d="M4.41 11.88A5.96 5.96 0 014.1 10c0-.65.11-1.29.31-1.88V5.54H1.1A10 10 0 000 10c0 1.61.39 3.14 1.1 4.46l3.31-2.58z" fill="#FBBC05"/>
              <path d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.87-2.86C14.96.9 12.7 0 10 0A10 10 0 001.1 5.54l3.31 2.58C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335"/>
            </svg>
            구글로 로그인
          </button>
        </div>

        <p className="login-terms">
          로그인 시{' '}
          <Link href="/terms">이용약관</Link> 및{' '}
          <Link href="/privacy">개인정보처리방침</Link>에 동의합니다.
        </p>
      </div>
    </div>
  )
}
