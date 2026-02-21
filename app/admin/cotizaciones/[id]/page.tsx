'use client'

import React from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import {
  ArrowLeft, Building2, Mail, Phone, FileText, MapPin,
  Calendar, DollarSign, Trash2, CheckCircle, XCircle, Send, Download
} from 'lucide-react'

interface CotizacionDetalle {
  id: string
  numero_cotizacion: string
  concepto: string
  subtotal: number
  iva: number
  total: number
  estado: string
  fecha_emision: string
  fecha_vencimiento: string
  condiciones_pago: string
  notas: string
  cliente_nombre: string
  cliente_empresa: string
  cliente_email: string
  cliente_telefono: string
  cliente_rfc: string
  cliente_direccion: string
  created_at: string
  items: {
    id: string
    descripcion: string
    cantidad: number
    precio_unitario: number
    descuento: number
    subtotal: number
    producto_nombre: string
  }[]
}

const estadoConfig: Record<string, { label: string; color: string; bg: string }> = {
  borrador: { label: 'Borrador', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-500/30' },
  pendiente: { label: 'Pendiente', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-500/30' },
  enviada: { label: 'Enviada', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-500/30' },
  aprobada: { label: 'Aprobada', color: 'text-green-400', bg: 'bg-green-400/10 border-green-500/30' },
  rechazada: { label: 'Rechazada', color: 'text-red-400', bg: 'bg-red-400/10 border-red-500/30' },
}

export default function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState<CotizacionDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const response = await fetch(`/api/cotizaciones/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCotizacion(data)
        } else {
          alert('Cotización no encontrada')
          router.push('/admin/cotizaciones')
        }
      } catch (error) {
        console.error('[ERP] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') fetchCotizacion()
  }, [status, id, router])

  const handleEstadoChange = async (nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/cotizaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (response.ok) {
        setCotizacion(prev => prev ? { ...prev, estado: nuevoEstado } : null)
      }
    } catch (error) {
      console.error('[ERP] Error updating estado:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta cotización? Esta acción no se puede deshacer.')) return
    try {
      const response = await fetch(`/api/cotizaciones/${id}`, { method: 'DELETE' })
      if (response.ok) router.push('/admin/cotizaciones')
    } catch (error) {
      console.error('[ERP] Error:', error)
    }
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/cotizaciones/${id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cotizacion-${cotizacion?.numero_cotizacion || id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error al generar PDF')
      }
    } catch (error) {
      console.error('[ERP] Error downloading PDF:', error)
      alert('Error al descargar PDF')
    } finally {
      setDownloading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  if (!cotizacion) return null

  const estado = estadoConfig[cotizacion.estado] || estadoConfig.borrador

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title={`root@netlab:~/cotizaciones/${cotizacion.numero_cotizacion || id}`}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-yellow-500/20 pb-4">
                <div>
                  <Button
                    onClick={() => router.push('/admin/cotizaciones')}
                    variant="ghost"
                    className="font-mono gap-2 text-sm mb-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Cotizaciones
                  </Button>
                  <h1 className="text-3xl font-mono text-yellow-400">
                    {cotizacion.numero_cotizacion || 'Sin número'}
                  </h1>
                  <p className="text-gray-400 font-mono text-sm mt-1">{cotizacion.concepto}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded border font-mono text-sm ${estado.bg} ${estado.color}`}>
                    {estado.label}
                  </span>
                  <span className="text-2xl font-mono text-green-400">
                    ${cotizacion.total?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDownloadPDF} disabled={downloading} className="font-mono gap-2 bg-green-600 hover:bg-green-700" size="sm">
                  <Download className="h-4 w-4" /> {downloading ? 'Generando...' : 'Descargar PDF'}
                </Button>
                {cotizacion.estado === 'borrador' && (
                  <Button onClick={() => handleEstadoChange('enviada')} className="font-mono gap-2 bg-blue-600 hover:bg-blue-700" size="sm">
                    <Send className="h-4 w-4" /> Marcar Enviada
                  </Button>
                )}
                {['enviada', 'pendiente'].includes(cotizacion.estado) && (
                  <>
                    <Button onClick={() => handleEstadoChange('aprobada')} className="font-mono gap-2 bg-green-600 hover:bg-green-700" size="sm">
                      <CheckCircle className="h-4 w-4" /> Aprobar
                    </Button>
                    <Button onClick={() => handleEstadoChange('rechazada')} className="font-mono gap-2 bg-red-600 hover:bg-red-700" size="sm">
                      <XCircle className="h-4 w-4" /> Rechazar
                    </Button>
                  </>
                )}
                <Button onClick={handleDelete} variant="outline" className="font-mono gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent ml-auto" size="sm">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
              </div>

              {/* Client + Quote Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-5 space-y-3">
                  <h2 className="text-lg font-mono text-yellow-400 mb-3">
                    <Building2 className="h-5 w-5 inline mr-2" />
                    Cliente
                  </h2>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-gray-300 font-bold">{cotizacion.cliente_nombre}</div>
                    {cotizacion.cliente_empresa && <div className="text-gray-400">{cotizacion.cliente_empresa}</div>}
                    {cotizacion.cliente_email && (
                      <div className="flex items-center gap-2 text-gray-400"><Mail className="h-3 w-3" /> {cotizacion.cliente_email}</div>
                    )}
                    {cotizacion.cliente_telefono && (
                      <div className="flex items-center gap-2 text-gray-400"><Phone className="h-3 w-3" /> {cotizacion.cliente_telefono}</div>
                    )}
                    {cotizacion.cliente_rfc && (
                      <div className="flex items-center gap-2 text-gray-400"><FileText className="h-3 w-3" /> RFC: {cotizacion.cliente_rfc}</div>
                    )}
                    {cotizacion.cliente_direccion && (
                      <div className="flex items-center gap-2 text-gray-400"><MapPin className="h-3 w-3" /> {cotizacion.cliente_direccion}</div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-5 space-y-3">
                  <h2 className="text-lg font-mono text-yellow-400 mb-3">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Detalles
                  </h2>
                  <div className="space-y-2 text-sm font-mono">
                    {cotizacion.fecha_emision && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Emisión:</span>
                        <span className="text-gray-300">{new Date(cotizacion.fecha_emision).toLocaleDateString('es-MX')}</span>
                      </div>
                    )}
                    {cotizacion.fecha_vencimiento && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vencimiento:</span>
                        <span className="text-gray-300">{new Date(cotizacion.fecha_vencimiento).toLocaleDateString('es-MX')}</span>
                      </div>
                    )}
                    {cotizacion.condiciones_pago && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Condiciones:</span>
                        <span className="text-gray-300">{cotizacion.condiciones_pago}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Creada:</span>
                      <span className="text-gray-300">
                        {cotizacion.created_at
                          ? new Date(cotizacion.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-yellow-500/20">
                  <h2 className="text-lg font-mono text-yellow-400">
                    <DollarSign className="h-5 w-5 inline mr-2" />
                    Partidas ({cotizacion.items?.length || 0})
                  </h2>
                </div>
                <table className="w-full">
                  <thead className="bg-zinc-800/50 border-b border-gray-700">
                    <tr className="font-mono text-xs text-gray-400">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Descripción</th>
                      <th className="text-right p-3">Cant.</th>
                      <th className="text-right p-3">Precio Unit.</th>
                      <th className="text-right p-3">Desc.</th>
                      <th className="text-right p-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    {cotizacion.items?.map((item, index) => (
                      <tr key={item.id || index} className="border-b border-gray-800 last:border-0">
                        <td className="p-3 text-gray-500">{index + 1}</td>
                        <td className="p-3">
                          <div className="text-gray-300">{item.descripcion || item.producto_nombre}</div>
                          {item.producto_nombre && item.descripcion && (
                            <div className="text-xs text-gray-500">{item.producto_nombre}</div>
                          )}
                        </td>
                        <td className="p-3 text-right text-gray-400">{item.cantidad}</td>
                        <td className="p-3 text-right text-gray-400">
                          ${item.precio_unitario?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right text-gray-400">
                          {item.descuento ? `${item.descuento}%` : '—'}
                        </td>
                        <td className="p-3 text-right text-green-400">
                          ${item.subtotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-yellow-500/20 p-4 space-y-2">
                  <div className="flex justify-between font-mono text-sm text-gray-400">
                    <span>Subtotal:</span>
                    <span>${cotizacion.subtotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm text-gray-400">
                    <span>IVA (16%):</span>
                    <span>${cotizacion.iva?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xl text-green-400 border-t border-green-500/20 pt-2">
                    <span>Total:</span>
                    <span>${cotizacion.total?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {cotizacion.notas && (
                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-5">
                  <h2 className="text-lg font-mono text-gray-400 mb-2">Notas</h2>
                  <p className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{cotizacion.notas}</p>
                </div>
              )}
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
