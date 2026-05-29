'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

/** Shield + checkmark from Figma node 1:862 (48×48), check centered in shield body. */
function FooterShieldIcon() {
  return (
    <svg
      className="size-12 shrink-0"
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M34 24.0009C34 34.0009 27 39.0009 18.68 41.9009C18.2443 42.0485 17.7711 42.0415 17.34 41.8809C9 39.0009 2 34.0009 2 24.0009V10.0009C2 9.47047 2.21071 8.96176 2.58579 8.58669C2.96086 8.21161 3.46957 8.0009 4 8.0009C8 8.0009 13 5.6009 16.48 2.5609C16.9037 2.1989 17.4427 2 18 2C18.5573 2 19.0963 2.1989 19.52 2.5609C23.02 5.6209 28 8.0009 32 8.0009C32.5304 8.0009 33.0391 8.21161 33.4142 8.58669C33.7893 8.96176 34 9.47047 34 10.0009V24.0009Z"
        stroke="#1BB658"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 23L15 27L25 17"
        stroke="#1BB658"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Dashboard footer — Figma node 80:113.
 * Brand wordmark, tagline, copyright, and parking illustration.
 */
export function DashboardFooter() {
  const t = useTranslations()

  return (
    <footer
      className="relative -mx-4 mt-10 overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F1FFF7_37.98%)]"
      aria-labelledby="dashboard-footer-wordmark"
    >
      <div className="flex flex-col items-center px-4 pt-10">
        <FooterShieldIcon />

        <p
          id="dashboard-footer-wordmark"
          className="mt-4 text-center text-[48px] font-bold lowercase leading-[67.2px] tracking-[-0.96px] text-primary-500"
        >
          {t('REGISTER_BRAND_WORDMARK')}
        </p>

        <p className="mt-2 text-center text-sm font-medium leading-5 text-[#16a34a]">
          {t('DASHBOARD_FOOTER_TAGLINE')}
        </p>

        <div className="mt-6 w-full max-w-[1280px] border-t border-[#d4edde] pt-[25px]">
          <p className="text-center text-sm font-normal leading-5 text-[#3bb86c]">
            {t('DASHBOARD_FOOTER_COPYRIGHT')}
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[400px]">
        <Image
          src="/images/dashboard/footer-illustration.png"
          alt=""
          width={800}
          height={677}
          className="pointer-events-none h-auto w-full select-none"
          sizes="(max-width: 430px) 100vw, 400px"
        />
      </div>
    </footer>
  )
}
