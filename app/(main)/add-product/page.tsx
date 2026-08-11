import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AddProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/add-product')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('whatsapp_number, campus')
    .eq('id', user.id)
    .single()

  if (!profile?.whatsapp_number || !profile?.campus) {
    redirect('/onboarding?next=/add-product')
  }

  return (
    <main className="min-h-screen bg-neutral px-4 pt-6">
      <h1 className="text-xl font-bold text-tertiary">Jual Barang</h1>
      <p className="mt-2 text-sm text-tertiary/60">Form posting produk akan ada di sini.</p>
    </main>
  )
}