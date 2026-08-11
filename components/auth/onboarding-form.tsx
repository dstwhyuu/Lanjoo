'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Phone, GraduationCap } from 'lucide-react'

export function OnboardingForm({ userId, next }: { userId: string; next: string }) {
    const router = useRouter()
    const supabase = createClient()
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [campus, setCampus] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsSubmitting(true)
        setErrorMessage('')

        const { error } = await supabase
            .from('profiles')
            .update({ whatsapp_number: whatsappNumber, campus })
            .eq('id', userId)

        if (error) {
            setErrorMessage('Gagal menyimpan, coba lagi.')
            setIsSubmitting(false)
            return
        }

        router.push(next)
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            {errorMessage && (
                <div className="rounded-2xl bg-danger-light px-4 py-3 text-sm text-danger">
                    {errorMessage}
                </div>
            )}
            <Button type="submit" loading={isSubmitting} size="lg" className="mt-1 w-full">
                Simpan & Lanjut
            </Button>
        </form>
    )
}