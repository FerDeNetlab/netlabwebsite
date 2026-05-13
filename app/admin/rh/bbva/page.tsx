'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, FileText, CreditCard, CheckCircle2, AlertCircle, Loader2, DollarSign, ChevronLeft, ChevronRight, Save, Calendar } from 'lucide-react'

// ─── Quincena helpers ─────────────────────────────────────────────────────────
const MESES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']
function qKey(year: number, month: number, q: 1 | 2) { return `${year}-${String(month).padStart(2, '0')}-${q}` }
function qLabel(key: string) { const [y, m, q] = key.split('-'); return `${q}ª Quincena ${MESES[parseInt(m) - 1]} ${y}` }
function qFilename(key: string) { const [y, m, q] = key.split('-'); return `NOMINA_${q}Q_${MESES[parseInt(m) - 1]}_${y}.txt` }
function qPrev(key: string) { const [, , q] = key.split('-'); const [y, m] = [parseInt(key.split('-')[0]), parseInt(key.split('-')[1])]; const qi = parseInt(q) as 1 | 2; if (qi === 2) return qKey(y, m, 1); return qKey(m === 1 ? y - 1 : y, m === 1 ? 12 : m - 1, 2) }
function qNext(key: string) { const [, , q] = key.split('-'); const [y, m] = [parseInt(key.split('-')[0]), parseInt(key.split('-')[1])]; const qi = parseInt(q) as 1 | 2; if (qi === 1) return qKey(y, m, 2); return qKey(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1) }
function qCurrent() { const now = new Date(); return qKey(now.getFullYear(), now.getMonth() + 1, now.getDate() <= 15 ? 1 : 2) }
// ──────────────────────────────────────────────────────────────────────────────

interface Empleado {
  id: string
  nombre: string
  curp: string | null
  email: string | null
  telefono: string | null
  numero_tarjeta: string | null
  sucursal_bbva: string | null
  salario_mensual: number | null
  activo: boolean
}

interface NominaEmpleado {
  id: string
  nombre: string
  tarjeta: string
  rfc: string
  importe: number
}

export default function BBVAPage() {
  const { status } = useSession()
  const router = useRouter()
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)

  // Alta state
  const [altaLoading, setAltaLoading] = useState(false)
  const [altaMsg, setAltaMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  // Pago state
  const [quincena, setQuincena] = useState<string>(qCurrent())
  const [nominaGuardada, setNominaGuardada] = useState<boolean>(false)
  const [nominaLoadingQ, setNominaLoadingQ] = useState<boolean>(false)
  const [pagoSeleccionados, setPagoSeleccionados] = useState<Record<string, number>>({})
  const [pagoLoading, setPagoLoading] = useState(false)
  const [guardandoLoading, setGuardandoLoading] = useState(false)
  const [pagoMsg, setPagoMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/rh/empleados')
      .then(r => r.json())
      .then((data: Empleado[]) => {
        setEmpleados(Array.isArray(data) ? data.filter(e => e.activo) : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [status])

  // Load saved nómina when quincena changes
  useEffect(() => {
    if (status !== 'authenticated') return
    setNominaLoadingQ(true)
    setPagoMsg(null)
    fetch(`/api/rh/nominas?quincena=${quincena}`)
      .then(r => r.json())
      .then((data: { empleados: NominaEmpleado[] } | null) => {
        if (data && data.empleados?.length > 0) {
          const sel: Record<string, number> = {}
          data.empleados.forEach(e => { sel[e.id] = e.importe })
          setPagoSeleccionados(sel)
          setNominaGuardada(true)
        } else {
          setPagoSeleccionados({})
          setNominaGuardada(false)
        }
      })
      .catch(() => {})
      .finally(() => setNominaLoadingQ(false))
  }, [quincena, status])

  // Empleados con datos completos para Alta
  const aptoAlta = empleados.filter(e => e.curp && e.email && e.telefono && e.numero_tarjeta && e.sucursal_bbva)
  const faltanDatos = empleados.filter(e => !e.curp || !e.email || !e.telefono || !e.numero_tarjeta || !e.sucursal_bbva)

  const descargarAlta = async () => {
    setAltaLoading(true)
    setAltaMsg(null)
    try {
      const r = await fetch('/api/rh/bbva/alta')
      if (!r.ok) {
        const d = await r.json()
        setAltaMsg({ tipo: 'error', texto: d.error || 'Error al generar el archivo' })
        return
      }
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ALTA_NOMINA_BBVA_${new Date().toISOString().split('T')[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
      setAltaMsg({ tipo: 'ok', texto: `Archivo generado con ${aptoAlta.length} empleado(s). Súbelo al portal BBVA.` })
    } finally {
      setAltaLoading(false)
    }
  }

  const togglePago = (id: string, salario: number | null) => {
    setPagoSeleccionados(prev => {
      const next = { ...prev }
      if (next[id] !== undefined) {
        delete next[id]
      } else {
        next[id] = salario || 0
      }
      return next
    })
    setNominaGuardada(false)
  }

  const setImporte = (id: string, val: string) => {
    const n = parseFloat(val.replace(/[^0-9.]/g, '')) || 0
    setPagoSeleccionados(prev => ({ ...prev, [id]: n }))
    setNominaGuardada(false)
  }

  const totalPago = Object.values(pagoSeleccionados).reduce((s, v) => s + v, 0)
  const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  const empConTarjeta = empleados.filter(e => e.numero_tarjeta)

  const guardarNomina = async () => {
    const lista = Object.entries(pagoSeleccionados).map(([id, importe]) => {
      const emp = empleados.find(e => e.id === id)
      return { id, nombre: emp?.nombre || '', tarjeta: emp?.numero_tarjeta || '', rfc: '', importe }
    })
    if (lista.length === 0) {
      setPagoMsg({ tipo: 'error', texto: 'Selecciona al menos un empleado' })
      return
    }
    setGuardandoLoading(true)
    setPagoMsg(null)
    try {
      const r = await fetch('/api/rh/nominas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quincena, total: totalPago, empleados: lista }),
      })
      if (!r.ok) {
        const d = await r.json()
        setPagoMsg({ tipo: 'error', texto: d.error || 'Error al guardar' })
        return
      }
      setNominaGuardada(true)
      setPagoMsg({ tipo: 'ok', texto: `Nómina guardada — ${lista.length} empleado(s), ${fmt(totalPago)} total. Ya puedes descargar el archivo.` })
    } finally {
      setGuardandoLoading(false)
    }
  }

  const descargarPago = async () => {
    const lista = Object.entries(pagoSeleccionados).map(([id, importe]) => ({ id, importe }))
    if (lista.length === 0) {
      setPagoMsg({ tipo: 'error', texto: 'Selecciona al menos un empleado' })
      return
    }
    setPagoLoading(true)
    setPagoMsg(null)
    try {
      const r = await fetch('/api/rh/bbva/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empleados: lista }),
      })
      if (!r.ok) {
        const d = await r.json()
        setPagoMsg({ tipo: 'error', texto: d.error || 'Error al generar el archivo' })
        return
      }
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = qFilename(quincena)
      a.click()
      URL.revokeObjectURL(url)
      setPagoMsg({ tipo: 'ok', texto: `Archivo ${qFilename(quincena)} generado. Súbelo al portal BBVA.` })
    } finally {
      setPagoLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/rh')} className="text-slate-400 hover:text-white gap-2">
            <ArrowLeft className="w-4 h-4" /> RH
          </Button>
          <div>
            <h1 className="text-2xl text-green-400 font-bold">Nómina BBVA</h1>
            <p className="text-xs text-slate-500">Generación de archivos para el portal BBVA</p>
          </div>
        </div>

        {/* ═══ MÓDULO 1: ALTA ═══ */}
        <TerminalFrame>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Módulo 1</div>
                <h2 className="text-lg font-bold text-white">Alta de Empleados BBVA</h2>
                <p className="text-xs text-slate-400">Genera el archivo .txt para dar de alta las cuentas de nómina en el portal BBVA</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded">
                <div className="text-xs text-green-400 font-bold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Listos para alta ({aptoAlta.length})
                </div>
                {aptoAlta.length === 0 ? (
                  <p className="text-xs text-slate-500">Ningún empleado tiene todos los datos completos</p>
                ) : (
                  <ul className="space-y-1">
                    {aptoAlta.map(e => (
                      <li key={e.id} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                        <span>{e.nombre}</span>
                        <span className="text-slate-600">{e.numero_tarjeta}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {faltanDatos.length > 0 && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded">
                  <div className="text-xs text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" /> Faltan datos ({faltanDatos.length})
                  </div>
                  <ul className="space-y-1">
                    {faltanDatos.map(e => {
                      const faltantes = []
                      if (!e.curp) faltantes.push('CURP')
                      if (!e.email) faltantes.push('email')
                      if (!e.telefono) faltantes.push('teléfono')
                      if (!e.numero_tarjeta) faltantes.push('tarjeta')
                      if (!e.sucursal_bbva) faltantes.push('sucursal')
                      return (
                        <li key={e.id} className="text-xs text-slate-400">
                          <span className="text-slate-300">{e.nombre}</span>
                          <span className="text-amber-600 ml-2">— falta: {faltantes.join(', ')}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <button
                    onClick={() => router.push('/admin/rh')}
                    className="mt-3 text-[10px] text-amber-400 underline"
                  >
                    Completar datos →
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded text-xs text-slate-500 space-y-1">
              <p><span className="text-slate-400">Formato:</span> Archivo .txt con 110 caracteres por empleado (layout BBVA)</p>
              <p><span className="text-slate-400">Campos:</span> Tipo (02) + CURP + Email + Teléfono + Tarjeta + Sucursal</p>
              <p><span className="text-slate-400">Siguiente paso:</span> Sube el archivo al portal BBVA → Nómina → Alta de empleados</p>
            </div>

            {altaMsg && (
              <div className={`p-3 rounded text-xs flex items-start gap-2 ${altaMsg.tipo === 'ok' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {altaMsg.tipo === 'ok' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                {altaMsg.texto}
              </div>
            )}

            <Button
              onClick={descargarAlta}
              disabled={altaLoading || aptoAlta.length === 0}
              className="bg-blue-600 hover:bg-blue-500 text-white gap-2 disabled:opacity-50"
            >
              {altaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Descargar archivo de Alta ({aptoAlta.length} empleados)
            </Button>
          </div>
        </TerminalFrame>

        {/* ═══ MÓDULO 2: PAGO ═══ */}
        <TerminalFrame>
          <div className="space-y-6">

            {/* Header + quincena selector */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">Módulo 2</div>
                  <h2 className="text-lg font-bold text-white">Dispersión de Nómina</h2>
                  <p className="text-xs text-slate-400">Genera el .txt para programar el pago en el portal BBVA</p>
                </div>
              </div>

              {/* Quincena navigator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuincena(qPrev(quincena))}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded min-w-[210px] justify-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="text-xs text-white">{qLabel(quincena)}</span>
                  {nominaGuardada && (
                    <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 rounded px-1.5 py-0.5 flex-shrink-0">guardada</span>
                  )}
                  {nominaLoadingQ && <Loader2 className="w-3 h-3 text-slate-500 animate-spin flex-shrink-0" />}
                </div>
                <button
                  onClick={() => setQuincena(qNext(quincena))}
                  className="w-7 h-7 flex items-center justify-center rounded border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setQuincena(qCurrent())}
                  className="text-[10px] text-slate-500 hover:text-green-400 underline"
                >
                  Actual
                </button>
              </div>
            </div>

            {/* Employees table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-800 px-2">
                <div className="col-span-1"></div>
                <div className="col-span-5">Empleado</div>
                <div className="col-span-3">Tarjeta</div>
                <div className="col-span-3">Importe</div>
              </div>

              {empConTarjeta.map(e => {
                const sel = pagoSeleccionados[e.id] !== undefined
                return (
                  <div
                    key={e.id}
                    className={`grid grid-cols-12 gap-2 items-center p-2 rounded border transition-colors ${sel ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={sel}
                        onChange={() => togglePago(e.id, e.salario_mensual)}
                        className="w-4 h-4 accent-green-500 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-5">
                      <div className="text-sm text-white">{e.nombre}</div>
                      {e.salario_mensual && (
                        <div className="text-[10px] text-slate-500">Salario: {fmt(e.salario_mensual)}</div>
                      )}
                    </div>
                    <div className="col-span-3 text-xs text-slate-400 font-mono truncate">
                      {e.numero_tarjeta}
                    </div>
                    <div className="col-span-3">
                      {sel ? (
                        <input
                          type="number"
                          value={pagoSeleccionados[e.id] || ''}
                          onChange={ev => setImporte(e.id, ev.target.value)}
                          placeholder="0.00"
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-green-500"
                        />
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </div>
                  </div>
                )
              })}

              {empConTarjeta.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">
                  Ningún empleado tiene número de tarjeta.{' '}
                  <button onClick={() => router.push('/admin/rh')} className="text-green-400 underline">Agregar →</button>
                </p>
              )}
            </div>

            {/* Total bar */}
            {Object.keys(pagoSeleccionados).length > 0 && (
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded flex items-center justify-between flex-wrap gap-4">
                <div className="text-xs text-slate-400">
                  <span className="text-white font-bold">{Object.keys(pagoSeleccionados).length}</span> empleados seleccionados
                </div>
                <div className="text-sm font-bold text-green-400">
                  Total: {fmt(totalPago)}
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded text-xs text-slate-500 space-y-1">
              <p><span className="text-slate-400">Archivo:</span> {qFilename(quincena)}</p>
              <p><span className="text-slate-400">Formato:</span> Layout fijo BBVA — consecutivo / RFC / tipo 99 / cuenta / importe / nombre</p>
              <p><span className="text-slate-400">Flujo:</span> Guarda la nómina → descarga el .txt → súbelo al portal BBVA → Dispersión de nómina</p>
            </div>

            {pagoMsg && (
              <div className={`p-3 rounded text-xs flex items-start gap-2 ${pagoMsg.tipo === 'ok' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {pagoMsg.tipo === 'ok' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                {pagoMsg.texto}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={guardarNomina}
                disabled={guardandoLoading || Object.keys(pagoSeleccionados).length === 0}
                className="bg-slate-700 hover:bg-slate-600 text-white gap-2 disabled:opacity-50"
              >
                {guardandoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Nómina
              </Button>
              <Button
                onClick={descargarPago}
                disabled={pagoLoading || !nominaGuardada}
                className="bg-green-600 hover:bg-green-500 text-black gap-2 disabled:opacity-50"
              >
                {pagoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Descargar .txt
              </Button>
              {!nominaGuardada && Object.keys(pagoSeleccionados).length > 0 && (
                <span className="text-[10px] text-amber-400">Guarda primero para habilitar la descarga</span>
              )}
            </div>

          </div>
        </TerminalFrame>

      </div>
    </div>
  )
}
