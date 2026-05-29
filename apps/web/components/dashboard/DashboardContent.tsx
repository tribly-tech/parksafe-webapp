'use client'

import { DrivingScoreCard } from '@/components/dashboard/DrivingScoreCard'
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { RewardsSection } from '@/components/dashboard/RewardsSection'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { DashboardErrorBanner } from '@/components/dashboard/DashboardErrorBanner'
import { useDashboard } from '@/lib/hooks/useDashboard'

function DashboardSkeleton() {
  return (
    <div className="mt-4 flex animate-pulse flex-col gap-6">
      <div className="h-7 w-3/4 max-w-sm rounded-lg bg-neutral-100" />
      <div className="h-36 rounded-2xl bg-neutral-100" />
      <div className="mt-6 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-neutral-100" />
          ))}
        </div>
        <div className="h-48 rounded-2xl bg-neutral-100" />
        <div className="h-[118px] rounded-2xl bg-neutral-100" />
      </div>
    </div>
  )
}

/** Owner dashboard — driving score, stats, and rewards. */
export function DashboardContent() {
  const { summary, isLoading, isError, error, refetch, isRefetching } = useDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError || !summary) {
    return (
      <div className="mt-4">
        <DashboardErrorBanner error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col gap-8 ${isRefetching ? 'opacity-80 transition-opacity' : ''}`}
    >
      <DashboardGreeting
        displayName={summary.displayName}
        alertCount={summary.reportsReceived}
      />

      <DrivingScoreCard safeDays={summary.safeDays} />

      <div className="mt-6 flex flex-col gap-8">
        <StatsGrid
          activeVehicles={summary.activeVehicles}
          reportsReceived={summary.reportsReceived}
          vehiclesReported={summary.vehiclesReported}
        />

        <RewardsSection rewards={summary.rewards} />

        <DashboardQuickActions />
      </div>
    </div>
  )
}
