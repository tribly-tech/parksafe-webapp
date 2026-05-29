import type { Metadata } from 'next'
import { HelpContactContent } from '@/components/dashboard/HelpContactContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_HELP_CONTACT_TITLE,
  description: en.META_HELP_CONTACT_DESCRIPTION,
}

export default function HelpContactPage() {
  return <HelpContactContent />
}
