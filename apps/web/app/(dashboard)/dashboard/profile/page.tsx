import type { Metadata } from 'next'
import { ProfilePageContent } from '@/components/dashboard/ProfilePageContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_PROFILE_TITLE,
  description: en.META_PROFILE_DESCRIPTION,
}

export default function ProfilePage() {
  return <ProfilePageContent />
}
