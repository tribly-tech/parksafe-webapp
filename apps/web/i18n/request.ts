import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, getMessages } from '@/lib/i18n/getMessages'

/**
 * next-intl request config — required for getTranslations() in Server Components.
 * Locale is fixed to default (en) until locale routing is added.
 */
export default getRequestConfig(async () => {
  const locale = defaultLocale

  return {
    locale,
    messages: getMessages(locale),
  }
})
