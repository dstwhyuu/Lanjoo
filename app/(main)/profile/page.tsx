import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'
import { LogoutButton } from '@/components/auth/logout-button'
import { Settings, Package, Phone, ShoppingBag, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import type { ProductWithSeller } from '@/types'

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 6) return phone
  return `${digits.slice(0, 4)}${'•'.repeat(digits.length - 8)}${digits.slice(-4)}`
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  const [{ data: profile }, { data: productsData }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('products')
      .select(`
        *,
        seller:profiles!products_seller_id_fkey(full_name, avatar_url, whatsapp_number, campus)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const allProducts: ProductWithSeller[] = (productsData ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
  })) as ProductWithSeller[]

  const availableProducts = allProducts.filter((p) => p.status === 'available')
  const soldProducts = allProducts.filter((p) => p.status === 'sold')

  return (
    <main className="px-4 py-6">
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
              {profile?.whatsapp_number && (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-tertiary/40">
                  <Phone size={10} />
                  {maskPhone(profile.whatsapp_number)}
                </div>
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

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-2xl bg-primary-light/50 px-4 py-3">
            <ShoppingBag size={18} className="text-primary" />
            <div>
              <p className="text-lg font-bold text-tertiary">{availableProducts.length}</p>
              <p className="text-[10px] font-medium text-tertiary/50">Dijual</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl bg-neutral px-4 py-3">
            <CheckCircle2 size={18} className="text-tertiary/40" />
            <div>
              <p className="text-lg font-bold text-tertiary">{soldProducts.length}</p>
              <p className="text-[10px] font-medium text-tertiary/50">Terjual</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <Package size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-tertiary">Produk Saya</h3>
          <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
            {allProducts.length}
          </span>
        </div>
        <ProductGrid products={allProducts} />
      </div>

      <div className="mt-8 rounded-3xl bg-surface p-4 shadow-sm">
        <LogoutButton />
      </div>
    </main>
  )
}