import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  return (
    <main className="min-h-screen bg-neutral px-4 pt-6">
      <h1 className="text-xl font-bold text-tertiary">Profil Saya</h1>
      <p className="mt-2 text-sm text-tertiary/60">Daftar listing kamu akan ada di sini.</p>
    </main>
  )
}