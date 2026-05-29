import type { Metadata } from 'next'
import { RegisterStartContent } from '@/components/register/RegisterStartContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_REGISTER_START_TITLE,
  description: en.META_REGISTER_START_DESCRIPTION,
}

/** /register/start — Scan QR tag to begin vehicle registration. */
export default function RegisterStartPage() {
  return <RegisterStartContent />
}
