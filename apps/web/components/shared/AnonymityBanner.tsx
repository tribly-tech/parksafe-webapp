'use client'

import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * Trust signal shown on the issue selection step.
 * Reassures the reporter that their identity stays private.
 */
export function AnonymityBanner() {
  const t = useTranslations()

  return (
    <div
      className="relative rounded border-2 border-primary-500/20 bg-gradient-to-br from-primary-50 via-white to-primary-50/30 p-[18px] shadow-sm"
      role="status"
      aria-label={t('ARIA_PRIVACY_NOTICE')}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded border border-primary-500/30 bg-white">
          <Info className="h-4 w-4 text-primary-500" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[13px] font-semibold text-neutral-900">
            {t('CONTACT_ANONYMITY_BANNER_TITLE')}
          </p>
          <p className="text-xs leading-relaxed text-neutral-600">
            {t('CONTACT_ANONYMITY_BANNER_BODY')}
          </p>
        </div>
      </div>
    </div>
  )
}
