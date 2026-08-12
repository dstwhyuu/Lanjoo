'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="md"
      loading={loading}
      onClick={handleLogout}
      className="w-full text-danger/70 hover:text-danger hover:bg-danger-light"
    >
      <LogOut size={16} />
      Keluar
    </Button>
  )
}
