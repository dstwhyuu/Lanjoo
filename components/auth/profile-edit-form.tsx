'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Phone, GraduationCap } from 'lucide-react'

interface ProfileEditFormProps {
  userId: string
  initialFullName: string
  initialWhatsapp: string
  initialCampus: string
}

export function ProfileEditForm({
  userId,
  initialFullName,
  initialWhatsapp,
  initialCampus,
}: ProfileEditFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [fullName, setFullName] = useState(initialFullName)
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsapp)
  const [campus, setCampus] = useState(initialCampus)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        whatsapp_number: whatsappNumber,
        campus,
      })
      .eq('id', userId)

    if (updateError) {
      setError('Gagal menyimpan perubahan. Coba lagi.')
      setIsSubmitting(false)
      return
    }

    setSuccess(true)
    setIsSubmitting(false)
    router.refresh()

    setTimeout(() => {
      router.push('/profile')
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Nama Lengkap"
        type="text"
        required
        placeholder="Nama kamu"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        icon={<User size={16} />}
        maxLength={60}
      />
      <Input
        label="Nomor WhatsApp"
        type="tel"
        required
        placeholder="628123456789"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        icon={<Phone size={16} />}
      />
      <Input
        label="Kampus"
        type="text"
        required
        placeholder="Universitas Indonesia"
        value={campus}
        onChange={(e) => setCampus(e.target.value)}
        icon={<GraduationCap size={16} />}
      />

      {error && (
        <div className="rounded-2xl bg-danger-light px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl bg-primary-light px-4 py-3 text-sm text-primary-dark">
          Profil berhasil diperbarui!
        </div>
      )}

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        Simpan Perubahan
      </Button>
    </form>
  )
}
