'use client'

import React from "react"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'

interface Cliente {
  id: string
  nombre: string
  empresa: string
}

interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio_unitario: number
  unidad: string
}

interface LineaItem {
  producto_id: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  descuento: number
  subtotal: number
}

export default function NuevaCotizacionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    cliente_id: '',
    concepto: '',
    fecha_vencimiento: '',
    condiciones_pago: 'Pago contra entrega',
    notas: '',
  })

  const [items, setItems] = useState<LineaItem[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, productosRes] = await Promise.all([
          fetch('/api/clientes'),
          fetch('/api/productos'),
        ])

        if (clientesRes.ok) {
          const clientesData = await clientesRes.json()
          setClientes(clientesData)
        }

        if (productosRes.ok) {
          const productosData = await productosRes.json()
          setProductos(productosData)
        }
      } catch (error) {
        console.error('[v0] Error fetching data:', error)
      }
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  const agregarLinea = () => {
    setItems([
      ...items,
      {
        producto_id: '',
        descripcion: '',
        cantidad: 1,
        precio_unitario: 0,
        descuento: 0,
        subtotal: 0,
      },
    ])
  }

  const eliminarLinea = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const actualizarLinea = (index: number, field: keyof LineaItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Si cambia el producto, actualizar descripción y precio
    if (field === 'producto_id') {
      const producto = productos.find((p) => p.id === value)
      if (producto) {
        newItems[index].descripcion = producto.descripcion || ''
        newItems[index].precio_unitario = producto.precio_unitario
      }
    }

    // Calcular subtotal
    const cantidad = newItems[index].cantidad
    const precio = newItems[index].precio_unitario
    const descuento = newItems[index].descuento / 100
    newItems[index].subtotal = cantidad * precio * (1 - descuento)

    setItems(newItems)
  }

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const iva = subtotal * 0.16
    const total = subtotal + iva
    return { subtotal, iva, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { subtotal, iva, total } = calcularTotales()

      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
          iva,
          total,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/admin/cotizaciones/${data.id}`)
      } else {
        alert('Error al crear cotización')
      }
    } catch (error) {
      console.error('[v0] Error:', error)
      alert('Error al crear cotización')
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

  const { subtotal, iva, total } = calcularTotales()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title="root@netlab:~/cotizaciones/nueva">
            <div className="p-6 space-y-6">
              <Button
                onClick={() => router.push('/admin/cotizaciones')}
                variant="ghost"
                className="font-mono gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Cotizaciones
              </Button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Cliente *
                    </label>
                    <select
                      required
                      value={formData.cliente_id}
                      onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-3 py-2 font-mono text-gray-300 focus:border-green-500/50 focus:outline-none"
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.empresa ? `- ${cliente.empresa}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">
                      Fecha de Vencimiento *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.fecha_vencimiento}
                      onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                      className="w-full bg-zinc-900 border border-green-500/20 rounded px-3 py-2 font-mono text-gray-300 focus:border-green-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Concepto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    placeholder="Ej: Desarrollo web, Consultoría"
                    className="w-full bg-zinc-900 border border-green-500/20 rounded px-3 py-2 font-mono text-gray-300 focus:border-green-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Condiciones de Pago
                  </label>
                  <input
                    type="text"
                    value={formData.condiciones_pago}
                    onChange={(e) => setFormData({ ...formData, condiciones_pago: e.target.value })}
                    className="w-full bg-zinc-900 border border-green-500/20 rounded px-3 py-2 font-mono text-gray-300 focus:border-green-500/50 focus:outline-none"
                  />
                </div>

                <div className="border-t border-yellow-500/20 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-mono text-yellow-400">Items de Cotización</h2>
                    <Button
                      type="button"
                      onClick={agregarLinea}
                      className="font-mono gap-2 bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Item
                    </Button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-gray-500 mb-1">Producto</label>
                          <select
                            value={item.producto_id}
                            onChange={(e) => actualizarLinea(index, 'producto_id', e.target.value)}
                            className="w-full bg-zinc-800 border border-gray-600 rounded px-2 py-1 text-sm font-mono text-gray-300"
                          >
                            <option value="">Servicio personalizado</option>
                            {productos.map((prod) => (
                              <option key={prod.id} value={prod.id}>
                                {prod.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-gray-500 mb-1">Descripción</label>
                          <input
                            type="text"
                            value={item.descripcion}
                            onChange={(e) => actualizarLinea(index, 'descripcion', e.target.value)}
                            className="w-full bg-zinc-800 border border-gray-600 rounded px-2 py-1 text-sm font-mono text-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">Cantidad</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.cantidad}
                            onChange={(e) => actualizarLinea(index, 'cantidad', parseFloat(e.target.value) || 0)}
                            className="w-full bg-zinc-800 border border-gray-600 rounded px-2 py-1 text-sm font-mono text-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">Precio Unit.</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.precio_unitario}
                            onChange={(e) => actualizarLinea(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                            className="w-full bg-zinc-800 border border-gray-600 rounded px-2 py-1 text-sm font-mono text-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">Descuento %</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.descuento}
                            onChange={(e) => actualizarLinea(index, 'descuento', parseFloat(e.target.value) || 0)}
                            className="w-full bg-zinc-800 border border-gray-600 rounded px-2 py-1 text-sm font-mono text-gray-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-gray-500 mb-1">Subtotal</label>
                          <div className="text-green-400 font-mono text-sm pt-1">
                            ${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => eliminarLinea(index)}
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-6">
                  <div className="space-y-2 text-right font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal:</span>
                      <span>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>IVA (16%):</span>
                      <span>${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-2xl text-green-400 border-t border-green-500/20 pt-2">
                      <span>Total:</span>
                      <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-mono text-gray-400 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    rows={4}
                    className="w-full bg-zinc-900 border border-green-500/20 rounded px-3 py-2 font-mono text-gray-300 focus:border-green-500/50 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="flex-1 font-mono gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Guardando...' : 'Crear Cotización'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.push('/admin/cotizaciones')}
                    variant="outline"
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
