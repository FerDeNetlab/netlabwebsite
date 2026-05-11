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
  Satellite, KeyRound, Download, Clock, Ban,
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

interface SatSolicitud {
  id: string
  id_solicitud_sat: string | null
  tipo: 'E' | 'R'
  fecha_inicio: string
  fecha_fin: string
  estado_sat: number
  num_cfdis: number
  paquetes_total: number
  paquetes_importados: number
  mensaje: string | null
  created_at: string
}

const SAT_ESTADO: Record<number, { label: string; color: string }> = {
  1: { label: 'Aceptada',              color: 'text-blue-400 bg-blue-400/10' },
  2: { label: 'En proceso',            color: 'text-yellow-400 bg-yellow-400/10' },
  3: { label: 'Lista para descargar',  color: 'text-emerald-400 bg-emerald-400/10' },
  4: { label: 'Error SAT',             color: 'text-red-400 bg-red-400/10' },
  5: { label: 'Rechazada (cuota)',     color: 'text-orange-400 bg-orange-400/10' },
  6: { label: 'Vencida',               color: 'text-gray-400 bg-gray-400/10' },
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

  // SAT Descarga Masiva
  const [satOpen, setSatOpen] = useState(false)
  const [satSolicitudes, setSatSolicitudes] = useState<SatSolicitud[]>([])
  const cerRef = useRef<HTMLInputElement>(null)
  const keyRef = useRef<HTMLInputElement>(null)
  const [satForm, setSatForm] = useState({
    password: '',
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    tipo: 'A' as 'E' | 'R' | 'A',
  })
  const [satCerFile, setSatCerFile] = useState<File | null>(null)
  const [satKeyFile, setSatKeyFile] = useState<File | null>(null)
  const [satLoading, setSatLoading] = useState(false)
  const [satMsg, setSatMsg] = useState<{ tipo: 'ok' | 'error' | 'info'; text: string } | null>(null)
  // Per-solicitud import state
  const [importandoId, setImportandoId] = useState<string | null>(null)
  const [importMsg, setImportMsg] = useState<Record<string, { tipo: 'ok' | 'error' | 'info'; text: string }>>({})


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

  const fetchSolicitudes = useCallback(() => {
    fetch('/api/finanzas/sat')
      .then(r => r.json())
      .then(d => setSatSolicitudes(d.solicitudes || []))
      .catch(() => null)
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    Promise.all([
      fetch('/api/facturas').then(r => r.json()),
      fetch('/api/gastos').then(r => r.json()),
    ]).then(([factData, gastData]) => {
      setFacturas(factData || [])
      setGastos(gastData.gastos || [])
    }).catch(() => null)
    fetchCfdis()
    fetchSolicitudes()
  }, [status, fetchCfdis, fetchSolicitudes])

  // ── SAT handlers ────────────────────────────────────────────────────────────

  const fileToB64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = () => res((r.result as string).split(',')[1] ?? '')
      r.onerror = rej
      r.readAsDataURL(f)
    })

  const handleSatSolicitar = async () => {
    if (!satCerFile || !satKeyFile || !satForm.password) {
      setSatMsg({ tipo: 'error', text: 'Selecciona el .cer, el .key y escribe tu contraseña' })
      return
    }
    setSatLoading(true)
    setSatMsg({ tipo: 'info', text: 'Autenticando con el SAT...' })
    try {
      const [cerB64, keyB64] = await Promise.all([fileToB64(satCerFile), fileToB64(satKeyFile)])
      const r = await fetch('/api/finanzas/sat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cerB64, keyB64, ...satForm }),
      })
      const data = await r.json()
      if (!r.ok) {
        setSatMsg({ tipo: 'error', text: data.error || 'Error al solicitar' })
      } else {
        const ok = data.resultados?.filter((x: { ok: boolean }) => x.ok).length ?? 0
        setSatMsg({ tipo: 'ok', text: `Solicitud${ok > 1 ? 'es' : ''} enviada${ok > 1 ? 's' : ''} al SAT. El SAT puede tardar minutos u horas en preparar los paquetes.` })
        fetchSolicitudes()
      }
    } catch {
      setSatMsg({ tipo: 'error', text: 'Error de red al conectar con el SAT' })
    } finally {
      setSatLoading(false)
    }
  }

  const handleSatImportar = async (sol: SatSolicitud) => {
    if (!satCerFile || !satKeyFile || !satForm.password) {
      setImportMsg(m => ({ ...m, [sol.id]: { tipo: 'error', text: 'Sube tu .cer, .key y contraseña en la sección de arriba primero' } }))
      return
    }
    setImportandoId(sol.id)
    setImportMsg(m => ({ ...m, [sol.id]: { tipo: 'info', text: 'Verificando con el SAT...' } }))
    try {
      const [cerB64, keyB64] = await Promise.all([fileToB64(satCerFile), fileToB64(satKeyFile)])
      const r = await fetch('/api/finanzas/sat/importar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cerB64, keyB64, password: satForm.password, dbId: sol.id }),
      })
      const data = await r.json()
      if (!r.ok) {
        setImportMsg(m => ({ ...m, [sol.id]: { tipo: 'error', text: data.error || 'Error al importar' } }))
      } else if (data.ok) {
        setImportMsg(m => ({ ...m, [sol.id]: { tipo: 'ok', text: `✅ Importados: ${data.importados}  Duplicados: ${data.duplicados}  Errores: ${data.errores}` } }))
        fetchSolicitudes()
        fetchCfdis()
      } else {
        setImportMsg(m => ({ ...m, [sol.id]: { tipo: 'info', text: `${data.estadoLabel ?? 'En proceso'} — ${data.mensaje ?? 'Intenta más tarde'}` } }))
        fetchSolicitudes()
      }
    } catch {
      setImportMsg(m => ({ ...m, [sol.id]: { tipo: 'error', text: 'Error de red' } }))
    } finally {
      setImportandoId(null)
    }
  }


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

              {/* ── SAT Descarga Masiva ─────────────────────────────────── */}
              <div className="bg-zinc-900/50 border border-indigo-500/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setSatOpen(o => !o)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <Satellite className="h-4 w-4 text-indigo-400" />
                  <span className="font-mono text-indigo-400 text-sm font-bold">Descarga Masiva SAT</span>
                  <span className="font-mono text-gray-500 text-xs ml-1">Emitidas + Recibidas automáticas</span>
                  <span className="ml-auto font-mono text-xs text-gray-600">{satSolicitudes.length} solicitudes</span>
                  {satOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                </button>

                {satOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="border-t border-indigo-500/20 p-5 space-y-5">

                    {/* FIEL form */}
                    <div className="space-y-3">
                      <p className="font-mono text-xs text-gray-500 flex items-center gap-1">
                        <KeyRound className="h-3 w-3" /> Tus archivos e.firma (FIEL) — solo se usan en memoria, <span className="text-indigo-400">nunca se guardan</span>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* .cer */}
                        <div>
                          <label className="font-mono text-[10px] text-gray-400">Certificado .cer</label>
                          <label className={`mt-1 flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors ${satCerFile ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-gray-700 hover:border-indigo-500/40'}`}>
                            <Upload className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="font-mono text-xs truncate text-gray-300">{satCerFile?.name ?? 'Seleccionar .cer'}</span>
                            <input ref={cerRef} type="file" accept=".cer" className="hidden"
                              onChange={e => setSatCerFile(e.target.files?.[0] ?? null)} />
                          </label>
                        </div>
                        {/* .key */}
                        <div>
                          <label className="font-mono text-[10px] text-gray-400">Llave privada .key</label>
                          <label className={`mt-1 flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors ${satKeyFile ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-gray-700 hover:border-indigo-500/40'}`}>
                            <Upload className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="font-mono text-xs truncate text-gray-300">{satKeyFile?.name ?? 'Seleccionar .key'}</span>
                            <input ref={keyRef} type="file" accept=".key" className="hidden"
                              onChange={e => setSatKeyFile(e.target.files?.[0] ?? null)} />
                          </label>
                        </div>
                        {/* Contraseña */}
                        <div>
                          <label className="font-mono text-[10px] text-gray-400">Contraseña e.firma</label>
                          <input type="password" value={satForm.password}
                            onChange={e => setSatForm(f => ({ ...f, password: e.target.value }))}
                            placeholder="••••••••"
                            className="mt-1 w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="font-mono text-[10px] text-gray-400">Fecha inicio</label>
                          <input type="date" value={satForm.fechaInicio}
                            onChange={e => setSatForm(f => ({ ...f, fechaInicio: e.target.value }))}
                            className="mt-1 w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-gray-400">Fecha fin</label>
                          <input type="date" value={satForm.fechaFin}
                            onChange={e => setSatForm(f => ({ ...f, fechaFin: e.target.value }))}
                            className="mt-1 w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="font-mono text-[10px] text-gray-400">Tipo</label>
                          <select value={satForm.tipo}
                            onChange={e => setSatForm(f => ({ ...f, tipo: e.target.value as 'E' | 'R' | 'A' }))}
                            className="mt-1 w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-indigo-500 focus:outline-none">
                            <option value="A">📤📥 Emitidas y Recibidas</option>
                            <option value="E">📤 Solo Emitidas</option>
                            <option value="R">📥 Solo Recibidas</option>
                          </select>
                        </div>
                      </div>

                      {satMsg && (
                        <div className={`px-3 py-2 rounded font-mono text-xs ${satMsg.tipo === 'ok' ? 'text-emerald-400 bg-emerald-400/10' : satMsg.tipo === 'error' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                          {satMsg.text}
                        </div>
                      )}

                      <Button
                        onClick={handleSatSolicitar}
                        disabled={satLoading || !satCerFile || !satKeyFile || !satForm.password}
                        className="font-mono bg-indigo-600 hover:bg-indigo-700 text-xs gap-1"
                        size="sm"
                      >
                        {satLoading
                          ? <><RefreshCw className="h-3 w-3 animate-spin" /> Conectando con el SAT...</>
                          : <><Download className="h-3 w-3" /> Solicitar descarga al SAT</>
                        }
                      </Button>
                    </div>

                    {/* Solicitudes list */}
                    {satSolicitudes.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-mono text-[11px] text-gray-500">Solicitudes anteriores</p>
                        {satSolicitudes.map(sol => {
                          const est = SAT_ESTADO[sol.estado_sat] ?? { label: `Estado ${sol.estado_sat}`, color: 'text-gray-400 bg-gray-400/10' }
                          const msg = importMsg[sol.id]
                          return (
                            <div key={sol.id} className="bg-zinc-800/50 border border-gray-700/50 rounded-lg p-3 flex flex-wrap items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs text-white">
                                    {sol.tipo === 'E' ? '📤 Emitidas' : '📥 Recibidas'}
                                  </span>
                                  <span className="font-mono text-xs text-gray-400">
                                    {sol.fecha_inicio?.split('T')[0]} → {sol.fecha_fin?.split('T')[0]}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${est.color}`}>
                                    {est.label}
                                  </span>
                                  {sol.num_cfdis > 0 && (
                                    <span className="font-mono text-[10px] text-gray-500">{sol.num_cfdis} CFDIs</span>
                                  )}
                                </div>
                                {msg && (
                                  <p className={`font-mono text-[10px] mt-1 ${msg.tipo === 'ok' ? 'text-emerald-400' : msg.tipo === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                                    {msg.text}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                {(sol.estado_sat === 1 || sol.estado_sat === 2 || sol.estado_sat === 3) && (
                                  <Button
                                    onClick={() => handleSatImportar(sol)}
                                    disabled={importandoId === sol.id}
                                    size="sm"
                                    className={`font-mono text-[10px] gap-1 ${sol.estado_sat === 3 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                                  >
                                    {importandoId === sol.id
                                      ? <><RefreshCw className="h-3 w-3 animate-spin" /> Verificando...</>
                                      : sol.estado_sat === 3
                                        ? <><Download className="h-3 w-3" /> Importar</>
                                        : <><Clock className="h-3 w-3" /> Verificar estado</>
                                    }
                                  </Button>
                                )}
                                {(sol.estado_sat === 4 || sol.estado_sat === 5 || sol.estado_sat === 6) && (
                                  <span className="font-mono text-[10px] text-gray-600 flex items-center gap-1">
                                    <Ban className="h-3 w-3" /> {est.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
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
