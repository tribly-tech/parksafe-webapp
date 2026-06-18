import posthog from 'posthog-js'

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
const region = host.includes('eu') ? 'eu' : 'us'
const enabled =
  Boolean(key) &&
  process.env.NEXT_PUBLIC_POSTHOG_DISABLED !== 'true' &&
  (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true')

function capturePageview(url: string): void {
  if (!enabled) return
  posthog.capture('$pageview', { $current_url: url })
}

if (enabled && key) {
  posthog.init(key, {
    // Same-origin proxy in next.config.ts — avoids ad blockers and config CDN issues.
    api_host: '/ingest',
    ui_host: `https://${region}.posthog.com`,
    defaults: '2026-01-30',
    capture_pageview: false,
    capture_pageleave: true,
    disable_session_recording: true,
    advanced_disable_flags: true,
    respect_dnt: true,
  })

  capturePageview(window.location.href)
}

export function onRouterTransitionStart(url: string): void {
  capturePageview(window.location.origin + url)
}
