'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/routes'
import { DashboardAuthGuard } from './DashboardAuthGuard'

interface ProfilePageShellProps {
  children: React.ReactNode
  backHref?: string
  title?: string
}

/** Profile hub layout — Figma sticky header with centered title. */
export function ProfilePageShell({
  children,
  backHref = routes.dashboard,
  title,
}: ProfilePageShellProps) {
  const t = useTranslations()
  const pageTitle = title ?? t('DASHBOARD_PROFILE_TITLE')

  return (
    <DashboardAuthGuard>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-neutral-50">
        <header className="sticky top-0 z-20 grid grid-cols-[40px_1fr_40px] items-center border-b border-neutral-200 bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-[17px] pt-4 backdrop-blur-sm">
          <Link
            href={backHref}
            className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white transition-colors hover:bg-neutral-50"
            aria-label={t('ARIA_GO_BACK')}
          >
            <ArrowLeft className="size-5 text-neutral-900" strokeWidth={2} aria-hidden />
          </Link>
          <h1 className="text-center text-base font-semibold leading-6 text-neutral-900">
            {pageTitle}
          </h1>
          <div className="size-10" aria-hidden />
        </header>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col gap-8 px-6 py-8">
          {children}
        </div>
      </div>
    </DashboardAuthGuard>
  )
}
