import { ChannelType } from '@parksafe/types'
import { parseIssueParam } from './parseIssue'

export interface SuccessPageParams {
  issue: NonNullable<ReturnType<typeof parseIssueParam>>
  channel: ChannelType
  sentAt: string
}

/** Parses success screen query params; returns null if required fields are missing. */
export function parseSuccessParams(
  search: Record<string, string | string[] | undefined>
): SuccessPageParams | null {
  const issue = parseIssueParam(search['issue'])
  const channelRaw = Array.isArray(search['channel']) ? search['channel'][0] : search['channel']
  const sentAtRaw = Array.isArray(search['sentAt']) ? search['sentAt'][0] : search['sentAt']

  if (!issue || !channelRaw || !sentAtRaw) return null
  if (!Object.values(ChannelType).includes(channelRaw as ChannelType)) return null

  return {
    issue,
    channel: channelRaw as ChannelType,
    sentAt: sentAtRaw,
  }
}
