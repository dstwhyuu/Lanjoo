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
            <div className="w-full max-w-sm mx-auto animate-slide-up">
                <div className="mb-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/20">
                        <span className="text-xl text-white">👋</span>
                    </div>
                    <h1 className="text-2xl font-bold text-tertiary">Lengkapi Profil</h1>
                    <p className="mt-1.5 text-sm text-tertiary/50">
                        Nomor WhatsApp dan kampus dibutuhkan supaya pembeli bisa menghubungimu.
                    </p>
                </div>

                <div className="rounded-3xl bg-surface p-6 shadow-lg shadow-tertiary/5">
                    <OnboardingForm userId={user.id} next={next ?? '/'} />
                </div>
            </div>
        </main>
    )
}