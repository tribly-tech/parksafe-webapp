import { z } from 'zod'
import { IssueType } from '../enums/issueType'
import { ChannelType } from '../enums/channelType'

/** Request body sent by a reporter to contact a vehicle owner. */
export const ContactRequestSchema = z.object({
  tagId: z.string().uuid(),
  issueType: z.nativeEnum(IssueType),
  channel: z.nativeEnum(ChannelType),
  /** Optional free-text note — max 140 chars, profanity-filtered on the backend. */
  customNote: z.string().max(140).optional(),
})

/** Response after a successful contact relay dispatch. */
export const ContactResponseSchema = z.object({
  success: z.boolean(),
  /** Opaque reference ID for the relay attempt — no PII */
  messageId: z.string(),
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>
export type ContactResponse = z.infer<typeof ContactResponseSchema>
