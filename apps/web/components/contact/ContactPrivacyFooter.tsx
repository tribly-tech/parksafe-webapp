'use client'

import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * Privacy assurance block shown at the bottom of both contact flow steps.
 */
export function ContactPrivacyFooter() {
  const t = useTranslations()
  return (
    <footer className="border-t border-neutral-200 pt-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <ShieldCheck className="h-5 w-5 text-primary-500" aria-hidden="true" />
        <div className="flex max-w-xs flex-col gap-2">
          <p className="text-[15px] font-semibold tracking-tight text-neutral-900">
            {t('CONTACT_PRIVACY_FOOTER_TITLE')}
          </p>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            {t('CONTACT_PRIVACY_FOOTER_BODY')}
          </p>
        </div>
        <ul className="grid w-full max-w-[342px] grid-cols-2 gap-x-4 gap-y-3 text-xs text-neutral-600">
          <li className="flex items-center justify-center gap-1.5">
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
            {t('CONTACT_PRIVACY_BADGE_ANONYMOUS')}
          </li>
          <li className="flex items-center justify-center gap-1.5">
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
            {t('CONTACT_PRIVACY_BADGE_SECURE')}
          </li>
          <li className="col-span-2 flex items-center justify-center gap-1.5">
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
            {t('CONTACT_PRIVACY_BADGE_NO_SPAM')}
          </li>
        </ul>
      </div>
    </footer>
  )
}
