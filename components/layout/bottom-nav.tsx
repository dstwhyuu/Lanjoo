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
    <nav className="glass-strong pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-tertiary/5">
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 transition-all duration-200"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive ? 'gradient-primary shadow-md shadow-primary/20' : ''
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-white' : 'text-tertiary/35'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-tertiary/35'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}