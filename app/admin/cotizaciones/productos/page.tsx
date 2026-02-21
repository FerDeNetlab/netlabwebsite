'use client'

import React from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Package, Edit, Trash2, Search, X, Save } from 'lucide-react'

interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio_unitario: number
  categoria: string
  unidad: string
  activo: boolean
}

export default function ProductosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [saving, setSaving] = useState(false)
  const ITEMS_PER_PAGE = 20

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_unitario: '',
    categoria: '',
    unidad: 'pieza',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/productos')
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error('[ERP] Error fetching productos:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProductos()
    }
  }, [status])

  const filteredProductos = productos.filter(p => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      p.nombre?.toLowerCase().includes(term) ||
      p.descripcion?.toLowerCase().includes(term) ||
      p.categoria?.toLowerCase().includes(term)
    )
  })

  const totalPages = Math.ceil(filteredProductos.length / ITEMS_PER_PAGE)
  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio_unitario: '', categoria: '', unidad: 'pieza' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        precio_unitario: parseFloat(formData.precio_unitario),
      }

      const url = editingId ? `/api/productos/${editingId}` : '/api/productos'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        fetchProductos()
        resetForm()
      } else {
        alert('Error al guardar producto')
      }
    } catch (error) {
      console.error('[ERP] Error saving producto:', error)
      alert('Error al guardar producto')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (producto: Producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio_unitario: producto.precio_unitario.toString(),
      categoria: producto.categoria || '',
      unidad: producto.unidad || 'pieza',
    })
    setEditingId(producto.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el producto "${nombre}"?`)) return

    try {
      const response = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchProductos()
      } else {
        alert('Error al eliminar producto')
      }
    } catch (error) {
      console.error('[ERP] Error deleting producto:', error)
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
          <TerminalFrame title="root@netlab:~/productos">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                <div>
                  <Button
                    onClick={() => router.push('/admin/cotizaciones')}
                    variant="ghost"
                    className="font-mono gap-2 text-sm mb-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Cotizaciones
                  </Button>
                  <h1 className="text-3xl font-mono text-purple-400">
                    <Package className="h-8 w-8 inline mr-2" />
                    Catálogo de Productos
                  </h1>
                  <p className="text-gray-400 font-mono text-sm mt-1">
                    {productos.length} productos registrados
                  </p>
                </div>
                <Button
                  onClick={() => { resetForm(); setShowForm(true) }}
                  className="font-mono gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </Button>
              </div>

              {/* Search */}
              {productos.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, descripción o categoría..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-purple-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              )}

              {/* Form */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-zinc-900/50 border border-purple-500/30 rounded-lg p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-mono text-purple-400">
                      {editingId ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={resetForm} className="text-gray-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">Nombre *</label>
                        <input
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="w-full bg-zinc-800 border border-gray-600 rounded px-3 py-2 text-sm font-mono text-white focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">Precio Unitario *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.precio_unitario}
                          onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
                          className="w-full bg-zinc-800 border border-gray-600 rounded px-3 py-2 text-sm font-mono text-white focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">Categoría</label>
                        <input
                          type="text"
                          value={formData.categoria}
                          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                          placeholder="Ej: Software, Hardware, Servicio"
                          className="w-full bg-zinc-800 border border-gray-600 rounded px-3 py-2 text-sm font-mono text-white focus:border-purple-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-1">Unidad</label>
                        <select
                          value={formData.unidad}
                          onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                          className="w-full bg-zinc-800 border border-gray-600 rounded px-3 py-2 text-sm font-mono text-white focus:border-purple-500/50 focus:outline-none"
                        >
                          <option value="pieza">Pieza</option>
                          <option value="servicio">Servicio</option>
                          <option value="hora">Hora</option>
                          <option value="licencia">Licencia</option>
                          <option value="paquete">Paquete</option>
                          <option value="mes">Mes</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-1">Descripción</label>
                      <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        rows={2}
                        className="w-full bg-zinc-800 border border-gray-600 rounded px-3 py-2 text-sm font-mono text-white focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" disabled={saving} className="font-mono gap-2 bg-purple-600 hover:bg-purple-700">
                        <Save className="h-4 w-4" />
                        {saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear Producto')}
                      </Button>
                      <Button type="button" onClick={resetForm} variant="outline" className="font-mono bg-transparent">
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Products Table */}
              {paginatedProductos.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/30 rounded-lg border border-gray-700">
                  <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-mono mb-4">
                    {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="font-mono gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                      Crear Primer Producto
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-900/50 border border-purple-500/20 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-zinc-800/50 border-b border-purple-500/20">
                      <tr className="font-mono text-xs text-gray-400">
                        <th className="text-left p-3">Nombre</th>
                        <th className="text-left p-3">Categoría</th>
                        <th className="text-left p-3">Unidad</th>
                        <th className="text-right p-3">Precio</th>
                        <th className="text-center p-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-sm">
                      {paginatedProductos.map((producto) => (
                        <tr key={producto.id} className="border-b border-gray-800 last:border-0 hover:bg-zinc-800/30">
                          <td className="p-3">
                            <div className="text-purple-400">{producto.nombre}</div>
                            {producto.descripcion && (
                              <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{producto.descripcion}</div>
                            )}
                          </td>
                          <td className="p-3 text-gray-400">{producto.categoria || '—'}</td>
                          <td className="p-3 text-gray-400">{producto.unidad}</td>
                          <td className="p-3 text-right text-green-400">
                            ${producto.precio_unitario.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(producto)}
                                className="text-blue-400 hover:text-blue-300 p-1"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(producto.id, producto.nombre)}
                                className="text-red-400 hover:text-red-300 p-1"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-gray-400">
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProductos.length)} de {filteredProductos.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="font-mono bg-transparent"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="font-mono bg-transparent"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
