'use client'

import { Car } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { formatPlateForDisplay } from '@/lib/utils/plateFormat'

interface VehicleCardProps {
  make: string
  model: string
  colour: string
  /** Masked plate — e.g. "MH**1234". Used on public/contact flows. */
  platePartial: string
  /** Full plate — owner views only. When set, shown instead of platePartial. */
  plate?: string
}

/**
 * Vehicle summary card — make, model, colour, and plate.
 * Pass `plate` for owner dashboards; omit it on contact/reporter flows (masked only).
 */
export function VehicleCard({ make, model, colour, platePartial, plate }: VehicleCardProps) {
  const t = useTranslations()
  const displayPlate = formatPlateForDisplay(plate ?? platePartial)

  return (
    <div
      className="relative rounded-[20px] border-2 border-neutral-200 bg-white p-[22px] shadow-sm"
      role="group"
      aria-label={t('VEHICLE_CARD_ARIA', { make, model, colour, plate: displayPlate })}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-[18px] border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100"
          aria-hidden="true"
        >
          <Car className="h-8 w-8 text-neutral-600" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <p className="text-[11px] font-semibold tracking-wide text-neutral-500">{make}</p>
          <p className="text-lg font-bold tracking-tight text-neutral-900">{model}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-[11px] py-1 text-xs font-semibold tracking-wide text-neutral-900">
              {displayPlate}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-600">
              <span className="size-1 rounded-full bg-neutral-400" aria-hidden="true" />
              {colour}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
