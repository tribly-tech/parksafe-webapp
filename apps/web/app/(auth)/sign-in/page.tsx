import type { Metadata } from 'next'
import { SignInForm } from '@/components/auth/SignInForm'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_SIGN_IN_TITLE,
  description: en.META_SIGN_IN_DESCRIPTION,
}

/** /sign-in — Mobile OTP sign-in for existing owners. */
export default function SignInPage() {
  return <SignInForm />
}
