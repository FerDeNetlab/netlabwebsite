'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { FileText, Download } from 'lucide-react'

export default function CotizacionPublicaPage() {
  const params = useParams()
  const token = params?.token as string
  const [cotizacion, setCotizacion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCot = async () => {
      try {
        const r = await fetch(`/api/cotizaciones/public/${token}`)
        if (r.ok) setCotizacion(await r.json())
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchCot()
  }, [token])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-primary font-mono">Cargando cotización...</div></div>
  if (!cotizacion) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-red-400 font-mono">Cotización no encontrada</div></div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16 max-w-2xl">
        <TerminalFrame title={`Cotización ${cotizacion.numero_cotizacion || ''}`}>
          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-mono text-green-400 mb-2 flex items-center gap-2">
              <FileText className="h-7 w-7" /> Cotización
            </h1>
            <div className="font-mono text-sm text-gray-300 mb-2">
              <div><b>Cliente:</b> {cotizacion.cliente_nombre || '—'}</div>
              <div><b>Empresa:</b> {cotizacion.cliente_empresa || '—'}</div>
              <div><b>Fecha de emisión:</b> {cotizacion.fecha_emision}</div>
              <div><b>Vigencia hasta:</b> {cotizacion.fecha_vencimiento || '—'}</div>
            </div>
            <div className="border-b border-green-500/20 pb-4 mb-4">
              <div className="font-mono text-base text-white mb-2">{cotizacion.concepto}</div>
              <div className="text-xs text-gray-400">{cotizacion.notas}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm border border-green-500/20 rounded">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="p-2 text-left">Descripción</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Precio</th>
                    <th className="p-2 text-right">Descuento</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacion.items.map((item: any) => (
                    <tr key={item.id} className="border-t border-green-500/10">
                      <td className="p-2">{item.descripcion}</td>
                      <td className="p-2 text-right">{item.cantidad}</td>
                      <td className="p-2 text-right">${item.precio_unitario.toFixed(2)}</td>
                      <td className="p-2 text-right">{item.descuento ? `${item.descuento}%` : '—'}</td>
                      <td className="p-2 text-right">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end gap-1 mt-4">
              <div className="font-mono text-base text-white">Subtotal: ${cotizacion.subtotal.toFixed(2)}</div>
              <div className="font-mono text-base text-white">IVA: ${cotizacion.iva.toFixed(2)}</div>
              <div className="font-mono text-xl text-green-400">Total: ${cotizacion.total.toFixed(2)}</div>
            </div>
            <div className="pt-6 text-xs text-gray-500 font-mono text-center">
              Esta cotización fue generada por Netlab. Si tienes dudas, responde a este mensaje o contacta a tu ejecutivo.
            </div>
          </div>
        </TerminalFrame>
      </div>
    </div>
  )
}
