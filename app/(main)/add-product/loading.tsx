import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="px-4 py-6">
      <Skeleton className="mb-5 h-7 w-32" />
      <div className="rounded-3xl bg-surface p-5 shadow-sm space-y-5">
        <div>
          <Skeleton className="mb-2 h-4 w-20" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
        <Skeleton className="h-14 rounded-2xl" />
      </div>
    </main>
  )
}
