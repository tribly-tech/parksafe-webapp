import type { Metadata } from 'next'
import { SettingsForm } from '@/components/dashboard/SettingsForm'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_SETTINGS_TITLE,
  description: en.META_SETTINGS_DESCRIPTION,
}

export default function SettingsPage() {
  return <SettingsForm />
}
