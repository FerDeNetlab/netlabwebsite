'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Receipt, CreditCard, Calendar, BarChart3, ArrowLeftRight, FileBarChart, Landmark } from 'lucide-react'

interface FinanzasStats {
    cxc: { pendientes: number; por_cobrar: number }
    cxp: { pendientes: number; por_pagar: number }
    ingresos_mes: number
    egresos_mes: number
    balance_mes: number
    alertas: { tipo: string; severity: 'danger' | 'warning' | 'info'; titulo: string; detalle: string; link?: string }[]
}

export default function FinanzasPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<FinanzasStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/finanzas/stats')
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [status])

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>
    }

    const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    const modules = [
        { title: 'Cuentas por Cobrar', desc: 'Ingresos pendientes', icon: Receipt, path: '/admin/finanzas/facturas', color: 'text-green-400', border: 'border-green-500/30' },
        { title: 'Gastos', desc: 'Egresos y gastos fijos', icon: CreditCard, path: '/admin/finanzas/gastos', color: 'text-red-400', border: 'border-red-500/30' },
        { title: 'Ingresos y Egresos', desc: 'Cobranza y pagos', icon: ArrowLeftRight, path: '/admin/finanzas/movimientos', color: 'text-emerald-400', border: 'border-emerald-500/30' },
        { title: 'Calendario', desc: 'Cobros y pagos del mes', icon: Calendar, path: '/admin/finanzas/calendario', color: 'text-blue-400', border: 'border-blue-500/30' },
        { title: 'Flujo de Efectivo', desc: 'Proyección mensual', icon: BarChart3, path: '/admin/finanzas/flujo', color: 'text-purple-400', border: 'border-purple-500/30' },
        { title: 'Reportes', desc: 'Panorama financiero completo', icon: FileBarChart, path: '/admin/finanzas/reportes', color: 'text-yellow-400', border: 'border-yellow-500/30' },
        { title: 'Aportes de Capital', desc: 'Inversiones de socios', icon: Landmark, path: '/admin/finanzas/aportes', color: 'text-amber-400', border: 'border-amber-500/30' },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <TerminalFrame title="root@netlab:~/finanzas">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                        <ArrowLeft className="h-4 w-4" /> Dashboard
                                    </Button>
                                    <h1 className="text-3xl font-mono text-green-400">Control Financiero</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Resumen de ingresos, egresos y flujo</p>
                                </div>
                            </div>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-zinc-900/50 border border-green-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-green-400" />
                                        <span className="text-xs font-mono text-gray-400">POR COBRAR</span>
                                    </div>
                                    <div className="text-2xl font-mono text-green-400">{fmt(stats?.cxc?.por_cobrar || 0)}</div>
                                    <div className="text-xs font-mono text-gray-500 mt-1">{stats?.cxc?.pendientes || 0} facturas pendientes</div>
                                </div>

                                <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                        <span className="text-xs font-mono text-gray-400">POR PAGAR</span>
                                    </div>
                                    <div className="text-2xl font-mono text-red-400">{fmt(stats?.cxp?.por_pagar || 0)}</div>
                                    <div className="text-xs font-mono text-gray-500 mt-1">{stats?.cxp?.pendientes || 0} gastos pendientes</div>
                                </div>

                                <div className="bg-zinc-900/50 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="h-4 w-4 text-blue-400" />
                                        <span className="text-xs font-mono text-gray-400">INGRESOS MES</span>
                                    </div>
                                    <div className="text-2xl font-mono text-blue-400">{fmt(stats?.ingresos_mes || 0)}</div>
                                    <div className="text-xs font-mono text-gray-500 mt-1">Pagos recibidos</div>
                                </div>

                                <div className={`bg-zinc-900/50 border rounded-lg p-4 ${(stats?.balance_mes || 0) >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 className={`h-4 w-4 ${(stats?.balance_mes || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                                        <span className="text-xs font-mono text-gray-400">BALANCE MES</span>
                                    </div>
                                    <div className={`text-2xl font-mono ${(stats?.balance_mes || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {fmt(stats?.balance_mes || 0)}
                                    </div>
                                    <div className="text-xs font-mono text-gray-500 mt-1">Ingresos - Egresos</div>
                                </div>
                            </div>

                            {/* Module Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {modules.map((mod) => (
                                    <button key={mod.path} onClick={() => router.push(mod.path)}
                                        className={`bg-zinc-900/50 border ${mod.border} rounded-lg p-5 text-left hover:bg-zinc-800/50 transition-all group`}>
                                        <mod.icon className={`h-8 w-8 ${mod.color} mb-3 group-hover:scale-110 transition-transform`} />
                                        <h3 className="font-mono text-white text-sm font-bold">{mod.title}</h3>
                                        <p className="font-mono text-gray-500 text-xs mt-1">{mod.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Smart Alerts */}
                            <div>
                                {stats?.alertas && stats.alertas.length > 0 ? (
                                    <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-5 space-y-2">
                                        <h3 className="font-mono text-white text-sm mb-3 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-400" /> Alertas Financieras ({stats.alertas.length})
                                        </h3>
                                        {stats.alertas.map((a, i) => {
                                            const colors = {
                                                danger: { border: 'border-red-500/30', bg: 'bg-red-500/5', icon: '🔴', text: 'text-red-400' },
                                                warning: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', icon: '🟡', text: 'text-yellow-400' },
                                                info: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', icon: '🔵', text: 'text-blue-400' },
                                            }
                                            const c = colors[a.severity]
                                            return (
                                                <div key={i} onClick={() => a.link && router.push(a.link)}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border ${c.border} ${c.bg} ${a.link ? 'cursor-pointer hover:bg-zinc-800/30' : ''} transition-colors`}>
                                                    <span className="text-sm mt-0.5">{c.icon}</span>
                                                    <div className="flex-1">
                                                        <div className={`font-mono text-sm font-bold ${c.text}`}>{a.titulo}</div>
                                                        <div className="font-mono text-xs text-gray-400 mt-0.5">{a.detalle}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-8 text-center">
                                        <div className="text-3xl mb-2">✅</div>
                                        <p className="font-mono text-green-400">Sin alertas financieras</p>
                                        <p className="font-mono text-gray-600 text-sm mt-1">Todo al corriente</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
