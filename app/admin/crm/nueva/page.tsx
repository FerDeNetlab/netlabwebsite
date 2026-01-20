'use client'

import React from "react"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface Cliente {
  id: number
  nombre: string
  empresa: string
}

export default function NuevaOportunidadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    cliente_id: '',
    valor_estimado: '',
    etapa: 'Prospecto',
    probabilidad: '10',
    fecha_cierre_estimada: '',
    descripcion: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching clientes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/oportunidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          valor_estimado: parseFloat(formData.valor_estimado),
          probabilidad: parseInt(formData.probabilidad),
          cliente_id: parseInt(formData.cliente_id),
        }),
      })

      if (response.ok) {
        router.push('/admin/crm')
      } else {
        alert('Error al crear la oportunidad')
      }
    } catch (error) {
      console.error('[v0] Error creating oportunidad:', error)
      alert('Error al crear la oportunidad')
    } finally {
      setLoading(false)
    }
  }

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
          <TerminalFrame title="root@netlab:~/crm/nueva">
            <div className="p-6 space-y-6">
              <Button
                onClick={() => router.push('/admin/crm')}
                variant="ghost"
                className="font-mono gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al CRM
              </Button>

              <div className="border-b border-cyan-500/20 pb-4">
                <h1 className="text-2xl font-mono text-cyan-400">
                  Nueva Oportunidad de Negocio
                </h1>
                <p className="text-gray-400 font-mono text-sm mt-2">
                  Registra una nueva oportunidad en el pipeline de ventas
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre de la oportunidad */}
                  <div className="col-span-2">
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Nombre de la Oportunidad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                      placeholder="Ej: Desarrollo de sitio web corporativo"
                    />
                  </div>

                  {/* Cliente */}
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Cliente *
                    </label>
                    <select
                      required
                      value={formData.cliente_id}
                      onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} - {cliente.empresa}
                        </option>
                      ))}
                    </select>
                    {clientes.length === 0 && (
                      <p className="text-yellow-400 font-mono text-xs mt-2">
                        No hay clientes registrados.{' '}
                        <button
                          type="button"
                          onClick={() => router.push('/admin/clientes/nuevo')}
                          className="underline"
                        >
                          Crear cliente
                        </button>
                      </p>
                    )}
                  </div>

                  {/* Valor estimado */}
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Valor Estimado (MXN) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.valor_estimado}
                      onChange={(e) => setFormData({ ...formData, valor_estimado: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Etapa */}
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Etapa *
                    </label>
                    <select
                      required
                      value={formData.etapa}
                      onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                    >
                      <option value="Prospecto">Prospecto</option>
                      <option value="Calificación">Calificación</option>
                      <option value="Propuesta">Propuesta</option>
                      <option value="Negociación">Negociación</option>
                      <option value="Ganada">Ganada</option>
                      <option value="Perdida">Perdida</option>
                    </select>
                  </div>

                  {/* Probabilidad */}
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Probabilidad (%) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.probabilidad}
                      onChange={(e) => setFormData({ ...formData, probabilidad: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                    />
                  </div>

                  {/* Fecha de cierre estimada */}
                  <div className="col-span-2">
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Fecha de Cierre Estimada *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.fecha_cierre_estimada}
                      onChange={(e) => setFormData({ ...formData, fecha_cierre_estimada: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="col-span-2">
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={4}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-4 py-2 font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                      placeholder="Detalles adicionales sobre la oportunidad..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 font-mono"
                  >
                    {loading ? 'Guardando...' : 'Crear Oportunidad'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/crm')}
                    className="font-mono"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
