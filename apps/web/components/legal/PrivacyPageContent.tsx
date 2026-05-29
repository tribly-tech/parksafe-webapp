'use client'

import { useTranslations } from 'next-intl'
import { privacyPolicy } from '@/content/legal/privacy'
import { routes } from '@/lib/routes'
import { LegalDocument } from './LegalDocument'
import { LegalPageShell } from './LegalPageShell'

interface PrivacyPageContentProps {
  backHref: string
}

export function PrivacyPageContent({ backHref }: PrivacyPageContentProps) {
  const t = useTranslations()

  return (
    <LegalPageShell
      title={t('DASHBOARD_PROFILE_PRIVACY_TITLE')}
      description={t('LEGAL_PRIVACY_SUBTITLE')}
      backHref={backHref}
    >
      <LegalDocument
        lastUpdated={privacyPolicy.lastUpdated}
        effectiveDate={privacyPolicy.effectiveDate}
        companyLegalName={privacyPolicy.companyLegalName}
        sections={privacyPolicy.sections}
        relatedLink={{
          href: routes.terms,
          label: t('DASHBOARD_PROFILE_TERMS_TITLE'),
        }}
      />
    </LegalPageShell>
  )
}
