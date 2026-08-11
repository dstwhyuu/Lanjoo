import { GoogleSignInButton } from '@/components/auth/google-signin-button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral px-6">
      <h1 className="mb-8 text-2xl font-bold text-tertiary">Masuk ke Lanjoo</h1>
      <GoogleSignInButton next={next} />
    </main>
  )
}