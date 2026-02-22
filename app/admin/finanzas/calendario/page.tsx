'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertTriangle, TrendingUp, Users } from 'lucide-react'

interface Evento {
    id: string; titulo: string; monto: number; fecha: string; estado: string;
    cliente_nombre: string; tipo: string; categoria_color?: string; subtipo?: string;
    dias_desfase?: number; fecha_ideal?: string;
    dias_emision_envio?: number; dias_envio_pago?: number; dias_emision_pago?: number;
}
interface Kpis { promedio_desfase: number; pct_a_tiempo: number; total_cobros: number; total_ingresos: number; total_egresos: number }
interface ClienteCobranza { id: string; nombre: string; pagos: number; total: number; promedio_desfase: number; promedio_emision_pago: number; promedio_envio_pago: number; pct_a_tiempo: number }

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function CalendarioPage() {
    const { status } = useSession()
    const router = useRouter()
    const [eventos, setEventos] = useState<Evento[]>([])
    const [kpis, setKpis] = useState<Kpis | null>(null)
    const [clientesCobranza, setClientesCobranza] = useState<ClienteCobranza[]>([])
    const [loading, setLoading] = useState(true)
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [vista, setVista] = useState<'ideales' | 'efectuados'>('ideales')
    const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        setLoading(true)
        fetch(`/api/finanzas/calendario?mes=${mes}&anio=${anio}&vista=${vista}`)
            .then(r => r.json())
            .then(data => { setEventos(data.eventos || []); setKpis(data.kpis || null); setLoading(false) })
            .catch(() => setLoading(false))
    }, [status, mes, anio, vista])

    // Load cobranza data for efectuados view
    useEffect(() => {
        if (status !== 'authenticated' || vista !== 'efectuados') return
        fetch('/api/finanzas/cobranza')
            .then(r => r.json())
            .then(data => setClientesCobranza(data.clientes || []))
            .catch(() => { })
    }, [status, vista])

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1); setDiaSeleccionado(null) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1); setDiaSeleccionado(null) }

    const primerDia = new Date(anio, mes - 1, 1).getDay()
    const diasEnMes = new Date(anio, mes, 0).getDate()
    const celdas: (number | null)[] = []
    for (let i = 0; i < primerDia; i++) celdas.push(null)
    for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

    const eventosDelDia = (dia: number) => {
        const dateStr = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
        return eventos.filter(e => e.fecha && e.fecha.startsWith(dateStr))
    }

    const fmt = (n: number) => `$${Math.abs(Number(n)).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    const hoy = new Date()
    const esHoy = (d: number) => d === hoy.getDate() && mes === hoy.getMonth() + 1 && anio === hoy.getFullYear()

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    const eventosDiaSeleccionado = diaSeleccionado ? eventosDelDia(diaSeleccionado) : []

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/calendario">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-blue-400">Calendario de Pagos</h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={prevMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
                                    <span className="font-mono text-white text-lg min-w-[160px] text-center">{MESES[mes - 1]} {anio}</span>
                                    <button onClick={nextMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronRight className="h-5 w-5 text-gray-400" /></button>
                                </div>
                            </div>

                            {/* Vista Toggle */}
                            <div className="flex gap-2">
                                <button onClick={() => { setVista('ideales'); setDiaSeleccionado(null) }}
                                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-mono text-sm ${vista === 'ideales' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}>
                                    <Clock className="h-4 w-4" />
                                    <div className="text-left">
                                        <div className="font-bold text-xs">📅 Pagos Ideales</div>
                                        <div className="text-[10px] opacity-70">Cuándo deberían pagar/cobrar</div>
                                    </div>
                                </button>
                                <button onClick={() => { setVista('efectuados'); setDiaSeleccionado(null) }}
                                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all font-mono text-sm ${vista === 'efectuados' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}>
                                    <CheckCircle className="h-4 w-4" />
                                    <div className="text-left">
                                        <div className="font-bold text-xs">✅ Pagos Efectuados</div>
                                        <div className="text-[10px] opacity-70">Cuándo realmente pagaron</div>
                                    </div>
                                </button>
                            </div>

                            {/* KPIs Strip (only efectuados) */}
                            {vista === 'efectuados' && kpis && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-3">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Desfase Promedio</div>
                                        <div className={`font-mono text-lg ${kpis.promedio_desfase > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {kpis.promedio_desfase > 0 ? `+${kpis.promedio_desfase}` : kpis.promedio_desfase} días
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-3">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> A Tiempo</div>
                                        <div className={`font-mono text-lg ${kpis.pct_a_tiempo >= 80 ? 'text-green-400' : kpis.pct_a_tiempo >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {kpis.pct_a_tiempo}%
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-3">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Cobros del Mes</div>
                                        <div className="font-mono text-lg text-green-400">{fmt(kpis.total_ingresos)}</div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-3">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Egresos del Mes</div>
                                        <div className="font-mono text-lg text-red-400">{fmt(kpis.total_egresos)}</div>
                                    </div>
                                </div>
                            )}

                            {/* Legend */}
                            <div className="flex flex-wrap gap-4 font-mono text-xs">
                                {vista === 'ideales' ? (
                                    <>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Cobro único</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Cobro recurrente</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Gasto único</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Gasto fijo</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Sueldo</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Ingreso recibido</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Egreso pagado</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Con desfase</span>
                                    </>
                                )}
                            </div>

                            {/* Calendar Grid */}
                            <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                <div className="grid grid-cols-7 bg-zinc-800/50 border-b border-gray-700">
                                    {DIAS.map(d => (
                                        <div key={d} className="p-2 text-center font-mono text-xs text-gray-400">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7">
                                    {celdas.map((dia, i) => {
                                        if (dia === null) return <div key={`e${i}`} className="min-h-[80px] border-b border-r border-gray-800 bg-zinc-900/30" />
                                        const evts = eventosDelDia(dia)
                                        const isSelected = diaSeleccionado === dia

                                        if (vista === 'efectuados') {
                                            const ingresos = evts.filter(e => e.tipo === 'ingreso')
                                            const egresos = evts.filter(e => e.tipo === 'egreso')
                                            const hasDesfase = ingresos.some(e => e.dias_desfase && e.dias_desfase > 0)

                                            return (
                                                <div key={dia} onClick={() => setDiaSeleccionado(dia === diaSeleccionado ? null : dia)}
                                                    className={`min-h-[80px] border-b border-r border-gray-800 p-1.5 cursor-pointer transition-colors
                                  ${esHoy(dia) ? 'bg-green-500/5' : ''} ${isSelected ? 'bg-blue-500/10 ring-1 ring-blue-500/30' : 'hover:bg-zinc-800/30'}`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`font-mono text-xs ${esHoy(dia) ? 'text-green-400 font-bold' : 'text-gray-500'}`}>{dia}</span>
                                                        <div className="flex gap-0.5">
                                                            {ingresos.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                                            {egresos.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                                                            {hasDesfase && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                                                        </div>
                                                    </div>
                                                    {ingresos.length > 0 && (
                                                        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 rounded px-1 py-0.5 mb-0.5 truncate">
                                                            +{fmt(ingresos.reduce((s, e) => s + Number(e.monto), 0))}
                                                        </div>
                                                    )}
                                                    {egresos.length > 0 && (
                                                        <div className="text-[10px] font-mono text-red-400 bg-red-400/10 rounded px-1 py-0.5 truncate">
                                                            -{fmt(egresos.reduce((s, e) => s + Number(e.monto), 0))}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }

                                        // Vista Ideales
                                        const cobros = evts.filter(e => ['cobro', 'cobro_recurrente', 'ingreso'].includes(e.tipo))
                                        const pagos = evts.filter(e => ['pago', 'pago_fijo'].includes(e.tipo))
                                        const hasCobros = cobros.length > 0
                                        const hasPagos = pagos.length > 0
                                        const hasSueldos = pagos.some(e => e.subtipo === 'sueldo')
                                        const hasRecurrente = evts.some(e => e.tipo === 'cobro_recurrente')

                                        return (
                                            <div key={dia} onClick={() => setDiaSeleccionado(dia === diaSeleccionado ? null : dia)}
                                                className={`min-h-[80px] border-b border-r border-gray-800 p-1.5 cursor-pointer transition-colors
                              ${esHoy(dia) ? 'bg-green-500/5' : ''} ${isSelected ? 'bg-blue-500/10 ring-1 ring-blue-500/30' : 'hover:bg-zinc-800/30'}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`font-mono text-xs ${esHoy(dia) ? 'text-green-400 font-bold' : 'text-gray-500'}`}>{dia}</span>
                                                    <div className="flex gap-0.5">
                                                        {hasRecurrente && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                                                        {hasCobros && !hasRecurrente && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                                                        {hasSueldos && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                                                        {hasPagos && !hasSueldos && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                                                    </div>
                                                </div>
                                                {hasCobros && (
                                                    <div className={`text-[10px] font-mono rounded px-1 py-0.5 mb-0.5 truncate ${hasRecurrente ? 'text-cyan-400 bg-cyan-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                                        +{fmt(cobros.reduce((s, e) => s + Number(e.monto), 0))}
                                                    </div>
                                                )}
                                                {hasPagos && (
                                                    <div className={`text-[10px] font-mono rounded px-1 py-0.5 truncate ${hasSueldos ? 'text-purple-400 bg-purple-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                        -{fmt(pagos.reduce((s, e) => s + Number(e.monto), 0))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Selected day detail */}
                            {diaSeleccionado && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-zinc-900/50 border border-blue-500/30 rounded-lg p-5">
                                    <h3 className="font-mono text-blue-400 text-sm mb-3">{diaSeleccionado} de {MESES[mes - 1]} {anio}</h3>
                                    {eventosDiaSeleccionado.length > 0 ? (
                                        <div className="space-y-2">
                                            {eventosDiaSeleccionado.map((e, i) => {
                                                const isEgreso = ['pago', 'pago_fijo', 'egreso'].includes(e.tipo)
                                                const isSueldo = e.subtipo === 'sueldo'
                                                const colorClass = vista === 'efectuados'
                                                    ? (isEgreso ? 'text-red-400' : 'text-emerald-400')
                                                    : (isSueldo ? 'text-purple-400' : isEgreso ? 'text-red-400' : e.tipo === 'cobro_recurrente' ? 'text-cyan-400' : 'text-green-400')
                                                const tipoLabel = vista === 'efectuados'
                                                    ? (isEgreso ? '💸 Egreso pagado' : '✅ Ingreso recibido')
                                                    : (isSueldo ? '🧑 Sueldo' : e.tipo === 'cobro_recurrente' ? '🔄 Cobro recurrente' : e.tipo === 'pago_fijo' ? '📌 Gasto fijo' : e.tipo === 'cobro' ? '⚡ Cobro' : e.tipo === 'ingreso' ? '✅ Ingreso' : '⚡ Gasto')

                                                return (
                                                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                                                        <div className="flex-1">
                                                            <div className="font-mono text-sm text-white">{e.titulo}</div>
                                                            <div className="font-mono text-xs text-gray-500">{e.cliente_nombre || ''} • {tipoLabel}</div>
                                                            {/* Desfase badge (efectuados only) */}
                                                            {vista === 'efectuados' && e.dias_desfase !== null && e.dias_desfase !== undefined && (
                                                                <div className="mt-1 flex gap-2 flex-wrap">
                                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${e.dias_desfase > 0 ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                                                        {e.dias_desfase > 0 ? `⚠️ +${e.dias_desfase} días tarde` : e.dias_desfase === 0 ? '✅ A tiempo' : `✅ ${Math.abs(e.dias_desfase)} días antes`}
                                                                    </span>
                                                                    {e.dias_emision_pago !== null && e.dias_emision_pago !== undefined && (
                                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-gray-400/10">
                                                                            📄→💰 {e.dias_emision_pago}d
                                                                        </span>
                                                                    )}
                                                                    {e.dias_envio_pago !== null && e.dias_envio_pago !== undefined && (
                                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-gray-400/10">
                                                                            📧→💰 {e.dias_envio_pago}d
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`font-mono text-sm font-bold ${colorClass}`}>
                                                            {isEgreso ? '-' : '+'}{fmt(Number(e.monto))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <p className="font-mono text-gray-500 text-sm">Sin eventos este día</p>
                                    )}
                                </motion.div>
                            )}

                            {/* Clients Ranking (efectuados view) */}
                            {vista === 'efectuados' && clientesCobranza.length > 0 && (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <div className="p-4 border-b border-gray-700">
                                        <h3 className="font-mono text-emerald-400 text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Efectividad de Cobranza por Cliente (12 meses)</h3>
                                    </div>
                                    <table className="w-full">
                                        <thead className="bg-zinc-800/50">
                                            <tr className="font-mono text-[10px] text-gray-400">
                                                <th className="text-left p-3">Cliente</th>
                                                <th className="text-right p-3">Pagos</th>
                                                <th className="text-right p-3">Desfase Prom.</th>
                                                <th className="text-right p-3">📄→💰</th>
                                                <th className="text-right p-3">📧→💰</th>
                                                <th className="text-right p-3">% A tiempo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {clientesCobranza.slice(0, 10).map(c => (
                                                <tr key={c.id} className="border-b border-gray-800 last:border-0">
                                                    <td className="p-3 text-gray-300">{c.nombre}</td>
                                                    <td className="p-3 text-right text-gray-400">{c.pagos}</td>
                                                    <td className={`p-3 text-right font-bold ${c.promedio_desfase > 5 ? 'text-red-400' : c.promedio_desfase > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                        {c.promedio_desfase > 0 ? `+${c.promedio_desfase}d` : `${c.promedio_desfase}d`}
                                                    </td>
                                                    <td className="p-3 text-right text-gray-400">{c.promedio_emision_pago > 0 ? `${c.promedio_emision_pago}d` : '—'}</td>
                                                    <td className="p-3 text-right text-gray-400">{c.promedio_envio_pago > 0 ? `${c.promedio_envio_pago}d` : '—'}</td>
                                                    <td className="p-3 text-right">
                                                        <span className={`px-2 py-0.5 rounded text-xs ${c.pct_a_tiempo >= 80 ? 'text-green-400 bg-green-400/10' : c.pct_a_tiempo >= 50 ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                            {c.pct_a_tiempo}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
