'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Lock, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { verifyAdminApiKey } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/client'
import { useAdminStore } from '@/lib/store/adminStore'
import { cn } from '@/lib/utils/cn'

interface AdminAuthGateProps {
  children: React.ReactNode
}

/** API-key gate for admin tools — key stored in sessionStorage only. */
export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const t = useTranslations()
  const { apiKey, setApiKey } = useAdminStore()
  const [draftKey, setDraftKey] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleSignIn = useCallback(async () => {
    const trimmed = draftKey.trim()
    if (!trimmed) {
      setError(t('ADMIN_AUTH_ERROR_EMPTY'))
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      await verifyAdminApiKey(trimmed)
      setApiKey(trimmed)
      setDraftKey('')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(t('ADMIN_AUTH_ERROR_INVALID'))
        } else if (err.status === 503) {
          setError(t('ADMIN_AUTH_ERROR_NOT_CONFIGURED'))
        } else {
          setError(t('ADMIN_AUTH_ERROR_NETWORK'))
        }
      } else {
        setError(t('ADMIN_AUTH_ERROR_NETWORK'))
      }
    } finally {
      setIsVerifying(false)
    }
  }, [draftKey, setApiKey, t])

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-neutral-600">{t('GLOBAL_LOADING')}</p>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
            <Lock className="h-5 w-5 text-neutral-600" aria-hidden />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">{t('ADMIN_AUTH_TITLE')}</h2>
          <p className="mt-1 text-sm text-neutral-600">{t('ADMIN_AUTH_SUBTITLE')}</p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault()
              void handleSignIn()
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-api-key" className="text-sm font-medium text-neutral-900">
                {t('ADMIN_AUTH_API_KEY_LABEL')}
              </label>
              <Input
                id="admin-api-key"
                type="password"
                autoComplete="off"
                value={draftKey}
                onChange={e => {
                  setDraftKey(e.target.value)
                  setError(null)
                }}
                placeholder={t('ADMIN_AUTH_API_KEY_PLACEHOLDER')}
                state={error ? 'error' : 'default'}
                className="shadow-none"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-error-500/20 bg-error-50 px-3 py-2 text-sm text-error-500"
              >
                {error}
              </p>
            )}

            <Button type="submit" disabled={isVerifying} className="w-full shadow-none">
              {isVerifying ? t('ADMIN_AUTH_VERIFYING') : t('ADMIN_AUTH_SUBMIT')}
            </Button>
          </form>
        </div>
      </section>
    )
  }

  return <>{children}</>
}

/** Sign-out control — lives in the page header when authenticated. */
export function AdminSignOutButton({ className }: { className?: string }) {
  const t = useTranslations()
  const { apiKey, clearApiKey } = useAdminStore()

  if (!apiKey) return null

  return (
    <button
      type="button"
      onClick={() => clearApiKey()}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2',
        'text-sm font-medium text-neutral-600 transition-colors hover:bg-white',
        className
      )}
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {t('ADMIN_AUTH_SIGN_OUT')}
    </button>
  )
}
