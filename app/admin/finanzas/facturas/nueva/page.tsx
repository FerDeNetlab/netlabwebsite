'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Upload, FileText, X, Zap, RefreshCw } from 'lucide-react'

interface Cliente { id: string; nombre: string; empresa: string }

export default function NuevaFacturaPage() {
    const { status } = useSession()
    const router = useRouter()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(false)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [tipo, setTipo] = useState<'unico' | 'recurrente'>('unico')
    const [tipoIngreso, setTipoIngreso] = useState<'fijo' | 'run_rate' | 'variable'>('variable')
    const [form, setForm] = useState({
        cliente_id: '', numero_factura: '', concepto: '', subtotal: '', iva: '', total: '',
        fecha_vencimiento: '', dia_mes: '', notas: ''
    })

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])
    useEffect(() => {
        if (status === 'authenticated') fetch('/api/clientes').then(r => r.json()).then(setClientes).catch(() => { })
    }, [status])

    // Cuando cambia el tipo de pago, sugerimos un tipo_ingreso por default
    useEffect(() => {
        setTipoIngreso(tipo === 'recurrente' ? 'fijo' : 'variable')
    }, [tipo])

    const handleSubtotalChange = (value: string) => {
        const sub = Number(value) || 0
        const iva = sub * 0.16
        setForm(f => ({ ...f, subtotal: value, iva: iva.toFixed(2), total: (sub + iva).toFixed(2) }))
    }

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === 'application/pdf') setPdfFile(file)
        else if (file) alert('Solo se permiten archivos PDF')
    }

    const handleSubmit = async () => {
        if (!form.concepto || !form.total) { alert('Concepto y total son requeridos'); return }
        if (tipo === 'recurrente' && !form.dia_mes) { alert('Selecciona el día del mes'); return }
        setLoading(true)
        try {
            // Subir PDF a Vercel Blob si hay archivo
            let archivo_url = null, archivo_nombre = null, archivo_tipo = null
            if (pdfFile) {
                const fd = new FormData()
                fd.append('file', pdfFile)
                fd.append('carpeta', 'facturas')
                const upRes = await fetch('/api/finanzas/upload', { method: 'POST', body: fd })
                if (!upRes.ok) {
                    const err = await upRes.json().catch(() => ({}))
                    alert('Error al subir PDF: ' + (err.error || 'desconocido'))
                    setLoading(false)
                    return
                }
                const upData = await upRes.json()
                archivo_url = upData.url
                archivo_nombre = upData.nombre
                archivo_tipo = upData.tipo
            }

            const response = await fetch('/api/facturas', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form, tipo, tipo_ingreso: tipoIngreso,
                    subtotal: Number(form.subtotal) || 0, iva: Number(form.iva) || 0, total: Number(form.total) || 0,
                    recurrente: tipo === 'recurrente', dia_mes: form.dia_mes ? Number(form.dia_mes) : null,
                    archivo_url, archivo_nombre, archivo_tipo,
                }),
            })
            if (response.ok) {
                const data = await response.json()
                router.push(`/admin/finanzas/facturas/${data.id}`)
            } else alert('Error al crear entrada')
        } catch { alert('Error al crear entrada') }
        finally { setLoading(false) }
    }

    if (status === 'loading') return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/cxc/nueva">
                        <div className="p-6 space-y-6">
                            <div className="border-b border-green-500/20 pb-4">
                                <Button onClick={() => router.push('/admin/finanzas/facturas')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                    <ArrowLeft className="h-4 w-4" /> Cuentas por Cobrar
                                </Button>
                                <h1 className="text-3xl font-mono text-green-400">
                                    {tipo === 'unico' ? 'Nuevo Pago Único' : 'Nuevo Pago Recurrente'}
                                </h1>
                                <p className="text-gray-400 font-mono text-sm mt-1">
                                    {tipo === 'unico' ? 'Registra un cobro puntual (factura o sin factura)' : 'Un cliente te paga cada mes — se refleja en proyecciones'}
                                </p>
                            </div>

                            {/* Tipo Toggle */}
                            <div className="flex gap-3">
                                <button onClick={() => setTipo('unico')}
                                    className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all font-mono text-sm ${tipo === 'unico' ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                    <Zap className="h-5 w-5" />
                                    <div className="text-left">
                                        <div className="font-bold">Pago Único</div>
                                        <div className="text-xs opacity-70">Cobro puntual con o sin factura</div>
                                    </div>
                                </button>
                                <button onClick={() => setTipo('recurrente')}
                                    className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all font-mono text-sm ${tipo === 'recurrente' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                    <RefreshCw className="h-5 w-5" />
                                    <div className="text-left">
                                        <div className="font-bold">Pago Recurrente</div>
                                        <div className="text-xs opacity-70">Cliente paga cada mes</div>
                                    </div>
                                </button>
                            </div>

                            {/* Tipo de Ingreso (clasificación SAF) */}
                            <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="font-mono text-xs text-green-400">Tipo de ingreso *</label>
                                    <span className="font-mono text-[10px] text-gray-500">Define la bolsa donde caerá este ingreso</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setTipoIngreso('fijo')}
                                        className={`p-3 rounded border-2 transition-all font-mono text-left ${tipoIngreso === 'fijo' ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                        <div className="font-bold text-xs">📌 Fijo</div>
                                        <div className="text-[10px] opacity-70 mt-0.5">Contrato indefinido. Va a Operación Base.</div>
                                    </button>
                                    <button onClick={() => setTipoIngreso('run_rate')}
                                        className={`p-3 rounded border-2 transition-all font-mono text-left ${tipoIngreso === 'run_rate' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                        <div className="font-bold text-xs">🔄 Run-rate</div>
                                        <div className="text-[10px] opacity-70 mt-0.5">Recurrencia esperada. Va a Operación Variable.</div>
                                    </button>
                                    <button onClick={() => setTipoIngreso('variable')}
                                        className={`p-3 rounded border-2 transition-all font-mono text-left ${tipoIngreso === 'variable' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                        <div className="font-bold text-xs">⚡ Variable</div>
                                        <div className="text-[10px] opacity-70 mt-0.5">Cobro puntual. Va a Crecimiento.</div>
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">Cliente</label>
                                        <select value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none">
                                            <option value="">Sin cliente asociado</option>
                                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}{c.empresa ? ` — ${c.empresa}` : ''}</option>)}
                                        </select>
                                    </div>
                                    {tipo === 'recurrente' ? (
                                        <div>
                                            <label className="font-mono text-xs text-gray-400 mb-1 block">Día de pago del mes *</label>
                                            <select value={form.dia_mes} onChange={e => setForm(f => ({ ...f, dia_mes: e.target.value }))}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none">
                                                <option value="">Seleccionar día</option>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d =>
                                                    <option key={d} value={d}>Día {d}</option>
                                                )}
                                            </select>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="font-mono text-xs text-gray-400 mb-1 block">Número de factura (opcional)</label>
                                            <input type="text" placeholder="Ej: INV/2026/0042 (o se autogenera)" value={form.numero_factura}
                                                onChange={e => setForm(f => ({ ...f, numero_factura: e.target.value }))}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="font-mono text-xs text-gray-400 mb-1 block">Concepto *</label>
                                    <input type="text" placeholder={tipo === 'recurrente' ? 'Ej: Mensualidad hosting cliente X' : 'Descripción del cobro'} value={form.concepto}
                                        onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">Subtotal *</label>
                                        <input type="number" placeholder="0.00" value={form.subtotal} onChange={e => handleSubtotalChange(e.target.value)}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">IVA (16%)</label>
                                        <input type="number" placeholder="0.00" value={form.iva}
                                            onChange={e => setForm(f => ({ ...f, iva: e.target.value, total: (Number(f.subtotal) + Number(e.target.value)).toFixed(2) }))}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-green-400 focus:border-green-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">Total</label>
                                        <input type="number" placeholder="0.00" value={form.total} readOnly
                                            className="w-full bg-zinc-900 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-green-400 font-bold cursor-not-allowed" />
                                    </div>
                                </div>

                                {tipo === 'unico' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-mono text-xs text-gray-400 mb-1 block">Fecha de vencimiento</label>
                                            <input type="date" value={form.fecha_vencimiento} onChange={e => setForm(f => ({ ...f, fecha_vencimiento: e.target.value }))}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="font-mono text-xs text-gray-400 mb-1 block">Notas</label>
                                            <input type="text" placeholder="Opcional" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                                                className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                        </div>
                                    </div>
                                )}

                                {/* PDF Upload — only for pago unico */}
                                {tipo === 'unico' && (
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">PDF de Factura <span className="text-gray-600">(opcional)</span></label>
                                        {!pdfFile ? (
                                            <label className="flex flex-col items-center justify-center w-full h-24 bg-zinc-900 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500/50 transition-colors">
                                                <Upload className="h-5 w-5 text-gray-500 mb-1" />
                                                <span className="font-mono text-xs text-gray-500">Click para subir PDF</span>
                                                <input type="file" accept=".pdf" onChange={handlePdfChange} className="hidden" />
                                            </label>
                                        ) : (
                                            <div className="flex items-center gap-3 bg-zinc-900 border border-green-500/30 rounded-lg px-4 py-3">
                                                <FileText className="h-5 w-5 text-green-400 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-mono text-sm text-white truncate">{pdfFile.name}</div>
                                                    <div className="font-mono text-xs text-gray-500">{(pdfFile.size / 1024).toFixed(0)} KB</div>
                                                </div>
                                                <button onClick={() => setPdfFile(null)} className="text-gray-500 hover:text-red-400"><X className="h-4 w-4" /></button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4 border-t border-gray-800">
                                <Button onClick={handleSubmit} disabled={loading || !form.concepto || !form.total}
                                    className={`font-mono gap-2 ${tipo === 'recurrente' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                    {loading ? 'Guardando...' : tipo === 'unico' ? 'Guardar Pago Único' : 'Guardar Pago Recurrente'}
                                </Button>
                                <Button onClick={() => router.push('/admin/finanzas/facturas')} variant="ghost" className="font-mono">Cancelar</Button>
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
