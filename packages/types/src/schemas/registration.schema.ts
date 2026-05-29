import { z } from 'zod'
import { CreateVehicleSchema } from './vehicle.schema'

/** Indian mobile — 10 digits starting with 6–9 (no country code). */
const indianMobileDigitsSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')

export const VehicleTypeSchema = z.enum(['CAR', 'BIKE', 'SCOOTER', 'TRUCK', 'OTHER'])

const plateFieldSchema = z
  .string()
  .min(1, 'Vehicle number is required')
  .transform(s => s.replace(/\s/g, '').toUpperCase())
  .pipe(CreateVehicleSchema.shape.plate)

const registerVehicleFieldsSchema = z.object({
  plate: plateFieldSchema,
  make: CreateVehicleSchema.shape.make,
  model: CreateVehicleSchema.shape.model,
  colour: CreateVehicleSchema.shape.colour,
  vehicleType: VehicleTypeSchema,
  ownerName: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  ownerPhone: indianMobileDigitsSchema,
  emergencyName: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  emergencyPhone: indianMobileDigitsSchema,
  whatsappEnabled: z.boolean(),
  /** UUID from the QR sticker URL — links tag to the new vehicle. */
  tagCode: z.string().uuid().optional(),
})

const distinctPhonesRefine = {
  check: (data: { ownerPhone: string; emergencyPhone: string }) =>
    data.ownerPhone !== data.emergencyPhone,
  message: 'Emergency contact must use a different mobile number' as const,
  path: ['emergencyPhone'] as const,
}

/** Client-side form schema — OTP collected in a separate step. */
export const RegisterVehicleFormSchema = registerVehicleFieldsSchema
  .extend({
    consent: z.boolean().refine(v => v === true, {
      message: 'You must agree to be contacted for vehicle-related issues',
    }),
  })
  .refine(distinctPhonesRefine.check, {
    message: distinctPhonesRefine.message,
    path: [...distinctPhonesRefine.path],
  })

/** Full registration payload submitted after OTP is entered. */
export const RegisterVehicleSchema = registerVehicleFieldsSchema
  .extend({
    consent: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to be contacted for vehicle-related issues' }),
    }),
    otp: z
      .string()
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain only digits'),
  })
  .refine(distinctPhonesRefine.check, {
    message: distinctPhonesRefine.message,
    path: [...distinctPhonesRefine.path],
  })

export type VehicleType = z.infer<typeof VehicleTypeSchema>
export type RegisterVehicleInput = z.infer<typeof RegisterVehicleSchema>
export type RegisterVehicleFormInput = z.infer<typeof RegisterVehicleFormSchema>
