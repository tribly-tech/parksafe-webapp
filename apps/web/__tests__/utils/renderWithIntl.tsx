import { render, type RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { type ReactElement, type ReactNode } from 'react'
import { en } from '@/content/en'

interface WrapperProps {
  children: ReactNode
}

/** Test wrapper providing next-intl context. */
export function IntlTestWrapper({ children }: WrapperProps) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {children}
    </NextIntlClientProvider>
  )
}

/** Renders a component wrapped with next-intl test providers. */
export function renderWithIntl(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: IntlTestWrapper, ...options })
}
