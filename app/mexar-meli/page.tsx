import { Suspense } from 'react'
import MexarMeliClient from './MexarMeliClient'

export const metadata = {
    title: 'Mexar Pharma × Netlab | Modelo de Concesión Digital',
    description: 'Propuesta de concesión digital exclusiva con gobierno de marca para Mexar Pharma y Made4You',
    robots: 'noindex, nofollow',
}

export default function MexarMeliPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="text-green-500 font-mono">Cargando propuesta...</div>
            </div>
        }>
            <MexarMeliClient />
        </Suspense>
    )
}
