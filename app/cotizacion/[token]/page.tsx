'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { FileText, Calendar, Building2, User } from 'lucide-react'
import Image from 'next/image'

interface CotizacionItem {
  id: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  descuento: number
  subtotal: number
}

interface CotizacionPublica {
  id: string
  numero_cotizacion: string
  concepto: string
  subtotal: number | string
  iva: number | string
  total: number | string
  estado: string
  fecha_emision: string
  fecha_vencimiento: string | null
  condiciones_pago: string | null
  notas: string | null
  cliente_nombre: string | null
  cliente_empresa: string | null
  cliente_email: string | null
  items: CotizacionItem[]
}

function fmt(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return '0.00'
  return Number(v).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(d: string | null): string {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }) }
  catch { return d }
}

const estadoLabel: Record<string, { label: string; cls: string }> = {
  borrador: { label: 'Borrador', cls: 'text-gray-400 bg-gray-400/10 border-gray-500/20' },
  enviada: { label: 'Enviada', cls: 'text-blue-400 bg-blue-400/10 border-blue-500/20' },
  pendiente: { label: 'Pendiente', cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20' },
  aprobada: { label: 'Aprobada', cls: 'text-green-400 bg-green-400/10 border-green-500/20' },
  rechazada: { label: 'Rechazada', cls: 'text-red-400 bg-red-400/10 border-red-500/20' },
}

export default function CotizacionPublicaPage() {
  const params = useParams()
  const token = params?.token as string
  const [cotizacion, setCotizacion] = useState<CotizacionPublica | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchCot = async () => {
      try {
        const r = await fetch(`/api/cotizaciones/public/${token}`)
        if (r.ok) {
          setCotizacion(await r.json())
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchCot()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-green-400 font-mono animate-pulse">Cargando cotización...</div>
      </div>
    )
  }

  if (notFound || !cotizacion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Image src="/logo-netlab.png" alt="Netlab" width={140} height={42} className="h-10 w-auto opacity-60" />
        <div className="text-red-400 font-mono text-sm">Cotización no encontrada o el link ha expirado.</div>
      </div>
    )
  }

  const estado = estadoLabel[cotizacion.estado] ?? estadoLabel.borrador

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16 max-w-3xl">
        {/* Logo header */}
        <div className="flex items-center justify-between mb-6">
          <Image src="/logo-netlab.png" alt="Netlab" width={140} height={42} className="h-9 w-auto" />
          <span className={`font-mono text-xs px-3 py-1 rounded border ${estado.cls}`}>{estado.label}</span>
        </div>

        <TerminalFrame title={`cotizacion/${cotizacion.numero_cotizacion || token.slice(0, 8)}`}>
          <div className="p-6 space-y-6">
            {/* Encabezado */}
            <div className="border-b border-green-500/20 pb-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-mono text-green-500 uppercase tracking-widest mb-1">
                    {cotizacion.numero_cotizacion || 'Cotización'}
                  </p>
                  <h1 className="text-2xl font-mono text-white leading-tight">{cotizacion.concepto}</h1>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-gray-500">Total</p>
                  <p className="text-3xl font-mono text-green-400">${fmt(cotizacion.total)}</p>
                  <p className="text-xs font-mono text-gray-500">MXN</p>
                </div>
              </div>
            </div>

            {/* Info cliente + fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-green-500/15 rounded-lg p-4 space-y-2">
                <p className="text-xs font-mono text-green-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3" /> Cliente
                </p>
                <p className="font-mono text-sm text-white">{cotizacion.cliente_nombre || '—'}</p>
                {cotizacion.cliente_empresa && (
                  <p className="font-mono text-xs text-gray-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {cotizacion.cliente_empresa}
                  </p>
                )}
                {cotizacion.cliente_email && (
                  <p className="font-mono text-xs text-gray-500">{cotizacion.cliente_email}</p>
                )}
              </div>
              <div className="bg-zinc-900/50 border border-green-500/15 rounded-lg p-4 space-y-2">
                <p className="text-xs font-mono text-green-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Vigencia
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Emitida</span>
                    <span className="text-gray-300">{fmtDate(cotizacion.fecha_emision)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Válida hasta</span>
                    <span className="text-gray-300">{fmtDate(cotizacion.fecha_vencimiento)}</span>
                  </div>
                  {cotizacion.condiciones_pago && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Condiciones</span>
                      <span className="text-gray-300">{cotizacion.condiciones_pago}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabla de items */}
            {cotizacion.items && cotizacion.items.length > 0 && (
              <div>
                <p className="text-xs font-mono text-green-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Partidas
                </p>
                <div className="overflow-x-auto rounded-lg border border-green-500/15">
                  <table className="w-full font-mono text-sm">
                    <thead>
                      <tr className="bg-zinc-900 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-3 py-2 text-left">Descripción</th>
                        <th className="px-3 py-2 text-right whitespace-nowrap">Cant.</th>
                        <th className="px-3 py-2 text-right whitespace-nowrap">P. Unit.</th>
                        <th className="px-3 py-2 text-right whitespace-nowrap">Desc.</th>
                        <th className="px-3 py-2 text-right whitespace-nowrap">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion.items.map((item, i) => (
                        <tr key={item.id} className={`border-t border-green-500/10 ${i % 2 === 0 ? '' : 'bg-zinc-900/30'}`}>
                          <td className="px-3 py-2 text-gray-200">{item.descripcion}</td>
                          <td className="px-3 py-2 text-right text-gray-400">{item.cantidad}</td>
                          <td className="px-3 py-2 text-right text-gray-300">${fmt(item.precio_unitario)}</td>
                          <td className="px-3 py-2 text-right text-gray-400">{item.descuento ? `${item.descuento}%` : '—'}</td>
                          <td className="px-3 py-2 text-right text-green-400">${fmt(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Totales */}
            <div className="flex flex-col items-end gap-1.5 border-t border-green-500/20 pt-4">
              <div className="flex justify-between w-full sm:w-64 font-mono text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-300">${fmt(cotizacion.subtotal)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 font-mono text-sm">
                <span className="text-gray-500">IVA (16%)</span>
                <span className="text-gray-300">${fmt(cotizacion.iva)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-64 font-mono text-lg border-t border-green-500/20 pt-2">
                <span className="text-white font-bold">Total</span>
                <span className="text-green-400 font-bold">${fmt(cotizacion.total)} MXN</span>
              </div>
            </div>

            {/* Notas */}
            {cotizacion.notas && (
              <div className="bg-zinc-900/40 border border-zinc-700 rounded-lg p-4">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Notas</p>
                <p className="font-mono text-sm text-gray-300 whitespace-pre-line">{cotizacion.notas}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-green-500/10 pt-4 text-center">
              <p className="font-mono text-xs text-gray-600">
                Cotización generada por <span className="text-green-500">Netlab</span> · netlab.mx
              </p>
              <p className="font-mono text-xs text-gray-600 mt-1">
                ¿Dudas? Escríbenos a <span className="text-gray-400">contacto@netlab.mx</span>
              </p>
            </div>
          </div>
        </TerminalFrame>
      </div>
    </div>
  )
}
