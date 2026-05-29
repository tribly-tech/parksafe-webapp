import { apiFetch } from './client'
import type { RequestOtpInput, VerifyOtpInput } from '@parksafe/types'

interface RequestOtpResponse {
  message: string
}

interface VerifyOtpResponse {
  message: string
  verified: boolean
}

interface SignInResponse {
  accessToken: string
  refreshToken: string
  userId: string
}

/**
 * Requests an OTP for the given phone number.
 * @param input - Validated phone input
 */
export async function requestOtp(input: RequestOtpInput): Promise<RequestOtpResponse> {
  return apiFetch<RequestOtpResponse>('/auth/request-otp', {
    method: 'POST',
    body: input as Record<string, unknown>,
  })
}

/**
 * Verifies the OTP entered by the user.
 * @param input - Phone + OTP pair
 */
export async function verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResponse> {
  return apiFetch<VerifyOtpResponse>('/auth/verify-otp', {
    method: 'POST',
    body: input as Record<string, unknown>,
  })
}

/**
 * Signs in an existing owner after OTP verification.
 */
export async function signIn(input: VerifyOtpInput): Promise<SignInResponse> {
  return apiFetch<SignInResponse>('/auth/sign-in', {
    method: 'POST',
    body: input as Record<string, unknown>,
  })
}

interface CheckSignInPhoneResponse {
  registered: boolean
}

/** Returns whether the phone number belongs to a registered ParkSafe owner. */
export async function checkSignInPhone(input: RequestOtpInput): Promise<CheckSignInPhoneResponse> {
  return apiFetch<CheckSignInPhoneResponse>('/auth/sign-in/check', {
    method: 'POST',
    body: input as Record<string, unknown>,
  })
}

export const SIGN_IN_NOT_REGISTERED_CODE = 'NOT_REGISTERED'
