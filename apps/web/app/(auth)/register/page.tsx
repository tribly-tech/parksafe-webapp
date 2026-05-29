import { Suspense } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { en } from '@/content/en'
import { RegisterForm } from '@/components/register/RegisterForm'
import { routes } from '@/lib/routes'
import RegisterLoading from './loading'

export const metadata: Metadata = {
  title: en.META_REGISTER_TITLE,
  description: en.META_REGISTER_DESCRIPTION,
}

interface RegisterPageProps {
  searchParams: Promise<{ tag?: string }>
}

/**
 * /register — Vehicle registration form (opened from QR scan with ?tag=).
 * Without a tag, users are sent to the scan / buy entry screen.
 */
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { tag } = await searchParams
  if (!tag) {
    redirect(routes.registerStart)
  }

  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  )
}
