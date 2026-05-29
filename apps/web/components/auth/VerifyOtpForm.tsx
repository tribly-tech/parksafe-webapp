'use client'

import { OtpInput } from '@/components/shared/OtpInput'
import { useTranslations } from 'next-intl'

/**
 * Standalone OTP verification form for the /verify-otp route.
 */
export function VerifyOtpForm() {
  const t = useTranslations()

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <OtpInput onComplete={() => undefined} disabled={false} />
      <p className="text-center text-xs text-neutral-500">{t('OTP_ENTER_LABEL')}</p>
    </div>
  )
}
