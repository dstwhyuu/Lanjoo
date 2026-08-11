'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Category } from '@/types'

interface CategoryChipListProps {
  categories: Category[]
  activeSlug?: string
}

export function CategoryChipList({ categories, activeSlug = 'all' }: CategoryChipListProps) {
  const pathname = usePathname()

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => {
        const isActive = cat.slug === activeSlug
        const href = cat.slug === 'all' ? '/' : `/category/${cat.slug}`
        const isCurrent = cat.slug === 'all' ? pathname === '/' : pathname === href

        return (
          <Link
            key={cat.id}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 press-scale ${
              isActive || isCurrent
                ? 'gradient-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface text-tertiary/60 shadow-sm hover:bg-neutral-dark'
            }`}
          >
            {cat.icon && <span className="text-sm">{cat.icon}</span>}
            {cat.name}
          </Link>
        )
      })}
    </div>
  )
}
