import { z } from 'zod'

/**
 * Type-safe environment variable validation.
 * Fails fast at startup if any required env var is missing or malformed.
 * In local development, safe placeholders are used when .env is not configured.
 */
const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  TWILIO_ACCOUNT_SID: z.string().min(1),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_RELAY_NUMBER: z.string().regex(/^\+\d{10,15}$/, 'Must be E.164 format'),

  WHATSAPP_ACCESS_TOKEN: z.string().min(1),
  WHATSAPP_PHONE_ID: z.string().min(1),

  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  OTP_HMAC_SECRET: z.string().min(32),
  SESSION_SIGNING_SECRET: z.string().min(32),

  NODE_ENV: z.enum(['development', 'test', 'production']),
  ALLOWED_ORIGIN: z.string().url(),
})

export type Env = z.infer<typeof envSchema>

/** Placeholders so the API can boot locally without a full .env file. */
const DEV_ENV_DEFAULTS: Record<string, string> = {
  NODE_ENV: 'development',
  ALLOWED_ORIGIN: 'http://localhost:3000',
  SUPABASE_URL: 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'dev-service-role-key',
  TWILIO_ACCOUNT_SID: 'AC00000000000000000000000000000000',
  TWILIO_AUTH_TOKEN: 'dev-twilio-token',
  TWILIO_RELAY_NUMBER: '+919999999999',
  WHATSAPP_ACCESS_TOKEN: 'dev-whatsapp-token',
  WHATSAPP_PHONE_ID: 'dev-phone-id',
  UPSTASH_REDIS_REST_URL: 'https://localhost',
  UPSTASH_REDIS_REST_TOKEN: 'dev-redis-token',
  OTP_HMAC_SECRET: 'dev-only-otp-hmac-secret-32chars-min',
  SESSION_SIGNING_SECRET: 'dev-only-session-signing-32chars-min',
}

function loadEnv(): Env {
  const nodeEnv = (process.env.NODE_ENV ?? 'development') as Env['NODE_ENV']
  const useDevDefaults =
    nodeEnv === 'development' && process.env.USE_PRODUCTION_ENV !== 'true' && !process.env.SUPABASE_URL

  const merged = useDevDefaults
    ? { ...DEV_ENV_DEFAULTS, ...process.env, NODE_ENV: nodeEnv }
    : { ...process.env, NODE_ENV: nodeEnv }

  return envSchema.parse(merged)
}

export const env = loadEnv()

/** Local dev: in-memory OTP store + console OTP (no SMS). Set OTP_DEV_MODE=false to disable. */
export const isOtpDevMode =
  env.NODE_ENV === 'development' && process.env.OTP_DEV_MODE !== 'false'
