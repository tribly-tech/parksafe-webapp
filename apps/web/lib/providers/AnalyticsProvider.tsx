'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { type ReactNode } from 'react'
import { PostHogIdentify } from '@/components/analytics/PostHogIdentify'

/** Wraps the app with PostHog context — init happens in instrumentation-client.ts. */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogIdentify />
      {children}
    </PostHogProvider>
  )
}
