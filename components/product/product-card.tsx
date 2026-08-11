import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format-price'
import { CONDITION_LABELS, CONDITION_VARIANTS } from '@/lib/constants'
import type { ProductWithSeller } from '@/types'

interface ProductCardProps {
  product: ProductWithSeller
}

export function ProductCard({ product }: ProductCardProps) {
  const hasImage = product.images.length > 0

  return (
    <Link href={`/product/${product.id}`} className="block animate-fade-in">
      <Card hover className="overflow-hidden">
        <div className="relative aspect-square bg-neutral-dark">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl text-tertiary/20">
              📷
            </div>
          )}
          <div className="absolute left-2 top-2">
            <Badge variant={CONDITION_VARIANTS[product.condition]}>
              {CONDITION_LABELS[product.condition]}
            </Badge>
          </div>
        </div>

        <div className="p-3">
          <p className="text-sm font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-tertiary">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-5 w-5 overflow-hidden rounded-full bg-neutral-dark">
              {product.seller.avatar_url ? (
                <Image
                  src={product.seller.avatar_url}
                  alt={product.seller.full_name}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-tertiary/40">
                  👤
                </div>
              )}
            </div>
            <span className="truncate text-xs text-tertiary/50">
              {product.campus}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
