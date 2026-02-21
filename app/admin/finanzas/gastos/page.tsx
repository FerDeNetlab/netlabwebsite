'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Plus, Search, CreditCard, CheckCircle, X, CalendarClock, Zap, Users, Wrench } from 'lucide-react'

interface Gasto {
    id: string; concepto: string; monto: number; estado: string; proveedor: string;
    fecha_vencimiento: string; fecha_pago: string; categoria_nombre: string; categoria_color: string;
    recurrente: boolean; dia_mes: number; subtipo: string
}
interface Categoria { id: string; nombre: string; color: string }

export default function GastosPage() {
    const { status } = useSession()
    const router = useRouter()
    const [gastos, setGastos] = useState<Gasto[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState<false | 'fijo' | 'unico'>(false)
    const [form, setForm] = useState({
        categoria_id: '', concepto: '', monto: '', fecha_vencimiento: '', proveedor: '',
        recurrente: false, dia_mes: '', subtipo: 'general', notas: ''
    })

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchData = () => {
        fetch('/api/gastos').then(r => r.json()).then(data => {
            setGastos(data.gastos || []); setCategorias(data.categorias || []); setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => { if (status === 'authenticated') fetchData() }, [status])

    const openForm = (tipo: 'fijo' | 'unico') => {
        setForm({
            categoria_id: '', concepto: '', monto: '', fecha_vencimiento: '', proveedor: '',
            recurrente: tipo === 'fijo', dia_mes: '', subtipo: 'general', notas: ''
        })
        setShowForm(tipo)
    }

    const handleCreate = async () => {
        const r = await fetch('/api/gastos', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form, monto: Number(form.monto),
                dia_mes: form.dia_mes ? Number(form.dia_mes) : null,
                recurrente: showForm === 'fijo',
            })
        })
        if (r.ok) { setShowForm(false); fetchData() }
        else alert('Error al crear gasto')
    }

    const handlePagar = async (id: string) => {
        const r = await fetch(`/api/gastos/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'pagado', fecha_pago: new Date().toISOString().split('T')[0] })
        })
        if (r.ok) fetchData()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar gasto?')) return
        await fetch(`/api/gastos/${id}`, { method: 'DELETE' })
        fetchData()
    }

    const filtered = gastos.filter(g => (g.concepto + g.proveedor + g.categoria_nombre).toLowerCase().includes(search.toLowerCase()))
    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/gastos">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-red-400">Gastos</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Gastos fijos y únicos</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => openForm('fijo')} className="font-mono gap-2 bg-orange-600 hover:bg-orange-700" size="sm">
                                        <CalendarClock className="h-4 w-4" /> Gasto Fijo
                                    </Button>
                                    <Button onClick={() => openForm('unico')} className="font-mono gap-2 bg-red-600 hover:bg-red-700" size="sm">
                                        <Zap className="h-4 w-4" /> Gasto Único
                                    </Button>
                                </div>
                            </div>

                            {/* Create Form */}
                            <AnimatePresence>
                                {showForm && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className={`bg-zinc-900/50 border rounded-lg p-5 space-y-4 ${showForm === 'fijo' ? 'border-orange-500/30' : 'border-red-500/30'}`}>
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-mono text-sm flex items-center gap-2 ${showForm === 'fijo' ? 'text-orange-400' : 'text-red-400'}`}>
                                                {showForm === 'fijo' ? <><CalendarClock className="h-4 w-4" /> Nuevo Gasto Fijo</> : <><Zap className="h-4 w-4" /> Nuevo Gasto Único</>}
                                            </h3>
                                            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-gray-500" /></button>
                                        </div>

                                        {/* Subtipo toggle (only for fijo) */}
                                        {showForm === 'fijo' && (
                                            <div className="flex gap-3">
                                                <button onClick={() => setForm(f => ({ ...f, subtipo: 'general' }))}
                                                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 transition-all font-mono text-sm ${form.subtipo === 'general' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-gray-700 text-gray-500'}`}>
                                                    <Wrench className="h-4 w-4" />
                                                    <div className="text-left">
                                                        <div className="font-bold text-xs">General</div>
                                                        <div className="text-[10px] opacity-70">Renta, servicios, software...</div>
                                                    </div>
                                                </button>
                                                <button onClick={() => setForm(f => ({ ...f, subtipo: 'sueldo' }))}
                                                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 transition-all font-mono text-sm ${form.subtipo === 'sueldo' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-gray-700 text-gray-500'}`}>
                                                    <Users className="h-4 w-4" />
                                                    <div className="text-left">
                                                        <div className="font-bold text-xs">Sueldo / Nómina</div>
                                                        <div className="text-[10px] opacity-70">Pagos a empleados</div>
                                                    </div>
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Concepto *</label>
                                                <input type="text" value={form.concepto} onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))}
                                                    placeholder={showForm === 'fijo' && form.subtipo === 'sueldo' ? 'Ej: Sueldo Juan Pérez' : 'Ej: Renta oficina'}
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none mt-1" />
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Monto *</label>
                                                <input type="number" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} placeholder="0.00"
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none mt-1" />
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Categoría</label>
                                                <select value={form.categoria_id} onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none mt-1">
                                                    <option value="">Sin categoría</option>
                                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                                </select>
                                            </div>

                                            {showForm === 'fijo' ? (
                                                <div>
                                                    <label className="font-mono text-xs text-gray-500">Día del mes *</label>
                                                    <select value={form.dia_mes} onChange={e => setForm(f => ({ ...f, dia_mes: e.target.value }))}
                                                        className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none mt-1">
                                                        <option value="">Seleccionar día</option>
                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d =>
                                                            <option key={d} value={d}>Día {d}</option>
                                                        )}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div>
                                                    <label className="font-mono text-xs text-gray-500">Fecha de vencimiento</label>
                                                    <input type="date" value={form.fecha_vencimiento} onChange={e => setForm(f => ({ ...f, fecha_vencimiento: e.target.value }))}
                                                        className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none mt-1" />
                                                </div>
                                            )}

                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Proveedor</label>
                                                <input type="text" value={form.proveedor} onChange={e => setForm(f => ({ ...f, proveedor: e.target.value }))}
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-red-500 focus:outline-none mt-1" />
                                            </div>
                                        </div>
                                        <Button onClick={handleCreate} className={`font-mono ${showForm === 'fijo' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`} size="sm"
                                            disabled={!form.concepto || !form.monto || (showForm === 'fijo' && !form.dia_mes)}>
                                            {showForm === 'fijo' ? 'Guardar Gasto Fijo' : 'Guardar Gasto Único'}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input type="text" placeholder="Buscar gastos..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-red-500 focus:outline-none" />
                            </div>

                            {/* Table */}
                            {filtered.length > 0 ? (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-zinc-800/50 border-b border-gray-700">
                                            <tr className="font-mono text-xs text-gray-400">
                                                <th className="text-left p-3">Concepto</th><th className="text-left p-3">Tipo</th>
                                                <th className="text-left p-3">Categoría</th><th className="text-left p-3">Proveedor</th>
                                                <th className="text-right p-3">Monto</th><th className="text-center p-3">Estado</th>
                                                <th className="text-right p-3">Día/Vence</th><th className="p-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {filtered.map(g => (
                                                <tr key={g.id} className="border-b border-gray-800 last:border-0 hover:bg-zinc-800/30">
                                                    <td className="p-3 text-gray-300">{g.concepto}</td>
                                                    <td className="p-3">
                                                        {g.recurrente ? (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${g.subtipo === 'sueldo' ? 'text-purple-400 bg-purple-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                                                                {g.subtipo === 'sueldo' ? '🧑 Sueldo' : '📌 Fijo'}
                                                            </span>
                                                        ) : (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] text-red-400 bg-red-400/10">⚡ Único</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded" style={{ color: g.categoria_color, backgroundColor: `${g.categoria_color}15` }}>{g.categoria_nombre || '—'}</span></td>
                                                    <td className="p-3 text-gray-400">{g.proveedor || '—'}</td>
                                                    <td className="p-3 text-right text-red-400">{fmt(g.monto)}</td>
                                                    <td className="p-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded border text-xs ${g.estado === 'pagado' ? 'text-green-400 bg-green-400/10 border-green-500/30' : 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30'}`}>
                                                            {g.estado}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right text-gray-400">
                                                        {g.recurrente && g.dia_mes ? `Día ${g.dia_mes}` : g.fecha_vencimiento ? new Date(g.fecha_vencimiento).toLocaleDateString('es-MX') : '—'}
                                                    </td>
                                                    <td className="p-3 text-right space-x-1">
                                                        {g.estado === 'pendiente' && (
                                                            <button onClick={() => handlePagar(g.id)} className="text-green-400 hover:text-green-300" title="Marcar pagado"><CheckCircle className="h-4 w-4 inline" /></button>
                                                        )}
                                                        <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-300" title="Eliminar"><X className="h-4 w-4 inline" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">{search ? 'Sin resultados' : 'No hay gastos registrados'}</p>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
