export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-register-tint">
      <header className="sticky top-0 z-10 flex justify-end border-b border-neutral-200/80 bg-white/95 px-6 pb-4 pt-4 backdrop-blur-sm">
        <div className="size-11 animate-pulse rounded-full bg-neutral-100" />
      </header>
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-8 px-6 pb-32 pt-8">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-32 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-0.5 w-12 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-64 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-56 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card-offset-neutral"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 animate-pulse rounded-[14px] bg-neutral-100" />
              <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex flex-col gap-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
                  <div className="h-[52px] w-full animate-pulse rounded-md bg-neutral-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-4">
          <div className="h-[54px] flex-1 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-[54px] flex-1 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}
