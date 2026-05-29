import { z } from 'zod'

/**
 * Validates a +91 Indian mobile number.
 * Regex: +91 followed by a digit 6–9, then 9 more digits.
 */
const indianPhoneSchema = z
  .string()
  .regex(/^\+91[6-9]\d{9}$/, 'Enter a valid Indian mobile number (+91XXXXXXXXXX)')

export const RequestOtpSchema = z.object({
  phone: indianPhoneSchema,
})

export const VerifyOtpSchema = z.object({
  phone: indianPhoneSchema,
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
})

export type RequestOtpInput = z.infer<typeof RequestOtpSchema>
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>
