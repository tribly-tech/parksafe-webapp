import { z } from 'zod'

export const RewardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  unlocked: z.boolean(),
  progress: z.number().min(0).max(100).optional(),
})

/** Vehicle linked to a received alert — full plate shown only to the owner. */
export const AlertVehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  colour: z.string(),
  platePartial: z.string(),
  plate: z.string().optional(),
})

export const ContactEventSummarySchema = z.object({
  id: z.string().uuid(),
  issueType: z.string(),
  issueLabel: z.string(),
  channel: z.string(),
  createdAt: z.string().datetime(),
  vehicle: AlertVehicleSchema.optional(),
})

export const DashboardSummarySchema = z.object({
  displayName: z.string(),
  activeVehicles: z.number().int().min(0),
  safeDays: z.number().int().min(0).max(999),
  reportsReceived: z.number().int().min(0),
  vehiclesReported: z.number().int().min(0),
  rewards: z.array(RewardSchema),
  recentContacts: z.array(ContactEventSummarySchema),
})

export type Reward = z.infer<typeof RewardSchema>
export type AlertVehicle = z.infer<typeof AlertVehicleSchema>
export type ContactEventSummary = z.infer<typeof ContactEventSummarySchema>
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>
