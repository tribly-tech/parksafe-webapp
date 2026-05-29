'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

interface ContactPageHeaderProps {
  /** 1 = issue selection, 2 = channel selection */
  currentStep: 1 | 2
}

/**
 * Sticky header for the reporter contact flow — title, step dots, and progress bar.
 */
export function ContactPageHeader({ currentStep }: ContactPageHeaderProps) {
  const t = useTranslations()
  const isStepOne = currentStep === 1

  return (
    <header className="sticky top-0 z-20 w-full bg-white">
      <div className="border-b border-neutral-200 px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">
          {t('CONTACT_PAGE_TITLE')}
        </h1>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span
              className={cn(
                'rounded-full',
                isStepOne ? 'h-1.5 w-6 bg-primary-500' : 'size-1.5 bg-primary-500'
              )}
            />
            <span
              className={cn(
                'rounded-full',
                isStepOne ? 'size-1.5 bg-neutral-200' : 'h-1.5 w-6 bg-primary-500'
              )}
            />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            {isStepOne ? t('CONTACT_STEP_ISSUE') : t('CONTACT_STEP_CHANNEL')}
          </span>
        </div>
      </div>
      <div className="h-1 bg-neutral-50" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={2}>
        <div
          className={cn(
            'h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300',
            isStepOne ? 'w-1/2' : 'w-full'
          )}
        />
      </div>
    </header>
  )
}
