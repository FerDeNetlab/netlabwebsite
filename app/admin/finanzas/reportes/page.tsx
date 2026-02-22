'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Wallet, PieChart, BarChart3, CalendarDays, Landmark } from 'lucide-react'

interface Reporte {
    resumen: { mes: number; anio: number; ingresos_mes: number; egresos_mes: number; balance_mes: number; total_clientes: number }
    definiciones: {
        cxc_recurrentes: number; cxc_unicas: number; total_mensual_recurrente: number; total_unico: number;
        gastos_fijos: number; sueldos: number; gastos_unicos: number;
        total_sueldos_mensual: number; total_gastos_fijos_mensual: number; total_gastos_unicos: number; carga_mensual: number
    }
    movimientos_mes: {
        pagos: { numero: string; concepto: string; cliente: string; monto: number; fecha: string; metodo: string; recurrente: boolean }[]
        gastos: { concepto: string; monto: number; fecha: string; categoria: string; color: string; subtipo: string }[]
    }
    historico_mensual: { anio: number; mes: number; ingresos: number; egresos: number }[]
    cobranza_clientes: { id: string; nombre: string; pagos: number; total_cobrado: number; dias_promedio: number }[]
    gastos_por_categoria: { nombre: string; color: string; total: number; cantidad: number }[]
    aportes_capital: {
        total_global: number; total_mes: number;
        socios: { nombre: string; total: number }[]
        movimientos_mes: { socio: string; monto: number; concepto: string; fecha: string }[]
    }
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MESES_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function ReportesPage() {
    const { status } = useSession()
    const router = useRouter()
    const [data, setData] = useState<Reporte | null>(null)
    const [loading, setLoading] = useState(true)
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        setLoading(true)
        fetch(`/api/finanzas/reportes?mes=${mes}&anio=${anio}`)
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [status, mes, anio])

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1) }
    const fmt = (n: number) => `$${Math.abs(Number(n)).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    const fmtFull = (n: number) => `$${Math.abs(Number(n)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando reportes...</div></div>
    if (!data) return null

    const { resumen, definiciones, movimientos_mes, historico_mensual, cobranza_clientes, gastos_por_categoria, aportes_capital } = data
    const maxHist = Math.max(...historico_mensual.map(h => Math.max(h.ingresos, h.egresos)), 1)
    const totalGastosCat = gastos_por_categoria.reduce((s, g) => s + g.total, 0)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/reportes">
                        <div className="p-6 space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-purple-400">Reportes Financieros</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Panorama completo de todos los módulos</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={prevMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
                                    <span className="font-mono text-white text-lg min-w-[160px] text-center">{MESES_FULL[mes - 1]} {anio}</span>
                                    <button onClick={nextMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronRight className="h-5 w-5 text-gray-400" /></button>
                                </div>
                            </div>

                            {/* ═══ SECCIÓN 1: KPIs del Mes ═══ */}
                            <div>
                                <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> RESUMEN DEL MES</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-zinc-900/50 border border-green-500/30 rounded-lg p-4">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Ingresos</div>
                                        <div className="font-mono text-2xl text-green-400 mt-1">{fmt(resumen.ingresos_mes)}</div>
                                        <div className="font-mono text-[10px] text-gray-600">{movimientos_mes.pagos.length} cobros registrados</div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg p-4">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Egresos</div>
                                        <div className="font-mono text-2xl text-red-400 mt-1">{fmt(resumen.egresos_mes)}</div>
                                        <div className="font-mono text-[10px] text-gray-600">{movimientos_mes.gastos.length} pagos realizados</div>
                                    </div>
                                    <div className={`bg-zinc-900/50 border rounded-lg p-4 ${resumen.balance_mes >= 0 ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Balance</div>
                                        <div className={`font-mono text-2xl mt-1 ${resumen.balance_mes >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {resumen.balance_mes >= 0 ? '+' : '-'}{fmt(resumen.balance_mes)}
                                        </div>
                                        <div className="font-mono text-[10px] text-gray-600">Ingresos – Egresos</div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-blue-500/30 rounded-lg p-4">
                                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1"><Users className="h-3 w-3" /> Clientes</div>
                                        <div className="font-mono text-2xl text-blue-400 mt-1">{resumen.total_clientes}</div>
                                        <div className="font-mono text-[10px] text-gray-600">registrados</div>
                                    </div>
                                </div>
                            </div>

                            {/* ═══ SECCIÓN 2: Definiciones (estructura mensual) ═══ */}
                            <div>
                                <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><Briefcase className="h-4 w-4" /> ESTRUCTURA MENSUAL (definiciones activas)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Ingresos esperados */}
                                    <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4 space-y-3">
                                        <h3 className="font-mono text-green-400 text-xs font-bold">💰 INGRESOS ESPERADOS</h3>
                                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                            <span className="font-mono text-xs text-gray-400">🔄 Recurrentes ({definiciones.cxc_recurrentes})</span>
                                            <span className="font-mono text-sm text-cyan-400 font-bold">{fmtFull(definiciones.total_mensual_recurrente)}/mes</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                            <span className="font-mono text-xs text-gray-400">⚡ Únicos ({definiciones.cxc_unicas})</span>
                                            <span className="font-mono text-sm text-green-400 font-bold">{fmtFull(definiciones.total_unico)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="font-mono text-xs text-white font-bold">Ingreso mensual base</span>
                                            <span className="font-mono text-lg text-green-400 font-bold">{fmtFull(definiciones.total_mensual_recurrente)}</span>
                                        </div>
                                    </div>

                                    {/* Egresos comprometidos */}
                                    <div className="bg-zinc-900/50 border border-red-500/20 rounded-lg p-4 space-y-3">
                                        <h3 className="font-mono text-red-400 text-xs font-bold">💸 EGRESOS COMPROMETIDOS</h3>
                                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                            <span className="font-mono text-xs text-gray-400">🧑 Sueldos ({definiciones.sueldos})</span>
                                            <span className="font-mono text-sm text-purple-400 font-bold">{fmtFull(definiciones.total_sueldos_mensual)}/mes</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                            <span className="font-mono text-xs text-gray-400">📌 Gastos fijos ({definiciones.gastos_fijos})</span>
                                            <span className="font-mono text-sm text-orange-400 font-bold">{fmtFull(definiciones.total_gastos_fijos_mensual)}/mes</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                            <span className="font-mono text-xs text-gray-400">⚡ Únicos ({definiciones.gastos_unicos})</span>
                                            <span className="font-mono text-sm text-red-400 font-bold">{fmtFull(definiciones.total_gastos_unicos)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="font-mono text-xs text-white font-bold">Carga mensual fija</span>
                                            <span className="font-mono text-lg text-red-400 font-bold">{fmtFull(definiciones.carga_mensual)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Margen proyectado */}
                                <div className={`mt-3 p-3 rounded-lg border-2 text-center ${definiciones.total_mensual_recurrente > definiciones.carga_mensual ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                    <span className="font-mono text-xs text-gray-400">Margen mensual proyectado (recurrente – carga fija): </span>
                                    <span className={`font-mono text-lg font-bold ${definiciones.total_mensual_recurrente > definiciones.carga_mensual ? 'text-green-400' : 'text-red-400'}`}>
                                        {definiciones.total_mensual_recurrente >= definiciones.carga_mensual ? '+' : '-'}{fmtFull(definiciones.total_mensual_recurrente - definiciones.carga_mensual)}
                                    </span>
                                </div>
                            </div>

                            {/* ═══ SECCIÓN 3: Histórico Mensual (chart) ═══ */}
                            {historico_mensual.length > 0 && (
                                <div>
                                    <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> HISTÓRICO MENSUAL (últimos 6 meses)</h2>
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex items-end gap-2 h-48">
                                            {historico_mensual.map((h, i) => {
                                                const hIngreso = (h.ingresos / maxHist) * 100
                                                const hEgreso = (h.egresos / maxHist) * 100
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                        <div className="w-full flex items-end justify-center gap-1 flex-1">
                                                            <div className="w-5 bg-green-500/60 rounded-t transition-all" style={{ height: `${hIngreso}%` }}
                                                                title={`Ingresos: ${fmt(h.ingresos)}`} />
                                                            <div className="w-5 bg-red-500/60 rounded-t transition-all" style={{ height: `${hEgreso}%` }}
                                                                title={`Egresos: ${fmt(h.egresos)}`} />
                                                        </div>
                                                        <div className="font-mono text-[10px] text-gray-500">{MESES[h.mes - 1]}</div>
                                                        <div className="font-mono text-[9px] text-green-400">+{fmt(h.ingresos)}</div>
                                                        <div className="font-mono text-[9px] text-red-400">-{fmt(h.egresos)}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="flex gap-4 mt-3 justify-center font-mono text-[10px]">
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500/60" /> Ingresos</span>
                                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/60" /> Egresos</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══ SECCIÓN 4: Cobranza por Cliente + Gastos por Categoría ═══ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Clientes */}
                                <div>
                                    <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> COBRANZA POR CLIENTE (12 meses)</h2>
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                        {cobranza_clientes.length > 0 ? (
                                            <table className="w-full">
                                                <thead className="bg-zinc-800/50">
                                                    <tr className="font-mono text-[10px] text-gray-400">
                                                        <th className="text-left p-2">Cliente</th>
                                                        <th className="text-right p-2">Cobrado</th>
                                                        <th className="text-right p-2">Pagos</th>
                                                        <th className="text-right p-2">Días prom.</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="font-mono text-xs">
                                                    {cobranza_clientes.map(c => (
                                                        <tr key={c.id} className="border-b border-gray-800 last:border-0">
                                                            <td className="p-2 text-gray-300">{c.nombre}</td>
                                                            <td className="p-2 text-right text-green-400 font-bold">{fmt(c.total_cobrado)}</td>
                                                            <td className="p-2 text-right text-gray-400">{c.pagos}</td>
                                                            <td className={`p-2 text-right font-bold ${c.dias_promedio > 15 ? 'text-red-400' : c.dias_promedio > 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                                {c.dias_promedio}d
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="p-4 text-center font-mono text-gray-500 text-xs">Sin datos de cobranza</div>
                                        )}
                                    </div>
                                </div>

                                {/* Gastos por categoría */}
                                <div>
                                    <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><PieChart className="h-4 w-4" /> GASTOS POR CATEGORÍA ({MESES_FULL[mes - 1]})</h2>
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4 space-y-3">
                                        {gastos_por_categoria.length > 0 ? gastos_por_categoria.map((g, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono text-xs text-gray-300">{g.nombre}</span>
                                                    <span className="font-mono text-xs font-bold" style={{ color: g.color }}>{fmtFull(g.total)}</span>
                                                </div>
                                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${(g.total / totalGastosCat) * 100}%`, backgroundColor: g.color }} />
                                                </div>
                                                <div className="font-mono text-[9px] text-gray-600 mt-0.5">{g.cantidad} gasto{g.cantidad !== 1 ? 's' : ''} • {Math.round((g.total / totalGastosCat) * 100)}%</div>
                                            </div>
                                        )) : (
                                            <div className="text-center font-mono text-gray-500 text-xs">Sin gastos pagados este mes</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ═══ SECCIÓN 5: Aportes de Capital ═══ */}
                            {aportes_capital && aportes_capital.total_global > 0 && (
                                <div>
                                    <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><Landmark className="h-4 w-4" /> APORTES DE CAPITAL</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-zinc-900/50 border border-amber-500/20 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono text-xs text-gray-400">Capital total acumulado</span>
                                                <span className="font-mono text-lg text-amber-400 font-bold">{fmtFull(aportes_capital.total_global)}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-gray-800 pt-2">
                                                <span className="font-mono text-xs text-gray-400">Aportes de {MESES_FULL[mes - 1]}</span>
                                                <span className="font-mono text-sm text-amber-400 font-bold">{fmtFull(aportes_capital.total_mes)}</span>
                                            </div>
                                            {/* Per-socio breakdown */}
                                            {aportes_capital.socios.map(s => (
                                                <div key={s.nombre}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-mono text-xs text-gray-300">{s.nombre}</span>
                                                        <span className="font-mono text-xs text-amber-400 font-bold">{fmtFull(s.total)}</span>
                                                    </div>
                                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${(s.total / aportes_capital.total_global) * 100}%` }} />
                                                    </div>
                                                    <div className="font-mono text-[9px] text-gray-600 mt-0.5">{Math.round((s.total / aportes_capital.total_global) * 100)}% del capital</div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Monthly detail */}
                                        <div className="bg-zinc-900/50 border border-amber-500/20 rounded-lg overflow-hidden">
                                            <div className="p-3 border-b border-amber-500/10 font-mono text-xs text-amber-400">Aportes de {MESES_FULL[mes - 1]}</div>
                                            {aportes_capital.movimientos_mes.length > 0 ? (
                                                <div className="divide-y divide-gray-800">
                                                    {aportes_capital.movimientos_mes.map((a, i) => (
                                                        <div key={i} className="p-3 flex justify-between items-center">
                                                            <div>
                                                                <div className="font-mono text-xs text-white">{a.socio}</div>
                                                                <div className="font-mono text-[10px] text-gray-500">
                                                                    {a.concepto}{a.fecha && ` · ${new Date(a.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}`}
                                                                </div>
                                                            </div>
                                                            <span className="font-mono text-xs text-amber-400 font-bold">{fmtFull(a.monto)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center font-mono text-gray-500 text-xs">Sin aportes este mes</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══ SECCIÓN 6: Movimientos detallados del mes ═══ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Cobros del mes */}
                                <div>
                                    <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><Wallet className="h-4 w-4" /> COBROS DE {MESES_FULL[mes - 1].toUpperCase()}</h2>
                                    <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg overflow-hidden">
                                        {movimientos_mes.pagos.length > 0 ? (
                                            <div className="divide-y divide-gray-800 max-h-[300px] overflow-y-auto">
                                                {movimientos_mes.pagos.map((p, i) => (
                                                    <div key={i} className="p-3 flex justify-between items-center">
                                                        <div>
                                                            <div className="font-mono text-xs text-white">{p.numero || p.concepto}</div>
                                                            <div className="font-mono text-[10px] text-gray-500">
                                                                {p.cliente} • {p.fecha ? new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : ''}
                                                                {p.metodo && ` • ${p.metodo}`}
                                                            </div>
                                                        </div>
                                                        <span className="font-mono text-xs text-green-400 font-bold">+{fmtFull(p.monto)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center font-mono text-gray-500 text-xs">Sin cobros este mes</div>
                                        )}
                                    </div>
                                </div>

                                {/* Pagos del mes */}
                                <div>
                                    <h2 className="font-mono text-sm text-gray-500 mb-3 flex items-center gap-2"><Wallet className="h-4 w-4" /> PAGOS DE {MESES_FULL[mes - 1].toUpperCase()}</h2>
                                    <div className="bg-zinc-900/50 border border-red-500/20 rounded-lg overflow-hidden">
                                        {movimientos_mes.gastos.length > 0 ? (
                                            <div className="divide-y divide-gray-800 max-h-[300px] overflow-y-auto">
                                                {movimientos_mes.gastos.map((g, i) => (
                                                    <div key={i} className="p-3 flex justify-between items-center">
                                                        <div>
                                                            <div className="font-mono text-xs text-white">{g.concepto}</div>
                                                            <div className="font-mono text-[10px] text-gray-500">
                                                                {g.fecha ? new Date(g.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : ''}
                                                                {g.categoria && <span style={{ color: g.color }}> • {g.categoria}</span>}
                                                                {g.subtipo === 'sueldo' && ' • 🧑 Sueldo'}
                                                            </div>
                                                        </div>
                                                        <span className="font-mono text-xs text-red-400 font-bold">-{fmtFull(g.monto)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center font-mono text-gray-500 text-xs">Sin pagos este mes</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
