import { createMiddleware } from 'hono/factory'

/**
 * Structured request logger — PII-safe.
 * Logs method, path, status, and duration.
 * NEVER logs: request bodies, phone numbers, OTPs, or any user data.
 */
export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  // Strip query params from logged path to avoid logging sensitive values
  const path = new URL(c.req.url).pathname

  await next()

  const duration = Date.now() - start
  const status = c.res.status

  console.log(
    JSON.stringify({
      type: 'request',
      method,
      path,
      status,
      durationMs: duration,
    })
  )
})
