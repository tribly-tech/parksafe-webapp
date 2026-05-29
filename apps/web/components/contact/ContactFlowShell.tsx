'use client'

import { type ReactNode } from 'react'
import { ContactPageHeader } from './ContactPageHeader'
import { ContactPrivacyFooter } from './ContactPrivacyFooter'

interface ContactFlowShellProps {
  step: 1 | 2
  children: ReactNode
  showFooter?: boolean
}

/** Shared layout wrapper for contact flow steps. */
export function ContactFlowShell({ step, children, showFooter = true }: ContactFlowShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-neutral-50">
      <ContactPageHeader currentStep={step} />
      <div className="flex flex-1 flex-col gap-8 px-6 pb-20 pt-8">
        {children}
        {showFooter && <ContactPrivacyFooter />}
      </div>
    </div>
  )
}
