interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-neutral-dark via-neutral to-neutral-dark bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  )
}
