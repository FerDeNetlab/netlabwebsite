'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Plus, X, Landmark, Trash2, Users } from 'lucide-react'

interface Aporte { id: string; socio: string; monto: number; concepto: string; fecha: string; notas: string }
interface SocioResumen { nombre: string; total: number; aportes: number }

export default function AportesPage() {
    const { status } = useSession()
    const router = useRouter()
    const [aportes, setAportes] = useState<Aporte[]>([])
    const [socios, setSocios] = useState<SocioResumen[]>([])
    const [totalGlobal, setTotalGlobal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ socio: '', monto: '', concepto: '', fecha: new Date().toISOString().split('T')[0], notas: '' })

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchData = () => {
        fetch('/api/finanzas/aportes').then(r => r.json()).then(data => {
            setAportes(data.aportes || [])
            setSocios(data.socios || [])
            setTotalGlobal(data.total_global || 0)
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => { if (status === 'authenticated') fetchData() }, [status])

    const handleSubmit = async () => {
        if (!form.socio || !form.monto) return alert('Socio y monto son requeridos')
        const r = await fetch('/api/finanzas/aportes', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, monto: Number(form.monto) })
        })
        if (r.ok) { setShowForm(false); setForm({ socio: '', monto: '', concepto: '', fecha: new Date().toISOString().split('T')[0], notas: '' }); fetchData() }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este aporte?')) return
        const r = await fetch(`/api/finanzas/aportes?id=${id}`, { method: 'DELETE' })
        if (r.ok) fetchData()
    }

    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
    const inputCls = "w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-amber-500 focus:outline-none"

    // Unique socio names for autocomplete
    const sociosUnicos = [...new Set(aportes.map(a => a.socio))]

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/aportes-capital">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-amber-400">Aportes de Capital</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Inversiones de socios</p>
                                </div>
                                <Button onClick={() => setShowForm(true)} className="font-mono gap-2 bg-amber-600 hover:bg-amber-700" size="sm">
                                    <Plus className="h-4 w-4" /> Registrar Aporte
                                </Button>
                            </div>

                            {/* KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-zinc-900/50 border border-amber-500/30 rounded-lg p-4">
                                    <div className="font-mono text-[10px] text-gray-500"><Landmark className="h-3 w-3 inline mr-1" />Capital Total</div>
                                    <div className="font-mono text-2xl text-amber-400 mt-1">{fmt(totalGlobal)}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                                    <div className="font-mono text-[10px] text-gray-500"><Users className="h-3 w-3 inline mr-1" />Socios</div>
                                    <div className="font-mono text-2xl text-white mt-1">{socios.length}</div>
                                </div>
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                                    <div className="font-mono text-[10px] text-gray-500">Total Aportes</div>
                                    <div className="font-mono text-2xl text-white mt-1">{aportes.length}</div>
                                </div>
                            </div>

                            {/* Per-socio cards */}
                            {socios.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {socios.map(s => (
                                        <div key={s.nombre} className="bg-zinc-900/50 border border-amber-500/20 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-mono text-white font-bold">{s.nombre}</div>
                                                    <div className="font-mono text-xs text-gray-500">{s.aportes} aporte{s.aportes !== 1 ? 's' : ''}</div>
                                                </div>
                                                <div className="font-mono text-lg text-amber-400 font-bold">{fmt(s.total)}</div>
                                            </div>
                                            {totalGlobal > 0 && (
                                                <div className="mt-2">
                                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${(s.total / totalGlobal) * 100}%` }} />
                                                    </div>
                                                    <div className="font-mono text-[10px] text-gray-500 mt-0.5">{Math.round((s.total / totalGlobal) * 100)}% del capital total</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Aporte Form */}
                            <AnimatePresence>
                                {showForm && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="bg-zinc-900/50 border border-amber-500/30 rounded-lg p-5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-mono text-amber-400 text-sm flex items-center gap-2"><Landmark className="h-4 w-4" /> Nuevo Aporte de Capital</h3>
                                            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-gray-500" /></button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Socio *</label>
                                                <select value={form.socio} onChange={e => setForm(f => ({ ...f, socio: e.target.value }))} className={inputCls + ' mt-1'}>
                                                    <option value="">Seleccionar socio</option>
                                                    <option value="Fer">Fer</option>
                                                    <option value="JC">JC</option>
                                                    <option value="Edgar">Edgar</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Monto *</label>
                                                <input type="number" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} placeholder="0.00" className={inputCls + ' mt-1'} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Concepto</label>
                                                <input type="text" value={form.concepto} onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))} placeholder="Ej: Pago sueldo Aarón" className={inputCls + ' mt-1'} />
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Fecha</label>
                                                <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className={inputCls + ' mt-1'} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Notas</label>
                                            <input type="text" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} className={inputCls + ' mt-1'} />
                                        </div>
                                        <Button onClick={handleSubmit} className="font-mono bg-amber-600 hover:bg-amber-700 gap-2" size="sm">
                                            <Landmark className="h-4 w-4" /> Registrar Aporte
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Aportes table */}
                            {aportes.length > 0 ? (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-zinc-800/50 border-b border-gray-700">
                                            <tr className="font-mono text-xs text-gray-400">
                                                <th className="text-left p-3">Fecha</th>
                                                <th className="text-left p-3">Socio</th>
                                                <th className="text-left p-3">Concepto</th>
                                                <th className="text-right p-3">Monto</th>
                                                <th className="text-right p-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {aportes.map(a => (
                                                <tr key={a.id} className="border-b border-gray-800 last:border-0 hover:bg-zinc-800/30">
                                                    <td className="p-3 text-gray-400">{new Date(a.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td className="p-3 text-amber-400 font-bold">{a.socio}</td>
                                                    <td className="p-3 text-gray-300">{a.concepto || '—'}</td>
                                                    <td className="p-3 text-right text-amber-400 font-bold">{fmt(Number(a.monto))}</td>
                                                    <td className="p-3 text-right">
                                                        <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Landmark className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">Sin aportes registrados</p>
                                    <p className="font-mono text-gray-600 text-sm mt-1">Registra aportes de capital de los socios</p>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
