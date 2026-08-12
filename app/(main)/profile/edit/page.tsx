import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfileEditForm } from '@/components/auth/profile-edit-form'
import { ChevronLeft } from 'lucide-react'

export default async function ProfileEditPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile/edit')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="px-4 py-6 animate-fade-in">
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface shadow-sm transition-colors hover:bg-neutral-dark"
        >
          <ChevronLeft size={18} className="text-tertiary" />
        </Link>
        <h1 className="text-xl font-bold text-tertiary">Edit Profil</h1>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-neutral-dark shadow-inner">
          {profile?.avatar_url ? (
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
      </div>

      <div className="rounded-3xl bg-surface p-5 shadow-sm">
        <ProfileEditForm
          userId={user.id}
          initialFullName={profile?.full_name ?? ''}
          initialWhatsapp={profile?.whatsapp_number ?? ''}
          initialCampus={profile?.campus ?? ''}
        />
      </div>

      <p className="mt-4 text-center text-xs text-tertiary/30">
        Foto profil diambil dari akun Google dan tidak bisa diubah di sini.
      </p>
    </main>
  )
}
