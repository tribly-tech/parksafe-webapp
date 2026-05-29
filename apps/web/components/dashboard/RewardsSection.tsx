'use client'

import { Award, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Reward } from '@parksafe/types'
import { cn } from '@/lib/utils/cn'

interface RewardsSectionProps {
  rewards: Reward[]
}

export function RewardsSection({ rewards }: RewardsSectionProps) {
  const t = useTranslations()
  const unlockedCount = rewards.filter(r => r.unlocked).length

  return (
    <section className="flex flex-col" aria-labelledby="rewards-heading">
      <div className="flex items-center justify-between">
        <h2 id="rewards-heading" className="text-lg font-semibold text-neutral-900">
          {t('DASHBOARD_REWARDS_TITLE')}
        </h2>
        <span className="text-xs font-medium text-primary-500">
          {t('DASHBOARD_REWARDS_COUNT', { count: unlockedCount, total: rewards.length })}
        </span>
      </div>

      <ul
        className="-mx-4 mt-6 flex gap-3 overflow-x-auto scroll-pl-6 scroll-smooth snap-x snap-mandatory pb-1 pl-6 pr-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label={t('DASHBOARD_REWARDS_TITLE')}
      >
        {rewards.map(reward => (
          <li
            key={reward.id}
            className={cn(
              'flex min-h-[156px] w-[calc((100%-1.5rem)/2.5)] shrink-0 snap-start flex-col justify-between gap-3 rounded-2xl border p-4 transition-colors',
              reward.unlocked
                ? 'border-primary-500/40 bg-primary-50/50'
                : 'border-neutral-200 bg-white'
            )}
          >
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  reward.unlocked ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'
                )}
              >
                {reward.unlocked ? (
                  <Award className="h-5 w-5" aria-hidden />
                ) : (
                  <Lock className="h-4 w-4" aria-hidden />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold leading-tight text-neutral-900">{reward.title}</p>
                <p className="text-xs leading-snug text-neutral-600">{reward.description}</p>
              </div>
            </div>
            {!reward.unlocked && reward.progress !== undefined && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${reward.progress}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
