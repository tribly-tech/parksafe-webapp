import { IssueType } from '@parksafe/types'

/** Validates `?issue=` search param against IssueType enum values. */
export function parseIssueParam(value: string | string[] | undefined): IssueType | null {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return null
  return Object.values(IssueType).includes(raw as IssueType) ? (raw as IssueType) : null
}
