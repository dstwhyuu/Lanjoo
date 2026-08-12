import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="pb-28">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="px-4 pt-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </main>
  )
}
