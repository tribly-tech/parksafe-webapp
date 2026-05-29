'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { IssueType } from '@parksafe/types'

const issueCardVariants = cva(
  [
    'flex min-h-[120px] cursor-pointer flex-col items-center gap-3',
    'rounded-button border-2 p-[18px] text-center transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      isSelected: {
        true: 'border-primary-500 bg-primary-50 shadow-md',
        false: 'border-neutral-200 bg-white hover:border-primary-400/60',
      },
      isEmergency: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      isSelected: false,
      isEmergency: false,
    },
  }
)

interface IssueCardProps extends VariantProps<typeof issueCardVariants> {
  issueType: IssueType
  emoji: string
  label: string
  description: string
  onSelect: (issueType: IssueType) => void
}

/**
 * Single issue category card — rendered inside the issue selection grid.
 */
export function IssueCard({
  issueType,
  emoji,
  label,
  description,
  isSelected,
  isEmergency,
  onSelect,
}: IssueCardProps) {
  return (
    <button
      type="button"
      className={cn(issueCardVariants({ isSelected, isEmergency }))}
      onClick={() => onSelect(issueType)}
      aria-pressed={isSelected ?? false}
    >
      <div
        className="flex size-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-neutral-50 to-neutral-100"
        aria-hidden="true"
      >
        <span className="text-[32px] leading-none">{emoji}</span>
      </div>
      <div className="flex w-full flex-col items-center">
        <span
          className={cn(
            'text-sm font-semibold tracking-tight',
            isEmergency ? 'text-emergency' : 'text-neutral-900'
          )}
        >
          {label}
        </span>
        <span className="mt-1 text-[11px] leading-snug text-neutral-400">{description}</span>
      </div>
    </button>
  )
}
