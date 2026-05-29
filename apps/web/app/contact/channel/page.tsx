import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { en } from '@/content/en'
import { ContactChannelStep } from '@/components/contact/ContactChannelStep'
import { buildContactPaths } from '@/lib/contact/paths'
import { parseIssueParam } from '@/lib/contact/parseIssue'
import { isContactDevPreview } from '@/lib/contact/devPreview'
import { resolveDevContactPreview } from '@/lib/contact/resolveContactTag'

export const metadata: Metadata = {
  title: en.META_CONTACT_CHANNEL_TITLE,
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ issue?: string }>
}

/** /contact/channel?issue=… — Step 2 (local dev preview). */
export default async function ContactDevChannelPage({ searchParams }: Props) {
  if (!isContactDevPreview()) {
    notFound()
  }

  const { issue: issueParam } = await searchParams
  const issue = parseIssueParam(issueParam)
  if (!issue) {
    redirect(buildContactPaths('/contact').issue())
  }

  const preview = resolveDevContactPreview()

  return (
    <ContactChannelStep
      tagId={preview.tagId}
      issue={issue}
      basePath="/contact"
      availableChannels={preview.availableChannels}
    />
  )
}
