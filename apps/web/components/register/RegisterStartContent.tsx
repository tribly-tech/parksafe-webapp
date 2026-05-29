'use client'

import Link from 'next/link'
import { ArrowLeft, Camera, QrCode, ShoppingBag, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ParkSafeBrandLogo } from '@/components/shared/ParkSafeBrandLogo'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'

const STEPS = [
  { key: 'REGISTER_START_STEP_1', icon: Camera },
  { key: 'REGISTER_START_STEP_2', icon: QrCode },
  { key: 'REGISTER_START_STEP_3', icon: Sparkles },
] as const

function RegisterScanSteps() {
  const t = useTranslations()

  return (
    <section
      className="rounded-2xl border border-gray-300 bg-white p-6 shadow-card-offset"
      aria-labelledby="register-steps-heading"
    >
      <h3
        id="register-steps-heading"
        className="mb-6 text-lg font-semibold tracking-[-0.36px] text-neutral-900"
      >
        {t('REGISTER_START_STEPS_TITLE')}
      </h3>
      <ol className="flex flex-col">
        {STEPS.map(({ key, icon: Icon }, index) => {
          const isLast = index === STEPS.length - 1
          return (
            <li key={key} className={cn('relative flex gap-4', !isLast && 'pb-8')}>
              {!isLast && (
                <span
                  className="absolute left-6 top-12 bottom-0 w-px bg-primary-200"
                  aria-hidden
                />
              )}
              <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-primary-50 ring-4 ring-white">
                <Icon className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pt-0.5">
                <span className="text-xs font-semibold uppercase tracking-[0.6px] text-primary-600">
                  {t('REGISTER_START_STEP_LABEL', { step: index + 1 })}
                </span>
                <p className="text-base font-semibold leading-6 tracking-[-0.32px] text-neutral-900">
                  {t(key)}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** Entry screen — scan QR tag to register; cross-sell if no tag. */
export function RegisterStartContent() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-register-tint">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-page items-center gap-3">
          <Link
            href={routes.signIn}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors hover:bg-neutral-50"
            aria-label={t('ARIA_GO_BACK')}
          >
            <ArrowLeft className="size-5 text-neutral-900" strokeWidth={2} aria-hidden />
          </Link>
          <h1 className="text-base font-semibold text-neutral-900">{t('REGISTER_START_TITLE')}</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-8 px-6 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <ParkSafeBrandLogo />
          <div className="flex size-20 items-center justify-center rounded-[20px] border border-primary-500/20 bg-gradient-to-br from-primary-500/15 to-primary-600/10 shadow-sm">
            <QrCode className="size-10 text-primary-600" strokeWidth={1.5} aria-hidden />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-[-0.48px] text-neutral-900">
              {t('REGISTER_START_HEADING')}
            </h2>
            <p className="max-w-[320px] text-[15px] leading-[22.5px] text-neutral-600">
              {t('REGISTER_START_BODY')}
            </p>
          </div>
        </div>

        <RegisterScanSteps />

        <section
          className="flex flex-col gap-4 rounded-[18px] border border-primary-500/30 bg-white p-6 shadow-card-offset-primary"
          aria-labelledby="register-no-tag-heading"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-primary-50">
              <ShoppingBag className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3
                id="register-no-tag-heading"
                className="text-base font-semibold tracking-[-0.32px] text-neutral-900"
              >
                {t('REGISTER_START_NO_TAG_TITLE')}
              </h3>
              <p className="text-sm leading-[21px] text-neutral-600">{t('REGISTER_START_NO_TAG_BODY')}</p>
            </div>
          </div>
          <a
            href={t('GLOBAL_BUY_URL')}
            className={cn(
              'flex min-h-touch w-full items-center justify-center rounded-button bg-primary-500 px-6 text-base font-semibold text-white shadow-md',
              'hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
            )}
          >
            {t('REGISTER_START_BUY_CTA')}
          </a>
        </section>

        <p className="text-center text-sm text-neutral-600">
          {t('REGISTER_START_SIGN_IN_PROMPT')}{' '}
          <Link href={routes.signIn} className="font-semibold text-primary-500 hover:text-primary-600">
            {t('REGISTER_START_SIGN_IN_LINK')}
          </Link>
        </p>
      </main>
    </div>
  )
}
