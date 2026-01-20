'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardClient from './DashboardClient'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando sesión...</div>
      </div>
    )
  }

  if (!session?.user?.email) {
    return null
  }

  return <DashboardClient session={session} />
}
