import { z } from 'zod'

/** Safe vehicle representation returned to reporters — no owner PII. */
export const VehicleSchema = z.object({
  id: z.string().uuid(),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  colour: z.string().min(1).max(30),
  /** Masked plate — e.g. "MH**1234". Safe for reporter display. */
  platePartial: z.string(),
  /** Full plate — returned only to the authenticated owner, never on public/tag APIs. */
  plate: z.string().optional(),
  isActive: z.boolean(),
})

/** Input schema for creating a vehicle. Full plate is validated here,
 *  then encrypted before persistence — never returned after creation. */
export const CreateVehicleSchema = z.object({
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  colour: z.string().min(1).max(30),
  /** Indian license plate format: e.g. MH02AB1234 */
  plate: z
    .string()
    .regex(
      /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/,
      'Enter a valid Indian license plate (e.g. MH02AB1234)'
    ),
})

export const UpdateVehicleSchema = CreateVehicleSchema.partial().omit({ plate: true })

export type Vehicle = z.infer<typeof VehicleSchema>
export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleSchema>
