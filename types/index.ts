export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair'
export type ProductStatus = 'available' | 'reserved' | 'sold'

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  whatsapp_number: string
  campus: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  sort_order: number
}

export interface Product {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string | null
  price: number
  condition: ProductCondition
  status: ProductStatus
  images: string[]
  campus: string
  view_count: number
  created_at: string
  updated_at: string
}

export interface ProductWithSeller extends Product {
  seller: Pick<Profile, 'full_name' | 'avatar_url' | 'whatsapp_number' | 'campus'>
}

export interface ProductWithSellerAndCategory extends ProductWithSeller {
  category: Pick<Category, 'name' | 'slug' | 'icon'>
}
