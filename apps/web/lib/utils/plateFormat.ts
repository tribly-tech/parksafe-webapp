/**
 * Formats a license plate for display as the user types (e.g. AP 31 CZ 0069).
 * Normalised value (no spaces, uppercase) is used for validation and API submission.
 *
 * Indian format: [AA][1-2 digits][1-3 letters][4 digits]
 */

/** Max length: 2 state + 2 district + 3 series + 4 number */
export const PLATE_MAX_LENGTH = 12

/** Removes spaces, uppercases, and strips non-alphanumeric characters. */
export function normalizePlate(value: string): string {
  return value.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/** Normalises and caps length — use on every keystroke. */
export function sanitizePlateInput(value: string): string {
  return normalizePlate(value).slice(0, PLATE_MAX_LENGTH)
}

/**
 * Inserts spaces between plate segments for readability while typing.
 * Parses structure left-to-right: state → district → series → number.
 */
export function formatPlateDisplay(value: string): string {
  const raw = sanitizePlateInput(value)
  if (raw.length <= 2) return raw

  const segments: string[] = []
  let idx = 0

  segments.push(raw.slice(0, 2))
  idx = 2
  if (idx >= raw.length) return segments.join(' ')

  let district = ''
  while (idx < raw.length && /[0-9]/.test(raw[idx]!) && district.length < 2) {
    district += raw[idx]
    idx++
  }
  if (district) segments.push(district)
  if (idx >= raw.length) return segments.join(' ')

  let series = ''
  while (idx < raw.length && /[A-Z]/.test(raw[idx]!) && series.length < 3) {
    series += raw[idx]
    idx++
  }
  if (series) segments.push(series)
  if (idx >= raw.length) return segments.join(' ')

  let number = ''
  while (idx < raw.length && /[0-9]/.test(raw[idx]!) && number.length < 4) {
    number += raw[idx]
    idx++
  }
  if (number) segments.push(number)

  return segments.join(' ')
}

const MASKED_PLATE_PATTERN = /^([A-Z]{2})\*\*(\d{4})$/

/**
 * Formats a plate for UI display — full plates per Indian spacing standards,
 * masked plates as `MH ** 1234`.
 */
export function formatPlateForDisplay(value: string): string {
  const compact = value.replace(/\s/g, '').toUpperCase()
  const masked = MASKED_PLATE_PATTERN.exec(compact)
  if (masked) {
    return `${masked[1]} ** ${masked[2]}`
  }
  return formatPlateDisplay(compact)
}
