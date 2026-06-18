import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const withNextIntl = createNextIntlPlugin()
const monorepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * apps/web/next.config.ts
 * Production-hardened Next.js 15 config.
 * Security headers, image optimisation, and CSP defined here.
 */
const isDev = process.env.NODE_ENV === 'development'
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

const posthogHosts = [
  'https://app.posthog.com',
  'https://*.i.posthog.com',
  'https://*.posthog.com',
].join(' ')

function getPostHogRegion(): 'us' | 'eu' {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
  return host.includes('eu') ? 'eu' : 'us'
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // PostHog API uses trailing slashes (e.g. /e/); avoid Next.js redirect breaking capture.
  skipTrailingSlashRedirect: true,
  // Monorepo root — avoids wrong workspace inference when multiple lockfiles exist.
  outputFileTracingRoot: monorepoRoot,

  async rewrites() {
    const rewrites = [
      {
        source: '/backend/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ]

    if (process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()) {
      const region = getPostHogRegion()
      const apiHost = `https://${region}.i.posthog.com`
      const assetsHost = `https://${region}-assets.i.posthog.com`
      rewrites.push(
        { source: '/ingest/static/:path*', destination: `${assetsHost}/static/:path*` },
        { source: '/ingest/array/:path*', destination: `${assetsHost}/array/:path*` },
        { source: '/ingest/:path*', destination: `${apiHost}/:path*` }
      )
    }

    return rewrites
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.posthog.com https://*.i.posthog.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              [
                "connect-src 'self'",
                posthogHosts,
                'https://graph.facebook.com',
                isDev ? apiOrigin : '',
              ]
                .filter(Boolean)
                .join(' '),
              "font-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [], // No remote images in v1 — all assets are local
  },
}

export default withNextIntl(nextConfig)
