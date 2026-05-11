'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Info, X } from 'lucide-react'

interface BolsaInfo {
    bolsa: string; nombre: string; descripcion: string; color: string;
    ingresos_asignados: number; egresos_consumidos: number; egresos_consumidos_count: number;
    egresos_pendientes: number; egresos_pendientes_count: number;
    saldo_disponible: number; utilizacion_porcentaje: number; proyeccion_neto: number;
}

interface DetalleIngreso { id: string; monto: number; fecha_pago: string; numero_factura: string; concepto: string; cliente_nombre?: string }
interface DetalleEgreso { id: string; concepto: string; monto: number; estado: string; proveedor?: string; fecha_pago?: string; fecha_vencimiento?: string }

export default function BolsasPage() {
    const { status } = useSession()
    const router = useRouter()
    const now = new Date()
    const [mes, setMes] = useState(now.getMonth() + 1)
    const [ano, setAno] = useState(now.getFullYear())
    const [data, setData] = useState<{ bolsas: BolsaInfo[]; totales: { ingresos_totales: number; egresos_totales: number; saldo_total: number } } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [detalle, setDetalle] = useState<{ bolsa: BolsaInfo; ingresos: DetalleIngreso[]; egresos: DetalleEgreso[] } | null>(null)
    const [loadingDetalle, setLoadingDetalle] = useState(false)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchData = () => {
        setLoading(true)
        setError(null)
        fetch(`/api/finanzas/bolsas?mes=${mes}&ano=${ano}`)
            .then(r => r.json())
            .then(d => {
                if (d.error) { setError(d.error); setData(null) }
                else { setData(d) }
            })
            .catch(() => setError('No se pudo conectar con el servidor'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { if (status === 'authenticated') fetchData() }, [status, mes, ano])

    const openDetalle = async (b: BolsaInfo) => {
        setLoadingDetalle(true)
        setDetalle({ bolsa: b, ingresos: [], egresos: [] })
        const r = await fetch(`/api/finanzas/bolsas/${b.bolsa}?mes=${mes}&ano=${ano}`)
        if (r.ok) {
            const d = await r.json()
            setDetalle({ bolsa: b, ingresos: d.ingresos || [], egresos: d.egresos || [] })
        }
        setLoadingDetalle(false)
    }

    const fmt = (n: number) => `$${Math.abs(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    if (error || !data) return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
                <TerminalFrame title="root@netlab:~/finanzas/bolsas">
                    <div className="p-6 space-y-4">
                        <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 font-mono text-sm text-red-400">
                            <p className="font-bold mb-1">Error al cargar las bolsas</p>
                            <p className="text-xs text-red-300/70">{error || 'Respuesta inesperada del servidor'}</p>
                            <p className="text-xs text-gray-500 mt-3">
                                Si acabas de activar el módulo SAF, asegúrate de haber ejecutado <span className="text-yellow-400">scripts/saf-migration.sql</span> en Neon.
                            </p>
                        </div>
                        <Button onClick={fetchData} className="bg-green-600 hover:bg-green-700 font-mono">Reintentar</Button>
                    </div>
                </TerminalFrame>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/bolsas">
                        <div className="p-6 space-y-6">
                            <div className="border-b border-purple-500/20 pb-4 flex items-start justify-between gap-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-purple-400">Bolsas Presupuestarias</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">SAF · 4 bolsas operativas con asignación automática</p>
                                </div>
                                <div className="flex gap-2">
                                    <select value={mes} onChange={e => setMes(Number(e.target.value))}
                                        className="bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-purple-500 focus:outline-none">
                                        {meses.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                                    </select>
                                    <select value={ano} onChange={e => setAno(Number(e.target.value))}
                                        className="bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-purple-500 focus:outline-none">
                                        {[ano - 1, ano, ano + 1].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Totales */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-green-400" /><span className="font-mono text-xs text-gray-400">Total ingresos asignados</span></div>
                                    <div className="font-mono text-2xl text-green-400">+{fmt(data.totales.ingresos_totales)}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-red-500/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1"><TrendingDown className="h-4 w-4 text-red-400" /><span className="font-mono text-xs text-gray-400">Total consumido</span></div>
                                    <div className="font-mono text-2xl text-red-400">-{fmt(data.totales.egresos_totales)}</div>
                                </div>
                                <div className={`bg-zinc-900/50 border rounded-lg p-4 ${data.totales.saldo_total >= 0 ? 'border-purple-500/20' : 'border-red-500/40'}`}>
                                    <div className="flex items-center gap-2 mb-1"><Wallet className="h-4 w-4 text-purple-400" /><span className="font-mono text-xs text-gray-400">Saldo total</span></div>
                                    <div className={`font-mono text-2xl ${data.totales.saldo_total >= 0 ? 'text-purple-400' : 'text-red-400'}`}>{fmt(data.totales.saldo_total)}</div>
                                </div>
                            </div>

                            {/* Bolsas grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.bolsas.map((b) => {
                                    const pct = Math.min(100, b.utilizacion_porcentaje)
                                    const overUsed = b.utilizacion_porcentaje > 100
                                    return (
                                        <button key={b.bolsa} onClick={() => openDetalle(b)}
                                            className="text-left bg-zinc-900/50 border rounded-lg p-5 hover:bg-zinc-900/80 transition-colors"
                                            style={{ borderColor: `${b.color}40` }}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-mono text-lg" style={{ color: b.color }}>{b.nombre}</h3>
                                                    <p className="font-mono text-[11px] text-gray-500 mt-0.5 max-w-md">{b.descripcion}</p>
                                                </div>
                                                <Info className="h-4 w-4 text-gray-600" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div>
                                                    <div className="font-mono text-[10px] text-gray-500">Asignado</div>
                                                    <div className="font-mono text-sm text-green-400">+{fmt(b.ingresos_asignados)}</div>
                                                </div>
                                                <div>
                                                    <div className="font-mono text-[10px] text-gray-500">Consumido</div>
                                                    <div className="font-mono text-sm text-red-400">-{fmt(b.egresos_consumidos)} <span className="text-gray-600">({b.egresos_consumidos_count})</span></div>
                                                </div>
                                                <div>
                                                    <div className="font-mono text-[10px] text-gray-500">Disponible</div>
                                                    <div className={`font-mono text-lg font-bold ${b.saldo_disponible >= 0 ? 'text-white' : 'text-red-400'}`}>{fmt(b.saldo_disponible)}</div>
                                                </div>
                                                <div>
                                                    <div className="font-mono text-[10px] text-gray-500">Pendiente del mes</div>
                                                    <div className="font-mono text-sm text-yellow-400">{fmt(b.egresos_pendientes)} <span className="text-gray-600">({b.egresos_pendientes_count})</span></div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between font-mono text-[10px] text-gray-500">
                                                    <span>Utilización</span>
                                                    <span className={overUsed ? 'text-red-400' : ''}>{b.utilizacion_porcentaje.toFixed(0)}%</span>
                                                </div>
                                                <div className="h-2 bg-zinc-800 rounded overflow-hidden">
                                                    <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: overUsed ? '#ef4444' : b.color }} />
                                                </div>
                                                <div className="font-mono text-[10px] text-gray-500 mt-2">
                                                    Proyección al cierre del mes: <span className={b.proyeccion_neto >= 0 ? 'text-green-400' : 'text-red-400'}>{fmt(b.proyeccion_neto)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="bg-zinc-900/30 border border-gray-800 rounded p-4 font-mono text-xs text-gray-400">
                                <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong className="text-purple-400">Asignación automática (Opción A):</strong> los ingresos cobrados se asignan a una bolsa según su <em>tipo_ingreso</em> (Fijo→Operación Base, Run-rate→Operación Variable, Variable→Crecimiento). Los gastos consumen de la bolsa indicada en su <em>bolsa_origen</em>. La Reserva solo se nutre de transferencias manuales (utilidad sobrante).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>

                {/* Modal de detalle */}
                {detalle && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4" onClick={() => setDetalle(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-zinc-950 border rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto"
                            style={{ borderColor: `${detalle.bolsa.color}50` }}>
                            <div className="sticky top-0 bg-zinc-950 border-b border-gray-800 p-4 flex items-center justify-between">
                                <h3 className="font-mono text-xl" style={{ color: detalle.bolsa.color }}>{detalle.bolsa.nombre} · {meses[mes - 1]} {ano}</h3>
                                <button onClick={() => setDetalle(null)}><X className="h-5 w-5 text-gray-400" /></button>
                            </div>
                            {loadingDetalle ? (
                                <div className="p-8 text-center font-mono text-gray-400">Cargando...</div>
                            ) : (
                                <div className="p-4 space-y-6">
                                    <div>
                                        <h4 className="font-mono text-xs text-green-400 mb-2">Ingresos asignados ({detalle.ingresos.length})</h4>
                                        {detalle.ingresos.length === 0 ? <p className="font-mono text-xs text-gray-500">Sin ingresos en este período</p> : (
                                            <table className="w-full font-mono text-xs">
                                                <thead className="text-gray-500 border-b border-gray-800">
                                                    <tr><th className="text-left p-2">Fecha</th><th className="text-left p-2">Factura</th><th className="text-left p-2">Cliente</th><th className="text-right p-2">Monto</th></tr>
                                                </thead>
                                                <tbody>
                                                    {detalle.ingresos.map(i => (
                                                        <tr key={i.id} className="border-b border-gray-900 hover:bg-zinc-900/50">
                                                            <td className="p-2 text-gray-400">{new Date(i.fecha_pago).toLocaleDateString('es-MX')}</td>
                                                            <td className="p-2 text-gray-300">{i.numero_factura}</td>
                                                            <td className="p-2 text-gray-400">{i.cliente_nombre || '—'}</td>
                                                            <td className="p-2 text-right text-green-400">+{fmt(i.monto)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-mono text-xs text-red-400 mb-2">Egresos ({detalle.egresos.length})</h4>
                                        {detalle.egresos.length === 0 ? <p className="font-mono text-xs text-gray-500">Sin egresos en este período</p> : (
                                            <table className="w-full font-mono text-xs">
                                                <thead className="text-gray-500 border-b border-gray-800">
                                                    <tr><th className="text-left p-2">Fecha</th><th className="text-left p-2">Concepto</th><th className="text-left p-2">Proveedor</th><th className="text-center p-2">Estado</th><th className="text-right p-2">Monto</th></tr>
                                                </thead>
                                                <tbody>
                                                    {detalle.egresos.map(g => (
                                                        <tr key={g.id} className="border-b border-gray-900 hover:bg-zinc-900/50">
                                                            <td className="p-2 text-gray-400">{(g.fecha_pago || g.fecha_vencimiento) ? new Date((g.fecha_pago || g.fecha_vencimiento)!).toLocaleDateString('es-MX') : '—'}</td>
                                                            <td className="p-2 text-gray-300">{g.concepto}</td>
                                                            <td className="p-2 text-gray-400">{g.proveedor || '—'}</td>
                                                            <td className="p-2 text-center">
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] ${g.estado === 'pagado' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>{g.estado}</span>
                                                            </td>
                                                            <td className="p-2 text-right text-red-400">-{fmt(g.monto)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}
