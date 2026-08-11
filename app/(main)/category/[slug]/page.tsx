import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'
import { CategoryChipList } from '@/components/category/category-chip-list'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import type { ProductWithSeller } from '@/types'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, slug, icon, sort_order')
    .order('sort_order')

  const categories = categoriesData && categoriesData.length > 0
    ? [DEFAULT_CATEGORIES[0], ...categoriesData]
    : DEFAULT_CATEGORIES

  const currentCategory = categories.find((c) => c.slug === slug)
  if (!currentCategory) notFound()

  const query = supabase
    .from('products')
    .select(`
      *,
      seller:profiles!products_seller_id_fkey(full_name, avatar_url, whatsapp_number, campus)
    `)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(20)

  if (currentCategory.id !== 'all') {
    query.eq('category_id', currentCategory.id)
  }

  const { data: productsData } = await query

  const products: ProductWithSeller[] = (productsData ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    seller: Array.isArray(p.seller) ? p.seller[0] : p.seller,
  })) as ProductWithSeller[]

  return (
    <main className="px-4 py-4 animate-fade-in">
      <section className="mb-4">
        <CategoryChipList categories={categories} activeSlug={slug} />
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-tertiary">
          {currentCategory.icon} {currentCategory.name}
        </h2>
        <ProductGrid products={products} />
      </section>
    </main>
  )
}
