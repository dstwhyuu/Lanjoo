import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'
import { Settings, Package } from 'lucide-react'
import Link from 'next/link'
import type { ProductWithSeller } from '@/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: productsData } = await supabase
    .from('products')
    .select(`
      *,
      seller:profiles!products_seller_id_fkey(full_name, avatar_url, whatsapp_number, campus)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const products: ProductWithSeller[] = (productsData ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
  })) as ProductWithSeller[]

  return (
    <main className="px-4 py-6 animate-fade-in">
      <div className="rounded-3xl bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-neutral-dark shadow-inner">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl text-tertiary/30">
                  👤
                </div>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-tertiary">
                {profile?.full_name || 'User'}
              </h2>
              {profile?.campus && (
                <p className="text-xs text-tertiary/50">{profile.campus}</p>
              )}
            </div>
          </div>
          <Link
            href="/profile/edit"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral transition-colors hover:bg-neutral-dark"
          >
            <Settings size={16} className="text-tertiary/50" />
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Package size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-tertiary">Produk Saya</h3>
          <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
            {products.length}
          </span>
        </div>
        <ProductGrid products={products} />
      </div>
    </main>
  )
}