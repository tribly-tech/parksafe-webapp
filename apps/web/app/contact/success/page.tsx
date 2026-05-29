import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { en } from '@/content/en'
import {
  ContactSuccessRedirect,
  ContactSuccessView,
} from '@/components/contact/ContactSuccessView'
import { parseSuccessParams } from '@/lib/contact/parseSuccessParams'
import { isContactDevPreview } from '@/lib/contact/devPreview'

export const metadata: Metadata = {
  title: en.META_SUCCESS_TITLE,
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ issue?: string; channel?: string; sentAt?: string }>
}

/** /contact/success — Confirmation (local dev preview). */
export default async function ContactDevSuccessPage({ searchParams }: Props) {
  if (!isContactDevPreview()) {
    notFound()
  }

  const params = parseSuccessParams(await searchParams)
  if (!params) {
    return <ContactSuccessRedirect basePath="/contact" />
  }

  return (
    <ContactSuccessView
      basePath="/contact"
      issue={params.issue}
      channel={params.channel}
      sentAt={params.sentAt}
    />
  )
}
