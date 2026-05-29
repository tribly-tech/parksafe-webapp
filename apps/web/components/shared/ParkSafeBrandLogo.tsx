'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'

interface ParkSafeBrandLogoProps {
  /** Full size for register; compact for dashboard header. */
  variant?: 'full' | 'header'
  className?: string
}

/** ParkSafe wordmark + gradient rule — matches /register branding. */
export function ParkSafeBrandLogo({ variant = 'full', className }: ParkSafeBrandLogoProps) {
  const t = useTranslations()
  const isHeader = variant === 'header'

  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      aria-label={t('GLOBAL_BRAND_NAME')}
    >
      <p
        className={cn(
          'font-medium lowercase text-primary-500',
          isHeader
            ? 'text-[27.5px] leading-[32.5px] tracking-[-0.55px]'
            : 'text-[40px] leading-[48px] tracking-[-0.8px]'
        )}
      >
        {t('REGISTER_BRAND_WORDMARK')}
      </p>
      <div
        className={cn(
          'h-0.5 bg-gradient-to-r from-primary-500 to-transparent',
          isHeader ? 'w-20' : 'w-[120px]'
        )}
        aria-hidden
      />
    </div>
  )
}
