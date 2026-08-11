'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-tertiary">Nomor WhatsApp</label>
                <input
                    type="tel"
                    required
                    placeholder="628123456789"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full rounded-xl border border-tertiary/10 bg-white px-4 py-3 text-tertiary"
                />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-tertiary">Kampus</label>
                <input
                    type="text"
                    required
                    placeholder="Universitas Indonesia"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full rounded-xl border border-tertiary/10 bg-white px-4 py-3 text-tertiary"
                />
            </div>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50"
            >
                {isSubmitting ? 'Menyimpan...' : 'Simpan & Lanjut'}
            </button>
        </form>
    )
}