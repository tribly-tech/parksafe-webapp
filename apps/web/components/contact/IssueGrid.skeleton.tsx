/**
 * Skeleton placeholder while the contact flow client bundle loads.
 */
export function IssueGridSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-neutral-50">
      <div className="border-b border-neutral-200 px-6 py-5">
        <div className="h-6 w-40 animate-pulse rounded-md bg-neutral-100" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-neutral-100" />
      </div>
      <div className="h-1 bg-neutral-50">
        <div className="h-full w-1/2 animate-pulse bg-neutral-100" />
      </div>
      <div className="flex flex-col gap-5 px-6 py-8">
        <div className="h-28 animate-pulse rounded-[20px] bg-neutral-100" />
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-16 animate-pulse rounded border bg-neutral-100" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-[20px] bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
