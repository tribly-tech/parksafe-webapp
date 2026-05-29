import { createMiddleware } from 'hono/factory'
import { supabase } from '../lib/supabase'
import { isOtpDevMode } from '../types/env'
import { parseDevSessionToken } from '../services/dev-registration'

/**
 * Supabase JWT auth middleware.
 * Validates the Bearer token from the Authorization header.
 * In OTP dev mode, accepts locally issued dev-session tokens.
 */
export const authMiddleware = createMiddleware<{
  Variables: { userId: string }
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or malformed authorization header' }, 401)
  }

  const token = authHeader.slice(7)

  if (isOtpDevMode) {
    const devUserId = parseDevSessionToken(token)
    if (devUserId) {
      c.set('userId', devUserId)
      await next()
      return
    }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }

  c.set('userId', user.id)

  await next()
})
