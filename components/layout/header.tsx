import Link from 'next/link'
import { Search } from 'lucide-react'

export function Header() {
  return (
    <header className="glass-strong sticky top-0 z-40 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-primary">Lan</span>
          <span className="text-tertiary">joo</span>
        </h1>
        <Link
          href="/search"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral transition-colors hover:bg-neutral-dark"
        >
          <Search size={18} className="text-tertiary/60" />
        </Link>
      </div>
    </header>
  )
}
