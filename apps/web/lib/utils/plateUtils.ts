/**
 * License plate masking utilities.
 * These run ONLY on the server or in tests — never expose the full plate to the browser.
 * The masked form (platePartial) is generated at write time and stored separately.
 */

/**
 * Masks a license plate for safe display to reporters.
 * Preserves first 2 and last 4 characters; masks the middle.
 *
 * @example
 * maskPlate('MH02AB1234') // → 'MH**1234'
 * maskPlate('KA05CD5678') // → 'KA**5678'
 */
export function maskPlate(plate: string): string {
  if (plate.length < 6) return '****'
  const prefix = plate.slice(0, 2)
  const suffix = plate.slice(-4)
  return `${prefix}**${suffix}`
}

/**
 * Validates an Indian license plate format.
 * Format: 2 letters + 1-2 digits + 1-3 letters + 4 digits
 * @example 'MH02AB1234', 'KA5CD5678'
 */
export function isValidIndianPlate(plate: string): boolean {
  return /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(plate)
}
