'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, RefreshCw, Upload, CheckCircle2, AlertCircle,
  GitMerge, FileText, Landmark, Receipt, CreditCard, X,
} from 'lucide-react'

interface EstadoCuenta {
  id: string; banco: string; numero_cuenta: string
  periodo_inicio: string; periodo_fin: string
  saldo_inicial: number; saldo_final: number
  total_cargos: number; total_abonos: number
  archivo_nombre: string; total_movimientos: number
  conciliados: number; pendientes: number
}
interface Movimiento {
  id: string; fecha_operacion: string; fecha_liquidacion: string
  codigo: string; descripcion: string; referencia: string
  cargo: number | null; abono: number | null
  saldo_operacion: number | null; conciliado: boolean
  etiqueta: string | null; categoria: string | null
  notas: string | null; cfdi_id: string | null
  factura_id: string | null; gasto_id: string | null
  uuid_sat: string | null; emisor_rfc: string | null
  receptor_rfc: string | null; cfdi_total: number | null
  numero_factura: string | null; factura_concepto: string | null
  factura_total: number | null; factura_estado: string | null
  factura_cliente: string | null
  gasto_concepto: string | null; gasto_monto: number | null
  gasto_proveedor: string | null
  periodo_inicio: string; periodo_fin: string; numero_cuenta: string
}
interface Candidato { id: string; uuid_sat: string; fecha_emision: string; emisor_rfc: string; emisor_nombre: string; receptor_rfc: string; receptor_nombre: string; total: number; tipo_netlab: string }
interface FacturaCandidato { id: string; numero_factura: string; concepto: string; total: number; fecha_referencia: string; estado: string; cliente_nombre: string; tipo_candidato: 'factura' }
interface GastoCandidato { id: string; concepto: string; total: number; fecha_referencia: string; cliente_nombre: string; estado: string; tipo_candidato: 'gasto' }

const fmt = (n: number | null) => n == null ? '—' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
const fmtDate = (s: string) => { if (!s) return ''; const [, m, d] = s.split('-'); const y = s.split('-')[0]; return `${d}/${m}/${y}` }
const inputCls = 'w-full px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50'
const labelCls = 'block text-xs font-mono text-gray-400 mb-1'

const CATEGORIAS = [
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'gasto_operativo', label: 'Gasto operativo' },
  { value: 'transferencia', label: 'Transferencia interna' },
  { value: 'impuestos', label: 'Impuestos / SAT' },
  { value: 'nomina', label: 'Nómina' },
  { value: 'otro', label: 'Otro' },
]

export default function ConciliacionClient() {
  const router = useRouter()
  const [tab, setTab]             = useState<'estados' | 'movimientos'>('estados')
  const [estados, setEstados]     = useState<EstadoCuenta[]>([])
  const [movimientos, setMov]     = useState<Movimiento[]>([])
  const [selectedEstado, setSel]  = useState<string | null>(null)
  const [filtro, setFiltro]       = useState<'todos' | 'pendientes' | 'conciliados'>('todos')
  const [loading, setLoading]     = useState(false)
  const [uploading, setUpload]    = useState(false)
  const [msg, setMsg]             = useState<{ text: string; ok: boolean } | null>(null)
  const [editando, setEditando]   = useState<Movimiento | null>(null)
  const [cfdiCands, setCfdiCands] = useState<Candidato[]>([])
  const [facturaCands, setFacturaCands] = useState<FacturaCandidato[]>([])
  const [gastoCands, setGastoCands]     = useState<GastoCandidato[]>([])
  const [loadCand, setLoadCand]   = useState(false)
  const [etiqueta, setEtiqueta]   = useState('')
  const [categoria, setCategoria] = useState('')
  const [notas, setNotas]         = useState('')
  const didLoad = useRef({ estados: false, movimientos: false })

  const fetchEstados = useCallback(async () => {
    setLoading(true)
    const r = await fetch('/api/finanzas/conciliacion?view=estados')
    const d = await r.json()
    setEstados(d.estados ?? [])
    setLoading(false)
  }, [])

  const fetchMovimientos = useCallback(async (estadoId: string | null, f: typeof filtro) => {
    setLoading(true)
    const params = new URLSearchParams({ view: 'movimientos' })
    if (estadoId) params.set('estadoId', estadoId)
    if (f === 'pendientes')  params.set('conciliado', 'false')
    if (f === 'conciliados') params.set('conciliado', 'true')
    const r = await fetch(`/api/finanzas/conciliacion?${params}`)
    const d = await r.json()
    setMov(d.movimientos ?? [])
    setLoading(false)
  }, [])

  const onTab = (t: typeof tab) => {
    setTab(t)
    if (t === 'estados' && !didLoad.current.estados) { didLoad.current.estados = true; fetchEstados() }
    if (t === 'movimientos' && !didLoad.current.movimientos) { didLoad.current.movimientos = true; fetchMovimientos(selectedEstado, filtro) }
  }

  const onDrop = useCallback(async (accepted: File[]) => {
    if (!accepted[0]) return
    setUpload(true); setMsg(null)
    const form = new FormData()
    form.append('pdf', accepted[0])
    try {
      const r = await fetch('/api/finanzas/conciliacion/upload', { method: 'POST', body: form })
      const d = await r.json()
      if (r.ok) {
        setMsg({ text: `✓ ${d.movimientosCargados} movimientos importados (${d.periodoInicio} → ${d.periodoFin})`, ok: true })
        didLoad.current.estados = false
        if (tab === 'estados') fetchEstados()
      } else {
        setMsg({ text: d.error ?? 'Error al subir', ok: false })
      }
    } catch {
      setMsg({ text: 'Error de red al subir el PDF', ok: false })
    } finally {
      setUpload(false)
    }
  }, [tab, fetchEstados])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, disabled: uploading,
  })

  const abrirPanel = async (m: Movimiento) => {
    setEditando(m); setEtiqueta(m.etiqueta ?? ''); setCategoria(m.categoria ?? ''); setNotas(m.notas ?? '')
    setCfdiCands([]); setFacturaCands([]); setGastoCands([])
    setLoadCand(true)
    const tipo = m.cargo ? 'cargo' : 'abono'
    const monto = m.cargo ?? m.abono ?? 0
    const r = await fetch(`/api/finanzas/conciliacion/candidatos?monto=${monto}&fecha=${m.fecha_operacion}&tipo=${tipo}`)
    const d = await r.json()
    setCfdiCands(d.candidatos ?? [])
    setFacturaCands(d.facturas ?? [])
    setGastoCands(d.gastos ?? [])
    setLoadCand(false)
  }

  const guardar = async (opts: { cfdi_id?: string | null; factura_id?: string | null; gasto_id?: string | null }) => {
    if (!editando) return
    const r = await fetch('/api/finanzas/conciliacion', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editando.id, ...opts, etiqueta: etiqueta || null, categoria: categoria || null, notas: notas || null, conciliado: true }),
    })
    if (r.ok) {
      setMov(prev => prev.map(m => m.id === editando.id ? { ...m, conciliado: true, ...opts, etiqueta: etiqueta || null } : m))
      setEditando(null)
    }
  }

  const desmarcar = async (id: string) => {
    await fetch('/api/finanzas/conciliacion', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, conciliado: false }) })
    setMov(prev => prev.map(m => m.id === id ? { ...m, conciliado: false } : m))
  }

  const badgeMovimiento = (m: Movimiento) => {
    const tiene = [m.cfdi_id, m.factura_id, m.gasto_id].filter(Boolean).length
    if (!m.conciliado) return <span className="font-mono text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded">pendiente</span>
    if (tiene === 0)  return <span className="font-mono text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded">✓ manual</span>
    return <span className="font-mono text-[10px] bg-green-500/20 text-green-300 border border-green-500/40 px-1.5 py-0.5 rounded">✓ ligado</span>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <TerminalFrame title="root@netlab:~/finanzas/conciliacion" borderColor="green">
            <div className="space-y-5">

              <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                <div>
                  <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-1 -ml-2">
                    <ArrowLeft className="h-4 w-4" /> Finanzas
                  </Button>
                  <h1 className="text-2xl font-mono text-green-400 flex items-center gap-2">
                    <GitMerge className="h-5 w-5" /> Conciliación Bancaria
                  </h1>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">BBVA Maestra Pyme · Ligado de movimientos con CFDIs, facturas y gastos</p>
                </div>
              </div>

              <div
                {...getRootProps()}
                className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-all font-mono text-sm ${
                  isDragActive ? 'border-green-400 bg-green-500/10 text-green-300' : 'border-green-500/30 hover:border-green-500/50 text-gray-400 hover:text-gray-300'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                <Upload className="h-5 w-5 mx-auto mb-2 opacity-60" />
                {uploading
                  ? <><span className="text-green-400 animate-pulse">$ procesando con Claude AI</span><span className="text-gray-600 block text-xs mt-1">esto puede tardar 15-30 segundos...</span></>
                  : isDragActive ? '$ soltar PDF aquí'
                  : '$ arrastra o selecciona un PDF de estado de cuenta BBVA'}
              </div>

              {msg && (
                <div className={`px-4 py-2 rounded border font-mono text-xs flex items-center gap-2 ${
                  msg.ok ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  {msg.ok ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                  {msg.text}
                </div>
              )}

              <div className="flex gap-1 border-b border-green-500/20">
                {(['estados', 'movimientos'] as const).map(t => (
                  <button key={t} onClick={() => onTab(t)}
                    className={`px-4 py-2 font-mono text-xs transition-colors border-b-2 -mb-px ${
                      tab === t ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {t === 'estados' ? '$ estados_cuenta' : '$ movimientos'}
                  </button>
                ))}
              </div>

              {tab === 'estados' && (
                <div className="space-y-3">
                  <Button onClick={fetchEstados} variant="ghost" size="sm" className="font-mono text-xs gap-1 text-gray-400 hover:text-green-400">
                    <RefreshCw className="h-3 w-3" /> actualizar
                  </Button>
                  {loading ? <p className="text-gray-500 font-mono text-xs">cargando...</p>
                  : estados.length === 0 ? (
                    <div className="text-center py-12 font-mono text-gray-600 text-sm">
                      <Landmark className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      sube un estado de cuenta BBVA para comenzar
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {estados.map(e => (
                        <div key={e.id} className="bg-zinc-900/60 border border-green-500/10 hover:border-green-500/30 rounded-lg p-4 flex items-center justify-between gap-4 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 font-mono text-sm">
                              <span className="text-white">{fmtDate(e.periodo_inicio)} <span className="text-gray-600">→</span> {fmtDate(e.periodo_fin)}</span>
                              <span className="text-[10px] text-gray-600 truncate">{e.archivo_nombre}</span>
                            </div>
                            <div className="flex gap-5 mt-2 font-mono text-xs text-gray-500">
                              <span>cargos: <span className="text-red-400">{fmt(e.total_cargos)}</span></span>
                              <span>abonos: <span className="text-green-400">{fmt(e.total_abonos)}</span></span>
                              <span>movs: <span className="text-gray-300">{e.total_movimientos}</span></span>
                              <span className="text-yellow-400">{e.pendientes} pendientes</span>
                              <span className="text-green-400">{e.conciliados} conciliados</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="font-mono text-xs shrink-0"
                            onClick={() => { setSel(e.id); setTab('movimientos'); didLoad.current.movimientos = true; fetchMovimientos(e.id, filtro) }}
                          >
                            ver movimientos →
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'movimientos' && (
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap items-center">
                    {(['todos', 'pendientes', 'conciliados'] as const).map(f => (
                      <button key={f} onClick={() => { setFiltro(f); fetchMovimientos(selectedEstado, f) }}
                        className={`px-3 py-1 font-mono text-xs rounded border transition-colors ${
                          filtro === f ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'border-green-500/10 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {f === 'todos' ? 'todos' : f === 'pendientes' ? '⚠ pendientes' : '✓ conciliados'}
                      </button>
                    ))}
                    <Button onClick={() => fetchMovimientos(selectedEstado, filtro)} variant="ghost" size="sm" className="font-mono text-xs gap-1 text-gray-400 hover:text-green-400 ml-auto">
                      <RefreshCw className="h-3 w-3" /> actualizar
                    </Button>
                  </div>

                  {loading ? <p className="text-gray-500 font-mono text-xs">cargando...</p> : (
                    <div className="overflow-x-auto">
                      <table className="w-full font-mono text-xs">
                        <thead>
                          <tr className="text-gray-600 border-b border-green-500/10 text-left">
                            <th className="pb-2 pr-4 font-normal">fecha</th>
                            <th className="pb-2 pr-4 font-normal">descripción</th>
                            <th className="pb-2 pr-4 text-right font-normal">cargo</th>
                            <th className="pb-2 pr-4 text-right font-normal">abono</th>
                            <th className="pb-2 pr-4 font-normal">ligado a</th>
                            <th className="pb-2 font-normal">estado</th>
                            <th className="pb-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-green-500/5">
                          {movimientos.map(m => (
                            <tr key={m.id} className={`hover:bg-green-500/5 transition-colors ${m.conciliado ? 'opacity-50' : ''}`}>
                              <td className="py-2 pr-4 text-gray-400 whitespace-nowrap">{fmtDate(m.fecha_operacion)}</td>
                              <td className="py-2 pr-4 max-w-[220px]">
                                <div className="text-gray-200 truncate">{m.descripcion}</div>
                                {m.referencia && <div className="text-gray-600 truncate">{m.referencia.split(' | ')[0]}</div>}
                              </td>
                              <td className="py-2 pr-4 text-right text-red-400 whitespace-nowrap">{m.cargo != null ? fmt(m.cargo) : ''}</td>
                              <td className="py-2 pr-4 text-right text-green-400 whitespace-nowrap">{m.abono != null ? fmt(m.abono) : ''}</td>
                              <td className="py-2 pr-4 max-w-[160px]">
                                {m.factura_id ? (
                                  <span className="text-blue-400 flex items-center gap-1"><Receipt className="h-3 w-3" />{m.numero_factura ?? 'Factura'}</span>
                                ) : m.gasto_id ? (
                                  <span className="text-orange-400 flex items-center gap-1"><CreditCard className="h-3 w-3" />{m.gasto_concepto?.slice(0, 16) ?? 'Gasto'}</span>
                                ) : m.cfdi_id ? (
                                  <span className="text-purple-400 flex items-center gap-1"><FileText className="h-3 w-3" />CFDI {m.uuid_sat?.substring(0, 8)}…</span>
                                ) : m.etiqueta ? (
                                  <span className="text-yellow-300">{m.etiqueta}</span>
                                ) : <span className="text-gray-700">—</span>}
                              </td>
                              <td className="py-2 pr-4">{badgeMovimiento(m)}</td>
                              <td className="py-2 text-right whitespace-nowrap">
                                {m.conciliado ? (
                                  <button onClick={() => desmarcar(m.id)} className="text-gray-600 hover:text-gray-400 transition-colors">desmarcar</button>
                                ) : (
                                  <button onClick={() => abrirPanel(m)} className="text-green-500 hover:text-green-300 transition-colors">conciliar →</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {movimientos.length === 0 && (
                        <div className="text-center py-12 font-mono text-gray-600 text-sm">no hay movimientos</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TerminalFrame>
        </motion.div>
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50" onClick={() => setEditando(null)}>
          <motion.div
            initial={{ x: 400 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-[#0a0a0a] border-l border-green-500/20 h-full overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-green-500/20 pb-3">
                <h2 className="font-mono text-sm text-green-400 flex items-center gap-2">
                  <GitMerge className="h-4 w-4" /> conciliar movimiento
                </h2>
                <button onClick={() => setEditando(null)} className="text-gray-600 hover:text-gray-300"><X className="h-4 w-4" /></button>
              </div>

              <div className="bg-zinc-900/60 border border-green-500/10 rounded-lg p-4 font-mono">
                <div className="text-white text-sm">{editando.descripcion}</div>
                <div className="text-gray-500 text-xs mt-1">{fmtDate(editando.fecha_operacion)}</div>
                {editando.referencia && (
                  <div className="text-gray-600 text-[10px] mt-1 whitespace-pre-wrap">{editando.referencia.replace(/ \| /g, '\n')}</div>
                )}
                <div className="mt-3 text-lg font-bold">
                  {editando.cargo != null
                    ? <span className="text-red-400">− {fmt(editando.cargo)}</span>
                    : <span className="text-green-400">+ {fmt(editando.abono)}</span>
                  }
                </div>
              </div>

              {loadCand ? (
                <p className="text-gray-600 font-mono text-xs">buscando candidatos...</p>
              ) : (
                <div className="space-y-4">
                  {facturaCands.length > 0 && (
                    <div>
                      <p className="font-mono text-xs text-gray-500 mb-2 flex items-center gap-1"><Receipt className="h-3 w-3" /> facturas pendientes similares</p>
                      <div className="space-y-1.5">
                        {facturaCands.map(f => (
                          <div key={f.id} className="bg-zinc-900/60 border border-blue-500/20 rounded p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="font-mono text-xs text-blue-300">{f.numero_factura}</div>
                              <div className="text-gray-300 text-xs truncate">{f.cliente_nombre}</div>
                              <div className="text-gray-600 text-[10px]">{fmtDate(f.fecha_referencia)}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-mono text-sm text-white">{fmt(f.total)}</div>
                              <button onClick={() => guardar({ factura_id: f.id })}
                                className="mt-1 font-mono text-[10px] bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/40 text-blue-300 px-2 py-0.5 rounded transition-colors">
                                ligar factura
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gastoCands.length > 0 && (
                    <div>
                      <p className="font-mono text-xs text-gray-500 mb-2 flex items-center gap-1"><CreditCard className="h-3 w-3" /> gastos pendientes similares</p>
                      <div className="space-y-1.5">
                        {gastoCands.map(g => (
                          <div key={g.id} className="bg-zinc-900/60 border border-orange-500/20 rounded p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-gray-300 text-xs truncate">{g.concepto}</div>
                              <div className="text-gray-600 text-[10px]">{g.cliente_nombre} · {fmtDate(g.fecha_referencia)}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-mono text-sm text-white">{fmt(g.total)}</div>
                              <button onClick={() => guardar({ gasto_id: g.id })}
                                className="mt-1 font-mono text-[10px] bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/40 text-orange-300 px-2 py-0.5 rounded transition-colors">
                                ligar gasto
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cfdiCands.length > 0 && (
                    <div>
                      <p className="font-mono text-xs text-gray-500 mb-2 flex items-center gap-1"><FileText className="h-3 w-3" /> CFDIs con monto similar</p>
                      <div className="space-y-1.5">
                        {cfdiCands.map(c => (
                          <div key={c.id} className="bg-zinc-900/60 border border-purple-500/20 rounded p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="font-mono text-[10px] text-gray-500 truncate">{c.uuid_sat.substring(0, 18)}…</div>
                              <div className="text-gray-300 text-xs truncate">{c.emisor_nombre ?? c.emisor_rfc}</div>
                              <div className="text-gray-600 text-[10px]">{fmtDate(c.fecha_emision)} · {c.tipo_netlab}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-mono text-sm text-white">{fmt(c.total)}</div>
                              <button onClick={() => guardar({ cfdi_id: c.id })}
                                className="mt-1 font-mono text-[10px] bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/40 text-purple-300 px-2 py-0.5 rounded transition-colors">
                                ligar CFDI
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {facturaCands.length === 0 && gastoCands.length === 0 && cfdiCands.length === 0 && (
                    <p className="font-mono text-xs text-gray-600">no se encontraron candidatos (±10%, ±45 días)</p>
                  )}
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-green-500/10">
                <div>
                  <label className={labelCls}>etiqueta manual</label>
                  <input value={etiqueta} onChange={e => setEtiqueta(e.target.value)} placeholder="ej. Nómina Edgar, Renta oficina..." className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>categoría</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputCls}>
                    <option value="">— sin categoría —</option>
                    {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>notas</label>
                  <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2} className={inputCls} />
                </div>
              </div>

              <button onClick={() => guardar({})}
                className="w-full py-2.5 font-mono text-sm bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 rounded-lg transition-colors">
                $ marcar como conciliado (manual)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
