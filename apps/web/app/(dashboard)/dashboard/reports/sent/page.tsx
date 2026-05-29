import type { Metadata } from 'next'
import { ReportsSentContent } from '@/components/dashboard/ReportsSentContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_ALERTS_SENT_TITLE,
  description: en.META_ALERTS_SENT_DESCRIPTION,
}

export default function ReportsSentPage() {
  return <ReportsSentContent />
}
