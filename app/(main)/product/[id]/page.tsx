import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProductGallery } from '@/components/product/product-gallery'
import { WhatsAppButton } from '@/components/product/whatsapp-button'
import { ConditionBadge } from '@/components/product/condition-badge'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format-price'
import { formatRelativeTime } from '@/lib/utils/format-relative-time'
import { STATUS_LABELS } from '@/lib/constants'
import { Eye, Clock, Tag, ChevronLeft, Pencil } from 'lucide-react'
import type { ProductWithSellerAndCategory } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!products_seller_id_fkey(full_name, avatar_url, whatsapp_number, campus),
      category:categories!products_category_id_fkey(name, slug, icon)
    `)
    .eq('id', id)
    .single()

  if (!data) return null

  // Fire-and-forget view count increment
  supabase
    .from('products')
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq('id', id)
    .then()

  return {
    ...data,
    seller: Array.isArray(data.seller) ? data.seller[0] : data.seller,
    category: Array.isArray(data.category) ? data.category[0] : data.category,
  } as ProductWithSellerAndCategory
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Produk Tidak Ditemukan' }

  return {
    title: `${product.title} — Lanjoo`,
    description: product.description ?? `${product.title} dijual di Lanjoo seharga ${formatPrice(product.price)}`,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === product.seller_id

  const isSold = product.status === 'sold'
  const isReserved = product.status === 'reserved'

  return (
    <main className="animate-fade-in pb-28">
      <div className="relative">
        <ProductGallery images={product.images} title={product.title} />
        <Link
          href="/"
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full glass shadow-sm"
        >
          <ChevronLeft size={20} className="text-tertiary" />
        </Link>
        {isOwner && (
          <Link
            href={`/product/${product.id}/edit`}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full glass shadow-sm"
          >
            <Pencil size={16} className="text-tertiary" />
          </Link>
        )}
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          {(isSold || isReserved) && (
            <Badge variant={isSold ? 'neutral' : 'warning'}>
              {STATUS_LABELS[product.status]}
            </Badge>
          )}
        </div>

        <h1 className="mt-2 text-lg font-semibold text-tertiary">
          {product.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ConditionBadge condition={product.condition} />
          {product.category && (
            <Badge variant="neutral">
              {product.category.icon} {product.category.name}
            </Badge>
          )}
        </div>

        {product.description && (
          <p className="mt-4 text-sm leading-relaxed text-tertiary/70">
            {product.description}
          </p>
        )}

        <Link
          href={`/profile/${product.seller_id}`}
          className="mt-5 flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-neutral-dark">
            {product.seller.avatar_url ? (
              <Image
                src={product.seller.avatar_url}
                alt={product.seller.full_name}
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg text-tertiary/30">
                👤
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-tertiary">
              {product.seller.full_name}
            </p>
            <p className="text-xs text-tertiary/50">
              {product.seller.campus}
            </p>
          </div>
          <ChevronLeft size={16} className="rotate-180 text-tertiary/30" />
        </Link>

        <div className="mt-5 flex items-center gap-4 text-xs text-tertiary/40">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {formatRelativeTime(product.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={13} />
            {product.view_count} dilihat
          </span>
          {product.category && (
            <span className="flex items-center gap-1">
              <Tag size={13} />
              {product.category.name}
            </span>
          )}
        </div>
      </div>

      <WhatsAppButton
        phone={product.seller.whatsapp_number}
        productTitle={product.title}
        price={product.price}
        status={product.status}
      />
    </main>
  )
}
