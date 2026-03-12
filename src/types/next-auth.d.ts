import { Grade } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      nickname?: string | null
      grade?: Grade
      points?: number
      isVerifiedHynix?: boolean
    }
  }
}
