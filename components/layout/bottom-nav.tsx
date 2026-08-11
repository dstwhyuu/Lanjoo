'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/add-product', label: 'Jual', icon: PlusCircle },
  { href: '/profile', label: 'Profil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 flex border-t border-tertiary/10 bg-white">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-1 py-2.5"
          >
            <Icon
              size={22}
              className={isActive ? 'text-primary' : 'text-tertiary/40'}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-xs ${isActive ? 'font-semibold text-primary' : 'text-tertiary/40'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}