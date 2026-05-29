'use client'

import { Shield } from 'lucide-react'
import { type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { EmptyState } from '@/components/shared/EmptyState'

interface DashboardSubpageListLayoutProps {
  count: number
  summaryRecentKey?: string
  recentTime?: string | null
  privacyTitleKey: string
  privacyBodyKey: string
  listAriaLabel: string
  empty: {
    icon: ReactNode
    title: string
    body: string
    action?: ReactNode
  }
  children: ReactNode
}

export function DashboardInfoNotice({ titleKey, bodyKey }: { titleKey: string; bodyKey: string }) {
  const t = useTranslations()

  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-primary-500/20 bg-primary-50/40 p-4"
      role="note"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary-500/20 bg-white">
        <Shield className="size-4 text-primary-500" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-semibold text-neutral-900">{t(titleKey)}</p>
        <p className="text-xs leading-relaxed text-neutral-600">{t(bodyKey)}</p>
      </div>
    </div>
  )
}

export function DashboardSubpageListLayout({
  count,
  summaryRecentKey,
  recentTime,
  privacyTitleKey,
  privacyBodyKey,
  listAriaLabel,
  empty,
  children,
}: DashboardSubpageListLayoutProps) {
  const t = useTranslations()

  if (count === 0) {
    return (
      <EmptyState icon={empty.icon} title={empty.title} body={empty.body} action={empty.action} />
    )
  }

  return (
    <div className="flex flex-col gap-6" aria-label={listAriaLabel}>
      {summaryRecentKey && recentTime && (
        <p className="text-xs text-neutral-500">{t(summaryRecentKey, { time: recentTime })}</p>
      )}

      <DashboardInfoNotice titleKey={privacyTitleKey} bodyKey={privacyBodyKey} />

      {children}
    </div>
  )
}
