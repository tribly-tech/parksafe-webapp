import { createMiddleware } from 'hono/factory'
import { env } from '../types/env'

/**
 * CORS middleware — only allows requests from the production domain
 * (or localhost in dev). Blocks all other origins.
 */
export const corsMiddleware = createMiddleware(async (c, next) => {
  const origin = c.req.header('origin')
  const allowedOrigin = env.ALLOWED_ORIGIN

  if (origin === allowedOrigin) {
    c.header('Access-Control-Allow-Origin', allowedOrigin)
    c.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-ID')
    c.header('Access-Control-Allow-Credentials', 'true')
    c.header('Vary', 'Origin')
  }

  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204)
  }

  await next()
})
