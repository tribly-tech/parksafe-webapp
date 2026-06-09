import type { Metadata } from 'next'
import { en } from '@/content/en'
import { AdminAuthGate } from '@/components/admin/AdminAuthGate'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export const metadata: Metadata = {
  title: en.META_ADMIN_TITLE,
  description: en.META_ADMIN_DESCRIPTION,
  robots: { index: false, follow: false },
}

/** Admin QR tag generation — internal tooling, not indexed. */
export default function AdminPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <AdminPageHeader />

        <AdminAuthGate>
          <AdminDashboard />
        </AdminAuthGate>
      </div>
    </main>
  )
}
