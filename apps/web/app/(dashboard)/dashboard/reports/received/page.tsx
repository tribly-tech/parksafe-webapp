import type { Metadata } from 'next'
import { ReportsReceivedContent } from '@/components/dashboard/ReportsReceivedContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_ALERTS_RECEIVED_TITLE,
  description: en.META_ALERTS_RECEIVED_DESCRIPTION,
}

export default function ReportsReceivedPage() {
  return <ReportsReceivedContent />
}
