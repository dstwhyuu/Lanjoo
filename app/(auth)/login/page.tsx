import { GoogleSignInButton } from '@/components/auth/google-signin-button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral px-6">
      <div className="w-full max-w-sm animate-scale-in">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-primary">Lan</span>
            <span className="text-tertiary">joo</span>
          </h1>
          <p className="mt-2 text-sm text-tertiary/50">
            Jual beli barang bekas kos antar mahasiswa
          </p>
        </div>

        <div className="rounded-3xl bg-surface p-6 shadow-lg shadow-tertiary/5">
          <h2 className="mb-1 text-lg font-semibold text-tertiary">Masuk</h2>
          <p className="mb-6 text-sm text-tertiary/50">
            Gunakan akun Google kampusmu untuk mulai
          </p>

          {error && (
            <div className="mb-4 rounded-2xl bg-danger-light px-4 py-3 text-sm text-danger">
              Login gagal. Silakan coba lagi.
            </div>
          )}

          <GoogleSignInButton next={next} />
        </div>

        <p className="mt-6 text-center text-xs text-tertiary/30">
          Dengan masuk, kamu menyetujui syarat dan ketentuan Lanjoo
        </p>
      </div>
    </main>
  )
}