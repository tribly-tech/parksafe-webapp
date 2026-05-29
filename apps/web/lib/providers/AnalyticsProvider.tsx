'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, type ReactNode } from 'react'

/**
 * PostHog analytics provider — initialised once on mount.
 * Anonymous IDs only — no PII ever passed to PostHog.
 * Disabled in development to avoid polluting analytics data.
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env['NEXT_PUBLIC_POSTHOG_KEY']
    const host = process.env['NEXT_PUBLIC_POSTHOG_HOST'] ?? 'https://app.posthog.com'

    if (!key || process.env['NODE_ENV'] !== 'production') return

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      // Disable session recording — privacy-first
      disable_session_recording: true,
      // Respect Do Not Track browser setting
      respect_dnt: true,
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
