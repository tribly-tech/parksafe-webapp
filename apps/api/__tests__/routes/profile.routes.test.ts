import { describe, it, expect, vi } from 'vitest'
import app from '../../src/index'

vi.mock('../../src/types/env', async importOriginal => {
  const actual = await importOriginal<typeof import('../../src/types/env')>()
  return {
    ...actual,
    isOtpDevMode: true,
  }
})

vi.mock('../../src/services/auth.service', () => ({
  verifyAccessToken: vi.fn().mockRejectedValue(new Error('invalid')),
}))

describe('profile routes', () => {
  it('GET /profile/settings returns 401 without authorization', async () => {
    const res = await app.request('/profile/settings')
    expect(res.status).toBe(401)
  })

  it('GET /profile/settings returns settings for dev-session token', async () => {
    const userId = '00000000-0000-0000-0000-000000000010'
    const res = await app.request('/profile/settings', {
      headers: { Authorization: `Bearer dev-session:${userId}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.settings).toEqual({
      notifyWhatsapp: true,
      marketingEmails: false,
    })
  })
})
