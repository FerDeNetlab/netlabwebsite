'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Plus, Search, Receipt } from 'lucide-react'

interface Factura {
    id: string; numero_factura: string; concepto: string; total: number; tipo: string;
    cliente_nombre: string; cliente_empresa: string; fecha_vencimiento: string;
    recurrente: boolean; dia_mes: number;
}

export default function FacturasPage() {
    const { status } = useSession()
    const router = useRouter()
    const [facturas, setFacturas] = useState<Factura[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('todos')

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/facturas').then(r => r.json()).then(data => { setFacturas(data); setLoading(false) }).catch(() => setLoading(false))
    }, [status])

    const filtered = facturas.filter(f => {
        const matchSearch = (f.numero_factura + f.concepto + f.cliente_nombre).toLowerCase().includes(search.toLowerCase())
        const matchTipo = filtroTipo === 'todos' || f.tipo === filtroTipo
        return matchSearch && matchTipo
    })

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

                            {/* Filters */}
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
