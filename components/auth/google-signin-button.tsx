'use client'

import { createClient } from '@/lib/supabase/client'

export function GoogleSignInButton({ next }: { next?: string }) {
  const supabase = createClient()

  async function handleSignIn() {
    const redirectTarget = next ?? '/'
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTarget)}`,
      },
    })
  }

  return (
    <button
      onClick={handleSignIn}
      className="w-full rounded-xl bg-primary py-3 font-semibold text-white"
    >
      Masuk dengan Google
    </button>
  )
}