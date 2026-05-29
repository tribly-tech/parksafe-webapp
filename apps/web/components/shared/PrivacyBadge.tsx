'use client'

import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PrivacyBadgeProps {
  label?: string
}

/**
 * Compact inline privacy signal — used within cards and forms
 * to reinforce anonymity without the full banner treatment.
 */
export function PrivacyBadge({ label }: PrivacyBadgeProps) {
  const t = useTranslations()
  const displayLabel = label ?? t('GLOBAL_PRIVACY_BADGE_DEFAULT')

  return (
    <div className="flex items-center gap-1.5" aria-label={t('ARIA_PRIVACY_INDICATOR')}>
      <Lock className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
      <span className="text-xs font-medium text-primary-600">{displayLabel}</span>
    </div>
  )
}
