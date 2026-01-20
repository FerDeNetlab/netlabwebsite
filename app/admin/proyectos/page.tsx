'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'

export default function ProyectosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [proyectos, setProyectos] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title="root@netlab:~/proyectos">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                <div>
                  <Button
                    onClick={() => router.push('/admin')}
                    variant="ghost"
                    className="font-mono gap-2 text-sm mb-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Dashboard
                  </Button>
                  <h1 className="text-3xl font-mono text-purple-400">
                    Gestión de Proyectos
                  </h1>
                  <p className="text-gray-400 font-mono text-sm mt-2">
                    Administra todos los proyectos activos e inactivos
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/admin/proyectos/nuevo')}
                  className="font-mono gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              </div>

              <div className="text-center py-12">
                <p className="text-gray-400 font-mono">
                  Módulo de Proyectos en construcción
                </p>
              </div>
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
