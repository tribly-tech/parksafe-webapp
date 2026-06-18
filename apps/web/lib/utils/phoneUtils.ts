/**
 * Indian phone helpers for registration forms.
 */

/** Strips non-digits and keeps the last 10 digits. */
export function sanitizeIndianMobile(value: string): string {
  return value.replace(/\D/g, '').slice(-10)
}

/** Converts 10-digit input to E.164 (+91XXXXXXXXXX). */
export function toE164Indian(digits: string): string {
  const cleaned = sanitizeIndianMobile(digits)
  return `+91${cleaned}`
}

/** Masks phone for display in OTP step: +91 98***3210 */
export function maskIndianMobile(digits: string): string {
  const cleaned = sanitizeIndianMobile(digits)
  if (cleaned.length < 4) return cleaned
  return `+91 ${cleaned.slice(0, 2)}***${cleaned.slice(-4)}`
}
