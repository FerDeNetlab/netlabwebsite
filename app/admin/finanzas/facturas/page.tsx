'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Plus, Search, Receipt, ChevronLeft, ChevronRight, Landmark } from 'lucide-react'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface Factura {
    id: string; numero_factura: string; concepto: string; total: number; tipo: string;
    cliente_nombre: string; cliente_empresa: string; fecha_vencimiento: string;
    recurrente: boolean; dia_mes: number; estado: string;
    movimiento_bancario_id?: string | null;
    fecha_pago_banco?: string | null;
    banco_descripcion?: string | null;
}

export default function FacturasPage() {
    const { status } = useSession()
    const router = useRouter()
    const [facturas, setFacturas] = useState<Factura[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('todos')
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'con_banco' | 'sin_banco'>('todos')
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1) }

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/facturas').then(r => r.json()).then(data => { setFacturas(data); setLoading(false) }).catch(() => setLoading(false))
    }, [status])

    const lastDay = new Date(anio, mes, 0).getDate()
    const filtered = facturas.filter(f => {
        const matchSearch = (f.numero_factura + f.concepto + f.cliente_nombre).toLowerCase().includes(search.toLowerCase())
        const matchTipo = filtroTipo === 'todos' || f.tipo === filtroTipo
        let matchMes = f.recurrente
        if (!f.recurrente && f.fecha_vencimiento) {
            const d = new Date(String(f.fecha_vencimiento).split('T')[0] + 'T12:00:00')
            // show if vence this month OR vence in a past month (rolling unpaid)
            const vencMes = d.getMonth() + 1; const vencAnio = d.getFullYear()
            matchMes = (vencAnio < anio) || (vencAnio === anio && vencMes <= mes)
        }
        const matchBanco = filtroEstado === 'todos' ? true : filtroEstado === 'con_banco' ? !!f.movimiento_bancario_id : !f.movimiento_bancario_id
        return matchSearch && matchTipo && matchMes && matchBanco
    })
    const totalMes = filtered.reduce((s, f) => s + Number(f.total), 0)
    const cobradoBanco = filtered.filter(f => f.movimiento_bancario_id).reduce((s, f) => s + f.total, 0)
    const sinConfirmar = totalMes - cobradoBanco

    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/cuentas-por-cobrar">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                        <ArrowLeft className="h-4 w-4" /> Finanzas
                                    </Button>
                                    <h1 className="text-3xl font-mono text-green-400">Cuentas por Cobrar</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Definiciones de ingresos esperados</p>
                                </div>
                                <Button onClick={() => router.push('/admin/finanzas/facturas/nueva')} className="font-mono gap-2 bg-green-600 hover:bg-green-700" size="sm">
                                    <Plus className="h-4 w-4" /> Nueva Entrada
                                </Button>
                            </div>

                            {/* Month navigation */}
                            <div className="flex items-center justify-between bg-zinc-900/50 border border-green-500/20 rounded-lg px-4 py-2">
                                <button onClick={prevMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="text-center">
                                    <span className="font-mono text-green-400 text-sm font-bold">{MESES[mes - 1]} {anio}</span>
                                    <span className="font-mono text-gray-500 text-xs block">{filtered.length} entrada{filtered.length !== 1 ? 's' : ''}</span>
                                </div>
                                <button onClick={nextMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input type="text" placeholder="Buscar por número, concepto, cliente..."
                                            value={search} onChange={(e) => setSearch(e.target.value)}
                                            className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-green-500 focus:outline-none" />
                                    </div>
                                    {['todos', 'recurrente', 'unico'].map(t => (
                                        <button key={t} onClick={() => setFiltroTipo(t)}
                                            className={`px-3 py-1.5 rounded font-mono text-xs border transition-all ${filtroTipo === t ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                            {t === 'todos' ? 'Todos' : t === 'recurrente' ? '🔄 Recurrente' : '⚡ Único'}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {(['todos', 'con_banco', 'sin_banco'] as const).map(f => (
                                        <button key={f} onClick={() => setFiltroEstado(f)}
                                            className={`px-3 py-1 font-mono text-xs rounded border transition-colors ${filtroEstado === f ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                                            {f === 'todos' ? 'Todos' : f === 'con_banco' ? '🏦 Cobrado banco' : '⚠ Sin confirmar'}
                                        </button>
                                    ))}
                                </div>
                                {/* Resumen banco del mes */}
                                <div className="grid grid-cols-3 gap-3 pt-1">
                                    <div className="bg-zinc-900/60 border border-gray-700 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">por cobrar del mes</div>
                                        <div className="text-white text-sm font-bold">{fmt(totalMes)}</div>
                                    </div>
                                    <div className="bg-zinc-900/60 border border-green-500/20 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">🏦 cobrado banco</div>
                                        <div className="text-green-400 text-sm font-bold">{fmt(cobradoBanco)}</div>
                                    </div>
                                    <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">⚠ sin confirmar</div>
                                        <div className="text-yellow-400 text-sm font-bold">{fmt(sinConfirmar)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            {filtered.length > 0 ? (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-zinc-800/50 border-b border-gray-700">
                                            <tr className="font-mono text-xs text-gray-400">
                                                <th className="text-left p-3">Número</th>
                                                <th className="text-left p-3">Tipo</th>
                                                <th className="text-left p-3">Cliente</th>
                                                <th className="text-left p-3">Concepto</th>
                                                <th className="text-right p-3">Monto</th>
                                                <th className="text-center p-3">Banco</th>
                                                <th className="text-right p-3">Frecuencia</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {filtered.map((f) => (
                                                <tr key={f.id} onClick={() => router.push(`/admin/finanzas/facturas/${f.id}`)}
                                                    className="border-b border-gray-800 last:border-0 hover:bg-zinc-800/30 cursor-pointer transition-colors">
                                                    <td className="p-3 text-green-400">{f.numero_factura}</td>
                                                    <td className="p-3">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${f.tipo === 'recurrente' ? 'text-cyan-400 bg-cyan-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                                            {f.tipo === 'recurrente' ? '🔄 Recurrente' : '⚡ Único'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-300">{f.cliente_nombre}</td>
                                                    <td className="p-3 text-gray-400 max-w-[200px] truncate">{f.concepto}</td>
                                                    <td className="p-3 text-right text-white">{fmt(f.total)}</td>
                                                    <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                                                        {f.movimiento_bancario_id ? (
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/30">
                                                                    <Landmark className="h-3 w-3" /> cobrado
                                                                </span>
                                                                {f.fecha_pago_banco && <span className="text-[10px] text-gray-500">{new Date(f.fecha_pago_banco).toLocaleDateString('es-MX')}</span>}
                                                            </div>
                                                        ) : (
                                                            <a href="/admin/finanzas/conciliacion" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:border-yellow-500/50 transition-colors">
                                                                ⚠ ligar
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {f.recurrente && f.dia_mes ? (
                                                            <span className="text-cyan-400 text-xs">Día {f.dia_mes} / mes</span>
                                                        ) : f.fecha_vencimiento ? (
                                                            <span className="text-gray-400 text-xs">{new Date(f.fecha_vencimiento).toLocaleDateString('es-MX')}</span>
                                                        ) : (
                                                            <span className="text-gray-600 text-xs">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Receipt className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">{search ? 'Sin resultados para esa búsqueda' : 'No hay entradas registradas'}</p>
                                    <p className="font-mono text-gray-600 text-sm mt-1">Agrega ingresos esperados para rastrearlos</p>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
