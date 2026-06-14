import { redirect } from 'next/navigation'
import { qrEntryPath, resolveQrEntry } from '@/lib/contact/resolveQrEntry'

interface Props {
  params: Promise<{ tagId: string }>
}

/** Legacy/alternate QR path — routes to register or contact based on tag status. */
export default async function TagEntryPage({ params }: Props) {
  const { tagId } = await params
  const entry = await resolveQrEntry(tagId)
  redirect(qrEntryPath(entry))
}
