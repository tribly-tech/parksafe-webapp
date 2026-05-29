import { describe, it, expect } from 'vitest'
import {
  formatPlateDisplay,
  formatPlateForDisplay,
  normalizePlate,
  sanitizePlateInput,
} from '@/lib/utils/plateFormat'

describe('plateFormat', () => {
  it('normalizes plate by removing spaces and uppercasing', () => {
    expect(normalizePlate('mh 02 ab 1234')).toBe('MH02AB1234')
  })

  it('strips invalid characters', () => {
    expect(sanitizePlateInput('mh-02!ab@1234')).toBe('MH02AB1234')
  })

  it('formats complete plate with spaces', () => {
    expect(formatPlateDisplay('MH02AB1234')).toBe('MH 02 AB 1234')
    expect(formatPlateDisplay('AP31CZ0069')).toBe('AP 31 CZ 0069')
  })

  it('formats partial plate input progressively without mangling', () => {
    expect(formatPlateDisplay('MH')).toBe('MH')
    expect(formatPlateDisplay('MH02')).toBe('MH 02')
    expect(formatPlateDisplay('MH02AB')).toBe('MH 02 AB')
    expect(formatPlateDisplay('AP31')).toBe('AP 31')
    expect(formatPlateDisplay('AP31CZ')).toBe('AP 31 CZ')
    expect(formatPlateDisplay('AP31CZ00')).toBe('AP 31 CZ 00')
    expect(formatPlateDisplay('AP31CZ0069')).toBe('AP 31 CZ 0069')
  })

  it('supports single-digit district codes', () => {
    expect(formatPlateDisplay('KA5CD5678')).toBe('KA 5 CD 5678')
  })

  it('caps input at 12 alphanumeric characters', () => {
    expect(sanitizePlateInput('MH02AB12345678')).toBe('MH02AB123456')
  })

  it('formats masked plates with standard spacing', () => {
    expect(formatPlateForDisplay('MH**1234')).toBe('MH ** 1234')
    expect(formatPlateForDisplay('KA**5678')).toBe('KA ** 5678')
  })

  it('formats full plates with standard spacing', () => {
    expect(formatPlateForDisplay('MH12AB1234')).toBe('MH 12 AB 1234')
    expect(formatPlateForDisplay('MH 12 AB 1234')).toBe('MH 12 AB 1234')
  })
})
