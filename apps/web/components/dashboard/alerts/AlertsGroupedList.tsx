'use client'

import { type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import {
  ALERT_DATE_GROUP_LABEL_KEYS,
  getMostRecentAlertDate,
  groupAlertsByDate,
  type AlertListEvent,
} from '@/lib/utils/alertDisplay'
import { relativeTime } from '@/lib/utils/formatters'
import { AlertEventCard } from './AlertEventCard'
import { DashboardSubpageListLayout } from './DashboardSubpageListLayout'

type SummaryVariant = 'received' | 'sent'

interface AlertsGroupedListProps {
  events: AlertListEvent[]
  variant: SummaryVariant
  listAriaLabel: string
  summaryRecentKey:
    | 'DASHBOARD_ALERTS_RECEIVED_SUMMARY_RECENT'
    | 'DASHBOARD_ALERTS_SENT_SUMMARY_RECENT'
  privacyTitleKey:
    | 'DASHBOARD_ALERTS_RECEIVED_PRIVACY_TITLE'
    | 'DASHBOARD_ALERTS_SENT_PRIVACY_TITLE'
  privacyBodyKey:
    | 'DASHBOARD_ALERTS_RECEIVED_PRIVACY_BODY'
    | 'DASHBOARD_ALERTS_SENT_PRIVACY_BODY'
  empty: {
    icon: ReactNode
    title: string
    body: string
    action?: ReactNode
  }
}

export function AlertsGroupedList({
  events,
  variant,
  listAriaLabel,
  summaryRecentKey,
  privacyTitleKey,
  privacyBodyKey,
  empty,
}: AlertsGroupedListProps) {
  const t = useTranslations()
  const mostRecent = getMostRecentAlertDate(events)
  const recentTime = mostRecent ? relativeTime(mostRecent.toISOString()) : null
  const groups = groupAlertsByDate(events)

  return (
    <DashboardSubpageListLayout
      count={events.length}
      summaryRecentKey={summaryRecentKey}
      recentTime={recentTime}
      privacyTitleKey={privacyTitleKey}
      privacyBodyKey={privacyBodyKey}
      listAriaLabel={listAriaLabel}
      empty={empty}
    >
      <div className="flex flex-col gap-6">
        {groups.map(({ group, events: groupEvents }) => (
          <section key={group} aria-labelledby={`alerts-group-${variant}-${group}`}>
            <h2
              id={`alerts-group-${variant}-${group}`}
              className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
            >
              {t(ALERT_DATE_GROUP_LABEL_KEYS[group])}
            </h2>
            <ul className="flex flex-col gap-3" aria-label={t(ALERT_DATE_GROUP_LABEL_KEYS[group])}>
              {groupEvents.map(event => (
                <li key={event.id}>
                  <AlertEventCard event={event} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </DashboardSubpageListLayout>
  )
}
