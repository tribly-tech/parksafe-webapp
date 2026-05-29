'use client'

import Link from 'next/link'
import { Car, ChevronRight, Inbox, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  href: string
  icon: React.ReactNode
  label: string
  value: number
  highlight?: boolean
}

function StatCard({ href, icon, label, value, highlight }: StatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all',
        'hover:shadow-md active:scale-[0.98]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
        highlight ? 'border-primary-500/30 bg-primary-50/40' : 'border-neutral-200'
      )}
      aria-label={`${label}: ${value}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            highlight ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'
          )}
        >
          {icon}
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-500"
          aria-hidden
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-bold tabular-nums text-neutral-900">{value}</p>
        <p className="text-xs font-medium text-neutral-600">{label}</p>
      </div>
    </Link>
  )
}

interface StatsGridProps {
  activeVehicles: number
  reportsReceived: number
  vehiclesReported: number
}

export function StatsGrid({
  activeVehicles,
  reportsReceived,
  vehiclesReported,
}: StatsGridProps) {
  const t = useTranslations()

  return (
    <section aria-label={t('DASHBOARD_STATS_ARIA')} className="grid grid-cols-3 gap-3">
      <StatCard
        href={routes.dashboardVehicles}
        icon={<Car className="h-4 w-4" aria-hidden />}
        label={t('DASHBOARD_STAT_ACTIVE_VEHICLES')}
        value={activeVehicles}
        highlight
      />
      <StatCard
        href={routes.dashboardReportsReceived}
        icon={<Inbox className="h-4 w-4" aria-hidden />}
        label={t('DASHBOARD_STAT_ALERTS_RECEIVED')}
        value={reportsReceived}
      />
      <StatCard
        href={routes.dashboardReportsSent}
        icon={<Send className="h-4 w-4" aria-hidden />}
        label={t('DASHBOARD_STAT_ALERTS_SENT')}
        value={vehiclesReported}
      />
    </section>
  )
}
