/**
 * apps/api/src/services/profanity.service.ts
 * Filters custom notes before they are appended to relay messages.
 * Uses a curated blocklist — not an external API (no PII leaves the server).
 *
 * TODO: Expand blocklist with a curated Hindi/Telugu/English dataset.
 */

/** Common profanity and harassment terms to block. */
const BLOCKLIST: ReadonlyArray<RegExp> = [
  /\bf+u+c+k+\b/gi,
  /\bs+h+i+t+\b/gi,
  /\ba+s+s+h+o+l+e+\b/gi,
  /\bb+a+s+t+a+r+d+\b/gi,
  // Indian language slurs — extend this list before production
  /\bmadar\b/gi,
  /\bbhenchod\b/gi,
  /\bchutiya\b/gi,
]

/** Pattern to strip phone numbers from custom notes — prevents number sharing */
const PHONE_PATTERN = /(\+?\d[\d\s\-().]{8,}\d)/g

/** Pattern to strip URLs */
const URL_PATTERN = /https?:\/\/[^\s]+/gi

/**
 * Filters a custom note to remove profanity, phone numbers, and URLs.
 * Returns null if the note is entirely blocked or empty after filtering.
 * @param note - Raw note from the reporter form
 */
export function filterNote(note: string | undefined): string | undefined {
  if (!note) return undefined

  let filtered = note
    .replace(PHONE_PATTERN, '[number removed]')
    .replace(URL_PATTERN, '[link removed]')

  for (const pattern of BLOCKLIST) {
    filtered = filtered.replace(pattern, '***')
  }

  const cleaned = filtered.trim()
  return cleaned.length > 0 ? cleaned : undefined
}

/**
 * Returns true if the note passes the profanity check.
 * Used as a guard before appending the note to relay messages.
 * @param note - Note to check (after filterNote has been applied)
 */
export function isNoteClean(note: string): boolean {
  return !BLOCKLIST.some(pattern => pattern.test(note))
}
