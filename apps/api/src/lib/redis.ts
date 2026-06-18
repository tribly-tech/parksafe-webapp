import { Redis } from '@upstash/redis'
import { env, isOtpDevMode } from '../types/env'
import { createInMemoryRedis } from './redis.memory'

/** True when Upstash is configured with real credentials (not local dev placeholders). */
export function isUpstashConfigured(): boolean {
  if (isOtpDevMode) return false

  const url = process.env['UPSTASH_REDIS_REST_URL']
  const token = process.env['UPSTASH_REDIS_REST_TOKEN']
  if (!url || !token) return false

  // Ignore template values from .env.example — they break OTP with "fetch failed".
  if (url.includes('your-redis') || token === 'your-redis-token') return false

  return true
}

/**
 * OTP / rate-limit store.
 * Uses Upstash when UPSTASH_REDIS_* is configured; otherwise in-memory (local/single-instance).
 */
export const redis = isUpstashConfigured()
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : createInMemoryRedis()

if (!isUpstashConfigured()) {
  console.warn(
    '[redis] UPSTASH_REDIS_REST_URL/TOKEN not set — OTP stored in memory only (resets on restart; not for multi-instance production)'
  )
}
