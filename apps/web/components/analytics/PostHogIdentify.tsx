'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { identifyOwner } from '@/lib/utils/analytics'

/** Syncs PostHog identity with the authenticated owner UUID (no PII). */
export function PostHogIdentify() {
  const userId = useAuthStore(s => s.userId)
  const hasHydrated = useAuthStore(s => s.hasHydrated)

  useEffect(() => {
    if (!hasHydrated || !userId) return
    identifyOwner(userId)
  }, [userId, hasHydrated])

  return null
}
