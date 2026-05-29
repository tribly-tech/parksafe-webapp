'use client'

import Link from 'next/link'
import { routes } from '@/lib/routes'
import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

/** Profile avatar — navigates to the full profile page. */
export function DashboardProfileButton() {
  const t = useTranslations()

  return (
    <Link
      href={routes.dashboardProfile}
      aria-label={t('DASHBOARD_PROFILE_LINK')}
      className={cn(
        'flex size-10 items-center justify-center rounded-full border border-primary-500/20',
        'bg-gradient-to-br from-primary-500/15 to-primary-600/10 shadow-sm',
        'transition-colors hover:from-primary-500/20 hover:to-primary-600/15',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
      )}
    >
      <User className="h-5 w-5 text-primary-600" strokeWidth={1.75} aria-hidden />
    </Link>
  )
}
