'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { X, Plus, ImagePlus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/utils/compress-image'
import { MAX_PRODUCT_IMAGES } from '@/lib/constants'

interface ImageUploaderProps {
  userId: string
  productId: string
  initialImages?: string[]
  onImagesChange: (urls: string[]) => void
}

interface ImageItem {
  url: string
  uploading: boolean
}

export function ImageUploader({
  userId,
  productId,
  initialImages = [],
  onImagesChange,
}: ImageUploaderProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageItem[]>(
    initialImages.map((url) => ({ url, uploading: false }))
  )
  const [error, setError] = useState('')

  const canAddMore = images.length < MAX_PRODUCT_IMAGES

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files) return
    setError('')

    const remaining = MAX_PRODUCT_IMAGES - images.length
    const filesToUpload = Array.from(files).slice(0, remaining)

    for (const file of filesToUpload) {
      const placeholder: ImageItem = { url: '', uploading: true }
      setImages((prev) => {
        const next = [...prev, placeholder]
        return next
      })

      try {
        const compressed = await compressImage(file)
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
        const filePath = `${userId}/${productId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressed, { contentType: 'image/webp' })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        setImages((prev) => {
          const updated = prev.map((img) =>
            img === placeholder ? { url: publicUrl, uploading: false } : img
          )
          onImagesChange(updated.filter((img) => img.url).map((img) => img.url))
          return updated
        })
      } catch {
        setError('Gagal mengupload gambar. Coba lagi.')
        setImages((prev) => prev.filter((img) => img !== placeholder))
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleRemove(index: number) {
    const imageToRemove = images[index]
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      onImagesChange(updated.filter((img) => img.url).map((img) => img.url))
      return updated
    })

    if (imageToRemove.url) {
      const pathMatch = imageToRemove.url.match(/product-images\/(.+)$/)
      if (pathMatch) {
        supabase.storage.from('product-images').remove([pathMatch[1]])
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-tertiary">
        Foto Produk ({images.length}/{MAX_PRODUCT_IMAGES})
      </label>

      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-dark"
          >
            {img.uploading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : (
              <Image
                src={img.url}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover"
                sizes="33vw"
              />
            )}
            {!img.uploading && (
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                <X size={14} />
              </button>
            )}
            {i === 0 && !img.uploading && (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                Utama
              </span>
            )}
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-neutral-dark text-tertiary/30 transition-colors hover:border-primary hover:text-primary"
          >
            {images.length === 0 ? (
              <>
                <ImagePlus size={24} />
                <span className="text-[10px] font-medium">Tambah Foto</span>
              </>
            ) : (
              <Plus size={24} />
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  )
}
