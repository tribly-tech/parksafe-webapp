import type { Metadata } from 'next'
import { VehiclesPageContent } from '@/components/dashboard/VehiclesPageContent'
import { en } from '@/content/en'

export const metadata: Metadata = {
  title: en.META_VEHICLES_TITLE,
  description: en.META_VEHICLES_DESCRIPTION,
}

export default function VehiclesPage() {
  return <VehiclesPageContent />
}
