import { ShieldCheck, Zap, PhoneOff } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

/**
 * Trust signal row — shown below the hero.
 * Communicates the three core value props at a glance.
 */
export async function TrustBadges() {
  const t = await getTranslations()

  const badges = [
    {
      icon: ShieldCheck,
      label: t('LANDING_TRUST_ANONYMOUS_LABEL'),
      desc: t('LANDING_TRUST_ANONYMOUS_DESC'),
    },
    {
      icon: Zap,
      label: t('LANDING_TRUST_INSTANT_LABEL'),
      desc: t('LANDING_TRUST_INSTANT_DESC'),
    },
    {
      icon: PhoneOff,
      label: t('LANDING_TRUST_NOCALLS_LABEL'),
      desc: t('LANDING_TRUST_NOCALLS_DESC'),
    },
  ]

  return (
    <section className="px-4 pb-10" aria-label={t('ARIA_KEY_FEATURES')}>
      <div className="flex flex-col gap-4">
        {badges.map(badge => (
          <div key={badge.label} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <badge.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-neutral-900">{badge.label}</p>
              <p className="text-xs text-neutral-600">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
