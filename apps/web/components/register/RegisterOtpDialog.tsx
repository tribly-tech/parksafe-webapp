'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { OtpInput } from '@/components/shared/OtpInput'
import { maskIndianMobile } from '@/lib/utils/phoneUtils'
import { cn } from '@/lib/utils/cn'

interface RegisterOtpDialogProps {
  phoneDigits: string
  open: boolean
  /** Shown in local dev when API returns devOtp — never shown in production. */
  devOtp?: string | null
  error: string | null
  isVerifying: boolean
  isResending: boolean
  resendCooldown: number
  onVerify: (otp: string) => void
  onResend: () => void
  onClose: () => void
}

const RESEND_COOLDOWN_SECONDS = 30

/**
 * OTP verification overlay — shown after the user submits the registration form.
 */
export function RegisterOtpDialog({
  phoneDigits,
  open,
  devOtp,
  error,
  isVerifying,
  isResending,
  resendCooldown,
  onVerify,
  onResend,
  onClose,
}: RegisterOtpDialogProps) {
  const t = useTranslations()
  const [otpKey, setOtpKey] = useState(0)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open) setOtpKey(k => k + 1)
  }, [open])

  useEffect(() => {
    if (error) setOtpKey(k => k + 1)
  }, [error])

  if (!open) return null

  const maskedPhone = maskIndianMobile(phoneDigits)
  const subtitle = t('REGISTER_OTP_SUBTITLE', { phone: maskedPhone })
  const canResend = resendCooldown <= 0 && !isResending

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-otp-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t('ARIA_CLOSE_DIALOG')}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-page rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="register-otp-title" className="text-xl font-bold text-neutral-900">
              {t('REGISTER_OTP_TITLE')}
            </h2>
            <p className="text-sm text-neutral-600">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-button border border-neutral-200 bg-white"
            aria-label={t('REGISTER_OTP_CANCEL')}
          >
            <X className="size-5 text-neutral-600" aria-hidden />
          </button>
        </div>

        {devOtp && (
          <div
            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            <p className="font-semibold">Dev mode OTP</p>
            <p className="mt-1 font-mono text-lg tracking-widest">{devOtp}</p>
            <p className="mt-1 text-xs text-amber-800">
              Use this code only — it expires when you resend or restart the API.
            </p>
          </div>
        )}

        <OtpInput
          key={otpKey}
          onComplete={onVerify}
          {...(error ? { error } : {})}
          disabled={isVerifying}
        />

        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            type="button"
            disabled={!canResend}
            onClick={() => {
              onResend()
            }}
            className={cn(
              'text-sm font-medium',
              canResend ? 'text-primary-500 hover:text-primary-600' : 'text-neutral-400'
            )}
          >
            {canResend
              ? t('REGISTER_OTP_RESEND')
              : t('REGISTER_OTP_RESEND_WAIT', { seconds: resendCooldown })}
          </button>
          {isVerifying && (
            <p className="text-sm text-neutral-500" aria-live="polite">
              {t('OTP_VERIFYING')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export { RESEND_COOLDOWN_SECONDS }
