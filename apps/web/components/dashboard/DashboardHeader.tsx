'use client'

import { ParkSafeBrandLogo } from '@/components/shared/ParkSafeBrandLogo'
import { DashboardProfileButton } from './DashboardProfileButton'

/** Dashboard top bar — ParkSafe logo left, profile menu right. */
export function DashboardHeader() {
  return (
    <header className="-mx-4 sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white bg-gradient-to-b from-white via-white/95 to-white/0 px-4 pb-[17px] pt-4 backdrop-blur-sm">
      <ParkSafeBrandLogo variant="header" />
      <DashboardProfileButton />
    </header>
  )
}
