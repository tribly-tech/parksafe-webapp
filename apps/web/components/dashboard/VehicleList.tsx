'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useVehicles } from '@/lib/hooks/useVehicles'
import { routes } from '@/lib/routes'
import { DashboardSubpageListLayout } from './alerts/DashboardSubpageListLayout'
import { VehicleListCard } from './alerts/VehicleListCard'
import { DashboardErrorBanner } from './DashboardErrorBanner'

/**
 * Owner vehicle list — reuses dashboard alerts list layout and card styling.
 */
export function VehicleList() {
  const t = useTranslations()
  const { vehicles, isLoading, error, deactivate, isDeactivating, refetch } = useVehicles()

  if (isLoading) {
    return null
  }

  if (error) {
    return <DashboardErrorBanner error={error} onRetry={() => void refetch()} />
  }

  return (
    <DashboardSubpageListLayout
      count={vehicles.length}
      privacyTitleKey="DASHBOARD_VEHICLES_INFO_TITLE"
      privacyBodyKey="DASHBOARD_VEHICLES_INFO_BODY"
      listAriaLabel={t('ARIA_VEHICLES_LIST')}
      empty={{
        icon: '🚗',
        title: t('DASHBOARD_EMPTY_TITLE'),
        body: t('DASHBOARD_EMPTY_BODY'),
        action: (
          <Link
            href={routes.registerStart}
            className="min-h-touch rounded-button bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            {t('DASHBOARD_ADD_VEHICLE_CTA')}
          </Link>
        ),
      }}
    >
      <ul className="flex flex-col gap-3" aria-label={t('ARIA_VEHICLES_LIST')}>
        {vehicles.map(vehicle => (
          <li key={vehicle.id}>
            <VehicleListCard
              vehicle={vehicle}
              onDeactivate={() => void deactivate(vehicle.id)}
              deactivateDisabled={isDeactivating}
            />
          </li>
        ))}
      </ul>
    </DashboardSubpageListLayout>
  )
}
