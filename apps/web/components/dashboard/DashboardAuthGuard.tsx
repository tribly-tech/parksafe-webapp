'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  getDevAuthCredentials,
  hasExplicitSignOut,
  isDevAuthBypassEnabled,
} from '@/lib/auth/devSession'
import { routes } from '@/lib/routes'
import { useAuthStore } from '@/lib/store/authStore'

interface DashboardAuthGuardProps {
  children: ReactNode
}

/** Redirects unauthenticated users to sign-in (dev bypass when enabled). */
export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const router = useRouter()
  const token = useAuthStore(s => s.token)
  const hasHydrated = useAuthStore(s => s.hasHydrated)
  const setSession = useAuthStore(s => s.setSession)
  const devBypass = isDevAuthBypassEnabled()

  useEffect(() => {
    void useAuthStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (!hasHydrated) return
    if (!token && devBypass && !hasExplicitSignOut()) {
      const { token: devToken, userId } = getDevAuthCredentials()
      setSession(devToken, userId)
      return
    }
    if (!token) {
      router.replace(routes.signIn)
    }
  }, [hasHydrated, token, devBypass, setSession, router])

  if (!hasHydrated) {
    return null
  }

  if (!token) {
    return null
  }

  return <>{children}</>
}
