import { createMiddleware } from 'hono/factory'
import { redis } from '../lib/redis'

const COOLDOWN_SECONDS = 1800 // 30 minutes per (session, tag) pair
const DAILY_CAP = 10 // Max contacts per reporter per day

/**
 * Anti-abuse rate limiting middleware for contact routes.
 * Enforces two independent limits:
 * 1. 30-minute cooldown per (reporter session, tag) pair
 * 2. Daily cap of 10 contact attempts per reporter
 *
 * Uses Redis — no reporter identity stored, only hashed session keys.
 */
export const rateLimitMiddleware = createMiddleware<{
  Variables: { cooldownKey: string }
}>(async (c, next) => {
  const tagId = c.req.param('tagId')
  // Use X-Session-ID header, falling back to IP for anonymous sessions
  const sessionId =
    c.req.header('x-session-id') ?? c.req.header('cf-connecting-ip') ?? 'unknown'

  if (!tagId) return next()

  // ── 30-minute cooldown per (session, tag) pair ─────────────────────────
  const cooldownKey = `rl:cooldown:${sessionId}:${tagId}`
  const onCooldown = await redis.get(cooldownKey)

  if (onCooldown !== null) {
    const ttl = await redis.ttl(cooldownKey)
    return c.json(
      { error: `Please wait ${Math.ceil(ttl / 60)} minutes before contacting this vehicle again.` },
      429
    )
  }

  // ── Daily cap: 10 contacts per session per day ─────────────────────────
  const today = new Date().toISOString().split('T')[0]
  const dailyKey = `rl:daily:${sessionId}:${today}`
  const count = await redis.incr(dailyKey)

  if (count === 1) {
    // Set TTL to expire at end of day UTC + buffer
    await redis.expire(dailyKey, 86400)
  }

  if (count > DAILY_CAP) {
    return c.json({ error: 'Daily contact limit reached. Please try again tomorrow.' }, 429)
  }

  // Store cooldown key — contact route sets TTL after successful relay
  c.set('cooldownKey', cooldownKey)

  await next()

  // Set cooldown after successful relay (only if response was 2xx)
  if (c.res.status >= 200 && c.res.status < 300) {
    await redis.setex(cooldownKey, COOLDOWN_SECONDS, '1')
  }
})
