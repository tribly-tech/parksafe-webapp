import type { IssueType } from '@parksafe/types'

/** Central route definitions — use for links, redirects, and modal URLs. */
export const routes = {
  home: '/',
  signIn: '/sign-in',
  signInOtp: '/sign-in/otp',
  registerStart: '/register/start',
  register: (opts?: { tag?: string }) => {
    if (!opts?.tag) return '/register'
    return `/register?tag=${encodeURIComponent(opts.tag)}`
  },
  registerOtp: (opts?: { tag?: string }) => {
    if (!opts?.tag) return '/register/otp'
    return `/register/otp?tag=${encodeURIComponent(opts.tag)}`
  },
  registerSuccess: '/register/success',
  verifyOtp: '/verify-otp',
  dashboard: '/dashboard',
  dashboardVehicles: '/dashboard/vehicles',
  dashboardReportsReceived: '/dashboard/reports/received',
  dashboardReportsSent: '/dashboard/reports/sent',
  dashboardProfile: '/dashboard/profile',
  dashboardProfileEdit: '/dashboard/profile/edit',
  dashboardProfileHelp: '/dashboard/profile/help',
  dashboardSettings: '/dashboard/settings',
  terms: '/terms',
  privacy: '/privacy',
  admin: '/admin',
  contact: {
    preview: '/contact',
    tag: (tagId: string) => `/contact/${encodeURIComponent(tagId)}`,
    channel: (tagId: string, issue: IssueType) =>
      `/contact/${encodeURIComponent(tagId)}/channel?issue=${encodeURIComponent(issue)}`,
    channelPreview: (issue: IssueType) =>
      `/contact/channel?issue=${encodeURIComponent(issue)}`,
    success: (tagId: string) => `/contact/${encodeURIComponent(tagId)}/success`,
    successPreview: '/contact/success',
  },
} as const
