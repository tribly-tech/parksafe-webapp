import { z } from 'zod'
import { IssueType } from '../enums/issueType'
import { ChannelType } from '../enums/channelType'

/** Internal relay dispatch request — only used server-side, never exposed to clients. */
export const RelayRequestSchema = z.object({
  /** Owner phone — passed directly to adapter, never logged or returned. */
  ownerPhone: z.string().regex(/^\+[1-9]\d{9,14}$/),
  issueType: z.nativeEnum(IssueType),
  channel: z.nativeEnum(ChannelType),
  customNote: z.string().max(140).optional(),
})

export const RelayResponseSchema = z.object({
  success: z.boolean(),
  /** Provider-assigned message SID — opaque identifier, no PII */
  providerMessageId: z.string().optional(),
  error: z.string().optional(),
})

export type RelayRequest = z.infer<typeof RelayRequestSchema>
export type RelayResponse = z.infer<typeof RelayResponseSchema>
