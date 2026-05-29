import { type ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}

/**
 * Generic empty state — used in every list/dashboard that may have no data.
 * Prevents blank screens — every collection view must use this.
 */
export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="status">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-2xl"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-600">{body}</p>
      </div>
      {action}
    </div>
  )
}
