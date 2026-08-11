import { ProductCard } from '@/components/product/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProductWithSeller } from '@/types'

interface ProductGridProps {
  products: ProductWithSeller[]
  loading?: boolean
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-surface shadow-sm">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <span className="text-5xl">🔍</span>
        <p className="mt-4 text-sm font-medium text-tertiary/60">
          Belum ada produk
        </p>
        <p className="mt-1 text-xs text-tertiary/40">
          Produk yang diposting akan muncul di sini
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
