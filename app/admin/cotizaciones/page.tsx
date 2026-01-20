'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, FileText, Package } from 'lucide-react'

interface Cotizacion {
  id: string
  numero_cotizacion: string
  cliente_nombre: string
  fecha_emision: string
  fecha_vencimiento: string
  total: number
  estado: string
}

export default function CotizacionesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const response = await fetch('/api/cotizaciones')
        if (response.ok) {
          const data = await response.json()
          setCotizaciones(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching cotizaciones:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchCotizaciones()
    }
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      'borrador': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'enviada': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'aceptada': 'bg-green-500/10 text-green-400 border-green-500/20',
      'rechazada': 'bg-red-500/10 text-red-400 border-red-500/20',
    }
    return colors[estado] || colors.borrador
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title="root@netlab:~/cotizaciones">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-yellow-500/20 pb-4">
                <div>
                  <Button
                    onClick={() => router.push('/admin')}
                    variant="ghost"
                    className="font-mono gap-2 text-sm mb-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Dashboard
                  </Button>
                  <h1 className="text-3xl font-mono text-yellow-400">
                    Cotizaciones
                  </h1>
                  <p className="text-gray-400 font-mono text-sm mt-2">
                    {cotizaciones.length} cotización(es) encontrada(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push('/admin/cotizaciones/productos')}
                    variant="outline"
                    className="font-mono gap-2 border-purple-500/30"
                  >
                    <Package className="h-4 w-4" />
                    Productos
                  </Button>
                  <Button
                    onClick={() => router.push('/admin/cotizaciones/nueva')}
                    className="font-mono gap-2 bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva Cotización
                  </Button>
                </div>
              </div>

              {cotizaciones.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/30 rounded-lg border border-gray-700">
                  <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-mono mb-4">
                    No hay cotizaciones registradas
                  </p>
                  <Button
                    onClick={() => router.push('/admin/cotizaciones/nueva')}
                    className="font-mono gap-2 bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Plus className="h-4 w-4" />
                    Crear Primera Cotización
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cotizaciones.map((cotizacion) => (
                    <motion.div
                      key={cotizacion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-500/40 transition-all cursor-pointer"
                      onClick={() => router.push(`/admin/cotizaciones/${cotizacion.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-mono text-yellow-400">
                              {cotizacion.numero_cotizacion}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-mono border ${getEstadoColor(cotizacion.estado)}`}>
                              {cotizacion.estado}
                            </span>
                          </div>
                          <p className="text-gray-300 font-mono text-sm">
                            Cliente: {cotizacion.cliente_nombre}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs font-mono text-gray-500">
                            <span>Emisión: {cotizacion.fecha_emision}</span>
                            <span>Vencimiento: {cotizacion.fecha_vencimiento}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-mono text-green-400">
                            ${cotizacion.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">MXN</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
