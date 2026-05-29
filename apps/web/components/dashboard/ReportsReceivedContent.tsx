'use client'

import { useTranslations } from 'next-intl'
import { DashboardSubpageShell } from './DashboardSubpageShell'
import { ContactHistory } from './ContactHistory'
import { DashboardErrorBanner } from './DashboardErrorBanner'
import { DashboardListSkeleton } from './alerts/DashboardListSkeleton'
import { useReportsReceived } from '@/lib/hooks/useReports'

export function ReportsReceivedContent() {
  const t = useTranslations()
  const { events, isLoading, isError, error, refetch } = useReportsReceived()

  return (
    <DashboardSubpageShell
      title={t('DASHBOARD_STAT_ALERTS_RECEIVED')}
      description={t('DASHBOARD_ALERTS_RECEIVED_SUBTITLE')}
    >
      {isLoading && <DashboardListSkeleton />}
      {isError && (
        <DashboardErrorBanner error={error} onRetry={() => void refetch()} />
      )}
      {!isLoading && !isError && <ContactHistory events={events} />}
    </DashboardSubpageShell>
  )
}
