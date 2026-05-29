'use client'

import type { IssueType } from '@parksafe/types'
import { ISSUE_META } from './issueMeta'
import { useTranslations } from 'next-intl'

interface SelectedIssueCardProps {
  issueType: IssueType
}

/** Summary of the reporter's chosen issue on step 2. */
export function SelectedIssueCard({ issueType }: SelectedIssueCardProps) {
  const t = useTranslations()
  const meta = ISSUE_META[issueType]

  return (
    <div className="relative rounded-[20px] border-2 border-neutral-200 bg-neutral-50 p-[22px] shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        {t('CONTACT_SELECTED_ISSUE_LABEL')}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-[18px] border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100"
          aria-hidden="true"
        >
          <span className="text-[32px] leading-none">{meta.emoji}</span>
        </div>
        <div className="min-w-0 flex flex-col">
          <p className="text-[17px] font-bold tracking-tight text-neutral-900">{meta.label}</p>
          <p className="text-[13px] text-neutral-600">{meta.description}</p>
        </div>
      </div>
    </div>
  )
}
