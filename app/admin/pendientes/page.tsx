'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PendientesClient from './PendientesClient'

export default function PendientesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">Cargando...</p>
      </div>
    )
  }

  return <PendientesClient />
}
