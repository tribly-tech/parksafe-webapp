import { z } from 'zod'
import { ContactEventSummarySchema } from './dashboard.schema'

export const MaskedVehicleSummarySchema = z.object({
  make: z.string(),
  model: z.string(),
  colour: z.string(),
  platePartial: z.string(),
})

export const ReportedVehicleEventSchema = z.object({
  id: z.string().uuid(),
  issueType: z.string(),
  issueLabel: z.string(),
  channel: z.string(),
  createdAt: z.string().datetime(),
  vehicle: MaskedVehicleSummarySchema,
})

export const ReportsReceivedResponseSchema = z.object({
  events: z.array(ContactEventSummarySchema),
})

export const ReportsSentResponseSchema = z.object({
  events: z.array(ReportedVehicleEventSchema),
})

export type MaskedVehicleSummary = z.infer<typeof MaskedVehicleSummarySchema>
export type ReportedVehicleEvent = z.infer<typeof ReportedVehicleEventSchema>
export type ReportsReceivedResponse = z.infer<typeof ReportsReceivedResponseSchema>
export type ReportsSentResponse = z.infer<typeof ReportsSentResponseSchema>
