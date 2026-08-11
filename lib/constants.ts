export const MAX_PRODUCT_IMAGES = 5

export const CONDITION_LABELS: Record<string, string> = {
  new: 'Baru',
  like_new: 'Seperti Baru',
  good: 'Bagus',
  fair: 'Cukup',
}

export const CONDITION_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  new: 'success',
  like_new: 'success',
  good: 'info',
  fair: 'warning',
}

export const STATUS_LABELS: Record<string, string> = {
  available: 'Tersedia',
  reserved: 'Dipesan',
  sold: 'Terjual',
}

export const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Semua', slug: 'all', icon: '🏷️', sort_order: 0 },
  { id: '1', name: 'Elektronik', slug: 'elektronik', icon: '💻', sort_order: 1 },
  { id: '2', name: 'Furniture', slug: 'furniture', icon: '🪑', sort_order: 2 },
  { id: '3', name: 'Buku', slug: 'buku', icon: '📚', sort_order: 3 },
  { id: '4', name: 'Pakaian', slug: 'pakaian', icon: '👕', sort_order: 4 },
  { id: '5', name: 'Alat Dapur', slug: 'alat-dapur', icon: '🍳', sort_order: 5 },
  { id: '6', name: 'Olahraga', slug: 'olahraga', icon: '⚽', sort_order: 6 },
  { id: '7', name: 'Lainnya', slug: 'lainnya', icon: '📦', sort_order: 7 },
]
