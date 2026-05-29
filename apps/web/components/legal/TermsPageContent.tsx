'use client'

import { useTranslations } from 'next-intl'
import { termsOfService } from '@/content/legal/terms'
import { routes } from '@/lib/routes'
import { LegalDocument } from './LegalDocument'
import { LegalPageShell } from './LegalPageShell'

interface TermsPageContentProps {
  backHref: string
}

export function TermsPageContent({ backHref }: TermsPageContentProps) {
  const t = useTranslations()

  return (
    <LegalPageShell
      title={t('DASHBOARD_PROFILE_TERMS_TITLE')}
      description={t('LEGAL_TERMS_SUBTITLE')}
      backHref={backHref}
    >
      <LegalDocument
        lastUpdated={termsOfService.lastUpdated}
        effectiveDate={termsOfService.effectiveDate}
        companyLegalName={termsOfService.companyLegalName}
        sections={termsOfService.sections}
        relatedLink={{
          href: routes.privacy,
          label: t('DASHBOARD_PROFILE_PRIVACY_TITLE'),
        }}
      />
    </LegalPageShell>
  )
}
