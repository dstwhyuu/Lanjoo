import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from '@/components/auth/onboarding-form'

export default async function OnboardingPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { next } = await searchParams

    if (!user) {
        redirect('/login')
    }

    return (
        <main className="flex min-h-screen flex-col justify-center bg-neutral px-6">
            <h1 className="mb-2 text-2xl font-bold text-tertiary">Lengkapi Profil</h1>
            <p className="mb-8 text-sm text-tertiary/70">
                Nomor WhatsApp dan kampus dibutuhkan supaya pembeli bisa menghubungimu.
            </p>
            <OnboardingForm userId={user.id} next={next ?? '/'} />
        </main>
    )
}