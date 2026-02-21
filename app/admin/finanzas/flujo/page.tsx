'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react'

interface MesProyeccion {
    mes: string; mesNum: number; anio: number
    ingresos: { recurrente: number; puntual: number; total: number }
    egresos: { recurrente: number; sueldos: number; puntual: number; total: number }
    neto: number; saldoAcumulado: number
}
interface Resumen { saldo_actual: number; ingresos_proyectados: number; egresos_proyectados: number; saldo_proyectado: number; meta_mensual: number }

export default function FlujoPage() {
    const { status } = useSession()
    const router = useRouter()
    const [proyeccion, setProyeccion] = useState<MesProyeccion[]>([])
    const [resumen, setResumen] = useState<Resumen | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])
    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/finanzas/flujo?meses=6').then(r => r.json()).then(data => {
            setProyeccion(data.proyeccion || [])
            setResumen(data.resumen || null)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [status])

    const fmt = (n: number) => `$${Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    const fmtSign = (n: number) => `${n >= 0 ? '+' : '-'}${fmt(n)}`

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    const maxVal = Math.max(...proyeccion.map(m => Math.max(m.ingresos.total, m.egresos.total, 1)))

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/flujo-efectivo">
                        <div className="p-6 space-y-6">
                            <div className="border-b border-green-500/20 pb-4">
                                <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                <h1 className="text-3xl font-mono text-green-400">Flujo de Efectivo</h1>
                                <p className="text-gray-400 font-mono text-sm mt-1">Proyección mensual — próximos 6 meses</p>
                            </div>

                            {/* KPIs */}
                            {resumen && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Saldo Actual', value: fmt(resumen.saldo_actual), icon: DollarSign, color: 'green' },
                                        { label: 'Ingresos Proyectados', value: fmt(resumen.ingresos_proyectados), icon: TrendingUp, color: 'green' },
                                        { label: 'Egresos Proyectados', value: fmt(resumen.egresos_proyectados), icon: TrendingDown, color: 'red' },
                                        { label: 'Meta Mensual', value: fmt(resumen.meta_mensual), icon: Target, color: 'amber' },
                                    ].map((kpi, i) => (
                                        <div key={i} className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <kpi.icon className={`h-4 w-4 text-${kpi.color}-400`} />
                                                <span className="font-mono text-xs text-gray-400">{kpi.label}</span>
                                            </div>
                                            <div className={`font-mono text-xl text-${kpi.color}-400`}>{kpi.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Monthly Bar Chart */}
                            <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-5">
                                <h3 className="font-mono text-green-400 text-sm mb-4">Ingresos vs Egresos por Mes</h3>
                                <div className="space-y-4">
                                    {proyeccion.map((m, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center font-mono text-xs">
                                                <span className="text-gray-300 uppercase font-bold">{m.mes}</span>
                                                <span className={`${m.neto >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtSign(m.neto)}</span>
                                            </div>
                                            {/* Income bar */}
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] text-gray-500 w-16 text-right">Ingresos</span>
                                                <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden flex">
                                                    {m.ingresos.recurrente > 0 && (
                                                        <div className="h-full bg-cyan-500/70" style={{ width: `${(m.ingresos.recurrente / maxVal) * 100}%` }}
                                                            title={`Recurrente: ${fmt(m.ingresos.recurrente)}`} />
                                                    )}
                                                    {m.ingresos.puntual > 0 && (
                                                        <div className="h-full bg-green-500/70" style={{ width: `${(m.ingresos.puntual / maxVal) * 100}%` }}
                                                            title={`Puntual: ${fmt(m.ingresos.puntual)}`} />
                                                    )}
                                                </div>
                                                <span className="font-mono text-xs text-green-400 w-20 text-right">{fmt(m.ingresos.total)}</span>
                                            </div>
                                            {/* Expense bar */}
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] text-gray-500 w-16 text-right">Egresos</span>
                                                <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden flex">
                                                    {m.egresos.sueldos > 0 && (
                                                        <div className="h-full bg-purple-500/70" style={{ width: `${(m.egresos.sueldos / maxVal) * 100}%` }}
                                                            title={`Sueldos: ${fmt(m.egresos.sueldos)}`} />
                                                    )}
                                                    {m.egresos.recurrente > 0 && (
                                                        <div className="h-full bg-orange-500/70" style={{ width: `${(m.egresos.recurrente / maxVal) * 100}%` }}
                                                            title={`Fijos: ${fmt(m.egresos.recurrente)}`} />
                                                    )}
                                                    {m.egresos.puntual > 0 && (
                                                        <div className="h-full bg-red-500/70" style={{ width: `${(m.egresos.puntual / maxVal) * 100}%` }}
                                                            title={`Puntuales: ${fmt(m.egresos.puntual)}`} />
                                                    )}
                                                </div>
                                                <span className="font-mono text-xs text-red-400 w-20 text-right">{fmt(m.egresos.total)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Legend */}
                                <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-800">
                                    {[
                                        { color: 'bg-cyan-500/70', label: 'Ingreso recurrente' },
                                        { color: 'bg-green-500/70', label: 'Ingreso puntual' },
                                        { color: 'bg-purple-500/70', label: 'Sueldos' },
                                        { color: 'bg-orange-500/70', label: 'Gastos fijos' },
                                        { color: 'bg-red-500/70', label: 'Gastos puntuales' },
                                    ].map(l => (
                                        <div key={l.label} className="flex items-center gap-1.5">
                                            <div className={`w-3 h-3 rounded ${l.color}`} />
                                            <span className="font-mono text-[10px] text-gray-500">{l.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Detail Table */}
                            <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-zinc-800/50 border-b border-gray-700">
                                        <tr className="font-mono text-xs text-gray-400">
                                            <th className="text-left p-3">Mes</th>
                                            <th className="text-right p-3 text-cyan-400">Ing. Recurrente</th>
                                            <th className="text-right p-3 text-green-400">Ing. Puntual</th>
                                            <th className="text-right p-3 text-purple-400">Sueldos</th>
                                            <th className="text-right p-3 text-orange-400">Gastos Fijos</th>
                                            <th className="text-right p-3 text-red-400">Gastos Punt.</th>
                                            <th className="text-right p-3">Neto</th>
                                            <th className="text-right p-3">Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-sm">
                                        {proyeccion.map((m, i) => (
                                            <tr key={i} className="border-b border-gray-800 last:border-0">
                                                <td className="p-3 text-gray-300 uppercase font-bold">{m.mes}</td>
                                                <td className="p-3 text-right text-cyan-400">{m.ingresos.recurrente > 0 ? fmt(m.ingresos.recurrente) : '—'}</td>
                                                <td className="p-3 text-right text-green-400">{m.ingresos.puntual > 0 ? fmt(m.ingresos.puntual) : '—'}</td>
                                                <td className="p-3 text-right text-purple-400">{m.egresos.sueldos > 0 ? `-${fmt(m.egresos.sueldos)}` : '—'}</td>
                                                <td className="p-3 text-right text-orange-400">{m.egresos.recurrente > 0 ? `-${fmt(m.egresos.recurrente)}` : '—'}</td>
                                                <td className="p-3 text-right text-red-400">{m.egresos.puntual > 0 ? `-${fmt(m.egresos.puntual)}` : '—'}</td>
                                                <td className={`p-3 text-right font-bold ${m.neto >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtSign(m.neto)}</td>
                                                <td className={`p-3 text-right ${m.saldoAcumulado >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(m.saldoAcumulado)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
