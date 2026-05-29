import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { en } from '@/content/en'
import { ContactIssueStep } from '@/components/contact/ContactIssueStep'
import { isContactDevPreview } from '@/lib/contact/devPreview'
import { resolveDevContactPreview } from '@/lib/contact/resolveContactTag'

export const metadata: Metadata = {
  title: en.META_CONTACT_TITLE,
  description: en.META_CONTACT_DESCRIPTION,
  robots: { index: false, follow: false },
}

/** /contact — Step 1 (local dev preview). */
export default function ContactDevIssuePage() {
  if (!isContactDevPreview()) {
    notFound()
  }

  const preview = resolveDevContactPreview()

  return (
    <ContactIssueStep
      tagId={preview.tagId}
      basePath="/contact"
      vehicle={preview.vehicle}
    />
  )
}
