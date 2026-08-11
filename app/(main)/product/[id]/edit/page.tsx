import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/product/product-form'
import type { Product } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/product/${id}/edit`)
  }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  if (product.seller_id !== user.id) {
    redirect(`/product/${id}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('campus')
    .eq('id', user.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, icon, sort_order')
    .order('sort_order')

  return (
    <main className="px-4 py-6 animate-fade-in">
      <h1 className="mb-5 text-xl font-bold text-tertiary">Edit Produk</h1>
      <div className="rounded-3xl bg-surface p-5 shadow-sm">
        <ProductForm
          mode="edit"
          userId={user.id}
          campus={profile?.campus ?? ''}
          categories={categories ?? []}
          product={product as Product}
        />
      </div>
    </main>
  )
}
