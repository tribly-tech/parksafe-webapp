/** Splits a stored display name into first and last name for editing. */
export function splitDisplayName(displayName: string): {
  firstName: string
  lastName: string
} {
  const trimmed = displayName.trim()
  if (!trimmed) return { firstName: '', lastName: '' }

  const spaceIndex = trimmed.indexOf(' ')
  if (spaceIndex === -1) return { firstName: trimmed, lastName: '' }

  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  }
}

/** Joins first and last name for API storage in display_name. */
export function joinDisplayName(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
}
