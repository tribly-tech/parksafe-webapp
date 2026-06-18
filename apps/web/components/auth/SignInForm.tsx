'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PhoneField } from '@/components/register/register-ui'
import { Button } from '@/components/ui/button'
import { checkSignInPhone, requestOtp } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { loadSignInPhone, saveSignInPhone } from '@/lib/flow-storage'
import { routes } from '@/lib/routes'
import { useAuthStore } from '@/lib/store/authStore'
import { track } from '@/lib/utils/analytics'
import { sanitizeIndianMobile, toE164Indian } from '@/lib/utils/phoneUtils'

const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/

/** Sign-in phone step — /sign-in */
export function SignInForm() {
  const t = useTranslations()
  const router = useRouter()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const hasHydrated = useAuthStore(s => s.hasHydrated)

  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notRegistered, setNotRegistered] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  useEffect(() => {
    void useAuthStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace(routes.dashboard)
    }
  }, [hasHydrated, isAuthenticated, router])

  useEffect(() => {
    const stored = loadSignInPhone()
    if (stored) setPhone(stored)
  }, [])

  const phoneE164 = toE164Indian(phone)
  const isPhoneValid = INDIAN_MOBILE_PATTERN.test(sanitizeIndianMobile(phone))

  const handleSendOtp = async () => {
    if (!isPhoneValid) return
    setError(null)
    setNotRegistered(false)
    setIsSendingOtp(true)
    try {
      const { registered } = await checkSignInPhone({ phone: phoneE164 })
      if (!registered) {
        setNotRegistered(true)
        return
      }
      await requestOtp({ phone: phoneE164 })
      track({ event: 'otp_requested', properties: { flow: 'sign_in' } })
      saveSignInPhone(phone)
      router.push(routes.signInOtp)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('GLOBAL_ERROR_GENERIC'))
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    setNotRegistered(false)
    setError(null)
  }

  if (!hasHydrated || isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-register-tint">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-page items-center gap-3">
          <Link
            href={routes.home}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors hover:bg-neutral-50"
            aria-label={t('ARIA_GO_BACK')}
          >
            <ArrowLeft className="size-5 text-neutral-900" strokeWidth={2} aria-hidden />
          </Link>
          <h1 className="text-base font-semibold text-neutral-900">{t('SIGN_IN_PAGE_TITLE')}</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-[-0.48px] text-neutral-900">
            {t('SIGN_IN_HEADING')}
          </h2>
          <p className="text-[15px] leading-[22.5px] text-neutral-600">{t('SIGN_IN_SUBTITLE')}</p>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={e => {
            e.preventDefault()
            void handleSendOtp()
          }}
        >
          <PhoneField
            label={t('OTP_PHONE_LABEL')}
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={t('REGISTER_OWNER_PHONE_PLACEHOLDER')}
            required
            disabled={isSendingOtp}
          />

          {notRegistered && (
            <div
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4"
              role="alert"
            >
              <p className="text-sm font-semibold text-neutral-900">
                {t('SIGN_IN_NOT_REGISTERED_TITLE')}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                {t('SIGN_IN_NOT_REGISTERED_BODY')}
              </p>
              <Link
                href={routes.registerStart}
                className="mt-3 inline-flex text-sm font-semibold text-primary-500 hover:text-primary-600"
              >
                {t('SIGN_IN_REGISTER_LINK')}
              </Link>
            </div>
          )}

          {error && !notRegistered && (
            <p className="text-sm text-error-500" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={!isPhoneValid || isSendingOtp}>
            {isSendingOtp ? t('OTP_SENDING') : t('OTP_SEND_CTA')}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600">
          {t('SIGN_IN_NO_ACCOUNT')}{' '}
          <Link href={routes.registerStart} className="font-semibold text-primary-500 hover:text-primary-600">
            {t('SIGN_IN_REGISTER_LINK')}
          </Link>
        </p>
      </main>
    </div>
  )
}
