import type { Metadata } from 'next'
import { en } from '@/content/en'
import {
  ContactSuccessRedirect,
  ContactSuccessView,
} from '@/components/contact/ContactSuccessView'
import { parseSuccessParams } from '@/lib/contact/parseSuccessParams'

export const metadata: Metadata = {
  title: en.META_SUCCESS_TITLE,
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ tagId: string }>
  searchParams: Promise<{ issue?: string; channel?: string; sentAt?: string }>
}

/** /contact/[tagId]/success — Confirmation */
export default async function ContactTagSuccessPage({ params, searchParams }: Props) {
  const { tagId } = await params
  const basePath = `/contact/${tagId}`
  const parsed = parseSuccessParams(await searchParams)

  if (!parsed) {
    return <ContactSuccessRedirect basePath={basePath} />
  }

  return (
    <ContactSuccessView
      basePath={basePath}
      issue={parsed.issue}
      channel={parsed.channel}
      sentAt={parsed.sentAt}
    />
  )
}
