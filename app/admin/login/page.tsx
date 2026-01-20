import { Suspense } from 'react'
import { LoginClient } from './LoginClient'

export const metadata = {
  title: 'Login - Netlab Admin',
  description: 'Panel de administración de Netlab',
  robots: 'noindex, nofollow',
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    }>
      <LoginClient />
    </Suspense>
  )
}
