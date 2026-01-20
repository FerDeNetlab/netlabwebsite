'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Mail, Printer } from 'lucide-react'

interface CotizacionDetalle {
  id: string
  numero_cotizacion: string
  cliente_nombre: string
  cliente_email: string
  cliente_empresa: string
  fecha_emision: string
  fecha_vencimiento: string
  concepto: string
  condiciones_pago: string
  notas: string
  subtotal: number
  iva: number
  total: number
  estado: string
  items: Array<{
    descripcion: string
    cantidad: number
    precio_unitario: number
    descuento: number
    subtotal: number
  }>
}

export default function CotizacionDetallePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState<CotizacionDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const response = await fetch(`/api/cotizaciones/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCotizacion(data)
        } else {
          alert('Cotización no encontrada')
          router.push('/admin/cotizaciones')
        }
      } catch (error) {
        console.error('[v0] Error fetching cotización:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchCotizacion()
    }
  }, [status, params.id, router])

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/cotizaciones/${params.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cotizacion-${cotizacion?.numero_cotizacion}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('[v0] Error downloading PDF:', error)
      alert('Error al descargar PDF')
    }
  }

  const handleSendEmail = async () => {
    setSendingEmail(true)
    try {
      const response = await fetch(`/api/cotizaciones/${params.id}/email`, {
        method: 'POST',
      })
      if (response.ok) {
        alert('Cotización enviada por correo')
      } else {
        alert('Error al enviar correo')
      }
    } catch (error) {
      console.error('[v0] Error sending email:', error)
      alert('Error al enviar correo')
    } finally {
      setSendingEmail(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  if (!cotizacion) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title={`root@netlab:~/cotizaciones/${cotizacion.numero_cotizacion}`}>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => router.push('/admin/cotizaciones')}
                  variant="ghost"
                  className="font-mono gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a Cotizaciones
                </Button>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadPDF}
                    variant="outline"
                    className="font-mono gap-2 border-green-500/30 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="font-mono gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="h-4 w-4" />
                    {sendingEmail ? 'Enviando...' : 'Enviar por Email'}
                  </Button>
                </div>
              </div>

              {/* Encabezado */}
              <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-mono text-yellow-400 mb-2">
                      {cotizacion.numero_cotizacion}
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">
                      {cotizacion.concepto}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-500">Estado</p>
                    <p className="text-lg font-mono text-green-400 capitalize">
                      {cotizacion.estado}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 text-sm font-mono">
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p className="text-gray-300">{cotizacion.cliente_nombre}</p>
                    {cotizacion.cliente_empresa && (
                      <p className="text-gray-400">{cotizacion.cliente_empresa}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha de Emisión</p>
                    <p className="text-gray-300">{cotizacion.fecha_emision}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vencimiento</p>
                    <p className="text-gray-300">{cotizacion.fecha_vencimiento}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Condiciones de Pago</p>
                    <p className="text-gray-300">{cotizacion.condiciones_pago}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-800/50 border-b border-green-500/20">
                    <tr className="font-mono text-xs text-gray-400">
                      <th className="text-left p-3">Descripción</th>
                      <th className="text-right p-3">Cantidad</th>
                      <th className="text-right p-3">Precio Unit.</th>
                      <th className="text-right p-3">Descuento</th>
                      <th className="text-right p-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    {cotizacion.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 last:border-0">
                        <td className="p-3 text-gray-300">{item.descripcion}</td>
                        <td className="p-3 text-right text-gray-400">{item.cantidad}</td>
                        <td className="p-3 text-right text-gray-400">
                          ${item.precio_unitario.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right text-gray-400">{item.descuento}%</td>
                        <td className="p-3 text-right text-green-400">
                          ${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-zinc-800/50 p-4 space-y-2 font-mono">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal:</span>
                    <span>${cotizacion.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>IVA (16%):</span>
                    <span>${cotizacion.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-2xl text-green-400 border-t border-green-500/20 pt-2">
                    <span>Total:</span>
                    <span>${cotizacion.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>
                </div>
              </div>

              {cotizacion.notas && (
                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-mono text-gray-500 mb-2">Notas:</p>
                  <p className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {cotizacion.notas}
                  </p>
                </div>
              )}
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
