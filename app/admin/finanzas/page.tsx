'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Receipt, CreditCard, Calendar, BarChart3, ArrowLeftRight } from 'lucide-react'

interface FinanzasStats {
    cxc: { total: number; pendientes: number; pagadas: number; vencidas: number; por_cobrar: number }
    cxp: { total: number; pendientes: number; pagados: number; vencidos: number; por_pagar: number }
    ingresos_mes: number
    egresos_mes: number
    balance_mes: number
    facturas_vencidas: { id: string; numero_factura: string; total: number; cliente_nombre: string; fecha_vencimiento: string }[]
    gastos_proximos: { id: string; concepto: string; monto: number; categoria_nombre: string; categoria_color: string; fecha_vencimiento: string }[]
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

                            {/* Alerts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {stats?.facturas_vencidas && stats.facturas_vencidas.length > 0 && (
                                    <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg p-5">
                                        <h3 className="font-mono text-red-400 text-sm mb-3 flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4" /> Facturas Vencidas
                                        </h3>
                                        {stats.facturas_vencidas.map(f => (
                                            <div key={f.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0 cursor-pointer hover:bg-zinc-800/30"
                                                onClick={() => router.push(`/admin/finanzas/facturas/${f.id}`)}>
                                                <div>
                                                    <div className="font-mono text-sm text-white">{f.numero_factura}</div>
                                                    <div className="font-mono text-xs text-gray-500">{f.cliente_nombre}</div>
                                                </div>
                                                <div className="font-mono text-sm text-red-400">{fmt(Number(f.total))}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {stats?.gastos_proximos && stats.gastos_proximos.length > 0 && (
                                    <div className="bg-zinc-900/50 border border-yellow-500/30 rounded-lg p-5">
                                        <h3 className="font-mono text-yellow-400 text-sm mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Próximos Pagos
                                        </h3>
                                        {stats.gastos_proximos.map(g => (
                                            <div key={g.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                                                <div>
                                                    <div className="font-mono text-sm text-white">{g.concepto}</div>
                                                    <div className="font-mono text-xs" style={{ color: g.categoria_color }}>{g.categoria_nombre}</div>
                                                </div>
                                                <div>
                                                    <div className="font-mono text-sm text-yellow-400 text-right">{fmt(Number(g.monto))}</div>
                                                    <div className="font-mono text-xs text-gray-500 text-right">
                                                        {g.fecha_vencimiento ? new Date(g.fecha_vencimiento).toLocaleDateString('es-MX') : '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {(!stats?.facturas_vencidas?.length && !stats?.gastos_proximos?.length) && (
                                    <div className="col-span-2 bg-zinc-900/50 border border-gray-700 rounded-lg p-8 text-center">
                                        <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                        <p className="font-mono text-gray-400">Sin alertas financieras</p>
                                        <p className="font-mono text-gray-600 text-sm mt-1">Crea facturas o gastos para ver métricas aquí</p>
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
