import type { Metadata } from 'next'
import { PrivacyPageContent } from '@/components/legal/PrivacyPageContent'
import { en } from '@/content/en'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: en.META_PRIVACY_TITLE,
  description: en.META_PRIVACY_DESCRIPTION,
}

interface PrivacyPageProps {
  searchParams: Promise<{ from?: string }>
}

/** /privacy — Privacy Policy */
export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const { from } = await searchParams
  const backHref = from === 'profile' ? routes.dashboardProfile : routes.home

  return <PrivacyPageContent backHref={backHref} />
}
