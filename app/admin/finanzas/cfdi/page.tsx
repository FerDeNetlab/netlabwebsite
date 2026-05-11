'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import {
  ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, X,
  Link2, ExternalLink, Trash2, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CfdiRow {
  id: string
  uuid_sat: string
  tipo_comprobante: string
  fecha: string | null
  fecha_timbrado: string | null
  emisor_rfc: string
  emisor_nombre: string | null
  receptor_rfc: string
  receptor_nombre: string | null
  subtotal: number
  total: number
  moneda: string
  tipo_netlab: 'emitida' | 'recibida' | 'otra' | null
  xml_url: string | null
  xml_nombre: string | null
  estado: 'sin_asignar' | 'asignado'
  factura_id: string | null
  gasto_id: string | null
  // joined fields
  numero_factura?: string | null
  factura_concepto?: string | null
  gasto_concepto?: string | null
  gasto_proveedor?: string | null
}

interface FacturaSug {
  id: string
  numero_factura: string
  concepto: string
  total: number
  cliente_nombre: string
}

interface GastoSug {
  id: string
  concepto: string
  monto: number
  proveedor: string | null
  categoria_nombre: string | null
}

interface UploadResult {
  name: string
  status: 'uploading' | 'ok' | 'error' | 'duplicate'
  msg?: string
  uuid?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

const fmtDate = (s: string | null) => {
  if (!s) return '—'
  return new Date(String(s).split('T')[0] + 'T12:00:00').toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const TIPO_LABEL: Record<string, string> = {
  I: 'Ingreso', E: 'Egreso', N: 'Nómina', P: 'Pago', T: 'Traslado',
}

// Auto-suggest: find facturas/gastos whose monto is within 2% of cfdi.total
function suggest(cfdi: CfdiRow, facturas: FacturaSug[], gastos: GastoSug[]) {
  const tol = cfdi.total * 0.02
  if (cfdi.tipo_netlab === 'emitida' || cfdi.tipo_netlab === null) {
    return facturas
      .filter(f => Math.abs(Number(f.total) - cfdi.total) <= tol)
      .slice(0, 3)
  }
  return gastos
    .filter(g => Math.abs(Number(g.monto) - cfdi.total) <= tol)
    .slice(0, 3)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CfdiPage() {
  const { status } = useSession()
  const router = useRouter()

  const [cfdis, setCfdis] = useState<CfdiRow[]>([])
  const [facturas, setFacturas] = useState<FacturaSug[]>([])
  const [gastos, setGastos] = useState<GastoSug[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'todos' | 'sin_asignar' | 'asignado'>('todos')

  // Upload state
  const [results, setResults] = useState<UploadResult[]>([])
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Assignment inline form
  const [asignandoId, setAsignandoId] = useState<string | null>(null)
  const [asignTipo, setAsignTipo] = useState<'factura' | 'gasto'>('factura')
  const [asignTargetId, setAsignTargetId] = useState('')
  const [asignando, setAsignando] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  const fetchCfdis = useCallback(() => {
    fetch('/api/finanzas/cfdi')
      .then(r => r.json())
      .then(d => setCfdis(d.cfdis || []))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    // Fetch in parallel
    Promise.all([
      fetch('/api/facturas').then(r => r.json()),
      fetch('/api/gastos').then(r => r.json()),
    ]).then(([factData, gastData]) => {
      setFacturas(factData || [])
      setGastos(gastData.gastos || [])
    }).catch(() => null)
    fetchCfdis()
  }, [status, fetchCfdis])

  // ── Upload ────────────────────────────────────────────────────────────────

  const uploadFiles = async (files: File[]) => {
    const xmlFiles = files.filter(f => f.name.toLowerCase().endsWith('.xml'))
    if (xmlFiles.length === 0) return

    // Seed uploading state
    setResults(prev => [
      ...xmlFiles.map(f => ({ name: f.name, status: 'uploading' as const })),
      ...prev,
    ])

    await Promise.allSettled(
      xmlFiles.map(async (file) => {
        const fd = new FormData()
        fd.append('file', file)
        try {
          const r = await fetch('/api/finanzas/cfdi', { method: 'POST', body: fd })
          const data = await r.json().catch(() => ({}))
          const result: UploadResult = r.ok
            ? { name: file.name, status: 'ok', uuid: data.cfdi?.uuid_sat }
            : r.status === 409
              ? { name: file.name, status: 'duplicate', msg: data.error }
              : { name: file.name, status: 'error', msg: data.error || 'Error desconocido' }
          setResults(prev =>
            prev.map(p => p.name === file.name && p.status === 'uploading' ? result : p)
          )
        } catch {
          setResults(prev =>
            prev.map(p => p.name === file.name && p.status === 'uploading'
              ? { name: file.name, status: 'error', msg: 'Error de red' } : p)
          )
        }
      })
    )
    fetchCfdis()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    uploadFiles(Array.from(e.dataTransfer.files))
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  // ── Assignment ────────────────────────────────────────────────────────────

  const openAsignar = (cfdi: CfdiRow) => {
    setAsignandoId(cfdi.id)
    setAsignTipo(cfdi.tipo_netlab === 'recibida' ? 'gasto' : 'factura')
    setAsignTargetId('')
  }

  const handleAsignar = async (cfdiId: string) => {
    if (!asignTargetId) return
    setAsignando(true)
    try {
      await fetch(`/api/finanzas/cfdi/${cfdiId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factura_id: asignTipo === 'factura' ? asignTargetId : null,
          gasto_id: asignTipo === 'gasto' ? asignTargetId : null,
        }),
      })
      setAsignandoId(null)
      fetchCfdis()
    } finally {
      setAsignando(false)
    }
  }

  const handleDesasignar = async (cfdiId: string) => {
    await fetch(`/api/finanzas/cfdi/${cfdiId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ factura_id: null, gasto_id: null }),
    })
    fetchCfdis()
  }

  const handleDelete = async (cfdiId: string, nombre: string) => {
    if (!confirm(`¿Eliminar el CFDI ${nombre}? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/finanzas/cfdi/${cfdiId}`, { method: 'DELETE' })
    setCfdis(prev => prev.filter(c => c.id !== cfdiId))
  }

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filtered = cfdis.filter(c => filtro === 'todos' || c.estado === filtro)

  const countSin = cfdis.filter(c => c.estado === 'sin_asignar').length
  const countAsig = cfdis.filter(c => c.estado === 'asignado').length

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <TerminalFrame title="root@netlab:~/finanzas/cfdi">
            <div className="p-6 space-y-6">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                <div>
                  <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                    <ArrowLeft className="h-4 w-4" /> Finanzas
                  </Button>
                  <h1 className="text-3xl font-mono text-blue-400">CFDIs / Facturas Fiscales</h1>
                  <p className="text-gray-400 font-mono text-sm mt-1">
                    Conciliación de XMLs del SAT — RFC <span className="text-blue-400">HAR250221IT3</span>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-mono text-xs text-gray-500">{cfdis.length} CFDIs cargados</div>
                  <div className="font-mono text-xs text-yellow-400">{countSin} sin asignar</div>
                  <div className="font-mono text-xs text-emerald-400">{countAsig} asignados</div>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-gray-700 hover:border-blue-500/50 hover:bg-zinc-900/50'
                }`}
              >
                <Upload className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                <p className="font-mono text-gray-400 text-sm">
                  Arrastra tus XMLs aquí o <span className="text-blue-400">haz click para seleccionarlos</span>
                </p>
                <p className="font-mono text-gray-600 text-xs mt-1">
                  Acepta múltiples archivos .xml del SAT (CFDI 3.3 y 4.0)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml"
                  multiple
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>

              {/* Upload results */}
              {results.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-gray-500">Últimas cargas</p>
                    <button onClick={() => setResults([])} className="font-mono text-[10px] text-gray-600 hover:text-gray-400">Limpiar</button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {results.map((r, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-mono ${
                        r.status === 'uploading' ? 'bg-zinc-800/50 text-gray-400' :
                        r.status === 'ok' ? 'bg-emerald-400/10 text-emerald-400' :
                        r.status === 'duplicate' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-red-400/10 text-red-400'
                      }`}>
                        {r.status === 'uploading' && <RefreshCw className="h-3 w-3 animate-spin" />}
                        {r.status === 'ok' && <CheckCircle className="h-3 w-3" />}
                        {r.status === 'duplicate' && <AlertTriangle className="h-3 w-3" />}
                        {r.status === 'error' && <X className="h-3 w-3" />}
                        <span className="truncate flex-1">{r.name}</span>
                        <span className="text-[10px] opacity-70">
                          {r.status === 'uploading' ? 'Procesando...' :
                           r.status === 'ok' ? 'Cargado ✓' :
                           r.status === 'duplicate' ? 'Duplicado' :
                           r.msg || 'Error'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter tabs */}
              <div className="flex gap-2">
                {[
                  { k: 'todos', label: `Todos (${cfdis.length})` },
                  { k: 'sin_asignar', label: `Sin asignar (${countSin})` },
                  { k: 'asignado', label: `Asignados (${countAsig})` },
                ].map(({ k, label }) => (
                  <button key={k} onClick={() => setFiltro(k as typeof filtro)}
                    className={`px-3 py-1.5 rounded font-mono text-xs border transition-all ${
                      filtro === k
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'border-gray-700 text-gray-500 hover:border-gray-500'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* CFDI list */}
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="font-mono text-gray-400">
                    {cfdis.length === 0
                      ? 'Aún no hay CFDIs cargados — arrastra tus XMLs arriba'
                      : 'No hay CFDIs con ese filtro'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(cfdi => {
                    const suggestions = suggest(cfdi, facturas, gastos)
                    const isOpen = asignandoId === cfdi.id

                    return (
                      <div key={cfdi.id} className={`bg-zinc-900/50 border rounded-lg overflow-hidden transition-colors ${
                        cfdi.estado === 'asignado' ? 'border-emerald-500/20' : 'border-gray-700/50'
                      }`}>
                        {/* Row */}
                        <div className="p-4 flex items-start gap-3">
                          {/* Badges */}
                          <div className="flex flex-col gap-1 pt-0.5 min-w-[80px]">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono text-center ${
                              cfdi.tipo_netlab === 'emitida' ? 'text-green-400 bg-green-400/10' :
                              cfdi.tipo_netlab === 'recibida' ? 'text-red-400 bg-red-400/10' :
                              'text-gray-400 bg-gray-400/10'
                            }`}>
                              {cfdi.tipo_netlab === 'emitida' ? '📤 Emitida' :
                               cfdi.tipo_netlab === 'recibida' ? '📥 Recibida' : '❓ Otra'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-center text-gray-400 bg-gray-400/5 border border-gray-700/50">
                              {TIPO_LABEL[cfdi.tipo_comprobante] ?? cfdi.tipo_comprobante}
                            </span>
                          </div>

                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-gray-300 tracking-wider">
                                {cfdi.uuid_sat.slice(0, 8)}…{cfdi.uuid_sat.slice(-4)}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                cfdi.estado === 'asignado'
                                  ? 'text-emerald-400 bg-emerald-400/10'
                                  : 'text-yellow-400 bg-yellow-400/10'
                              }`}>
                                {cfdi.estado === 'asignado' ? '✅ Asignado' : '⏳ Sin asignar'}
                              </span>
                            </div>
                            <div className="font-mono text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                              <span>
                                {cfdi.tipo_netlab === 'emitida'
                                  ? (cfdi.receptor_nombre || cfdi.receptor_rfc)
                                  : (cfdi.emisor_nombre || cfdi.emisor_rfc)}
                              </span>
                              <span className="text-gray-600">
                                {cfdi.tipo_netlab === 'emitida' ? cfdi.receptor_rfc : cfdi.emisor_rfc}
                              </span>
                              <span>{fmtDate(cfdi.fecha_timbrado || cfdi.fecha)}</span>
                            </div>
                            {/* Assigned to */}
                            {cfdi.estado === 'asignado' && (
                              <div className="mt-1 font-mono text-[11px] text-emerald-400">
                                {cfdi.factura_id
                                  ? `→ Factura ${cfdi.numero_factura || ''} — ${cfdi.factura_concepto || ''}`
                                  : `→ Gasto: ${cfdi.gasto_concepto || ''} ${cfdi.gasto_proveedor ? `(${cfdi.gasto_proveedor})` : ''}`}
                              </div>
                            )}
                            {/* Auto-suggest */}
                            {cfdi.estado === 'sin_asignar' && suggestions.length > 0 && !isOpen && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                <span className="font-mono text-[10px] text-gray-600">Posible match:</span>
                                {suggestions.map(s => (
                                  <button
                                    key={'id' in s ? s.id : ''}
                                    onClick={() => {
                                      openAsignar(cfdi)
                                      setAsignTargetId('id' in s ? s.id : '')
                                    }}
                                    className="font-mono text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded hover:bg-blue-400/20"
                                  >
                                    {'numero_factura' in s
                                      ? `${s.numero_factura} — ${fmt(Number(s.total))}`
                                      : `${(s as GastoSug).concepto} — ${fmt(Number((s as GastoSug).monto))}`}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Amount + actions */}
                          <div className="flex flex-col items-end gap-2">
                            <span className={`font-mono text-base font-bold ${
                              cfdi.tipo_netlab === 'emitida' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {fmt(Number(cfdi.total))}
                              {cfdi.moneda !== 'MXN' && <span className="text-xs ml-1 text-gray-500">{cfdi.moneda}</span>}
                            </span>
                            <div className="flex gap-1">
                              {cfdi.xml_url && (
                                <a href={cfdi.xml_url} target="_blank" rel="noopener noreferrer"
                                  title="Ver XML"
                                  className="p-1.5 rounded text-gray-500 hover:text-blue-400 hover:bg-zinc-800 transition-colors">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                              {cfdi.estado === 'sin_asignar' ? (
                                <button
                                  onClick={() => isOpen ? setAsignandoId(null) : openAsignar(cfdi)}
                                  className="flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                                >
                                  <Link2 className="h-3 w-3" />
                                  {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDesasignar(cfdi.id)}
                                  className="px-2 py-1 rounded font-mono text-[10px] text-gray-500 hover:text-orange-400 hover:bg-zinc-800 transition-colors"
                                  title="Quitar asignación"
                                >
                                  <Link2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(cfdi.id, cfdi.xml_nombre || cfdi.uuid_sat)}
                                className="p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                                title="Eliminar CFDI"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Inline assignment form */}
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                            className="mx-4 mb-4 p-4 bg-zinc-900 border border-blue-500/20 rounded-lg"
                          >
                            <p className="font-mono text-[11px] text-blue-400 mb-3 flex items-center gap-1">
                              <Link2 className="h-3 w-3" /> Conciliar CFDI con registro interno
                            </p>

                            {/* Type selector */}
                            <div className="flex gap-2 mb-3">
                              <button
                                onClick={() => { setAsignTipo('factura'); setAsignTargetId('') }}
                                className={`flex-1 py-1.5 rounded font-mono text-xs border transition-all ${
                                  asignTipo === 'factura'
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                    : 'border-gray-700 text-gray-500 hover:border-gray-500'
                                }`}
                              >
                                📄 Factura (ingreso)
                              </button>
                              <button
                                onClick={() => { setAsignTipo('gasto'); setAsignTargetId('') }}
                                className={`flex-1 py-1.5 rounded font-mono text-xs border transition-all ${
                                  asignTipo === 'gasto'
                                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                    : 'border-gray-700 text-gray-500 hover:border-gray-500'
                                }`}
                              >
                                💸 Gasto (egreso)
                              </button>
                            </div>

                            {/* Target selector */}
                            <select
                              value={asignTargetId}
                              onChange={e => setAsignTargetId(e.target.value)}
                              className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-blue-500 focus:outline-none mb-3"
                            >
                              <option value="">— Selecciona {asignTipo === 'factura' ? 'una factura' : 'un gasto'} —</option>
                              {asignTipo === 'factura'
                                ? facturas.map(f => (
                                    <option key={f.id} value={f.id}>
                                      {f.numero_factura} — {f.concepto} — {fmt(Number(f.total))} ({f.cliente_nombre})
                                    </option>
                                  ))
                                : gastos.map(g => (
                                    <option key={g.id} value={g.id}>
                                      {g.concepto} — {fmt(Number(g.monto))}{g.proveedor ? ` (${g.proveedor})` : ''}
                                    </option>
                                  ))}
                            </select>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAsignar(cfdi.id)}
                                disabled={!asignTargetId || asignando}
                                className="font-mono bg-blue-600 hover:bg-blue-700 text-xs gap-1"
                                size="sm"
                              >
                                {asignando ? 'Guardando...' : <><CheckCircle className="h-3 w-3" /> Confirmar conciliación</>}
                              </Button>
                              <Button
                                onClick={() => setAsignandoId(null)}
                                variant="ghost"
                                className="font-mono text-xs"
                                size="sm"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
