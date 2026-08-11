import { MessageCircle } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/utils/build-whatsapp-link'
import type { ProductStatus } from '@/types'

interface WhatsAppButtonProps {
  phone: string
  productTitle: string
  price: number
  status: ProductStatus
}

export function WhatsAppButton({ phone, productTitle, price, status }: WhatsAppButtonProps) {
  const isAvailable = status === 'available'
  const href = isAvailable ? buildWhatsAppLink(phone, productTitle, price) : undefined

  return (
    <div className="glass-strong fixed inset-x-0 bottom-[60px] z-40 border-t border-tertiary/5 px-4 py-3">
      {isAvailable ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] py-3.5 font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-all duration-200 press-scale hover:bg-[#20BD5A] hover:shadow-xl"
        >
          <MessageCircle size={20} strokeWidth={2.5} />
          Chat via WhatsApp
        </a>
      ) : (
        <div className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-neutral-dark py-3.5 font-semibold text-tertiary/40">
          <MessageCircle size={20} strokeWidth={2.5} />
          {status === 'sold' ? 'Barang sudah terjual' : 'Barang sedang dipesan'}
        </div>
      )}
    </div>
  )
}
