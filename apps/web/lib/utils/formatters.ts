/**
 * Formatting utilities — dates, masked phone display, relative time.
 * No raw PII is ever formatted for display on reporter-facing screens.
 */

/**
 * Masks a phone number for safe display (e.g. in owner confirmation screens).
 * Input: '+919876543210' → Output: '+91 98***3210'
 * Only the first 2 and last 4 digits after the country code are shown.
 */
export function maskPhone(phone: string): string {
  if (phone.length < 8) return '****'
  const stripped = phone.replace(/\D/g, '')
  const prefix = stripped.slice(0, 4)  // country code + first digit
  const suffix = stripped.slice(-4)
  const maskedLen = stripped.length - 8
  return `+${prefix}${'*'.repeat(Math.max(maskedLen, 3))}${suffix}`
}

/**
 * Formats a date as a human-readable string in Indian locale.
 * @example formatDate('2026-05-24T10:30:00Z') → '24 May 2026, 4:00 PM'
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/**
 * Returns a relative time string for recent events.
 * @example relativeTime('2026-05-24T09:00:00Z') → '2 hours ago'
 */
export function relativeTime(dateString: string): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diffMs = new Date(dateString).getTime() - Date.now()
  const diffMins = Math.round(diffMs / 60_000)

  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, 'minute')
  const diffHours = Math.round(diffMins / 60)
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour')
  return rtf.format(Math.round(diffHours / 24), 'day')
}
