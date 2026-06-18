import posthog from 'posthog-js'

/** True when PostHog key is set and analytics is not explicitly disabled. */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false
  if (!process.env['NEXT_PUBLIC_POSTHOG_KEY']?.trim()) return false
  if (process.env['NEXT_PUBLIC_POSTHOG_DISABLED'] === 'true') return false
  return (
    process.env.NODE_ENV === 'production' ||
    process.env['NEXT_PUBLIC_POSTHOG_ENABLED'] === 'true'
  )
}

/**
 * Discriminated union of all trackable analytics events.
 * CRITICAL: No PII in any event or property — anonymous IDs and enum labels only.
 */
export type AnalyticsEvent =
  | { event: 'qr_scanned'; properties: { tagStatus: 'ACTIVE' | 'INACTIVE' | 'UNREGISTERED' } }
  | { event: 'issue_selected'; properties: { issueType: string } }
  | { event: 'channel_selected'; properties: { channel: 'WHATSAPP' | 'CALL' } }
  | { event: 'contact_sent'; properties: { channel: string; issueType: string } }
  | { event: 'contact_failed'; properties: { channel: string; issueType: string; status: number } }
  | { event: 'otp_requested'; properties: { flow: 'register' | 'sign_in' } }
  | { event: 'otp_verified'; properties: { flow: 'register' | 'sign_in' } }
  | { event: 'otp_failed'; properties: { flow: 'register' | 'sign_in'; attemptCount: number } }
  | { event: 'registration_step'; properties: { step: number } }
  | { event: 'tag_activated'; properties: Record<string, never> }
  | { event: 'tag_deactivated'; properties: Record<string, never> }
  | { event: 'offline_screen_shown'; properties: Record<string, never> }

/**
 * Tracks an analytics event with PostHog.
 * Safe: no PII, no phone numbers, no plates, no names.
 */
export function track({ event, properties }: AnalyticsEvent): void {
  if (!isAnalyticsEnabled()) return
  posthog.capture(event, properties)
}

/**
 * Links events to an anonymous owner UUID after auth — never pass phone or name.
 */
export function identifyOwner(userId: string): void {
  if (!isAnalyticsEnabled()) return
  posthog.identify(userId)
}

/** Clears identity on sign-out. */
export function resetAnalyticsIdentity(): void {
  if (!isAnalyticsEnabled()) return
  posthog.reset()
}
