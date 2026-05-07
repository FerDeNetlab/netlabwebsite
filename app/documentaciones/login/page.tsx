import { Suspense } from 'react'
import { LoginClient } from './LoginClient'

export const metadata = {
    title: 'Login - Netlab Documentaciones',
    description: 'Acceso al editor de documentaciones de Netlab',
    robots: 'noindex, nofollow',
}

export default function DocumentacionesLoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-primary font-mono">Cargando...</div>
                </div>
            }
        >
            <LoginClient />
        </Suspense>
    )
}
