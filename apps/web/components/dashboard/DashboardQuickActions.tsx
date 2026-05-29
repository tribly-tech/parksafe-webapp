'use client'

import Link from 'next/link'
import { ArrowUpRight, QrCode, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'

interface ActionRowProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  external?: boolean
  className?: string
}

function ActionRow({ href, icon, title, description, external, className }: ActionRowProps) {
  const rowClass = cn(
    'group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors',
    'hover:bg-neutral-50/90',
    'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500',
    className
  )

  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center text-neutral-400 transition-colors group-hover:text-primary-500">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-snug tracking-[-0.2px] text-neutral-900">
          {title}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">{description}</span>
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-neutral-300 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-neutral-500"
        strokeWidth={1.75}
        aria-hidden
      />
    </>
  )

  if (external) {
    return (
      <a href={href} className={rowClass}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={rowClass}>
      {content}
    </Link>
  )
}

/** Register another vehicle + buy QR tag shortcuts on the dashboard. */
export function DashboardQuickActions() {
  const t = useTranslations()

  return (
    <section aria-label={t('DASHBOARD_QUICK_ACTIONS_ARIA')}>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/90">
        <ActionRow
          href={routes.registerStart}
          icon={<QrCode className="size-[18px]" strokeWidth={1.5} aria-hidden />}
          title={t('DASHBOARD_ACTION_REGISTER_TITLE')}
          description={t('DASHBOARD_ACTION_REGISTER_DESC')}
          className="border-b border-neutral-100"
        />
        <ActionRow
          href={t('GLOBAL_BUY_URL')}
          external
          icon={<ShoppingBag className="size-[18px]" strokeWidth={1.5} aria-hidden />}
          title={t('DASHBOARD_ACTION_BUY_TITLE')}
          description={t('DASHBOARD_ACTION_BUY_DESC')}
        />
      </div>
    </section>
  )
}
