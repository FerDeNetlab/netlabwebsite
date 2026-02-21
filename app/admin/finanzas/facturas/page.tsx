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
    id: string; numero_factura: string; concepto: string; total: number; estado: string; tipo: string;
    cliente_nombre: string; cliente_empresa: string; fecha_vencimiento: string; total_pagado: number
}

const estadoColors: Record<string, string> = {
    pendiente: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30',
    parcial: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
    pagada: 'text-green-400 bg-green-400/10 border-green-500/30',
    vencida: 'text-red-400 bg-red-400/10 border-red-500/30',
    cancelada: 'text-gray-400 bg-gray-400/10 border-gray-500/30',
}

export default function FacturasPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [facturas, setFacturas] = useState<Factura[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/facturas').then(r => r.json()).then(data => { setFacturas(data); setLoading(false) }).catch(() => setLoading(false))
    }, [status])

    const filtered = facturas.filter(f => {
        const matchSearch = (f.numero_factura + f.concepto + f.cliente_nombre).toLowerCase().includes(search.toLowerCase())
        const isOverdue = f.estado === 'pendiente' && f.fecha_vencimiento && new Date(f.fecha_vencimiento) < new Date()
        const effectiveEstado = isOverdue ? 'vencida' : f.estado
        const matchEstado = filtroEstado === 'todos' || effectiveEstado === filtroEstado
        return matchSearch && matchEstado
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
                    <TerminalFrame title="root@netlab:~/finanzas/facturas">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                        <ArrowLeft className="h-4 w-4" /> Finanzas
                                    </Button>
                                    <h1 className="text-3xl font-mono text-green-400">Cuentas por Cobrar</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Facturas y pagos comprometidos</p>
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
                                {['todos', 'pendiente', 'parcial', 'pagada', 'vencida'].map(e => (
                                    <button key={e} onClick={() => setFiltroEstado(e)}
                                        className={`px-3 py-1.5 rounded font-mono text-xs border transition-all ${filtroEstado === e ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                        {e === 'todos' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
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
                                                <th className="text-right p-3">Total</th>
                                                <th className="text-right p-3">Pagado</th>
                                                <th className="text-center p-3">Estado</th>
                                                <th className="text-right p-3">Vencimiento</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {filtered.map((f) => {
                                                const isOverdue = f.estado === 'pendiente' && f.fecha_vencimiento && new Date(f.fecha_vencimiento) < new Date()
                                                const displayEstado = isOverdue ? 'vencida' : f.estado
                                                return (
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
                                                        <td className="p-3 text-right text-gray-400">{fmt(f.total_pagado)}</td>
                                                        <td className="p-3 text-center">
                                                            <span className={`px-2 py-0.5 rounded border text-xs ${estadoColors[displayEstado] || ''}`}>
                                                                {displayEstado}
                                                            </span>
                                                        </td>
                                                        <td className={`p-3 text-right ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                                                            {f.fecha_vencimiento ? new Date(f.fecha_vencimiento).toLocaleDateString('es-MX') : '—'}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Receipt className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">{search ? 'Sin resultados para esa búsqueda' : 'No hay facturas registradas'}</p>
                                    <p className="font-mono text-gray-600 text-sm mt-1">Registra facturas generadas en Odoo</p>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
