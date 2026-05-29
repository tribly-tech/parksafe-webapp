'use client'

import { useTranslations } from 'next-intl'
import { DashboardSubpageShell } from './DashboardSubpageShell'
import { VehicleList } from './VehicleList'
import { DashboardListSkeleton } from './alerts/DashboardListSkeleton'
import { useVehicles } from '@/lib/hooks/useVehicles'

export function VehiclesPageContent() {
  const t = useTranslations()
  const { isLoading } = useVehicles()

  return (
    <DashboardSubpageShell
      title={t('DASHBOARD_STAT_ACTIVE_VEHICLES')}
      description={t('DASHBOARD_VEHICLES_SUBTITLE')}
    >
      {isLoading ? <DashboardListSkeleton /> : <VehicleList />}
    </DashboardSubpageShell>
  )
}
