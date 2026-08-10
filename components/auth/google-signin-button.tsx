'use client'

import { createClient } from '@/lib/supabase/client'

export function GoogleSignInButton() {
  const supabase = createClient()

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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