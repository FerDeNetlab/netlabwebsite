'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react'

interface FlujoData {
    proyeccion: { fecha: string; monto: number; saldo: number; tipo: string }[]
    resumen: { saldo_actual: number; por_cobrar_90d: number; por_pagar_90d: number; saldo_proyectado: number }
}

export default function FlujoPage() {
    const { status } = useSession()
    const router = useRouter()
    const [data, setData] = useState<FlujoData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/finanzas/flujo').then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
    }, [status])

    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    const resumen = data?.resumen || { saldo_actual: 0, por_cobrar_90d: 0, por_pagar_90d: 0, saldo_proyectado: 0 }
    const proyeccion = data?.proyeccion || []

    // Calculate max for bar chart scaling
    const maxAbs = Math.max(...proyeccion.map(p => Math.abs(p.saldo)), 1)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/flujo-efectivo">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-purple-400">Flujo de Efectivo</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Proyección a 90 días</p>
                                </div>
                            </div>

                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-zinc-900/50 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-blue-400" /><span className="text-xs font-mono text-gray-400">SALDO ACTUAL</span></div>
                                    <div className={`text-xl font-mono ${resumen.saldo_actual >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{fmt(resumen.saldo_actual)}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-green-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-green-400" /><span className="text-xs font-mono text-gray-400">POR COBRAR (90d)</span></div>
                                    <div className="text-xl font-mono text-green-400">{fmt(resumen.por_cobrar_90d)}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-red-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2"><TrendingDown className="h-4 w-4 text-red-400" /><span className="text-xs font-mono text-gray-400">POR PAGAR (90d)</span></div>
                                    <div className="text-xl font-mono text-red-400">{fmt(resumen.por_pagar_90d)}</div>
                                </div>
                                <div className={`bg-zinc-900/50 border rounded-lg p-4 ${resumen.saldo_proyectado >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                                    <div className="flex items-center gap-2 mb-2"><BarChart3 className={`h-4 w-4 ${resumen.saldo_proyectado >= 0 ? 'text-green-400' : 'text-red-400'}`} /><span className="text-xs font-mono text-gray-400">SALDO PROYECTADO</span></div>
                                    <div className={`text-xl font-mono ${resumen.saldo_proyectado >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(resumen.saldo_proyectado)}</div>
                                </div>
                            </div>

                            {/* Cash flow chart (CSS bar chart) */}
                            {proyeccion.length > 0 ? (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-5">
                                    <h3 className="font-mono text-purple-400 text-sm mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Movimientos Proyectados</h3>
                                    <div className="space-y-2">
                                        {proyeccion.map((p, i) => {
                                            const pct = Math.abs(p.monto) / maxAbs * 100
                                            const isIngreso = p.tipo === 'ingreso'
                                            return (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-24 font-mono text-xs text-gray-500 shrink-0">
                                                        {p.fecha ? new Date(p.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }) : '—'}
                                                    </div>
                                                    <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden relative">
                                                        <div className={`h-full rounded ${isIngreso ? 'bg-green-500/30' : 'bg-red-500/30'}`}
                                                            style={{ width: `${Math.max(pct, 2)}%` }} />
                                                        <span className={`absolute inset-0 flex items-center px-2 font-mono text-xs ${isIngreso ? 'text-green-400' : 'text-red-400'}`}>
                                                            {isIngreso ? '+' : '-'}{fmt(Math.abs(p.monto))}
                                                        </span>
                                                    </div>
                                                    <div className={`w-28 font-mono text-xs text-right shrink-0 ${p.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        Saldo: {fmt(p.saldo)}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-8 text-center">
                                    <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">Sin movimientos proyectados</p>
                                    <p className="font-mono text-gray-600 text-sm mt-1">Crea facturas y gastos con fecha de vencimiento para ver proyecciones</p>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
