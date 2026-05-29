'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ContactSuccessHeaderProps {
  backHref: string
}

/** Success screen header — back control and centered title per Figma. */
export function ContactSuccessHeader({ backHref }: ContactSuccessHeaderProps) {
  const t = useTranslations()
  return (
    <header className="sticky top-0 z-20 w-full border-b border-neutral-200 bg-white">
      <div className="grid grid-cols-[36px_1fr_36px] items-center px-6 py-5">
        <Link
          href={backHref}
          className="flex size-9 items-center justify-center rounded-full bg-neutral-50 text-neutral-600 transition-colors hover:bg-neutral-100"
          aria-label={t('ARIA_GO_BACK')}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <h1 className="text-center text-xl font-bold tracking-tight text-neutral-900">
          {t('CONTACT_PAGE_TITLE')}
        </h1>
        <span className="size-9" aria-hidden="true" />
      </div>
    </header>
  )
}
