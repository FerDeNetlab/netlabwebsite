'use client'

import React from "react"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NuevoClientePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    ciudad: '',
    estado: '',
    direccion: '',
    rfc: '',
    notas: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/clientes')
      } else {
        alert('Error al crear cliente')
      }
    } catch (error) {
      console.error('[v0] Error creating cliente:', error)
      alert('Error al crear cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <TerminalFrame title="root@netlab:~/clientes/nuevo">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-green-500/20 pb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="font-mono gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-mono text-green-400">
                  Nuevo Cliente
                </h1>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="ACME Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="5512345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Ciudad de México"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="CDMX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    RFC
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="ABC123456XYZ"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Calle Ejemplo #123, Col. Centro"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Notas
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="Información adicional..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-mono"
                >
                  {loading ? 'Guardando...' : 'Guardar Cliente'}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="font-mono bg-transparent"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </TerminalFrame>
      </div>
    </div>
  )
}
