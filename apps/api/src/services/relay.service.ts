/**
 * apps/api/src/services/relay.service.ts
 * Abstracts all communication channels behind a single interface.
 * Route handlers and other services NEVER call Twilio/WhatsApp/Exotel directly.
 * Channel fallback chain: WhatsApp → SMS (Twilio → MSG91) → Call (Exotel).
 */

import { IssueType, ChannelType, MESSAGE_TEMPLATES } from '@parksafe/types'
import { twilioAdapter } from '../lib/adapters/twilio'
import { whatsappAdapter } from '../lib/adapters/whatsapp'
import { exotelAdapter } from '../lib/adapters/exotel'
import { msg91Adapter } from '../lib/adapters/msg91'

interface RelayOptions {
  /** Owner phone in E.164 format — passed only here, never returned to client */
  ownerPhone: string
  issueType: IssueType
  channel: ChannelType
  /** Pre-filtered custom note from the reporter */
  customNote?: string
}

interface RelayResult {
  success: boolean
  providerMessageId?: string
  error?: string
}

/**
 * Dispatches a relay message to the vehicle owner via the specified channel.
 * Uses pre-defined templates — custom notes are appended after filtering.
 * @param opts - Relay options including owner phone (never logged)
 */
export async function dispatchRelay(opts: RelayOptions): Promise<RelayResult> {
  const baseMessage = MESSAGE_TEMPLATES[opts.issueType]
  const message = opts.customNote
    ? `${baseMessage}\n\nNote: ${opts.customNote}`
    : baseMessage

  switch (opts.channel) {
    case ChannelType.WHATSAPP:
      return whatsappAdapter.sendMessage({ to: opts.ownerPhone, body: message })

    case ChannelType.SMS: {
      // Try Twilio first — fall back to MSG91 on failure
      const twilioResult = await twilioAdapter.sendSms({ to: opts.ownerPhone, body: message })
      if (twilioResult.success) return twilioResult

      console.warn('[relay] Twilio failed, falling back to MSG91')
      return msg91Adapter.sendSms({ to: opts.ownerPhone, body: message })
    }

    case ChannelType.CALL:
      return exotelAdapter.initiateCall({ to: opts.ownerPhone, issueType: opts.issueType })

    default: {
      // TypeScript exhaustiveness check — ensures all ChannelType values are handled
      const _exhaustive: never = opts.channel
      throw new Error(`Unsupported channel: ${String(_exhaustive)}`)
    }
  }
}

/**
 * Sends an OTP via SMS — separate from the contact relay.
 * Phone is passed directly to Twilio and never stored.
 * @param phone - E.164 formatted phone number
 * @param otp - 6-digit OTP to deliver
 */
export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  const result = await twilioAdapter.sendSms({
    to: phone,
    body: `Your ParkSafe OTP is ${otp}. Valid for 5 minutes. Do not share this with anyone.`,
  })

  if (!result.success) {
    // Log failure without the phone number
    console.error('[relay] OTP SMS delivery failed:', result.error)
    throw new Error('Failed to send OTP. Please try again.')
  }
}
