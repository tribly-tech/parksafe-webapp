import { describe, it, expect } from 'vitest'
import { RegisterVehicleFormSchema } from '@parksafe/types'

const validForm = {
  plate: 'MH02AB1234',
  make: 'Honda',
  model: 'City',
  colour: 'White',
  vehicleType: 'CAR' as const,
  ownerName: 'Rahul Sharma',
  ownerPhone: '9876543210',
  emergencyName: 'Priya Sharma',
  emergencyPhone: '9123456780',
  whatsappEnabled: true,
  consent: true,
}

describe('RegisterVehicleFormSchema', () => {
  it('accepts valid registration data', () => {
    const result = RegisterVehicleFormSchema.safeParse(validForm)
    expect(result.success).toBe(true)
  })

  it('rejects when owner and emergency phones match', () => {
    const result = RegisterVehicleFormSchema.safeParse({
      ...validForm,
      emergencyPhone: validForm.ownerPhone,
    })
    expect(result.success).toBe(false)
  })

  it('rejects without consent', () => {
    const result = RegisterVehicleFormSchema.safeParse({
      ...validForm,
      consent: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid plate format', () => {
    const result = RegisterVehicleFormSchema.safeParse({
      ...validForm,
      plate: 'INVALID',
    })
    expect(result.success).toBe(false)
  })

  it('normalizes plate with spaces before validation', () => {
    const result = RegisterVehicleFormSchema.safeParse({
      ...validForm,
      plate: 'MH 02 AB 1234',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.plate).toBe('MH02AB1234')
    }
  })
})
