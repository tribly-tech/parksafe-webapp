'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

interface DashboardGreetingProps {
  displayName: string
  /** Alerts received on the owner's vehicles. */
  alertCount: number
}

export type GreetingTone = 'rewarding' | 'mild' | 'cautious'

/** 0 = reward, 1–3 = mild, 4+ = cautious */
export function getGreetingTone(alertCount: number): GreetingTone {
  if (alertCount === 0) return 'rewarding'
  if (alertCount <= 3) return 'mild'
  return 'cautious'
}

type MildAlertKey = 'DASHBOARD_GREETING_MILD_ALERTS_ONE' | 'DASHBOARD_GREETING_MILD_ALERTS_MANY'

export function getMildAlertKey(count: number): MildAlertKey {
  return count === 1 ? 'DASHBOARD_GREETING_MILD_ALERTS_ONE' : 'DASHBOARD_GREETING_MILD_ALERTS_MANY'
}

const accentClass: Record<GreetingTone, string> = {
  rewarding: 'text-primary-500',
  mild: 'text-primary-600',
  cautious: 'text-warning-500',
}

/**
 * Dashboard greeting — tone shifts with alert count:
 * rewarding (0), mild (1–3), cautious (4+).
 */
export function DashboardGreeting({ displayName, alertCount }: DashboardGreetingProps) {
  const t = useTranslations()
  const tone = getGreetingTone(alertCount)
  const accent = accentClass[tone]

  if (tone === 'rewarding') {
    return (
      <p className="mt-4 text-2xl leading-snug tracking-[-0.48px] text-neutral-600">
        <span className="font-semibold text-neutral-900">
          {t('DASHBOARD_GREETING_REWARDING_LINE_1', { name: displayName })}
        </span>
        <br />
        <span className={cn('font-light', accent)}>
          {t('DASHBOARD_GREETING_REWARDING_LINE_2')}
        </span>
      </p>
    )
  }

  if (tone === 'mild') {
    return (
      <p className="mt-4 text-2xl leading-snug tracking-[-0.48px] text-neutral-600">
        <span className="font-semibold text-neutral-900">
          {t('DASHBOARD_GREETING_MILD_LINE_1', { name: displayName })}
        </span>
        <br />
        <span className="font-light">
          {t(getMildAlertKey(alertCount), { count: alertCount })}
        </span>
      </p>
    )
  }

  return (
    <p className="mt-4 text-2xl leading-snug tracking-[-0.48px] text-neutral-600">
      <span className="font-semibold text-neutral-900">
        {t('DASHBOARD_GREETING_CAUTIOUS_LINE_1', { name: displayName })}
      </span>
      <br />
      <span className={cn('font-light', accent)}>
        {t('DASHBOARD_GREETING_CAUTIOUS_LINE_2', { count: alertCount })}
      </span>
    </p>
  )
}
