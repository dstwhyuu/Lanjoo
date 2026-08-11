import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

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
    <main className="px-4 py-6 animate-fade-in">
      <div className="flex flex-col items-center justify-center rounded-3xl bg-surface p-8 shadow-sm text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/20">
          <PlusCircle size={28} className="text-white" />
        </div>
        <h1 className="mt-5 text-lg font-bold text-tertiary">Jual Barang</h1>
        <p className="mt-2 max-w-xs text-sm text-tertiary/50">
          Form posting produk sedang dalam pengembangan. Nantikan update selanjutnya!
        </p>
        <Link
          href="/"
          className="mt-6 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </main>
  )
}