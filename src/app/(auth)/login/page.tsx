import type { Metadata } from 'next'
import Providers from '@/components/layout/Providers'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: '로그인',
  description: '이천시.com에 로그인하세요',
}

export default function LoginPage() {
  return (
    <Providers>
      <LoginClient />
    </Providers>
  )
}
