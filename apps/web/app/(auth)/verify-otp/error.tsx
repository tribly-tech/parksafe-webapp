'use client'

import { AlertCircle } from 'lucide-react'

export default function VerifyOtpError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertCircle className="h-10 w-10 text-error-500" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-neutral-900">Verification error</h2>
        <p className="text-sm text-neutral-600">Please request a new OTP and try again.</p>
      </div>
      <button
        onClick={reset}
        className="min-h-touch rounded-button bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  )
}
