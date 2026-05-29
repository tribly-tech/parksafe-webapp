import { describe, it, expect } from 'vitest'
import { filterNote, isNoteClean } from '../../src/services/profanity.service'

describe('Profanity Service', () => {
  describe('filterNote', () => {
    it('returns undefined for empty input', () => {
      expect(filterNote(undefined)).toBeUndefined()
      expect(filterNote('')).toBeUndefined()
    })

    it('returns clean notes unchanged', () => {
      const note = 'Your car is blocking my driveway.'
      expect(filterNote(note)).toBe(note)
    })

    it('replaces phone numbers with [number removed]', () => {
      const result = filterNote('Call me at 9876543210 for details')
      expect(result).toContain('[number removed]')
      expect(result).not.toContain('9876543210')
    })

    it('replaces URLs with [link removed]', () => {
      const result = filterNote('See https://example.com for more info')
      expect(result).toContain('[link removed]')
      expect(result).not.toContain('https://example.com')
    })

    it('censors profanity with asterisks', () => {
      const result = filterNote('What the fuck is going on')
      expect(result).toContain('***')
    })

    it('returns undefined when entire note is stripped', () => {
      // Empty after trim
      const result = filterNote('   ')
      expect(result).toBeUndefined()
    })
  })

  describe('isNoteClean', () => {
    it('returns true for clean notes', () => {
      expect(isNoteClean('Please move your car')).toBe(true)
    })

    it('returns false for profanity', () => {
      expect(isNoteClean('This is shit')).toBe(false)
    })
  })
})
