import crypto from 'node:crypto'

/**
 * Normalises a 10-digit Indian mobile to E.164 (+91XXXXXXXXXX).
 */
export function toE164Indian(digits: string): string {
  const cleaned = digits.replace(/\D/g, '').slice(-10)
  return `+91${cleaned}`
}

/**
 * HMAC hash of phone for storage and lookups — never store raw numbers.
 */
export function hashPhone(phone: string): string {
  return crypto
    .createHmac('sha256', process.env['OTP_HMAC_SECRET'] ?? '')
    .update(phone)
    .digest('hex')
}
