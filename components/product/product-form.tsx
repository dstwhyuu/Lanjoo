'use client'

import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/product/image-uploader'
import { Trash2 } from 'lucide-react'
import type { Product, Category, ProductCondition } from '@/types'

interface ProductFormProps {
  mode: 'create' | 'edit'
  userId: string
  campus: string
  categories: Category[]
  product?: Product
}

const CONDITION_OPTIONS = [
  { value: 'new', label: 'Baru' },
  { value: 'like_new', label: 'Seperti Baru' },
  { value: 'good', label: 'Bagus' },
  { value: 'fair', label: 'Cukup' },
]

export function ProductForm({ mode, userId, campus, categories, product }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const formProductId = useId().replace(/:/g, '').slice(0, 8)
  const productId = product?.id ?? formProductId

  const [title, setTitle] = useState(product?.title ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [condition, setCondition] = useState<ProductCondition>(product?.condition ?? 'good')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const categoryOptions = categories.map((c) => ({ value: c.id, label: `${c.icon ?? ''} ${c.name}`.trim() }))

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    if (images.length === 0) {
      setError('Tambahkan minimal 1 foto produk.')
      return
    }

    setIsSubmitting(true)

    const productData = {
      title,
      description: description || null,
      price: parseFloat(price),
      condition,
      category_id: categoryId,
      images,
      campus,
      seller_id: userId,
    }

    if (mode === 'create') {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(productData)
        .select('id')
        .single()

      if (insertError) {
        setError('Gagal membuat produk. Coba lagi.')
        setIsSubmitting(false)
        return
      }

      router.push(`/product/${data.id}`)
      router.refresh()
    } else {
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', product!.id)

      if (updateError) {
        setError('Gagal menyimpan perubahan. Coba lagi.')
        setIsSubmitting(false)
        return
      }

      router.push(`/product/${product!.id}`)
      router.refresh()
    }
  }

  async function handleDelete() {
    if (!product) return
    setIsDeleting(true)

    const { error: deleteError } = await fetch(`/api/products/${product.id}`, {
      method: 'DELETE',
    }).then((res) => res.json())

    if (deleteError) {
      setError('Gagal menghapus produk.')
      setIsDeleting(false)
      return
    }

    router.push('/profile')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <ImageUploader
        userId={userId}
        productId={productId}
        initialImages={product?.images}
        onImagesChange={setImages}
      />

      <Input
        label="Judul Produk"
        required
        placeholder="Meja belajar IKEA bekas"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />

      <Textarea
        label="Deskripsi"
        placeholder="Kondisi, ukuran, alasan jual, dll."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
      />

      <Input
        label="Harga (Rp)"
        type="number"
        required
        placeholder="150000"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min={0}
      />

      <Select
        label="Kondisi"
        options={CONDITION_OPTIONS}
        value={condition}
        onChange={(e) => setCondition(e.target.value as ProductCondition)}
      />

      <Select
        label="Kategori"
        options={categoryOptions}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Pilih kategori"
        required
      />

      {error && (
        <div className="rounded-2xl bg-danger-light px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        {mode === 'create' ? 'Posting Produk' : 'Simpan Perubahan'}
      </Button>

      {mode === 'edit' && (
        <>
          {showDeleteConfirm ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-danger/20 bg-danger-light p-4">
              <p className="text-sm font-medium text-danger">
                Yakin ingin menghapus produk ini? Aksi ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  loading={isDeleting}
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Ya, Hapus
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 py-2 text-sm text-danger/70 transition-colors hover:text-danger"
            >
              <Trash2 size={15} />
              Hapus Produk
            </button>
          )}
        </>
      )}
    </form>
  )
}
