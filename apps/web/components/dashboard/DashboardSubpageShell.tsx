'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/routes'
import { DashboardAuthGuard } from './DashboardAuthGuard'

interface DashboardSubpageShellProps {
  title: string
  description?: string
  children: React.ReactNode
  backHref?: string
}

/** Shared layout for dashboard detail pages — back link + auth guard. */
export function DashboardSubpageShell({
  title,
  description,
  children,
  backHref = routes.dashboard,
}: DashboardSubpageShellProps) {
  const t = useTranslations()

  return (
    <DashboardAuthGuard>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-neutral-50 px-4 py-8">
        <div className="flex flex-col gap-3">
          <Link
            href={backHref}
            className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-xl border border-neutral-200 bg-white transition-colors hover:bg-neutral-50"
            aria-label={t('ARIA_GO_BACK')}
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" aria-hidden />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
            {description && (
              <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-1 flex-col">{children}</div>
      </main>
    </DashboardAuthGuard>
  )
}
