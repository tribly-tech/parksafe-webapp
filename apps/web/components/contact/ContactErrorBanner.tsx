'use client'

import { AlertCircle, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ContactErrorBannerProps {
  message: string
  onDismiss?: () => void
  onRetry?: () => void
}

/** Inline error for contact flow API failures — dismissible with optional retry. */
export function ContactErrorBanner({ message, onDismiss, onRetry }: ContactErrorBannerProps) {
  const t = useTranslations()
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border-2 border-error-500/20 bg-error-50 px-4 py-3"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error-500" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm font-medium text-neutral-900">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="self-start text-sm font-semibold text-primary-600 underline-offset-2 hover:underline"
          >
            {t('GLOBAL_ERROR_RETRY_CTA')}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-button p-1 text-neutral-600 hover:bg-neutral-100"
          aria-label={t('ARIA_DISMISS_ERROR')}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
