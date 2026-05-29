'use client'

import {
  FileText,
  HelpCircle,
  Settings,
  Shield,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useProfile } from '@/lib/hooks/useProfile'
import { DashboardNavCard } from './DashboardNavCard'
import { routes } from '@/lib/routes'
import { ProfilePageShell } from './ProfilePageShell'

function ProfileSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 text-xs font-semibold uppercase tracking-[0.6px] text-neutral-400">
      {children}
    </p>
  )
}

/** Profile hub — Figma layout with account, support, and legal sections. */
export function ProfilePageContent() {
  const t = useTranslations()
  const { profile, isLoading } = useProfile()

  const displayName = profile?.displayName ?? t('DASHBOARD_PROFILE_GUEST_NAME')

  return (
    <ProfilePageShell>
      <div className="flex flex-col items-center">
        <div className="relative mb-4 flex size-16 items-center justify-center rounded-[18px] border border-primary-500/20 bg-gradient-to-br from-primary-500/15 to-primary-600/10 shadow-sm">
          <User className="size-8 text-primary-600" strokeWidth={1.5} aria-hidden />
        </div>
        {!isLoading && (
          <>
            <h2 className="pb-2 text-center text-2xl font-bold tracking-[-0.48px] text-neutral-900">
              {displayName}
            </h2>
            <p className="max-w-[320px] text-center text-[15px] leading-[22.5px] text-neutral-600">
              {t('DASHBOARD_PROFILE_WELCOME_SUBTITLE')}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 pb-6">
          <ProfileSectionLabel>{t('DASHBOARD_PROFILE_SECTION_ACCOUNT')}</ProfileSectionLabel>
          <DashboardNavCard
            href={routes.dashboardProfileEdit}
            icon={<User className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />}
            title={t('DASHBOARD_PROFILE_ACCOUNT_TITLE')}
            description={t('DASHBOARD_PROFILE_MENU_DESC')}
          />
          <DashboardNavCard
            href={routes.dashboardSettings}
            icon={<Settings className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />}
            title={t('DASHBOARD_SETTINGS_LINK')}
            description={t('DASHBOARD_SETTINGS_MENU_DESC')}
          />
        </div>

        <div className="flex flex-col gap-3 pb-6">
          <ProfileSectionLabel>{t('DASHBOARD_PROFILE_SECTION_SUPPORT')}</ProfileSectionLabel>
          <DashboardNavCard
            href={routes.dashboardProfileHelp}
            icon={<HelpCircle className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />}
            title={t('DASHBOARD_PROFILE_HELP_TITLE')}
            description={t('DASHBOARD_PROFILE_HELP_DESC')}
          />
        </div>

        <div className="flex flex-col gap-3">
          <ProfileSectionLabel>{t('DASHBOARD_PROFILE_SECTION_LEGAL')}</ProfileSectionLabel>
          <div className="flex flex-col gap-4">
            <DashboardNavCard
              href={`${routes.terms}?from=profile`}
              icon={<FileText className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />}
              title={t('DASHBOARD_PROFILE_TERMS_TITLE')}
              description={t('DASHBOARD_PROFILE_TERMS_DESC')}
            />
            <DashboardNavCard
              href={`${routes.privacy}?from=profile`}
              icon={<Shield className="size-6 text-primary-500" strokeWidth={1.75} aria-hidden />}
              title={t('DASHBOARD_PROFILE_PRIVACY_TITLE')}
              description={t('DASHBOARD_PROFILE_PRIVACY_DESC')}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-[25px]">
        <p className="text-center text-xs leading-[18px] text-neutral-400">
          {t('DASHBOARD_PROFILE_MENU_VERSION')}
        </p>
      </div>
    </ProfilePageShell>
  )
}
