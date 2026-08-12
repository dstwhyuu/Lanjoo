import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'
import { CategoryChipList } from '@/components/category/category-chip-list'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import type { ProductWithSeller } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: categoriesData }, { data: productsData }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, icon, sort_order')
      .order('sort_order'),
    supabase
      .from('products')
      .select(`
        *,
        seller:profiles!products_seller_id_fkey(full_name, avatar_url, whatsapp_number, campus)
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const categories = categoriesData && categoriesData.length > 0
    ? [DEFAULT_CATEGORIES[0], ...categoriesData]
    : DEFAULT_CATEGORIES

  const products: ProductWithSeller[] = (productsData ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
  })) as ProductWithSeller[]

  return (
    <main className="px-4 py-4">
      <section className="mb-4">
        <CategoryChipList categories={categories} activeSlug="all" />
      </section>

      <section>
        <ProductGrid products={products} />
      </section>
    </main>
  )
}