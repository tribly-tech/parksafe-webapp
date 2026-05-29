'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ReportedVehicleEvent } from '@parksafe/types'
import { routes } from '@/lib/routes'
import { AlertsGroupedList } from './alerts/AlertsGroupedList'

interface ReportedVehiclesListProps {
  events: ReportedVehicleEvent[]
}

/**
 * List of vehicles the owner reported to others.
 * Only masked vehicle info is shown — no owner PII.
 */
export function ReportedVehiclesList({ events }: ReportedVehiclesListProps) {
  const t = useTranslations()

  return (
    <AlertsGroupedList
      events={events}
      variant="sent"
      listAriaLabel={t('DASHBOARD_ALERTS_SENT_LIST_ARIA')}
      summaryRecentKey="DASHBOARD_ALERTS_SENT_SUMMARY_RECENT"
      privacyTitleKey="DASHBOARD_ALERTS_SENT_PRIVACY_TITLE"
      privacyBodyKey="DASHBOARD_ALERTS_SENT_PRIVACY_BODY"
      empty={{
        icon: '📤',
        title: t('DASHBOARD_ALERTS_SENT_EMPTY_TITLE'),
        body: t('DASHBOARD_ALERTS_SENT_EMPTY_BODY'),
        action: (
          <Link
            href={routes.contact.preview}
            className="min-h-touch rounded-button bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            {t('DASHBOARD_ALERTS_SENT_EMPTY_CTA')}
          </Link>
        ),
      }}
    />
  )
}
