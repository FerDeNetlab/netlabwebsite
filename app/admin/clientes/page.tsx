'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone, Building2, Search, ArrowLeft } from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  ciudad: string
  estado: string
  activo: boolean
  created_at: string
}

export default function ClientesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClientes = clientes.filter(c => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      c.nombre?.toLowerCase().includes(term) ||
      c.empresa?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.ciudad?.toLowerCase().includes(term)
    )
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('/api/clientes')
        if (response.ok) {
          const data = await response.json()
          setClientes(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchClientes()
    }
  }, [status])

  if (status === 'loading' || loading) {
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

      <div className="container mx-auto px-4 pt-24 pb-16">
        <TerminalFrame title="root@netlab:~/clientes">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
              <div>
                <Button onClick={() => router.push('/admin')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                  <ArrowLeft className="h-4 w-4" /> Dashboard
                </Button>
                <h1 className="text-3xl font-mono text-green-400 mb-2">
                  Gestión de Clientes
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                  Total de clientes: {clientes.length}
                </p>
              </div>
              <Button
                onClick={() => router.push('/admin/clientes/nuevo')}
                className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2"
              >
                <Plus className="h-4 w-4" />
                Nuevo Cliente
              </Button>
            </div>

            {/* Search */}
            {clientes.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, empresa, email o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            )}

            {/* Clientes Grid */}
            {filteredClientes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-mono mb-4">
                  {searchTerm ? `No se encontraron clientes para "${searchTerm}"` : 'No hay clientes registrados'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/admin/clientes/nuevo')}
                    className="bg-green-600 hover:bg-green-700 text-white font-mono"
                  >
                    Crear primer cliente
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/clientes/${cliente.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-mono text-green-400 mb-1">
                          {cliente.nombre}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-mono mb-2">
                          <Building2 className="h-4 w-4" />
                          <span>{cliente.empresa}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-mono">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{cliente.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-mono">
                        <Phone className="h-4 w-4" />
                        <span>{cliente.telefono}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-xs font-mono text-gray-500">
                        {cliente.ciudad}, {cliente.estado}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TerminalFrame>
      </div>
    </div>
  )
}
