export default function VerifyOtpLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-100" />
      <div className="h-4 w-64 animate-pulse rounded-md bg-neutral-100" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-12 w-12 animate-pulse rounded-lg bg-neutral-100" />
        ))}
      </div>
      <div className="h-12 w-full max-w-xs animate-pulse rounded-xl bg-neutral-100" />
    </div>
  )
}
