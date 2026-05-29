import { IssueType } from '@parksafe/types'

/** Builds contact flow URLs for a given base path (`/contact` or `/contact/[tagId]`). */
export function buildContactPaths(basePath: string) {
  const normalized = basePath.replace(/\/$/, '')

  return {
    issue: () => normalized,
    channel: (issue: IssueType) =>
      `${normalized}/channel?issue=${encodeURIComponent(issue)}`,
    success: () => `${normalized}/success`,
  } as const
}

export type ContactPaths = ReturnType<typeof buildContactPaths>

/** Dev preview entry — step 1 at /contact */
export const devContactPaths = buildContactPaths('/contact')
