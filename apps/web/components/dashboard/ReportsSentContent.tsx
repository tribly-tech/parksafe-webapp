'use client'

import { useTranslations } from 'next-intl'
import { DashboardSubpageShell } from './DashboardSubpageShell'
import { ReportedVehiclesList } from './ReportedVehiclesList'
import { DashboardErrorBanner } from './DashboardErrorBanner'
import { DashboardListSkeleton } from './alerts/DashboardListSkeleton'
import { useReportsSent } from '@/lib/hooks/useReports'

export function ReportsSentContent() {
  const t = useTranslations()
  const { events, isLoading, isError, error, refetch } = useReportsSent()

  return (
    <DashboardSubpageShell
      title={t('DASHBOARD_STAT_ALERTS_SENT')}
      description={t('DASHBOARD_ALERTS_SENT_SUBTITLE')}
    >
      {isLoading && <DashboardListSkeleton />}
      {isError && (
        <DashboardErrorBanner error={error} onRetry={() => void refetch()} />
      )}
      {!isLoading && !isError && <ReportedVehiclesList events={events} />}
    </DashboardSubpageShell>
  )
}
