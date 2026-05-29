import { getTranslations } from 'next-intl/server'

interface ContactStatusScreenProps {
  emoji: string
  title: string
  body: string
  cta?: { label: string; href: string }
}

export async function ContactStatusScreen({ emoji, title, body, cta }: ContactStatusScreenProps) {
  const t = await getTranslations()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-neutral-50">
      <header className="border-b border-neutral-200 px-6 py-5">
        <h1 className="text-xl font-bold text-neutral-900">{t('CONTACT_PAGE_TITLE')}</h1>
      </header>
      <div className="flex flex-1 flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <span className="text-2xl" aria-hidden="true">
            {emoji}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold text-neutral-900">{title}</p>
          <p className="text-sm text-neutral-600">{body}</p>
        </div>
        {cta && (
          <a
            href={cta.href}
            className="min-h-touch rounded-button bg-primary-500 px-6 py-3 text-sm font-semibold text-white"
          >
            {cta.label}
          </a>
        )}
      </div>
    </div>
  )
}