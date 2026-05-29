import { Suspense } from 'react'
import type { Metadata } from 'next'
import { RegisterOtpContent } from '@/components/register/RegisterOtpContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_VERIFY_OTP_TITLE,
  description: en.META_REGISTER_DESCRIPTION,
}

/** /register/otp — Registration OTP bottom sheet (URL-addressable). */
export default function RegisterOtpPage() {
  return (
    <Suspense fallback={null}>
      <RegisterOtpContent />
    </Suspense>
  )
}
