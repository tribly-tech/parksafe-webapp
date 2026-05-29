'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ContactEventSummary } from '@parksafe/types'
import { routes } from '@/lib/routes'
import { AlertsGroupedList } from './alerts/AlertsGroupedList'

interface ContactHistoryProps {
  events: ContactEventSummary[]
}

/**
 * Owner view of contact events on their vehicles.
 * Reporter identity is NEVER shown — only issue type, channel, and timestamp.
 */
export function ContactHistory({ events }: ContactHistoryProps) {
  const t = useTranslations()

  return (
    <AlertsGroupedList
      events={events}
      variant="received"
      listAriaLabel={t('DASHBOARD_ALERTS_RECEIVED_LIST_ARIA')}
      summaryRecentKey="DASHBOARD_ALERTS_RECEIVED_SUMMARY_RECENT"
      privacyTitleKey="DASHBOARD_ALERTS_RECEIVED_PRIVACY_TITLE"
      privacyBodyKey="DASHBOARD_ALERTS_RECEIVED_PRIVACY_BODY"
      empty={{
        icon: '✅',
        title: t('DASHBOARD_ALERTS_RECEIVED_EMPTY_TITLE'),
        body: t('DASHBOARD_ALERTS_RECEIVED_EMPTY_BODY'),
        action: (
          <Link
            href={routes.dashboardSettings}
            className="min-h-touch rounded-button border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            {t('DASHBOARD_ALERTS_RECEIVED_EMPTY_CTA')}
          </Link>
        ),
      }}
    />
  )
}
