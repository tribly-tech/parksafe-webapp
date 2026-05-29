import { en } from '@/content/en'
import { HeroSection } from '@/components/landing/HeroSection'
import { TrustBadges } from '@/components/landing/TrustBadges'

/**
 * / — Landing page
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <TrustBadges />

      <section id="how-it-works" className="flex flex-col gap-4 px-4 py-10">
        <h2 className="text-center text-xl font-bold text-neutral-900">{en.LANDING_HERO_CTA_SECONDARY}</h2>
        <ol className="flex flex-col gap-3">
          <li className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
            {en.LANDING_HERO_SUBHEADING}
          </li>
          <li className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
            {en.LANDING_TRUST_ANONYMOUS_DESC}
          </li>
          <li className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
            {en.LANDING_TRUST_INSTANT_DESC}
          </li>
        </ol>
      </section>

      <footer className="border-t border-neutral-200 px-4 py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} Tribly Tech Pvt. Ltd. · {en.GLOBAL_TAGLINE}
      </footer>
    </main>
  )
}
