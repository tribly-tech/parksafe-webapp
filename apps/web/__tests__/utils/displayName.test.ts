import { describe, expect, it } from 'vitest'
import { joinDisplayName, splitDisplayName } from '@/lib/utils/displayName'

describe('displayName', () => {
  it('splits a full name into first and last', () => {
    expect(splitDisplayName('Aditya Kumar')).toEqual({
      firstName: 'Aditya',
      lastName: 'Kumar',
    })
  })

  it('handles a single name', () => {
    expect(splitDisplayName('Aditya')).toEqual({
      firstName: 'Aditya',
      lastName: '',
    })
  })

  it('joins first and last name for storage', () => {
    expect(joinDisplayName('Aditya', 'Kumar')).toBe('Aditya Kumar')
    expect(joinDisplayName('Aditya', '')).toBe('Aditya')
  })
})
