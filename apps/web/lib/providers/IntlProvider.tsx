'use client'

import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { type ReactNode } from 'react'

interface IntlProviderProps {
  children: ReactNode
  locale?: string
  messages?: AbstractIntlMessages
}

/**
 * next-intl client provider.
 * Locale and messages are passed from the root layout Server Component.
 * Defaults to 'en' with no messages — pages load their own translations.
 */
export function IntlProvider({ children, locale = 'en', messages = {} }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
