'use client'

import { useState } from 'react'
import { ChevronRight, Copy, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { en } from '@/content/en'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { DashboardSubpageShell } from './DashboardSubpageShell'
import { DashboardInfoNotice } from './alerts/DashboardSubpageListLayout'
import { buttonVariants } from '@/components/ui/button'

const FAQ_KEYS = [
  { q: 'HELP_FAQ_Q1' as const, a: 'HELP_FAQ_A1' as const },
  { q: 'HELP_FAQ_Q2' as const, a: 'HELP_FAQ_A2' as const },
  { q: 'HELP_FAQ_Q3' as const, a: 'HELP_FAQ_A3' as const },
] as const

function FaqItem({ questionKey, answerKey }: { questionKey: string; answerKey: string }) {
  const t = useTranslations()

  return (
    <div className="border-b border-neutral-200 p-4 last:border-b-0">
      <p className="text-sm font-semibold text-neutral-900">{t(questionKey)}</p>
      <p className="mt-1 text-xs leading-relaxed text-neutral-600">{t(answerKey)}</p>
    </div>
  )
}

/** Help & Contact — FAQ and support email (no auto-redirect from profile). */
export function HelpContactContent() {
  const t = useTranslations()
  const [copied, setCopied] = useState(false)
  const supportEmail = en.HELP_SUPPORT_EMAIL

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <DashboardSubpageShell
      title={t('DASHBOARD_PROFILE_HELP_TITLE')}
      description={t('HELP_SUBTITLE')}
      backHref={routes.dashboardProfile}
    >
      <div className="flex flex-col gap-6">
        <DashboardInfoNotice titleKey="HELP_INFO_TITLE" bodyKey="HELP_INFO_BODY" />

        <section aria-labelledby="help-faq-heading">
          <h2
            id="help-faq-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
          >
            {t('HELP_FAQ_TITLE')}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {FAQ_KEYS.map(item => (
              <FaqItem key={item.q} questionKey={item.q} answerKey={item.a} />
            ))}
          </div>
        </section>

        <section aria-labelledby="help-contact-heading">
          <h2
            id="help-contact-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
          >
            {t('HELP_CONTACT_TITLE')}
          </h2>
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <Mail className="size-5 text-neutral-600" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-xs font-medium text-neutral-500">{t('HELP_CONTACT_EMAIL_LABEL')}</p>
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-sm font-semibold text-primary-500 hover:text-primary-600"
                >
                  {supportEmail}
                </a>
                <p className="text-xs text-neutral-600">{t('HELP_CONTACT_RESPONSE')}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleCopyEmail()}
                className={cn(
                  'flex min-h-touch flex-1 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-colors',
                  'hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
                )}
              >
                <Copy className="size-4" aria-hidden />
                {copied ? t('HELP_CONTACT_COPIED') : t('HELP_CONTACT_COPY')}
              </button>
              <a
                href={`mailto:${supportEmail}`}
                className={cn(buttonVariants({ variant: 'primary' }), 'min-h-touch flex-1')}
              >
                {t('HELP_CONTACT_CTA')}
                <ChevronRight className="ml-1 size-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </div>
    </DashboardSubpageShell>
  )
}
