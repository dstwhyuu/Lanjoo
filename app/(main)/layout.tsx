import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral pb-20">
      <Header />
      {children}
      <BottomNav />
    </div>
  )
}