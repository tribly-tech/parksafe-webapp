import type { Metadata } from 'next'
import { ProfileEditContent } from '@/components/dashboard/ProfileEditContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_PROFILE_EDIT_TITLE,
  description: en.META_PROFILE_EDIT_DESCRIPTION,
}

export default function ProfileEditPage() {
  return <ProfileEditContent />
}
