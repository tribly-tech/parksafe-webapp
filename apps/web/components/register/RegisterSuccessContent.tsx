'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/routes'

/** Post-registration success — /register/success */
export function RegisterSuccessContent() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-white via-white to-register-tint px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
        <Check className="size-8" strokeWidth={2.5} aria-hidden />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">{t('REGISTER_SUCCESS_TITLE')}</h1>
        <p className="text-sm text-neutral-600">{t('REGISTER_SUCCESS_BODY')}</p>
      </div>
      <Link
        href={routes.dashboard}
        className="flex min-h-touch w-full max-w-xs items-center justify-center rounded-button border border-primary-500 bg-white px-6 text-base font-semibold text-primary-500 shadow-[0_4px_0_0_var(--color-primary-500)]"
      >
        {t('REGISTER_SUCCESS_CTA')}
      </Link>
    </div>
  )
}
