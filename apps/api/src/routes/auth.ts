import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { RequestOtpSchema, VerifyOtpSchema } from '@parksafe/types'
import { requestOtp, verifyOtp } from '../services/otp.service'
import { isPhoneRegistered, signInWithOtp, SIGN_IN_ERROR_NOT_REGISTERED } from '../services/login.service'

export const authRoutes = new Hono()

/**
 * POST /auth/request-otp
 * Public — initiates OTP delivery to the provided phone number.
 * Phone is validated by Zod then passed only to the OTP service (never stored).
 */
authRoutes.post('/request-otp', zValidator('json', RequestOtpSchema), async c => {
  const { phone } = c.req.valid('json')

  try {
    const result = await requestOtp(phone)

    if (!result.success) {
      return c.json({ error: result.message }, 429)
    }

    return c.json({ message: result.message })
  } catch (err) {
    console.error('[auth] request-otp failed:', err instanceof Error ? err.message : err)
    const message =
      err instanceof Error ? err.message : 'Failed to send OTP. Please try again.'
    return c.json({ error: message }, 500)
  }
})

/**
 * POST /auth/verify-otp
 * Public — verifies the OTP and returns a Supabase session on success.
 */
authRoutes.post('/verify-otp', zValidator('json', VerifyOtpSchema), async c => {
  const { phone, otp } = c.req.valid('json')
  const result = await verifyOtp(phone, otp)

  if (!result.valid) {
    const statusCode = result.message.includes('locked') ? 429 : 400
    return c.json({ error: result.message }, statusCode)
  }

  return c.json({ message: result.message, verified: true })
})

/**
 * POST /auth/sign-in/check
 * Public — returns whether the phone belongs to a registered ParkSafe owner.
 */
authRoutes.post('/sign-in/check', zValidator('json', RequestOtpSchema), async c => {
  const { phone } = c.req.valid('json')
  const registered = await isPhoneRegistered(phone)
  return c.json({ registered })
})

/**
 * POST /auth/sign-in
 * Public — verifies OTP and returns a session for an existing owner account.
 */
authRoutes.post('/sign-in', zValidator('json', VerifyOtpSchema), async c => {
  const { phone, otp } = c.req.valid('json')

  try {
    const result = await signInWithOtp(phone, otp)

    if (!result.success) {
      const statusCode = result.error?.includes('locked') ? 429 : 400
      return c.json(
        {
          error: result.error,
          ...(result.code === SIGN_IN_ERROR_NOT_REGISTERED ? { code: result.code } : {}),
        },
        statusCode
      )
    }

    return c.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      userId: result.userId,
    })
  } catch (err) {
    console.error('[auth] sign-in failed:', err instanceof Error ? err.message : err)
    return c.json({ error: 'Sign in failed. Please try again.' }, 500)
  }
})
