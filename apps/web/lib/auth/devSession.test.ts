import { describe, expect, it, vi, afterEach } from 'vitest'
import { DEV_AUTH_TOKEN, getDevAuthCredentials, isDevAuthBypassEnabled } from './devSession'

describe('devSession', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns stable dev credentials', () => {
    expect(getDevAuthCredentials().token).toBe(DEV_AUTH_TOKEN)
  })

  it('is disabled when NEXT_PUBLIC_DEV_SKIP_AUTH=false', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_DEV_SKIP_AUTH', 'false')
    expect(isDevAuthBypassEnabled()).toBe(false)
  })
})
