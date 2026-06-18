import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const capture = vi.fn()
const identify = vi.fn()
const reset = vi.fn()

vi.mock('posthog-js', () => ({
  default: {
    capture,
    identify,
    reset,
  },
}))

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules()
    capture.mockClear()
    identify.mockClear()
    reset.mockClear()
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_ENABLED', 'true')
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_DISABLED', 'false')
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('isAnalyticsEnabled is false when explicitly disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_DISABLED', 'true')
    vi.stubGlobal('window', {} as Window)
    const { isAnalyticsEnabled } = await import('@/lib/utils/analytics')
    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('track captures events when enabled in browser', async () => {
    vi.stubGlobal('window', {} as Window)
    const { track } = await import('@/lib/utils/analytics')

    track({ event: 'qr_scanned', properties: { tagStatus: 'ACTIVE' } })

    expect(capture).toHaveBeenCalledWith('qr_scanned', { tagStatus: 'ACTIVE' })
  })

  it('track is a no-op when analytics is disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', '')
    vi.stubGlobal('window', {} as Window)
    const { track } = await import('@/lib/utils/analytics')

    track({ event: 'offline_screen_shown', properties: {} })

    expect(capture).not.toHaveBeenCalled()
  })

  it('identifyOwner passes UUID only', async () => {
    vi.stubGlobal('window', {} as Window)
    const { identifyOwner } = await import('@/lib/utils/analytics')

    identifyOwner('owner-uuid-123')

    expect(identify).toHaveBeenCalledWith('owner-uuid-123')
  })

  it('resetAnalyticsIdentity clears PostHog session', async () => {
    vi.stubGlobal('window', {} as Window)
    const { resetAnalyticsIdentity } = await import('@/lib/utils/analytics')

    resetAnalyticsIdentity()

    expect(reset).toHaveBeenCalled()
  })
})
