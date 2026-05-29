import { en } from '@/content/en'
import { hi as hiOverrides } from '@/content/hi'
import { te as teOverrides } from '@/content/te'

export const locales = ['en', 'hi', 'te'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/**
 * Returns merged message catalog for a locale.
 * Hindi and Telugu files provide partial overrides; English fills all gaps.
 */
export function getMessages(locale: string): Record<string, string> {
  if (locale === 'hi') {
    return { ...en, ...hiOverrides }
  }
  if (locale === 'te') {
    return { ...en, ...teOverrides }
  }
  return { ...en }
}
