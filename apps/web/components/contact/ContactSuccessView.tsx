'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { IssueType, ChannelType } from '@parksafe/types'
import { useContactStore } from '@/lib/store/contactStore'
import { buildContactPaths } from '@/lib/contact/paths'
import { ContactSuccessHeader } from './ContactSuccessHeader'
import { SuccessScreen } from './SuccessScreen'

interface ContactSuccessViewProps {
  basePath: string
  issue: IssueType
  channel: ChannelType
  sentAt: string
}

/** Success screen — `/contact/success` or `/contact/[tagId]/success`. */
export function ContactSuccessView({
  basePath,
  issue,
  channel,
  sentAt,
}: ContactSuccessViewProps) {
  const reset = useContactStore(s => s.reset)
  const paths = buildContactPaths(basePath)

  useEffect(() => {
    const { setTagId, selectIssue, selectChannel, setSentAt } = useContactStore.getState()
    selectIssue(issue)
    selectChannel(channel)
    setSentAt(sentAt)
    return () => reset()
  }, [issue, channel, sentAt, reset])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-neutral-50">
      <ContactSuccessHeader backHref={paths.channel(issue)} />
      <main className="flex flex-1 flex-col px-6 pb-20 pt-8">
        <SuccessScreen
          issue={issue}
          channel={channel}
          sentAt={sentAt}
          homeHref="/"
        />
      </main>
    </div>
  )
}

/** Redirects to step 1 when success params are missing (e.g. direct URL visit). */
export function ContactSuccessRedirect({ basePath }: { basePath: string }) {
  const router = useRouter()
  const paths = buildContactPaths(basePath)

  useEffect(() => {
    router.replace(paths.issue())
  }, [router, paths])

  return null
}
