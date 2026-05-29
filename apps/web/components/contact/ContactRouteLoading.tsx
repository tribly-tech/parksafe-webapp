/** Shared contact flow loading skeleton — used across contact route segments. */
export function ContactRouteLoading() {
  return (
    <div className="flex min-h-screen flex-col gap-4 px-4 py-6">
      <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-100" />
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-40 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-4 w-24 animate-pulse rounded-md bg-neutral-100" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-32 animate-pulse rounded-md bg-neutral-100" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
