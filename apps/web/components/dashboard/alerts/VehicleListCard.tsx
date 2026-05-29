'use client'

import { Car } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Vehicle } from '@parksafe/types'
import { formatPlateForDisplay } from '@/lib/utils/plateFormat'
import { VehicleActionsMenu } from '@/components/dashboard/VehicleActionsMenu'

interface VehicleListCardProps {
  vehicle: Vehicle
  onDeactivate: () => void
  deactivateDisabled?: boolean
}

/** Vehicle row — matches AlertEventCard layout for dashboard list pages. */
export function VehicleListCard({
  vehicle,
  onDeactivate,
  deactivateDisabled,
}: VehicleListCardProps) {
  const t = useTranslations()
  const displayPlate = formatPlateForDisplay(vehicle.plate ?? vehicle.platePartial)
  const vehicleLabel = `${vehicle.make} ${vehicle.model}`

  return (
    <article className="relative flex gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100"
        aria-hidden
      >
        <Car className="size-5 text-neutral-600" strokeWidth={1.5} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pr-10">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-neutral-900">{vehicleLabel}</p>
          <p className="text-xs text-neutral-600">{vehicle.colour}</p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-primary-500/20 bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-600">
          {t('DASHBOARD_TAG_STATUS_ACTIVE')}
        </span>

        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
          <span className="min-w-0 truncate text-xs font-semibold text-neutral-900">{displayPlate}</span>
        </div>
      </div>

      <VehicleActionsMenu
        vehicleLabel={vehicleLabel}
        onDeactivate={onDeactivate}
        disabled={deactivateDisabled}
      />
    </article>
  )
}
