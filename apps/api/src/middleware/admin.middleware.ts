import { createMiddleware } from 'hono/factory'
import { timingSafeEqual } from 'node:crypto'
import { env } from '../types/env'

function getAdminApiKey(): string | undefined {
  return env.ADMIN_API_KEY
}

function keysMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Admin API key middleware — validates X-Admin-Api-Key header.
 * Requires ADMIN_API_KEY env var in production.
 */
export const adminMiddleware = createMiddleware(async (c, next) => {
  const expectedKey = getAdminApiKey()

  if (!expectedKey) {
    console.error('[admin] ADMIN_API_KEY is not configured')
    return c.json({ error: 'Admin access is not configured', code: 'ADMIN_NOT_CONFIGURED' }, 503)
  }

  const providedKey = c.req.header('X-Admin-Api-Key')

  if (!providedKey) {
    return c.json({ error: 'Missing admin API key', code: 'ADMIN_UNAUTHORIZED' }, 401)
  }

  if (!keysMatch(providedKey, expectedKey)) {
    return c.json({ error: 'Invalid admin API key', code: 'ADMIN_UNAUTHORIZED' }, 401)
  }

  await next()
})
