'use client'

import { OdometerCounter } from './OdometerCounter'
import { useTranslations } from 'next-intl'

interface DrivingScoreCardProps {
  safeDays: number
}

/** Hero card — odometer safe-day counter. */
export function DrivingScoreCard({ safeDays }: DrivingScoreCardProps) {
  const t = useTranslations()

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card-offset-neutral">
      <div className="flex items-center gap-4">
        <OdometerCounter value={safeDays} maxDigits={3} />
        <p className="text-sm leading-tight text-neutral-600">
          {t('DASHBOARD_SAFE_DAYS_LABEL')}
        </p>
      </div>
    </section>
  )
}
