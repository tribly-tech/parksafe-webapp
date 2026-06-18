'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { IssueType } from '@parksafe/types'
import { QrEntryTracker } from '@/components/analytics/QrEntryTracker'
import { track } from '@/lib/utils/analytics'
import { useContactStore } from '@/lib/store/contactStore'
import { buildContactPaths } from '@/lib/contact/paths'
import { VehicleCard } from '@/components/shared/VehicleCard'
import { AnonymityBanner } from '@/components/shared/AnonymityBanner'
import { useTranslations } from 'next-intl'
import { ContactFlowShell } from './ContactFlowShell'
import { IssueCard } from './IssueCard'
import { ISSUE_META } from './issueMeta'

interface ContactIssueStepProps {
  tagId: string
  /** Serializable route base — `/contact` or `/contact/[tagId]` */
  basePath: string
  vehicle: {
    make: string
    model: string
    colour: string
    platePartial: string
  }
}

/** Step 1 — issue selection (`/contact` or `/contact/[tagId]`). */
export function ContactIssueStep({ tagId, basePath, vehicle }: ContactIssueStepProps) {
  const t = useTranslations()
  const router = useRouter()
  const setTagId = useContactStore(s => s.setTagId)
  const paths = useMemo(() => buildContactPaths(basePath), [basePath])

  useEffect(() => {
    setTagId(tagId)
  }, [tagId, setTagId])

  const handleSelectIssue = (issue: IssueType) => {
    track({ event: 'issue_selected', properties: { issueType: issue } })
    router.push(paths.channel(issue))
  }

  return (
    <ContactFlowShell step={1}>
      <QrEntryTracker tagStatus="ACTIVE" />
      <div className="flex flex-col gap-5">
        <VehicleCard {...vehicle} />

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            {t('CONTACT_ISSUE_GRID_TITLE')}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">{t('CONTACT_ISSUE_GRID_SUBTITLE')}</p>
        </div>

        <AnonymityBanner />

        <div className="grid grid-cols-2 gap-3" role="group" aria-label={t('CONTACT_ISSUE_GRID_TITLE')}>
          {Object.values(IssueType).map(issueType => (
            <IssueCard
              key={issueType}
              issueType={issueType}
              emoji={ISSUE_META[issueType].emoji}
              label={ISSUE_META[issueType].label}
              description={ISSUE_META[issueType].description}
              isEmergency={issueType === IssueType.EMERGENCY}
              onSelect={handleSelectIssue}
            />
          ))}
        </div>
      </div>
    </ContactFlowShell>
  )
}
