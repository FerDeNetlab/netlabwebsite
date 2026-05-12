'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Plus, Search, CreditCard, CheckCircle, X, CalendarClock, Zap, Users, Wrench, Pencil, Save, Upload, Eye, Paperclip, ChevronLeft, ChevronRight, Landmark, GitMerge } from 'lucide-react'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
import { BOLSAS_SAF, BOLSA_LABEL } from '@/lib/finanzas-bolsas'

interface Gasto {
    id: string; concepto: string; monto: number; estado: string; proveedor: string;
    fecha_vencimiento: string; fecha_pago: string; categoria_nombre: string; categoria_color: string;
    recurrente: boolean; dia_mes: number; subtipo: string;
    tipo_gasto?: string; bolsa_origen?: string;
    archivo_url?: string | null; archivo_nombre?: string | null;
    estado_calculado?: string; dias_atraso?: number | null;
    movimiento_bancario_id?: string | null;
    fecha_pago_banco?: string | null;
    banco_descripcion?: string | null;
}
interface MovBanco {
    id: string; fecha_operacion: string; descripcion: string; referencia: string;
    cargo: number | null; abono: number | null; numero_cuenta: string; banco: string;
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
    const [form, setForm] = useState<{
        categoria_id: string; concepto: string; monto: string; fecha_vencimiento: string;
        proveedor: string; recurrente: boolean; dia_mes: string; subtipo: string; notas: string;
        tipo_gasto: string; bolsa_origen: string;
        archivo_url: string | null; archivo_nombre: string | null; archivo_tipo: string | null;
    }>({
        categoria_id: '', concepto: '', monto: '', fecha_vencimiento: '', proveedor: '',
        recurrente: false, dia_mes: '', subtipo: 'general', notas: '',
        tipo_gasto: 'variable', bolsa_origen: 'operacion_variable',
        archivo_url: null, archivo_nombre: null, archivo_tipo: null,
    })
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<Record<string, string | number | boolean | null>>({})
    const [uploadingId, setUploadingId] = useState<string | null>(null)
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'con_banco' | 'sin_banco'>('todos')
    // Panel ligar banco
    const [ligandoGasto, setLigandoGasto] = useState<Gasto | null>(null)
    const [movCandidatos, setMovCandidatos] = useState<MovBanco[]>([])
    const [loadMovCands, setLoadMovCands] = useState(false)

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1) }

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchData = () => {
        fetch(`/api/gastos?mes=${mes}&anio=${anio}`).then(r => r.json()).then(data => {
            setGastos(data.gastos || []); setCategorias(data.categorias || []); setLoading(false)
        }).catch(() => setLoading(false))
    }

    useEffect(() => { if (status === 'authenticated') fetchData() }, [status, mes, anio])

    const openForm = (tipo: 'fijo' | 'unico') => {
        setForm({
            categoria_id: '', concepto: '', monto: '', fecha_vencimiento: '', proveedor: '',
            recurrente: tipo === 'fijo', dia_mes: '', subtipo: 'general', notas: '',
            tipo_gasto: tipo === 'fijo' ? 'estructural' : 'variable',
            bolsa_origen: tipo === 'fijo' ? 'operacion_base' : 'operacion_variable',
            archivo_url: null, archivo_nombre: null, archivo_tipo: null,
        })
        setShowForm(tipo)
    }

    const handleUploadComprobante = async (file: File): Promise<{ url: string; nombre: string; tipo: string } | null> => {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('carpeta', 'gastos')
        const r = await fetch('/api/finanzas/upload', { method: 'POST', body: fd })
        if (!r.ok) {
            const err = await r.json().catch(() => ({}))
            alert('Error al subir comprobante: ' + (err.error || 'desconocido'))
            return null
        }
        return r.json()
    }

    const handleFormFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const up = await handleUploadComprobante(file)
        if (up) setForm(f => ({ ...f, archivo_url: up.url, archivo_nombre: up.nombre, archivo_tipo: up.tipo }))
    }

    const handleRowFile = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingId(id)
        try {
            const up = await handleUploadComprobante(file)
            if (up) {
                const r = await fetch(`/api/gastos/${id}`, {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ archivo_url: up.url, archivo_nombre: up.nombre, archivo_tipo: up.tipo })
                })
                if (r.ok) fetchData()
            }
        } finally { setUploadingId(null) }
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

    const startEdit = (g: Gasto) => {
        setEditForm({
            concepto: g.concepto, monto: g.monto, proveedor: g.proveedor || '',
            recurrente: g.recurrente, dia_mes: g.dia_mes || '',
            subtipo: g.subtipo || 'general',
            fecha_vencimiento: g.fecha_vencimiento?.split('T')[0] || '',
            tipo_gasto: g.tipo_gasto || 'variable',
            bolsa_origen: g.bolsa_origen || 'operacion_variable',
        })
        setEditingId(g.id)
    }

    const handleSaveEdit = async (id: string) => {
        const r = await fetch(`/api/gastos/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...editForm, monto: Number(editForm.monto), dia_mes: editForm.dia_mes ? Number(editForm.dia_mes) : null })
        })
        if (r.ok) { setEditingId(null); fetchData() }
        else alert('Error al guardar')
    }

    const abrirPanelLigar = async (g: Gasto) => {
        setLigandoGasto(g)
        setMovCandidatos([])
        setLoadMovCands(true)
        const fecha = g.fecha_vencimiento?.split('T')[0] || new Date().toISOString().split('T')[0]
        const r = await fetch(`/api/finanzas/conciliacion/movimientos-candidatos?monto=${g.monto}&fecha=${fecha}&tipo=cargo`)
        const d = await r.json()
        setMovCandidatos(d.movimientos ?? [])
        setLoadMovCands(false)
    }

    const ligarMovimiento = async (movId: string) => {
        if (!ligandoGasto) return
        const r = await fetch('/api/finanzas/conciliacion', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: movId, gasto_id: ligandoGasto.id, conciliado: true }),
        })
        if (r.ok) { setLigandoGasto(null); fetchData() }
        else alert('Error al ligar')
    }

    const filtered = gastos.filter(g => {
        const matchSearch = (g.concepto + g.proveedor + g.categoria_nombre).toLowerCase().includes(search.toLowerCase())
        let matchMes = g.recurrente
        if (!g.recurrente && g.fecha_vencimiento) {
            const d = new Date(String(g.fecha_vencimiento).split('T')[0] + 'T12:00:00')
            const vencMes = d.getMonth() + 1; const vencAnio = d.getFullYear()
            // show if vence this month OR unpaid from previous month (rolling)
            const isPendiente = (g.estado_calculado || g.estado) !== 'pagado'
            matchMes = (vencMes === mes && vencAnio === anio) || (isPendiente && (vencAnio < anio || (vencAnio === anio && vencMes < mes)))
        }
        const matchBanco = filtroEstado === 'todos' ? true : filtroEstado === 'con_banco' ? !!g.movimiento_bancario_id : !g.movimiento_bancario_id
        return matchSearch && matchMes && matchBanco
    })
    const totalMes = filtered.reduce((s, g) => s + Number(g.monto), 0)
    const confirmadoBanco = filtered.filter(g => g.movimiento_bancario_id).reduce((s, g) => s + Number(g.monto), 0)
    const sinConfirmar = totalMes - confirmadoBanco
    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
    <>
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

                            {/* Month navigation */}
                            <div className="flex items-center justify-between bg-zinc-900/50 border border-red-500/20 rounded-lg px-4 py-2">
                                <button onClick={prevMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="text-center">
                                    <span className="font-mono text-red-400 text-sm font-bold">{MESES[mes - 1]} {anio}</span>
                                    <span className="font-mono text-gray-500 text-xs block">{filtered.length} gasto{filtered.length !== 1 ? 's' : ''}</span>
                                </div>
                                <button onClick={nextMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
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

                                        {/* SAF: tipo_gasto + bolsa_origen */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                                            <div>
                                                <label className="font-mono text-xs text-orange-400">Tipo de gasto (SAF) *</label>
                                                <select value={form.tipo_gasto} onChange={e => {
                                                    const tg = e.target.value
                                                    const bo = tg === 'estructural' ? 'operacion_base' : tg === 'estrategico' ? 'crecimiento' : 'operacion_variable'
                                                    setForm(f => ({ ...f, tipo_gasto: tg, bolsa_origen: bo }))
                                                }}
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-orange-500 focus:outline-none mt-1">
                                                    <option value="estructural">🏛️ Estructural (renta, sueldos, software)</option>
                                                    <option value="variable">⚡ Variable (gasolina, comisiones)</option>
                                                    <option value="estrategico">🚀 Estratégico (marketing, equipo)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-orange-400">Bolsa de origen</label>
                                                <select value={form.bolsa_origen} onChange={e => setForm(f => ({ ...f, bolsa_origen: e.target.value }))}
                                                    className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-orange-500 focus:outline-none mt-1">
                                                    {BOLSAS_SAF.map(b => <option key={b} value={b}>{BOLSA_LABEL[b]}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Comprobante (Vercel Blob) */}
                                        <div className="pt-2">
                                            <label className="font-mono text-xs text-gray-500">Comprobante (PDF / imagen) — opcional</label>
                                            {form.archivo_nombre ? (
                                                <div className="flex items-center gap-3 bg-zinc-900 border border-green-500/30 rounded px-3 py-2 mt-1">
                                                    <Paperclip className="h-4 w-4 text-green-400" />
                                                    <span className="font-mono text-xs text-white truncate flex-1">{form.archivo_nombre}</span>
                                                    <button onClick={() => setForm(f => ({ ...f, archivo_url: null, archivo_nombre: null, archivo_tipo: null }))}>
                                                        <X className="h-4 w-4 text-gray-500" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex items-center justify-center gap-2 mt-1 w-full bg-zinc-900 border-2 border-dashed border-gray-600 hover:border-orange-500/50 rounded px-3 py-3 cursor-pointer transition-colors">
                                                    <Upload className="h-4 w-4 text-gray-500" />
                                                    <span className="font-mono text-xs text-gray-500">Click para subir</span>
                                                    <input type="file" accept=".pdf,image/*" onChange={handleFormFile} className="hidden" />
                                                </label>
                                            )}
                                        </div>

                                        <Button onClick={handleCreate} className={`font-mono ${showForm === 'fijo' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`} size="sm"
                                            disabled={!form.concepto || !form.monto || (showForm === 'fijo' && !form.dia_mes)}>
                                            {showForm === 'fijo' ? 'Guardar Gasto Fijo' : 'Guardar Gasto Único'}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Search + filtro banco */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input type="text" placeholder="Buscar gastos..." value={search} onChange={e => setSearch(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-red-500 focus:outline-none" />
                                </div>
                                <div className="flex gap-2 items-center flex-wrap">
                                    {(['todos', 'con_banco', 'sin_banco'] as const).map(f => (
                                        <button key={f} onClick={() => setFiltroEstado(f)}
                                            className={`px-3 py-1 font-mono text-xs rounded border transition-colors ${filtroEstado === f ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                                            {f === 'todos' ? 'Todos' : f === 'con_banco' ? '🏦 Confirmados banco' : '⚠ Sin confirmar'}
                                        </button>
                                    ))}
                                </div>
                                {/* Resumen banco del mes */}
                                <div className="grid grid-cols-3 gap-3 pt-1">
                                    <div className="bg-zinc-900/60 border border-gray-700 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">total del mes</div>
                                        <div className="text-red-400 text-sm font-bold">{fmt(totalMes)}</div>
                                    </div>
                                    <div className="bg-zinc-900/60 border border-green-500/20 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">🏦 confirmado banco</div>
                                        <div className="text-green-400 text-sm font-bold">{fmt(confirmadoBanco)}</div>
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
                                                <th className="text-left p-3">Concepto</th><th className="text-left p-3">Tipo</th>
                                                <th className="text-left p-3">Categoría</th><th className="text-left p-3">Proveedor</th>
                                                <th className="text-right p-3">Monto</th><th className="text-center p-3">Estado</th>
                                                <th className="text-center p-3">Banco</th>
                                                <th className="text-right p-3">Día/Vence</th>
                                                <th className="text-center p-3">📎</th>
                                                <th className="p-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {filtered.map(g => (
                                                <tr key={g.id} className="border-b border-gray-800 last:border-0 hover:bg-zinc-800/30">
                                                    <td className="p-3 text-gray-300">
                                                        {editingId === g.id ? (
                                                            <input type="text" value={String(editForm.concepto || '')} onChange={e => setEditForm(f => ({ ...f, concepto: e.target.value }))}
                                                                className="w-full bg-zinc-800 border border-yellow-500/30 rounded px-2 py-1 font-mono text-sm text-white focus:outline-none" />
                                                        ) : g.concepto}
                                                    </td>
                                                    <td className="p-3">
                                                        {editingId === g.id ? (
                                                            <select value={String(editForm.subtipo || 'general')} onChange={e => setEditForm(f => ({ ...f, subtipo: e.target.value }))}
                                                                className="bg-zinc-800 border border-yellow-500/30 rounded px-1 py-1 font-mono text-[10px] text-white focus:outline-none">
                                                                <option value="general">Fijo</option>
                                                                <option value="sueldo">Sueldo</option>
                                                            </select>
                                                        ) : g.recurrente ? (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${g.subtipo === 'sueldo' ? 'text-purple-400 bg-purple-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                                                                {g.subtipo === 'sueldo' ? '🧑 Sueldo' : '📌 Fijo'}
                                                            </span>
                                                        ) : (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] text-red-400 bg-red-400/10">⚡ Único</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded" style={{ color: g.categoria_color, backgroundColor: `${g.categoria_color}15` }}>{g.categoria_nombre || '—'}</span></td>
                                                    <td className="p-3 text-gray-400">
                                                        {editingId === g.id ? (
                                                            <input type="text" value={String(editForm.proveedor || '')} onChange={e => setEditForm(f => ({ ...f, proveedor: e.target.value }))}
                                                                className="w-full bg-zinc-800 border border-yellow-500/30 rounded px-2 py-1 font-mono text-sm text-white focus:outline-none" />
                                                        ) : (g.proveedor || '—')}
                                                    </td>
                                                    <td className="p-3 text-right text-red-400">
                                                        {editingId === g.id ? (
                                                            <input type="number" value={String(editForm.monto || '')} onChange={e => setEditForm(f => ({ ...f, monto: e.target.value }))}
                                                                className="w-20 bg-zinc-800 border border-yellow-500/30 rounded px-2 py-1 font-mono text-sm text-white focus:outline-none text-right" />
                                                        ) : fmt(g.monto)}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {(() => {
                                                            const est = g.estado_calculado || g.estado
                                                            const cls = est === 'pagado' ? 'text-green-400 bg-green-400/10 border-green-500/30'
                                                                : est === 'vencido' ? 'text-red-400 bg-red-400/10 border-red-500/30'
                                                                    : 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30'
                                                            return (
                                                                <div className="flex flex-col items-center gap-0.5">
                                                                    <span className={`px-2 py-0.5 rounded border text-xs ${cls}`}>{est}</span>
                                                                    {typeof g.dias_atraso === 'number' && g.dias_atraso > 0 && est !== 'pagado' && (
                                                                        <span className="text-[10px] text-red-400">⏰ {g.dias_atraso}d</span>
                                                                    )}
                                                                </div>
                                                            )
                                                        })()}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {g.movimiento_bancario_id ? (
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/30">
                                                                    <Landmark className="h-3 w-3" /> banco
                                                                </span>
                                                                {g.fecha_pago_banco && <span className="text-[10px] text-gray-500">{new Date(g.fecha_pago_banco).toLocaleDateString('es-MX')}</span>}
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => abrirPanelLigar(g)} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                                                                <GitMerge className="h-3 w-3" /> ligar
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right text-gray-400">
                                                        {editingId === g.id && g.recurrente ? (
                                                            <select value={String(editForm.dia_mes || '')} onChange={e => setEditForm(f => ({ ...f, dia_mes: e.target.value }))}
                                                                className="bg-zinc-800 border border-yellow-500/30 rounded px-1 py-1 font-mono text-xs text-white focus:outline-none">
                                                                <option value="">—</option>
                                                                {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>Día {i + 1}</option>)}
                                                            </select>
                                                        ) : g.recurrente && g.dia_mes ? `Día ${g.dia_mes}` : g.fecha_vencimiento ? new Date(g.fecha_vencimiento).toLocaleDateString('es-MX') : '—'}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {g.archivo_url ? (
                                                            <a href={g.archivo_url} target="_blank" rel="noopener noreferrer" title={g.archivo_nombre || 'Ver comprobante'}>
                                                                <Eye className="h-4 w-4 inline text-blue-400 hover:text-blue-300" />
                                                            </a>
                                                        ) : (
                                                            <label className={`cursor-pointer text-gray-500 hover:text-cyan-400 ${uploadingId === g.id ? 'opacity-50' : ''}`} title="Subir comprobante">
                                                                {uploadingId === g.id ? <span className="text-[10px]">...</span> : <Upload className="h-4 w-4 inline" />}
                                                                <input type="file" accept=".pdf,image/*" onChange={(e) => handleRowFile(g.id, e)} className="hidden" disabled={uploadingId === g.id} />
                                                            </label>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right space-x-1">
                                                        {editingId === g.id ? (
                                                            <>
                                                                <button onClick={() => handleSaveEdit(g.id)} className="text-yellow-400 hover:text-yellow-300" title="Guardar"><Save className="h-4 w-4 inline" /></button>
                                                                <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-300" title="Cancelar"><X className="h-4 w-4 inline" /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => startEdit(g)} className="text-yellow-400 hover:text-yellow-300" title="Editar"><Pencil className="h-4 w-4 inline" /></button>
                                                                {g.estado === 'pendiente' && (
                                                                    <button onClick={() => handlePagar(g.id)} className="text-green-400 hover:text-green-300" title="Marcar pagado"><CheckCircle className="h-4 w-4 inline" /></button>
                                                                )}
                                                                <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-300" title="Eliminar"><X className="h-4 w-4 inline" /></button>
                                                            </>
                                                        )}
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

        {/* Panel lateral ligar banco */}
        {ligandoGasto && (
            <div className="fixed inset-0 bg-black/80 flex justify-end z-50" onClick={() => setLigandoGasto(null)}>
                <motion.div
                    initial={{ x: 420 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 28 }}
                    className="w-full max-w-md bg-[#0a0a0a] border-l border-red-500/20 h-full overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
                            <h2 className="font-mono text-sm text-red-400 flex items-center gap-2">
                                <GitMerge className="h-4 w-4" /> ligar movimiento bancario
                            </h2>
                            <button onClick={() => setLigandoGasto(null)} className="text-gray-600 hover:text-gray-300"><X className="h-4 w-4" /></button>
                        </div>

                        {/* Resumen gasto */}
                        <div className="bg-zinc-900/60 border border-red-500/10 rounded-lg p-4 font-mono">
                            <div className="text-white text-sm">{ligandoGasto.concepto}</div>
                            {ligandoGasto.proveedor && <div className="text-gray-500 text-xs mt-0.5">{ligandoGasto.proveedor}</div>}
                            {ligandoGasto.fecha_vencimiento && <div className="text-gray-600 text-[10px] mt-0.5">{new Date(ligandoGasto.fecha_vencimiento).toLocaleDateString('es-MX')}</div>}
                            <div className="mt-3 text-lg font-bold text-red-400">{fmt(ligandoGasto.monto)}</div>
                        </div>

                        <p className="font-mono text-xs text-gray-500">movimientos bancarios similares (±15%, ±60 días):</p>

                        {loadMovCands ? (
                            <p className="text-gray-600 font-mono text-xs">buscando...</p>
                        ) : movCandidatos.length === 0 ? (
                            <div className="font-mono text-xs text-gray-600 bg-zinc-900/40 border border-gray-800 rounded p-4 text-center">
                                No se encontraron movimientos similares.<br />
                                <span className="text-gray-700">Sube el estado de cuenta BBVA en</span>{' '}
                                <a href="/admin/finanzas/conciliacion" className="text-yellow-500 hover:underline">Conciliación</a>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {movCandidatos.map(m => (
                                    <div key={m.id} className="bg-zinc-900/60 border border-orange-500/20 hover:border-orange-500/40 rounded-lg p-3 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-mono text-xs text-white truncate">{m.descripcion}</div>
                                                {m.referencia && <div className="text-gray-600 text-[10px] truncate">{m.referencia.split(' | ')[0]}</div>}
                                                <div className="text-gray-500 text-[10px] mt-0.5">{new Date(m.fecha_operacion).toLocaleDateString('es-MX')} · {m.banco} {m.numero_cuenta}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-mono text-sm text-red-400">{fmt(m.cargo ?? 0)}</div>
                                                <button onClick={() => ligarMovimiento(m.id)}
                                                    className="mt-1.5 font-mono text-[10px] bg-green-500/20 hover:bg-green-500/40 border border-green-500/40 text-green-300 px-2 py-0.5 rounded transition-colors">
                                                    ✓ ligar este
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
    </>
    )
}