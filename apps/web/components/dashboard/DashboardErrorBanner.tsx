'use client'

import { AlertCircle } from 'lucide-react'
import { ApiError } from '@/lib/api/client'
import { useTranslations } from 'next-intl'

interface DashboardErrorBannerProps {
  error: unknown
  onRetry: () => void
}

export function DashboardErrorBanner({ error, onRetry }: DashboardErrorBannerProps) {
  const t = useTranslations()

  const message =
    error instanceof ApiError
      ? error.status === 401
        ? t('DASHBOARD_ERROR_SESSION')
        : error.message
      : t('GLOBAL_ERROR_NETWORK')

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-error-500/30 bg-error-50 p-4"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-error-500" aria-hidden />
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-sm font-medium text-neutral-900">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="self-start text-sm font-semibold text-primary-500"
        >
          {t('GLOBAL_ERROR_RETRY_CTA')}
        </button>
      </div>
    </div>
  )
}
