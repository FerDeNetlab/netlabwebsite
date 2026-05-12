'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ChevronLeft, ChevronRight, DollarSign, CreditCard, CheckCircle, X, TrendingUp, TrendingDown, Undo2, AlertTriangle, FileText, Landmark } from 'lucide-react'

interface Movimiento {
    id: string; concepto: string; monto: number; numero_factura?: string;
    cliente_nombre: string; fecha_ideal: string; estado: string;
    tipo_mov: 'ingreso' | 'egreso'; subtipo?: string; categoria?: string;
    fecha_pago?: string; metodo_pago?: string; monto_pagado?: number;
    categoria_nombre?: string; categoria_color?: string;
    fecha_emision?: string; fecha_vencimiento?: string; dias_atraso?: number;
    has_cfdi?: boolean; has_banco?: boolean;
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function MovimientosPage() {
    const { status } = useSession()
    const router = useRouter()
    const [movimientos, setMovimientos] = useState<Movimiento[]>([])
    const [loading, setLoading] = useState(true)
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [cobrandoId, setCobrandoId] = useState<string | null>(null)
    const [pagoForm, setPagoForm] = useState({ monto: '', fecha_pago: new Date().toISOString().split('T')[0], metodo_pago: 'transferencia', notas: '' })
    const [submitting, setSubmitting] = useState(false)
    const [pagoError, setPagoError] = useState<string | null>(null)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchData = () => {
        setLoading(true)
        fetch(`/api/finanzas/movimientos?mes=${mes}&anio=${anio}`)
            .then(r => r.json())
            .then(data => { setMovimientos(data.movimientos || []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { if (status === 'authenticated') fetchData() }, [status, mes, anio])

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1) }

    const openCobrar = (mov: Movimiento) => {
        setCobrandoId(mov.id)
        setPagoForm({ monto: String(mov.monto), fecha_pago: new Date().toISOString().split('T')[0], metodo_pago: 'transferencia', notas: '' })
    }

    const handleCobrar = async (mov: Movimiento) => {
        setSubmitting(true)
        setPagoError(null)
        try {
            const r = await fetch('/api/finanzas/movimientos', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: mov.tipo_mov,
                    id: mov.id,
                    monto: Number(pagoForm.monto),
                    fecha_pago: pagoForm.fecha_pago,
                    metodo_pago: pagoForm.metodo_pago,
                    notas: pagoForm.notas,
                })
            })
            if (r.ok) {
                setCobrandoId(null)
                setPagoError(null)
                fetchData()
            } else {
                const err = await r.json().catch(() => ({}))
                setPagoError(err.error || 'Error al registrar. Intenta de nuevo.')
            }
        } catch {
            setPagoError('Error de conexión. Intenta de nuevo.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancelar = async (mov: Movimiento) => {
        if (!confirm(`¿Cancelar ${mov.tipo_mov === 'ingreso' ? 'cobro' : 'pago'} de ${mov.numero_factura || mov.concepto}?`)) return
        const r = await fetch(`/api/finanzas/movimientos?tipo=${mov.tipo_mov}&id=${mov.id}&mes=${mes}&anio=${anio}`, { method: 'DELETE' })
        if (r.ok) fetchData()
        else alert('Error al cancelar')
    }

    const fmt = (n: number) => `$${Math.abs(Number(n)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
    const inputCls = "w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-green-500 focus:outline-none"

    const ingresos = movimientos.filter(m => m.tipo_mov === 'ingreso')
    const egresos = movimientos.filter(m => m.tipo_mov === 'egreso')
    const ingresosPendientes = ingresos.filter(m => m.estado === 'pendiente')
    const ingresosCobrados = ingresos.filter(m => m.estado === 'cobrado')
    const egresosPendientes = egresos.filter(m => m.estado === 'pendiente')
    const egresosPagados = egresos.filter(m => m.estado === 'pagado')

    const totalPorCobrar = ingresosPendientes.reduce((s, m) => s + Number(m.monto), 0)
    const totalCobrado = ingresosCobrados.reduce((s, m) => s + Number(m.monto_pagado || m.monto), 0)
    const totalPorPagar = egresosPendientes.reduce((s, m) => s + Number(m.monto), 0)
    const totalPagado = egresosPagados.reduce((s, m) => s + Number(m.monto), 0)

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/movimientos">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-emerald-400">Ingresos y Egresos</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Cobranza y pagos del mes</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={prevMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
                                    <span className="font-mono text-white text-lg min-w-[160px] text-center">{MESES[mes - 1]} {anio}</span>
                                    <button onClick={nextMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronRight className="h-5 w-5 text-gray-400" /></button>
                                </div>
                            </div>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-zinc-900/50 border border-green-500/30 rounded-lg p-3">
                                    <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Por Cobrar</div>
                                    <div className="font-mono text-lg text-green-400">{fmt(totalPorCobrar)}</div>
                                    <div className="font-mono text-[10px] text-gray-600">{ingresosPendientes.length} pendientes</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-emerald-500/30 rounded-lg p-3">
                                    <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Cobrado</div>
                                    <div className="font-mono text-lg text-emerald-400">{fmt(totalCobrado)}</div>
                                    <div className="font-mono text-[10px] text-gray-600">{ingresosCobrados.length} cobrados</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg p-3">
                                    <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Por Pagar</div>
                                    <div className="font-mono text-lg text-red-400">{fmt(totalPorPagar)}</div>
                                    <div className="font-mono text-[10px] text-gray-600">{egresosPendientes.length} pendientes</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-orange-500/30 rounded-lg p-3">
                                    <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Pagado</div>
                                    <div className="font-mono text-lg text-orange-400">{fmt(totalPagado)}</div>
                                    <div className="font-mono text-[10px] text-gray-600">{egresosPagados.length} pagados</div>
                                </div>
                            </div>

                            {/* COBRANZA PENDIENTE */}
                            <div className="bg-zinc-900/50 border border-green-500/30 rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-green-500/20 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-400" />
                                    <h3 className="font-mono text-green-400 text-sm">Cobranza — Ingresos del Mes</h3>
                                    <span className="ml-auto font-mono text-xs text-gray-500">{ingresos.length} entradas</span>
                                </div>
                                {ingresos.length > 0 ? (
                                    <div className="divide-y divide-gray-800">
                                        {ingresos.map(m => (
                                            <div key={`i-${m.id}`} className="p-4 hover:bg-zinc-800/30 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono text-sm text-white font-bold">{m.numero_factura || m.concepto}</span>
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${m.subtipo === 'recurrente' ? 'text-cyan-400 bg-cyan-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                                                {m.subtipo === 'recurrente' ? '🔄' : '⚡'}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${m.estado === 'cobrado' ? 'text-emerald-400 bg-emerald-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                                                                {m.estado === 'cobrado' ? '✅ Cobrado' : '⏳ Pendiente'}
                                                            </span>
                                                            {m.estado !== 'cobrado' && m.dias_atraso && m.dias_atraso > 0 ? (
                                                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-red-400 bg-red-400/10">
                                                                    <AlertTriangle className="h-2.5 w-2.5" /> {m.dias_atraso}d atraso
                                                                </span>
                                                            ) : null}
                                                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ${m.has_cfdi ? 'text-blue-400 bg-blue-400/10' : 'text-gray-600 bg-gray-700/20'}`} title={m.has_cfdi ? 'CFDI ligado' : 'Sin CFDI'}>
                                                                <FileText className="h-2.5 w-2.5" /> {m.has_cfdi ? 'XML' : 'sin XML'}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ${m.has_banco ? 'text-green-400 bg-green-400/10' : 'text-gray-600 bg-gray-700/20'}`} title={m.has_banco ? 'Confirmado en banco' : 'Sin mov. bancario'}>
                                                                <Landmark className="h-2.5 w-2.5" /> {m.has_banco ? 'banco' : 'sin banco'}
                                                            </span>
                                                        </div>
                                                        <div className="font-mono text-xs text-gray-500 mt-0.5 flex flex-wrap gap-2">
                                                            <span>{m.cliente_nombre || 'Sin cliente'}</span>
                                                            {m.concepto && m.numero_factura && <span>· {m.concepto}</span>}
                                                            {m.fecha_emision && <span>· Emitida: {new Date(String(m.fecha_emision).split('T')[0] + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                                            {m.fecha_ideal && <span>· Vence: {new Date(String(m.fecha_ideal).split('T')[0] + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                                        </div>
                                                        {m.estado === 'cobrado' && m.fecha_pago && (
                                                            <div className="font-mono text-[10px] text-emerald-400 mt-0.5">
                                                                Cobrado el {new Date(String(m.fecha_pago).split('T')[0] + 'T12:00:00').toLocaleDateString('es-MX')} • {m.metodo_pago}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-sm text-green-400 font-bold">{fmt(Number(m.monto))}</span>
                                                        {m.estado === 'pendiente' && (
                                                            <Button onClick={() => openCobrar(m)} className="font-mono gap-1 bg-green-600 hover:bg-green-700" size="sm">
                                                                <DollarSign className="h-3 w-3" /> Cobrar
                                                            </Button>
                                                        )}
                                                        {m.estado === 'cobrado' && (
                                                            <Button onClick={() => handleCancelar(m)} variant="ghost" className="font-mono gap-1 text-gray-500 hover:text-red-400" size="sm">
                                                                <Undo2 className="h-3 w-3" /> Cancelar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Inline form — cobro */}
                                                {cobrandoId === m.id && (
                                                    <motion.div
                                                        key={`form-i-${m.id}`}
                                                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                                        className="mt-3 p-4 bg-zinc-900 border border-green-500/30 rounded-lg">
                                                        <p className="font-mono text-[11px] text-green-400 mb-3 flex items-center gap-1">
                                                            <DollarSign className="h-3 w-3" /> Registrar cobro — {m.numero_factura || m.concepto}
                                                        </p>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                            <div>
                                                                <label className="font-mono text-[10px] text-gray-400">Monto cobrado</label>
                                                                <input type="number" value={pagoForm.monto} onChange={e => setPagoForm(f => ({ ...f, monto: e.target.value }))} className={inputCls + ' mt-0.5 text-xs'} />
                                                            </div>
                                                            <div>
                                                                <label className="font-mono text-[10px] text-green-400 font-bold">Fecha de cobro ✱</label>
                                                                <input type="date" value={pagoForm.fecha_pago} onChange={e => setPagoForm(f => ({ ...f, fecha_pago: e.target.value }))} className={inputCls + ' mt-0.5 text-xs border-green-500/40'} />
                                                            </div>
                                                            <div>
                                                                <label className="font-mono text-[10px] text-gray-400">Método</label>
                                                                <select value={pagoForm.metodo_pago} onChange={e => setPagoForm(f => ({ ...f, metodo_pago: e.target.value }))} className={inputCls + ' mt-0.5 text-xs'}>
                                                                    <option value="transferencia">Transferencia</option>
                                                                    <option value="efectivo">Efectivo</option>
                                                                    <option value="cheque">Cheque</option>
                                                                    <option value="tarjeta">Tarjeta</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="font-mono text-[10px] text-gray-400">Notas</label>
                                                                <input type="text" value={pagoForm.notas} onChange={e => setPagoForm(f => ({ ...f, notas: e.target.value }))} placeholder="Referencia, nota..." className={inputCls + ' mt-0.5 text-xs'} />
                                                            </div>
                                                        </div>
                                                        {pagoError && <p className="font-mono text-xs text-red-400 mt-2">{pagoError}</p>}
                                                        <div className="flex gap-2 mt-3">
                                                            <Button onClick={() => handleCobrar(m)} disabled={submitting || !pagoForm.fecha_pago} className="font-mono bg-green-600 hover:bg-green-700 text-xs gap-1" size="sm">
                                                                {submitting ? 'Registrando...' : <><CheckCircle className="h-3 w-3" /> Confirmar Cobro</>}
                                                            </Button>
                                                            <Button onClick={() => { setCobrandoId(null); setPagoError(null) }} variant="ghost" className="font-mono text-xs" size="sm">Cancelar</Button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center font-mono text-gray-500 text-sm">Sin ingresos esperados este mes</div>
                                )}
                            </div>

                            {/* PAGOS PENDIENTES */}
                            <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg overflow-hidden">
                                <div className="p-4 border-b border-red-500/20 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-red-400" />
                                    <h3 className="font-mono text-red-400 text-sm">Pagos — Egresos del Mes</h3>
                                    <span className="ml-auto font-mono text-xs text-gray-500">{egresos.length} entradas</span>
                                </div>
                                {egresos.length > 0 ? (
                                    <div className="divide-y divide-gray-800">
                                        {egresos.map(m => (
                                            <div key={`e-${m.id}`} className="p-4 hover:bg-zinc-800/30 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono text-sm text-white font-bold">{m.concepto}</span>
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${m.subtipo === 'sueldo' ? 'text-purple-400 bg-purple-400/10' : m.categoria === 'egreso' && !m.subtipo ? 'text-red-400 bg-red-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                                                                {m.subtipo === 'sueldo' ? '🧑' : '📌'}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${m.estado === 'pagado' ? 'text-emerald-400 bg-emerald-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                                                                {m.estado === 'pagado' ? '✅ Pagado' : '⏳ Pendiente'}
                                                            </span>
                                                            {m.estado !== 'pagado' && m.dias_atraso && m.dias_atraso > 0 ? (
                                                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-red-400 bg-red-400/10">
                                                                    <AlertTriangle className="h-2.5 w-2.5" /> {m.dias_atraso}d atraso
                                                                </span>
                                                            ) : null}
                                                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ${m.has_cfdi ? 'text-blue-400 bg-blue-400/10' : 'text-gray-600 bg-gray-700/20'}`} title={m.has_cfdi ? 'CFDI ligado' : 'Sin CFDI'}>
                                                                <FileText className="h-2.5 w-2.5" /> {m.has_cfdi ? 'XML' : 'sin XML'}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ${m.has_banco ? 'text-green-400 bg-green-400/10' : 'text-gray-600 bg-gray-700/20'}`} title={m.has_banco ? 'Confirmado en banco' : 'Sin mov. bancario'}>
                                                                <Landmark className="h-2.5 w-2.5" /> {m.has_banco ? 'banco' : 'sin banco'}
                                                            </span>
                                                        </div>
                                                        <div className="font-mono text-xs text-gray-500 mt-0.5 flex flex-wrap gap-2">
                                                            {m.cliente_nombre && <span>{m.cliente_nombre}</span>}
                                                            {m.categoria_nombre && <span style={{ color: m.categoria_color as string }}>· {m.categoria_nombre}</span>}
                                                            {m.fecha_ideal && <span>· Vence: {new Date(String(m.fecha_ideal).split('T')[0] + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-sm text-red-400 font-bold">{fmt(Number(m.monto))}</span>
                                                        {m.estado === 'pendiente' && (
                                                            <Button onClick={() => openCobrar(m)} className="font-mono gap-1 bg-red-600 hover:bg-red-700" size="sm">
                                                                <CreditCard className="h-3 w-3" /> Pagar
                                                            </Button>
                                                        )}
                                                        {m.estado === 'pagado' && (
                                                            <Button onClick={() => handleCancelar(m)} variant="ghost" className="font-mono gap-1 text-gray-500 hover:text-red-400" size="sm">
                                                                <Undo2 className="h-3 w-3" /> Cancelar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Inline form — pago */}
                                                {cobrandoId === m.id && (
                                                    <motion.div
                                                        key={`form-e-${m.id}`}
                                                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                                        className="mt-3 p-4 bg-zinc-900 border border-red-500/30 rounded-lg">
                                                        <p className="font-mono text-[11px] text-red-400 mb-3 flex items-center gap-1">
                                                            <CreditCard className="h-3 w-3" /> Registrar pago — {m.concepto}
                                                        </p>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            <div>
                                                                <label className="font-mono text-[10px] text-red-400 font-bold">Fecha de pago ✱</label>
                                                                <input type="date" value={pagoForm.fecha_pago} onChange={e => setPagoForm(f => ({ ...f, fecha_pago: e.target.value }))} className={inputCls + ' mt-0.5 text-xs border-red-500/40'} />
                                                            </div>
                                                            <div>
                                                                <label className="font-mono text-[10px] text-gray-400">Método</label>
                                                                <select value={pagoForm.metodo_pago} onChange={e => setPagoForm(f => ({ ...f, metodo_pago: e.target.value }))} className={inputCls + ' mt-0.5 text-xs'}>
                                                                    <option value="transferencia">Transferencia</option>
                                                                    <option value="efectivo">Efectivo</option>
                                                                    <option value="cheque">Cheque</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="font-mono text-[10px] text-gray-400">Notas</label>
                                                                <input type="text" value={pagoForm.notas} onChange={e => setPagoForm(f => ({ ...f, notas: e.target.value }))} placeholder="Referencia, nota..." className={inputCls + ' mt-0.5 text-xs'} />
                                                            </div>
                                                        </div>
                                                        {pagoError && <p className="font-mono text-xs text-red-400 mt-2">{pagoError}</p>}
                                                        <div className="flex gap-2 mt-3">
                                                            <Button onClick={() => handleCobrar(m)} disabled={submitting || !pagoForm.fecha_pago} className="font-mono bg-red-600 hover:bg-red-700 text-xs gap-1" size="sm">
                                                                {submitting ? 'Registrando...' : <><CheckCircle className="h-3 w-3" /> Confirmar Pago</>}
                                                            </Button>
                                                            <Button onClick={() => { setCobrandoId(null); setPagoError(null) }} variant="ghost" className="font-mono text-xs" size="sm">Cancelar</Button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center font-mono text-gray-500 text-sm">Sin egresos pendientes este mes</div>
                                )}
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
