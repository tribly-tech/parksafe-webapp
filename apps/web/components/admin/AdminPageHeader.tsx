'use client'

import { useEffect, useState } from 'react'
import { en } from '@/content/en'
import { ParkSafeBrandLogo } from '@/components/shared/ParkSafeBrandLogo'
import { AdminSignOutButton } from '@/components/admin/AdminAuthGate'
import { useAdminStore } from '@/lib/store/adminStore'

/** Admin page header — title block + sign-out aligned on one row. */
export function AdminPageHeader() {
  const apiKey = useAdminStore(s => s.apiKey)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const showSignOut = isHydrated && Boolean(apiKey)

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <ParkSafeBrandLogo />
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-500">
            {en.ADMIN_PAGE_BADGE}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">{en.ADMIN_PAGE_TITLE}</h1>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">{en.ADMIN_PAGE_SUBTITLE}</p>
        </div>
      </div>
      {showSignOut && <AdminSignOutButton className="mt-1 bg-white" />}
    </header>
  )
}
