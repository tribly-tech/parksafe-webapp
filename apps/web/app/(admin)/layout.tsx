/** Admin routes use full viewport width — breaks out of the mobile-first page shell. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-neutral-50">
      {children}
    </div>
  )
}
