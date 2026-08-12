import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'
import { formatRelativeTime } from '@/lib/utils/format-relative-time'
import { ChevronLeft, Calendar, MessageCircle, Package } from 'lucide-react'
import type { ProductWithSeller } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: productsData } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!products_seller_id_fkey(full_name, avatar_url, whatsapp_number, campus)
    `)
    .eq('seller_id', id)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  const products: ProductWithSeller[] = (productsData ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
  })) as ProductWithSeller[]

  const whatsappLink = profile.whatsapp_number
    ? `https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`
    : null

  return (
    <main className="px-4 py-6 animate-fade-in">
      <div className="mb-5">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface shadow-sm transition-colors hover:bg-neutral-dark"
        >
          <ChevronLeft size={18} className="text-tertiary" />
        </Link>
      </div>

      <div className="rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 overflow-hidden rounded-2xl bg-neutral-dark shadow-inner">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl text-tertiary/30">
                👤
              </div>
            )}
          </div>

          <h1 className="mt-4 text-lg font-bold text-tertiary">
            {profile.full_name}
          </h1>

          {profile.campus && (
            <p className="mt-0.5 text-sm text-tertiary/50">{profile.campus}</p>
          )}

          <div className="mt-2 flex items-center gap-1 text-xs text-tertiary/40">
            <Calendar size={12} />
            Bergabung {formatRelativeTime(profile.created_at)}
          </div>

          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 rounded-2xl bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20 press-scale"
            >
              <MessageCircle size={16} />
              Hubungi via WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Package size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-tertiary">Produk Dijual</h2>
          <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
            {products.length}
          </span>
        </div>
        <ProductGrid products={products} />
      </div>
    </main>
  )
}
