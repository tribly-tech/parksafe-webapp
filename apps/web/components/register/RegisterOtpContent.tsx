'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { requestOtp } from '@/lib/api/auth'
import { registerVehicle } from '@/lib/api/registration'
import { ApiError } from '@/lib/api/client'
import {
  clearRegisterDraft,
  loadRegisterDraft,
  updateRegisterDraftDevOtp,
} from '@/lib/flow-storage'
import { routes } from '@/lib/routes'
import { useAuthStore } from '@/lib/store/authStore'
import { track } from '@/lib/utils/analytics'
import { normalizePlate } from '@/lib/utils/plateFormat'
import { toE164Indian } from '@/lib/utils/phoneUtils'
import { RegisterOtpDialog, RESEND_COOLDOWN_SECONDS } from './RegisterOtpDialog'
import { useTranslations } from 'next-intl'

/** Registration OTP bottom sheet — /register/otp */
export function RegisterOtpContent() {
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tagFromUrl = searchParams.get('tag') ?? undefined
  const setTokens = useAuthStore(s => s.setTokens)

  const [ready, setReady] = useState(false)
  const [phoneDigits, setPhoneDigits] = useState('')
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const otpAttemptCount = useRef(0)
  const step2Tracked = useRef(false)
  const verifyInFlight = useRef(false)

  useEffect(() => {
    const draft = loadRegisterDraft()
    if (!draft) {
      router.replace(routes.register(tagFromUrl ? { tag: tagFromUrl } : undefined))
      return
    }
    setPhoneDigits(draft.form.ownerPhone)
    setDevOtp(draft.devOtp ?? null)
    setReady(true)
  }, [router, tagFromUrl])

  useEffect(() => {
    if (!ready || step2Tracked.current) return
    step2Tracked.current = true
    track({ event: 'registration_step', properties: { step: 2 } })
  }, [ready])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleClose = useCallback(() => {
    router.push(routes.register(tagFromUrl ? { tag: tagFromUrl } : undefined))
  }, [router, tagFromUrl])

  const completeRegistration = useCallback(
    async (otpCode: string) => {
      if (verifyInFlight.current) return

      const draft = loadRegisterDraft()
      if (!draft) {
        handleClose()
        return
      }

      verifyInFlight.current = true
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const tagCode = tagFromUrl ?? draft.tagCode
        const payload = {
          ...draft.form,
          plate: normalizePlate(draft.form.plate),
          otp: otpCode,
          consent: true as const,
          tagCode,
        }

        const result = await registerVehicle(payload)
        clearRegisterDraft()
        setTokens(result.accessToken, result.refreshToken, result.userId)
        track({ event: 'otp_verified', properties: { flow: 'register' } })
        track({ event: 'registration_step', properties: { step: 3 } })
        router.replace(routes.registerSuccess)
      } catch (err) {
        otpAttemptCount.current += 1
        track({
          event: 'otp_failed',
          properties: { flow: 'register', attemptCount: otpAttemptCount.current },
        })
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : t('GLOBAL_ERROR_GENERIC')
        setSubmitError(message)
      } finally {
        verifyInFlight.current = false
        setIsSubmitting(false)
      }
    },
    [handleClose, router, setTokens, t, tagFromUrl]
  )

  const handleResendOtp = useCallback(async () => {
    const draft = loadRegisterDraft()
    if (!draft || resendCooldown > 0) return
    try {
      const result = await requestOtp({ phone: toE164Indian(draft.form.ownerPhone) })
      track({ event: 'otp_requested', properties: { flow: 'register' } })
      updateRegisterDraftDevOtp(result.devOtp ?? '')
      setDevOtp(result.devOtp ?? null)
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
      setSubmitError(null)
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : t('GLOBAL_ERROR_GENERIC'))
    }
  }, [resendCooldown, t])

  if (!ready) {
    return null
  }

  return (
    <RegisterOtpDialog
      open
      phoneDigits={phoneDigits}
      devOtp={devOtp}
      error={submitError}
      isVerifying={isSubmitting}
      isResending={false}
      resendCooldown={resendCooldown}
      onVerify={code => void completeRegistration(code)}
      onResend={() => void handleResendOtp()}
      onClose={handleClose}
    />
  )
}
