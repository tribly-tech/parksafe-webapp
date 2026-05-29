import type { Metadata } from 'next'
import { SignInOtpContent } from '@/components/auth/SignInOtpContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_VERIFY_OTP_TITLE,
  description: en.META_SIGN_IN_DESCRIPTION,
}

/** /sign-in/otp — OTP verification step for sign-in. */
export default function SignInOtpPage() {
  return <SignInOtpContent />
}
