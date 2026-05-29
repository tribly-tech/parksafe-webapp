import type { Metadata } from 'next'
import { TermsPageContent } from '@/components/legal/TermsPageContent'
import { en } from '@/content/en'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: en.META_TERMS_TITLE,
  description: en.META_TERMS_DESCRIPTION,
}

interface TermsPageProps {
  searchParams: Promise<{ from?: string }>
}

/** /terms — Terms of Service */
export default async function TermsPage({ searchParams }: TermsPageProps) {
  const { from } = await searchParams
  const backHref = from === 'profile' ? routes.dashboardProfile : routes.home

  return <TermsPageContent backHref={backHref} />
}
