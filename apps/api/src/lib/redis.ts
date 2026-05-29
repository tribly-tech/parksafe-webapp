import { Redis } from '@upstash/redis'
import { env, isOtpDevMode } from '../types/env'
import { createInMemoryRedis } from './redis.memory'

/**
 * Upstash Redis client — edge-compatible, HTTP-based.
 * In OTP dev mode, uses an in-memory store so local registration works without Upstash.
 */
export const redis = isOtpDevMode
  ? createInMemoryRedis()
  : new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
