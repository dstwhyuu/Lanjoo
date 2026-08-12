import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral px-6">
      <div className="w-full max-w-sm text-center animate-scale-in">
        <span className="text-6xl">🔍</span>
        <h1 className="mt-6 text-2xl font-bold text-tertiary">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-tertiary/50">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-2xl gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 press-scale hover:shadow-xl"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  )
}
