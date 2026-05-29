import type { Metadata } from 'next'
import { RegisterSuccessContent } from '@/components/register/RegisterSuccessContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_REGISTER_TITLE,
  description: en.META_REGISTER_DESCRIPTION,
}

/** /register/success — Registration complete. */
export default function RegisterSuccessPage() {
  return <RegisterSuccessContent />
}
