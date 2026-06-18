'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { isAnalyticsEnabled } from '@/lib/utils/analytics'

/** Captures SPA pageviews for the App Router. */
export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isAnalyticsEnabled()) return

    let url = window.origin + pathname
    const query = searchParams.toString()
    if (query) {
      url += `?${query}`
    }

    if (urlRef.current === url) return
    urlRef.current = url

    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}
