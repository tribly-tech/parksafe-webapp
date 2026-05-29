'use client'

import { WifiOff, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * Shared contact flow error boundary — retry UI, never a blank screen.
 */
export function ContactRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations()
  const isNetworkError =
    error.message.toLowerCase().includes('fetch') ||
    error.message.toLowerCase().includes('network')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <WifiOff className="h-8 w-8 text-neutral-400" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-neutral-900">
          {isNetworkError ? t('GLOBAL_ERROR_NETWORK') : t('GLOBAL_ERROR_GENERIC')}
        </h2>
        <p className="text-sm text-neutral-600">
          {isNetworkError
            ? t('GLOBAL_ERROR_NETWORK')
            : t('CONTACT_ERROR_DELIVERY_FAILED')}
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="flex min-h-touch items-center gap-2 rounded-button bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t('GLOBAL_ERROR_RETRY_CTA')}
      </button>
    </div>
  )
}

export default ContactRouteError
