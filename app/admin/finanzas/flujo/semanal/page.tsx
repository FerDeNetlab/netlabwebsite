'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Wallet, ArrowRight } from 'lucide-react'

interface ItemIng { id: string; monto: number; concepto: string; cliente?: string; fecha: string }
interface ItemEg { id: string; monto: number; concepto: string; proveedor?: string; fecha: string; bolsa_origen?: string }
interface Semana {
    semana: number; inicio: string; fin: string;
    ingresos: number; egresos: number; neto: number; balance_acumulado: number;
    items_ingreso: ItemIng[]; items_egreso: ItemEg[]
}

export default function FlujoSemanalPage() {
    const { status } = useSession()
    const router = useRouter()
    const [data, setData] = useState<{ saldo_actual: number; semanas: Semana[] } | null>(null)
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<number | null>(null)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])
    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/finanzas/flujo-semanal').then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
    }, [status])

    const fmt = (n: number) => `$${Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    const fmtSign = (n: number) => `${n >= 0 ? '+' : '-'}${fmt(n)}`

    if (status === 'loading' || loading || !data) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    const totalIng = data.semanas.reduce((s, w) => s + w.ingresos, 0)
    const totalEg = data.semanas.reduce((s, w) => s + w.egresos, 0)
    const balanceFinal = data.semanas[data.semanas.length - 1]?.balance_acumulado ?? data.saldo_actual

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/flujo/semanal">
                        <div className="p-6 space-y-6">
                            <div className="border-b border-cyan-500/20 pb-4 flex items-center justify-between">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas/flujo')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                        <ArrowLeft className="h-4 w-4" /> Flujo mensual
                                    </Button>
                                    <h1 className="text-3xl font-mono text-cyan-400">Flujo de Efectivo · 4 Semanas</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Proyección detallada semana por semana</p>
                                </div>
                            </div>

                            {/* Resumen */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2"><Wallet className="h-4 w-4 text-gray-400" /><span className="font-mono text-xs text-gray-400">Saldo actual</span></div>
                                    <div className="font-mono text-xl text-white">{fmt(data.saldo_actual)}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-green-400" /><span className="font-mono text-xs text-gray-400">Entra (4 sem)</span></div>
                                    <div className="font-mono text-xl text-green-400">+{fmt(totalIng)}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-red-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2"><TrendingDown className="h-4 w-4 text-red-400" /><span className="font-mono text-xs text-gray-400">Sale (4 sem)</span></div>
                                    <div className="font-mono text-xl text-red-400">-{fmt(totalEg)}</div>
                                </div>
                                <div className={`bg-zinc-900/50 border rounded-lg p-4 ${balanceFinal >= 0 ? 'border-cyan-500/20' : 'border-red-500/40'}`}>
                                    <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-cyan-400" /><span className="font-mono text-xs text-gray-400">Saldo en 4 sem</span></div>
                                    <div className={`font-mono text-xl ${balanceFinal >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>{fmt(balanceFinal)}</div>
                                </div>
                            </div>

                            {/* Semanas */}
                            <div className="space-y-3">
                                {data.semanas.map((s) => {
                                    const isOpen = expanded === s.semana
                                    return (
                                        <div key={s.semana} className={`bg-zinc-900/50 border rounded-lg overflow-hidden transition-colors ${s.balance_acumulado < 0 ? 'border-red-500/40' : 'border-gray-700 hover:border-cyan-500/30'}`}>
                                            <button onClick={() => setExpanded(isOpen ? null : s.semana)}
                                                className="w-full p-4 flex items-center gap-4 text-left">
                                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-cyan-400 text-lg shrink-0">
                                                    {s.semana}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-mono text-sm text-gray-300">
                                                        Semana {s.semana} · {new Date(s.inicio).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} → {new Date(s.fin).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    <div className="font-mono text-[11px] text-gray-500 mt-0.5">
                                                        {s.items_ingreso.length} ingreso{s.items_ingreso.length !== 1 ? 's' : ''} · {s.items_egreso.length} egreso{s.items_egreso.length !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3 text-right font-mono">
                                                    <div>
                                                        <div className="text-[10px] text-gray-500">Entra</div>
                                                        <div className="text-green-400 text-sm">+{fmt(s.ingresos)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-gray-500">Sale</div>
                                                        <div className="text-red-400 text-sm">-{fmt(s.egresos)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-gray-500">Saldo</div>
                                                        <div className={`text-sm ${s.balance_acumulado >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>{fmt(s.balance_acumulado)}</div>
                                                    </div>
                                                </div>
                                                <ArrowRight className={`h-4 w-4 text-gray-500 transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                                            </button>
                                            {isOpen && (s.items_ingreso.length > 0 || s.items_egreso.length > 0) && (
                                                <div className="border-t border-gray-800 p-4 space-y-4">
                                                    {s.items_ingreso.length > 0 && (
                                                        <div>
                                                            <h4 className="font-mono text-xs text-green-400 mb-2">Ingresos esperados</h4>
                                                            <div className="space-y-1">
                                                                {s.items_ingreso.map((it) => (
                                                                    <div key={it.id} className="flex items-center gap-3 text-xs font-mono py-1 px-2 hover:bg-zinc-800/50 rounded">
                                                                        <span className="text-gray-500 w-16">{new Date(it.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
                                                                        <span className="text-gray-300 flex-1 truncate">{it.cliente || it.concepto}</span>
                                                                        <span className="text-green-400">+{fmt(it.monto)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {s.items_egreso.length > 0 && (
                                                        <div>
                                                            <h4 className="font-mono text-xs text-red-400 mb-2">Egresos esperados</h4>
                                                            <div className="space-y-1">
                                                                {s.items_egreso.map((it) => (
                                                                    <div key={it.id} className="flex items-center gap-3 text-xs font-mono py-1 px-2 hover:bg-zinc-800/50 rounded">
                                                                        <span className="text-gray-500 w-16">{new Date(it.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
                                                                        <span className="text-gray-300 flex-1 truncate">{it.proveedor || it.concepto}</span>
                                                                        {it.bolsa_origen && <span className="text-purple-400 text-[10px] px-1.5 py-0.5 rounded bg-purple-400/10">{it.bolsa_origen.replace('_', ' ')}</span>}
                                                                        <span className="text-red-400">-{fmt(it.monto)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
