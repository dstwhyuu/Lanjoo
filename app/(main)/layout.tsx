import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral pb-20">
      <Header />
      <div className="flex-1 relative">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}