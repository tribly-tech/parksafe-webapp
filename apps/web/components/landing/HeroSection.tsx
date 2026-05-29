import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { routes } from '@/lib/routes'

/**
 * Landing page hero section — RSC, no client JS.
 * Figma design pending — this is a functional placeholder.
 * Replace with pixel-perfect Figma implementation before launch.
 */
export async function HeroSection() {
  const t = await getTranslations()

  return (
    <section className="flex flex-col items-center gap-8 px-4 pb-12 pt-8 text-center">
      <header className="flex w-full items-center justify-between py-4">
        <span className="text-lg font-bold text-primary-500">ParkSafe</span>
        <Link
          href={routes.signIn}
          className="flex min-h-touch items-center justify-center rounded-button border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900"
        >
          {t('LANDING_SIGN_IN_CTA')}
        </Link>
      </header>

      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-500 shadow-lg">
        <span className="text-3xl font-bold text-white" aria-hidden="true">
          P
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold leading-tight text-neutral-900">
          {t('LANDING_HERO_HEADLINE')}
        </h1>
        <p className="text-base text-neutral-600">{t('LANDING_HERO_SUBHEADING')}</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <a
          href={t('GLOBAL_BUY_URL')}
          className="flex min-h-touch w-full items-center justify-center rounded-button bg-primary-500 px-6 text-base font-semibold text-white shadow-md hover:bg-primary-600"
        >
          {t('LANDING_HERO_CTA_PRIMARY')}
        </a>
        <Link
          href="#how-it-works"
          className="flex min-h-touch w-full items-center justify-center rounded-button border border-neutral-200 bg-white px-6 text-base font-semibold text-neutral-900"
        >
          {t('LANDING_HERO_CTA_SECONDARY')}
        </Link>
      </div>
    </section>
  )
}
