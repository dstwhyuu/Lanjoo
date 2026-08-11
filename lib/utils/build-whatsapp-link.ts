function sanitizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('62')) return digits
  return `62${digits}`
}

export function buildWhatsAppLink(
  phone: string,
  productTitle: string,
  price: number
): string {
  const sanitized = sanitizePhoneNumber(phone)
  const formattedPrice = new Intl.NumberFormat('id-ID').format(price)
  const message = `Halo, saya tertarik dengan "${productTitle}" (Rp ${formattedPrice}) yang kamu jual di Lanjoo. Apakah masih tersedia?`
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`
}
