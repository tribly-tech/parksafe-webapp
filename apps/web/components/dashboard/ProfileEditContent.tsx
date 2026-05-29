'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TextField } from '@/components/register/register-ui'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/lib/hooks/useProfile'
import { ApiError } from '@/lib/api/client'
import { joinDisplayName, splitDisplayName } from '@/lib/utils/displayName'
import { routes } from '@/lib/routes'
import { DashboardSubpageShell } from './DashboardSubpageShell'

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="h-[76px] animate-pulse rounded-md bg-neutral-100" />
        <div className="h-[76px] animate-pulse rounded-md bg-neutral-100" />
      </div>
      <div className="h-[76px] animate-pulse rounded-md bg-neutral-100" />
      <div className="h-[52px] animate-pulse rounded-md bg-neutral-100" />
    </div>
  )
}

/** Edit profile details — first name, last name, and email. */
export function ProfileEditContent() {
  const t = useTranslations()
  const { profile, isLoading, updateProfile, isUpdatingProfile, profileError } = useProfile()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      const { firstName: first, lastName: last } = splitDisplayName(profile.displayName)
      setFirstName(first)
      setLastName(last)
      setEmail(profile.email ?? '')
    }
  }, [profile])

  const displayName = joinDisplayName(firstName, lastName)
  const canSave = firstName.trim().length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    setSaved(false)
    try {
      await updateProfile({
        displayName,
        email: email.trim() || null,
      })
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : t('GLOBAL_ERROR_GENERIC'))
    }
  }

  return (
    <DashboardSubpageShell
      title={t('DASHBOARD_PROFILE_ACCOUNT_TITLE')}
      description={t('DASHBOARD_PROFILE_EDIT_SUBTITLE')}
      backHref={routes.dashboardProfile}
    >
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <form
          onSubmit={e => void handleSubmit(e)}
          className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <TextField
            label={t('DASHBOARD_PROFILE_FIRST_NAME_LABEL')}
            name="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
            disabled={isUpdatingProfile}
          />
          <TextField
            label={t('DASHBOARD_PROFILE_LAST_NAME_LABEL')}
            name="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            autoComplete="family-name"
            disabled={isUpdatingProfile}
          />

          <TextField
            label={t('DASHBOARD_PROFILE_EMAIL_LABEL')}
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('DASHBOARD_PROFILE_EMAIL_PLACEHOLDER')}
            autoComplete="email"
            disabled={isUpdatingProfile}
          />

          {(saveError ?? profileError) && (
            <p className="text-sm text-error-500" role="alert">
              {saveError ??
                (profileError instanceof Error ? profileError.message : t('GLOBAL_ERROR_GENERIC'))}
            </p>
          )}
          {saved && (
            <p className="text-sm font-medium text-primary-500" role="status">
              {t('DASHBOARD_PROFILE_SAVED')}
            </p>
          )}

          <Button type="submit" disabled={isUpdatingProfile || !canSave} className="w-full">
            {isUpdatingProfile ? t('GLOBAL_UPDATING') : t('DASHBOARD_PROFILE_SAVE')}
          </Button>
        </form>
      )}
    </DashboardSubpageShell>
  )
}
