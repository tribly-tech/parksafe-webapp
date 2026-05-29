'use client'

import { Car } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { formatPlateForDisplay } from '@/lib/utils/plateFormat'
import {
  getAlertIssueDisplay,
  getAlertTimeDisplay,
  type AlertListEvent,
} from '@/lib/utils/alertDisplay'
import { cn } from '@/lib/utils/cn'
import { AlertChannelBadge } from './AlertChannelBadge'

interface AlertEventCardProps {
  event: AlertListEvent
}

export function AlertEventCard({ event }: AlertEventCardProps) {
  const t = useTranslations()
  const issue = getAlertIssueDisplay(event.issueType, event.issueLabel)
  const time = getAlertTimeDisplay(event.createdAt)

  return (
    <article
      className={cn(
        'flex gap-3 rounded-2xl border bg-white p-4 shadow-sm',
        issue.isEmergency
          ? 'border-warning-500/40 bg-warning-50/30'
          : 'border-neutral-200'
      )}
    >
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl text-xl',
          issue.isEmergency ? 'bg-warning-100' : 'bg-neutral-100'
        )}
        aria-hidden
      >
        {issue.emoji}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-sm font-semibold text-neutral-900">{issue.label}</p>
            {issue.description && (
              <p className="text-xs leading-relaxed text-neutral-600">{issue.description}</p>
            )}
          </div>
          {issue.isEmergency && (
            <span className="shrink-0 rounded-full bg-warning-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {t('DASHBOARD_ALERTS_EMERGENCY_BADGE')}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AlertChannelBadge channel={event.channel} />
          {time.relative ? (
            <time
              dateTime={event.createdAt}
              className="text-xs font-medium text-neutral-500"
              title={time.absolute ?? undefined}
            >
              {time.relative}
            </time>
          ) : (
            <span className="text-xs text-neutral-400">{t('DASHBOARD_ALERTS_UNKNOWN_TIME')}</span>
          )}
        </div>

        {time.absolute && <p className="text-[11px] text-neutral-400">{time.absolute}</p>}

        {event.vehicle ? (
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
            <Car className="size-4 shrink-0 text-neutral-500" aria-hidden />
            <p className="min-w-0 truncate text-xs text-neutral-700">
              {event.vehicle.colour} {event.vehicle.make} {event.vehicle.model}
              <span className="text-neutral-400"> · </span>
              <span className="font-semibold text-neutral-900">
                {formatPlateForDisplay(event.vehicle.plate ?? event.vehicle.platePartial)}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-neutral-400">{t('DASHBOARD_ALERTS_VEHICLE_UNKNOWN')}</p>
        )}
      </div>
    </article>
  )
}
