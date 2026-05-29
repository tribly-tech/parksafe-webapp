import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind class names with proper conflict resolution.
 * Used everywhere in place of raw template literals or conditional strings.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
