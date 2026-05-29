/**
 * Owner sign-in — OTP verification and session issuance for existing accounts.
 */

import { supabase } from '../lib/supabase'
import { hashPhone } from '../lib/phone'
import { isOtpDevMode } from '../types/env'
import { verifyOtp } from './otp.service'
import { ensureAuthSession } from './registration.service'
import { getUserProfile } from './profile.service'
import { createDevSession } from './dev-registration'
import { findDevUserIdByPhone } from './dev-store'

export const SIGN_IN_ERROR_NOT_REGISTERED = 'NOT_REGISTERED' as const

const NOT_REGISTERED_MESSAGE =
  'This mobile number is not registered with ParkSafe. Register your vehicle to continue.'

function phoneToInternalEmail(phoneE164: string): string {
  const phoneHash = hashPhone(phoneE164).slice(0, 32)
  return `phone+${phoneHash}@internal.parksafe.app`
}

async function findAuthUserIdByPhone(phoneE164: string): Promise<string | null> {
  const email = phoneToInternalEmail(phoneE164)
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error('[login.service] listUsers failed:', error.message)
    return null
  }

  const user = data.users.find(u => u.phone === phoneE164 || u.email === email)
  return user?.id ?? null
}

/** Whether an owner account exists for this phone (before sending sign-in OTP). */
export async function isPhoneRegistered(phoneE164: string): Promise<boolean> {
  if (isOtpDevMode) {
    return findDevUserIdByPhone(phoneE164) !== undefined
  }
  const userId = await findAuthUserIdByPhone(phoneE164)
  return userId !== null
}

interface SignInResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  userId?: string
  error?: string
  code?: string
}

export async function signInWithOtp(phoneE164: string, otp: string): Promise<SignInResult> {
  const otpResult = await verifyOtp(phoneE164, otp)
  if (!otpResult.valid) {
    return { success: false, error: otpResult.message }
  }

  let userId: string | null = null

  if (isOtpDevMode) {
    userId = findDevUserIdByPhone(phoneE164) ?? null
  } else {
    userId = await findAuthUserIdByPhone(phoneE164)
  }

  if (!userId) {
    return {
      success: false,
      error: NOT_REGISTERED_MESSAGE,
      code: SIGN_IN_ERROR_NOT_REGISTERED,
    }
  }

  if (isOtpDevMode) {
    const { accessToken, refreshToken } = createDevSession(userId)
    return { success: true, accessToken, refreshToken, userId }
  }

  const profile = await getUserProfile(userId)
  const displayName = profile?.displayName ?? 'Driver'

  const session = await ensureAuthSession(phoneE164, displayName, {})
  if ('error' in session) {
    return { success: false, error: session.error }
  }

  return {
    success: true,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    userId: session.userId,
  }
}
