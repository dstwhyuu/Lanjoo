import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/product/product-form'

export default async function AddProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/add-product')
  }

  const [{ data: profile }, { data: categories }] = await Promise.all([
    supabase
      .from('profiles')
      .select('whatsapp_number, campus')
      .eq('id', user.id)
      .single(),
    supabase
      .from('categories')
      .select('id, name, slug, icon, sort_order')
      .order('sort_order'),
  ])

  if (!profile?.whatsapp_number || !profile?.campus) {
    redirect('/onboarding?next=/add-product')
  }

  return (
    <main className="px-4 py-6">
      <h1 className="mb-5 text-xl font-bold text-tertiary">Jual Barang</h1>
      <div className="rounded-3xl bg-surface p-5 shadow-sm">
        <ProductForm
          mode="create"
          userId={user.id}
          campus={profile.campus}
          categories={categories ?? []}
        />
      </div>
    </main>
  )
}