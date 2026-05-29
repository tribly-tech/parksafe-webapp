export function NoticeSkeleton() {
  return <div className="h-[88px] animate-pulse rounded-2xl bg-neutral-100" />
}

export function ListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[120px] animate-pulse rounded-2xl bg-neutral-100" />
        ))}
      </div>
    </div>
  )
}

export function DashboardListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <NoticeSkeleton />
      <ListSkeleton />
    </div>
  )
}
