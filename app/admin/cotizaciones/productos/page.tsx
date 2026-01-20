'use client'

import React from "react"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Package, Edit, Trash2, Download } from 'lucide-react'

interface Producto {
  id: number
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
  const [importing, setImporting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const ITEMS_PER_PAGE = 20
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_unitario: '',
    categoria: '',
    unidad: 'pieza',
  })
  const [showImportModal, setShowImportModal] = useState(false)
  const [importResult, setImportResult] = useState('')
  const [cvaCredentials, setCvaCredentials] = useState({
    user: '',
    password: '',
    marca: '',
    grupo: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
    fetchProductos()
  }, [status, router])

  const fetchProductos = async () => {
    try {
      const response = await fetch('/api/productos')
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching productos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precio_unitario: parseFloat(formData.precio_unitario),
        }),
      })

      if (response.ok) {
        setFormData({
          nombre: '',
          descripcion: '',
          precio_unitario: '',
          categoria: '',
          unidad: 'pieza',
        })
        setShowForm(false)
        fetchProductos()
      }
    } catch (error) {
      console.error('[v0] Error creating producto:', error)
    }
  }

  const handleImportCVA = async (startPage = 1, totalImportados = 0) => {
    if (startPage === 1) {
      if (!confirm('¿Deseas importar productos desde CVA? Se hará en lotes automáticos hasta completar todo el catálogo.')) {
        return
      }
    }

    setImporting(true)

    try {
      const response = await fetch('/api/productos/importar-cva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startPage,
          maxPages: 10, // Procesar 10 páginas por vez
          filters: {
            exist: 3,
            completos: 1,
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const nuevoTotal = totalImportados + data.importados
        console.log(`[v0] Importados ${data.importados} productos. Total acumulado: ${nuevoTotal}`)
        
        // Si hay más páginas, continuar automáticamente
        if (data.hayMasPaginas) {
          console.log(`[v0] Continuando desde página ${data.paginaActual}...`)
          // Llamar recursivamente para continuar
          setTimeout(() => {
            handleImportCVA(data.paginaActual, nuevoTotal)
          }, 1000) // Esperar 1 segundo entre lotes
        } else {
          // Importación completa
          alert(`Importación completada: ${nuevoTotal} productos importados en total`)
          fetchProductos()
          setImporting(false)
        }
      } else {
        alert(`Error: ${data.error}`)
        setImporting(false)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error('[v0] Error importing from CVA:', errorMsg)
      alert(`Error al importar productos desde CVA: ${errorMsg}`)
      setImporting(false)
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
          <TerminalFrame title="root@netlab:~/cotizaciones/productos">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-yellow-500/20 pb-4">
                <div>
                  <Button
                    onClick={() => router.push('/admin/cotizaciones')}
                    variant="ghost"
                    className="font-mono gap-2 text-sm mb-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Cotizaciones
                  </Button>
                  <h1 className="text-3xl font-mono text-yellow-400 flex items-center gap-3">
                    <Package className="h-8 w-8" />
                    Catálogo de Productos y Servicios
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleImportCVA}
                    disabled={importing}
                    variant="outline"
                    className="font-mono gap-2 border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    {importing ? 'Importando...' : 'Importar productos de CVA'}
                  </Button>
                  <Button
                    onClick={() => setShowForm(!showForm)}
                    className="font-mono gap-2 bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </div>
              </div>

              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-6"
                >
                  <h2 className="text-xl font-mono text-yellow-400 mb-4">
                    Nuevo Producto/Servicio
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Nombre *
                        </label>
                        <Input
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Categoría
                        </label>
                        <Input
                          value={formData.categoria}
                          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                          placeholder="Ej: Software, Consultoría, Hardware"
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-gray-400 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-gray-300"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Precio Unitario *
                        </label>
                        <Input
                          required
                          type="number"
                          step="0.01"
                          value={formData.precio_unitario}
                          onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
                          className="font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-gray-400 mb-2">
                          Unidad
                        </label>
                        <select
                          value={formData.unidad}
                          onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                          className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-gray-300"
                        >
                          <option value="pieza">Pieza</option>
                          <option value="hora">Hora</option>
                          <option value="mes">Mes</option>
                          <option value="servicio">Servicio</option>
                          <option value="licencia">Licencia</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="font-mono bg-green-600 hover:bg-green-700">
                        Guardar Producto
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowForm(false)}
                        variant="ghost"
                        className="font-mono"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Buscador */}
              <div className="mb-4">
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Buscar productos por nombre, SKU o descripción..."
                  className="font-mono bg-zinc-900/50 border-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {productos
                  .filter(p => 
                    !searchTerm || 
                    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((producto) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4 hover:border-yellow-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-mono text-yellow-400">
                            {producto.nombre}
                          </h3>
                          {producto.categoria && (
                            <span className="text-xs font-mono text-gray-500 bg-zinc-800 px-2 py-1 rounded">
                              {producto.categoria}
                            </span>
                          )}
                        </div>
                        {producto.descripcion && (
                          <p className="text-sm font-mono text-gray-400 mb-2">
                            {producto.descripcion}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm font-mono">
                          <span className="text-green-400">
                            ${Number(producto.precio_unitario).toFixed(2)} MXN
                          </span>
                          <span className="text-gray-500">
                            por {producto.unidad}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="font-mono text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="font-mono text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {productos.filter(p => 
                  !searchTerm || 
                  p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-mono">
                      {searchTerm ? 'No se encontraron productos con ese criterio.' : 'No hay productos registrados. Importa desde CVA o crea uno manualmente.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Paginación */}
              {productos.filter(p => 
                !searchTerm || 
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                  <p className="text-sm font-mono text-gray-400">
                    Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, productos.length)} de {productos.length} productos
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="font-mono"
                    >
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm font-mono text-gray-400">
                      Página {currentPage} de {Math.ceil(productos.length / ITEMS_PER_PAGE)}
                    </span>
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(productos.length / ITEMS_PER_PAGE), p + 1))}
                      disabled={currentPage >= Math.ceil(productos.length / ITEMS_PER_PAGE)}
                      variant="outline"
                      size="sm"
                      className="font-mono"
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
