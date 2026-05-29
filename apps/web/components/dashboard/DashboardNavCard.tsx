'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DashboardNavCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

/** Nav card for dashboard hub pages — matches profile/settings row pattern. */
export function DashboardNavCard({ href, icon, title, description }: DashboardNavCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center gap-4 rounded-[18px] border border-neutral-200 bg-white p-[21px] transition-colors',
        'hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-primary-50">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold tracking-[-0.32px] text-neutral-900">{title}</p>
        <p className="text-sm leading-[21px] text-neutral-600">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
    </Link>
  )
}
