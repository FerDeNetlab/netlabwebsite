'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface EstadoCuenta {
  id: string
  banco: string
  numero_cuenta: string
  periodo_inicio: string
  periodo_fin: string
  saldo_inicial: number
  saldo_final: number
  total_cargos: number
  total_abonos: number
  archivo_nombre: string
  total_movimientos: number
  conciliados: number
  pendientes: number
}

interface Movimiento {
  id: string
  fecha_operacion: string
  fecha_liquidacion: string
  codigo: string
  descripcion: string
  referencia: string
  cargo: number | null
  abono: number | null
  saldo_operacion: number | null
  conciliado: boolean
  etiqueta: string | null
  categoria: string | null
  notas: string | null
  cfdi_id: string | null
  uuid_sat: string | null
  emisor_rfc: string | null
  receptor_rfc: string | null
  cfdi_total: number | null
  periodo_inicio: string
  periodo_fin: string
  numero_cuenta: string
}

interface CfdCandidato {
  id: string
  uuid_sat: string
  fecha_emision: string
  emisor_rfc: string
  emisor_nombre: string
  receptor_rfc: string
  receptor_nombre: string
  total: number
  tipo_netlab: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number | null) =>
  n == null ? '—' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

const fmtDate = (s: string) => {
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

const CATEGORIAS = [
  { value: 'ingreso',          label: 'Ingreso' },
  { value: 'gasto_operativo',  label: 'Gasto operativo' },
  { value: 'transferencia',    label: 'Transferencia interna' },
  { value: 'impuestos',        label: 'Impuestos / SAT' },
  { value: 'nomina',           label: 'Nómina' },
  { value: 'otro',             label: 'Otro' },
]

// ── Componente principal ──────────────────────────────────────────────────────
export default function ConciliacionClient() {
  const [tab, setTab]           = useState<'estados' | 'movimientos'>('estados')
  const [estados, setEstados]   = useState<EstadoCuenta[]>([])
  const [movimientos, setMov]   = useState<Movimiento[]>([])
  const [selectedEstado, setSel] = useState<string | null>(null)
  const [filtro, setFiltro]     = useState<'todos' | 'pendientes' | 'conciliados'>('todos')
  const [loading, setLoading]   = useState(false)
  const [uploading, setUpload]  = useState(false)
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null)

  // Panel de conciliación
  const [editando, setEditando] = useState<Movimiento | null>(null)
  const [candidatos, setCandidatos] = useState<CfdCandidato[]>([])
  const [loadCand, setLoadCand] = useState(false)
  const [etiqueta, setEtiqueta] = useState('')
  const [categoria, setCategoria] = useState('')
  const [notas, setNotas]       = useState('')

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
    if (estadoId)       params.set('estadoId',  estadoId)
    if (f === 'pendientes')  params.set('conciliado', 'false')
    if (f === 'conciliados') params.set('conciliado', 'true')
    const r = await fetch(`/api/finanzas/conciliacion?${params}`)
    const d = await r.json()
    setMov(d.movimientos ?? [])
    setLoading(false)
  }, [])

  // Auto-load on tab switch
  const didLoad = useRef({ estados: false, movimientos: false })
  const onTab = (t: typeof tab) => {
    setTab(t)
    if (t === 'estados' && !didLoad.current.estados) {
      didLoad.current.estados = true
      fetchEstados()
    }
    if (t === 'movimientos' && !didLoad.current.movimientos) {
      didLoad.current.movimientos = true
      fetchMovimientos(selectedEstado, filtro)
    }
  }

  // ── Upload ──────────────────────────────────────────────────────────────────
  const onDrop = useCallback(async (accepted: File[]) => {
    if (!accepted[0]) return
    setUpload(true)
    setMsg(null)
    const form = new FormData()
    form.append('pdf', accepted[0])
    const r = await fetch('/api/finanzas/conciliacion/upload', { method: 'POST', body: form })
    const d = await r.json()
    setUpload(false)
    if (r.ok) {
      setMsg({ text: `✓ ${d.movimientosCargados} movimientos cargados (${d.periodoInicio} → ${d.periodoFin})`, ok: true })
      didLoad.current.estados = false  // force reload
      if (tab === 'estados') fetchEstados()
    } else {
      setMsg({ text: d.error ?? 'Error al subir', ok: false })
    }
  }, [tab, fetchEstados])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, disabled: uploading,
  })

  // ── Panel de conciliación ───────────────────────────────────────────────────
  const abrirPanel = async (m: Movimiento) => {
    setEditando(m)
    setEtiqueta(m.etiqueta ?? '')
    setCategoria(m.categoria ?? '')
    setNotas(m.notas ?? '')
    setCandidatos([])

    // Buscar CFDIs candidatos
    setLoadCand(true)
    const tipo = m.cargo ? 'cargo' : 'abono'
    const monto = m.cargo ?? m.abono ?? 0
    const r = await fetch(`/api/finanzas/conciliacion/candidatos?monto=${monto}&fecha=${m.fecha_operacion}&tipo=${tipo}`)
    const d = await r.json()
    setCandidatos(d.candidatos ?? [])
    setLoadCand(false)
  }

  const guardarConciliacion = async (cfdiId?: string | null) => {
    if (!editando) return
    const r = await fetch('/api/finanzas/conciliacion', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id:         editando.id,
        cfdi_id:    cfdiId !== undefined ? cfdiId : editando.cfdi_id,
        etiqueta:   etiqueta  || null,
        categoria:  categoria || null,
        notas:      notas     || null,
        conciliado: true,
      }),
    })
    if (r.ok) {
      setMov(prev => prev.map(m => m.id === editando.id
        ? { ...m, conciliado: true, etiqueta: etiqueta || null, categoria: categoria || null, notas: notas || null, cfdi_id: cfdiId ?? m.cfdi_id }
        : m
      ))
      setEditando(null)
    }
  }

  const desmarcarConciliado = async (id: string) => {
    await fetch('/api/finanzas/conciliacion', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, conciliado: false }),
    })
    setMov(prev => prev.map(m => m.id === id ? { ...m, conciliado: false } : m))
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Conciliación Bancaria</h1>
            <p className="text-gray-400 text-sm mt-1">BBVA Maestra Pyme · Cuenta 0125537991</p>
          </div>
        </div>

        {/* Upload zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 mb-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-900/20' : 'border-gray-700 hover:border-gray-500'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-400">
            {uploading ? 'Procesando PDF...' : isDragActive
              ? 'Suelta el PDF aquí'
              : '📄 Arrastra aquí un estado de cuenta BBVA (.pdf) o haz clic para seleccionar'}
          </p>
        </div>
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.ok ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
          {(['estados', 'movimientos'] as const).map(t => (
            <button
              key={t}
              onClick={() => onTab(t)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tab === t ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'estados' ? '📋 Estados de Cuenta' : '💳 Movimientos'}
            </button>
          ))}
        </div>

        {/* ── Tab: Estados ──────────────────────────────────────────────── */}
        {tab === 'estados' && (
          <div>
            <button
              onClick={fetchEstados}
              className="mb-4 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              ↺ Actualizar
            </button>
            {loading ? (
              <p className="text-gray-400">Cargando...</p>
            ) : estados.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Sube un estado de cuenta para comenzar</p>
            ) : (
              <div className="space-y-3">
                {estados.map(e => (
                  <div key={e.id} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{fmtDate(e.periodo_inicio)} → {fmtDate(e.periodo_fin)}</span>
                        <span className="text-xs text-gray-500">{e.archivo_nombre}</span>
                      </div>
                      <div className="flex gap-6 mt-2 text-sm text-gray-400">
                        <span>Cargos: <span className="text-red-400">{fmt(e.total_cargos)}</span></span>
                        <span>Abonos: <span className="text-green-400">{fmt(e.total_abonos)}</span></span>
                        <span>Movimientos: {e.total_movimientos}</span>
                        <span className="text-yellow-400">{e.pendientes} pendientes</span>
                        <span className="text-green-400">{e.conciliados} conciliados</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSel(e.id)
                        setTab('movimientos')
                        didLoad.current.movimientos = true
                        fetchMovimientos(e.id, filtro)
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm whitespace-nowrap"
                    >
                      Ver movimientos →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Movimientos ──────────────────────────────────────────── */}
        {tab === 'movimientos' && (
          <div>
            {/* Filtros */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(['todos', 'pendientes', 'conciliados'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => { setFiltro(f); fetchMovimientos(selectedEstado, f) }}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    filtro === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {f === 'todos' ? 'Todos' : f === 'pendientes' ? '⚠ Pendientes' : '✓ Conciliados'}
                </button>
              ))}
              <button
                onClick={() => fetchMovimientos(selectedEstado, filtro)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm ml-auto"
              >
                ↺ Actualizar
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400">Cargando...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800 text-left">
                      <th className="pb-2 pr-4">Fecha</th>
                      <th className="pb-2 pr-4">Descripción</th>
                      <th className="pb-2 pr-4 text-right">Cargo</th>
                      <th className="pb-2 pr-4 text-right">Abono</th>
                      <th className="pb-2 pr-4">Etiqueta / CFDI</th>
                      <th className="pb-2">Estado</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {movimientos.map(m => (
                      <tr key={m.id} className={`hover:bg-gray-900/50 ${m.conciliado ? 'opacity-60' : ''}`}>
                        <td className="py-2 pr-4 text-gray-400 whitespace-nowrap">{fmtDate(m.fecha_operacion)}</td>
                        <td className="py-2 pr-4 max-w-xs">
                          <div className="font-medium truncate">{m.descripcion}</div>
                          {m.referencia && (
                            <div className="text-xs text-gray-500 truncate">{m.referencia.split(' | ')[0]}</div>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-right text-red-400 whitespace-nowrap">
                          {m.cargo != null ? fmt(m.cargo) : ''}
                        </td>
                        <td className="py-2 pr-4 text-right text-green-400 whitespace-nowrap">
                          {m.abono != null ? fmt(m.abono) : ''}
                        </td>
                        <td className="py-2 pr-4 text-xs max-w-[160px]">
                          {m.cfdi_id ? (
                            <span className="text-blue-400 font-mono truncate block">
                              CFDI {m.uuid_sat?.substring(0, 8)}…
                            </span>
                          ) : m.etiqueta ? (
                            <span className="text-yellow-300">{m.etiqueta}</span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          {m.conciliado ? (
                            <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full">✓</span>
                          ) : (
                            <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full">pendiente</span>
                          )}
                        </td>
                        <td className="py-2 text-right whitespace-nowrap">
                          {m.conciliado ? (
                            <button
                              onClick={() => desmarcarConciliado(m.id)}
                              className="text-xs text-gray-500 hover:text-gray-300"
                            >
                              desmarcar
                            </button>
                          ) : (
                            <button
                              onClick={() => abrirPanel(m)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                            >
                              Conciliar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {movimientos.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No hay movimientos para mostrar</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Panel lateral: Conciliación ────────────────────────────────── */}
        {editando && (
          <div className="fixed inset-0 bg-black/70 flex justify-end z-50" onClick={() => setEditando(null)}>
            <div
              className="w-full max-w-lg bg-gray-950 border-l border-gray-800 h-full overflow-y-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Conciliar movimiento</h2>
                <button onClick={() => setEditando(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
              </div>

              {/* Resumen del movimiento */}
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <div className="font-medium">{editando.descripcion}</div>
                <div className="text-sm text-gray-400 mt-1">{fmtDate(editando.fecha_operacion)}</div>
                {editando.referencia && (
                  <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{editando.referencia.replace(/ \| /g, '\n')}</div>
                )}
                <div className="mt-3 text-xl font-bold">
                  {editando.cargo != null
                    ? <span className="text-red-400">− {fmt(editando.cargo)}</span>
                    : <span className="text-green-400">+ {fmt(editando.abono)}</span>
                  }
                </div>
              </div>

              {/* CFDIs candidatos */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">CFDIs con monto similar</h3>
                {loadCand ? (
                  <p className="text-gray-500 text-sm">Buscando...</p>
                ) : candidatos.length === 0 ? (
                  <p className="text-gray-500 text-sm">No se encontraron CFDIs con monto similar (±5%, ±30 días)</p>
                ) : (
                  <div className="space-y-2">
                    {candidatos.map(c => (
                      <div key={c.id} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-mono text-gray-400 truncate">{c.uuid_sat.substring(0, 16)}…</div>
                          <div className="text-sm truncate">{c.emisor_nombre ?? c.emisor_rfc}</div>
                          <div className="text-xs text-gray-500">{fmtDate(c.fecha_emision)} · {c.tipo_netlab}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-semibold">{fmt(c.total)}</div>
                          <button
                            onClick={() => guardarConciliacion(c.id)}
                            className="mt-1 px-2 py-0.5 bg-green-700 hover:bg-green-600 rounded text-xs"
                          >
                            Ligar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Etiqueta manual */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Etiqueta</label>
                  <input
                    value={etiqueta}
                    onChange={e => setEtiqueta(e.target.value)}
                    placeholder="ej. Nómina Edgar, Renta oficina..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">— Sin categoría —</option>
                    {CATEGORIAS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Notas</label>
                  <textarea
                    value={notas}
                    onChange={e => setNotas(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => guardarConciliacion(undefined)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                Marcar como conciliado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
