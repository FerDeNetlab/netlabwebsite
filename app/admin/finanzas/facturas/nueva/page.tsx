'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Upload, FileText, X } from 'lucide-react'

interface Cliente { id: string; nombre: string; empresa: string }

export default function NuevaFacturaPage() {
    const { status } = useSession()
    const router = useRouter()
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(false)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [form, setForm] = useState({
        cliente_id: '', numero_factura: '', concepto: '', subtotal: '', iva: '', total: '',
        fecha_vencimiento: '', notas: ''
    })

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/clientes').then(r => r.json()).then(data => setClientes(data)).catch(() => { })
        }
    }, [status])

    // Auto-calculate IVA + Total
    const handleSubtotalChange = (value: string) => {
        const sub = Number(value) || 0
        const iva = sub * 0.16
        setForm(f => ({ ...f, subtotal: value, iva: iva.toFixed(2), total: (sub + iva).toFixed(2) }))
    }

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setPdfFile(file)
        } else if (file) {
            alert('Solo se permiten archivos PDF')
        }
    }

    const handleSubmit = async () => {
        if (!form.concepto || !form.total) { alert('Concepto y total son requeridos'); return }
        setLoading(true)

        try {
            let archivo_nombre = null
            let archivo_data = null

            if (pdfFile) {
                archivo_nombre = pdfFile.name
                const arrayBuffer = await pdfFile.arrayBuffer()
                const bytes = new Uint8Array(arrayBuffer)
                let binary = ''
                for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
                archivo_data = btoa(binary)
            }

            const response = await fetch('/api/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    subtotal: Number(form.subtotal) || 0,
                    iva: Number(form.iva) || 0,
                    total: Number(form.total) || 0,
                    archivo_nombre,
                    archivo_data,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                router.push(`/admin/finanzas/facturas/${data.id}`)
            } else {
                alert('Error al crear factura')
            }
        } catch (error) {
            console.error('[ERP] Error:', error)
            alert('Error al crear factura')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/facturas/nueva">
                        <div className="p-6 space-y-6">
                            <div className="border-b border-green-500/20 pb-4">
                                <Button onClick={() => router.push('/admin/finanzas/facturas')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                    <ArrowLeft className="h-4 w-4" /> Facturas
                                </Button>
                                <h1 className="text-3xl font-mono text-green-400">Nueva Factura</h1>
                                <p className="text-gray-400 font-mono text-sm mt-1">Registra una factura generada en Odoo</p>
                            </div>

                            {/* Form */}
                            <div className="space-y-5">
                                {/* Row 1: Cliente + Número */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">Cliente</label>
                                        <select value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none">
                                            <option value="">Sin cliente asociado</option>
                                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}{c.empresa ? ` — ${c.empresa}` : ''}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">Número de factura (Odoo)</label>
                                        <input type="text" placeholder="Ej: INV/2026/0042 (o se autogenera)" value={form.numero_factura}
                                            onChange={e => setForm(f => ({ ...f, numero_factura: e.target.value }))}
                                            className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                    </div>
                                </div>

                                {/* Concepto */}
                                <div>
                                    <label className="font-mono text-xs text-gray-400 mb-1 block">Concepto *</label>
                                    <input type="text" placeholder="Descripción del servicio o producto facturado" value={form.concepto}
                                        onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))}
                                        className="w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2.5 font-mono text-sm text-white focus:border-green-500 focus:outline-none" />
                                </div>

                                {/* Montos */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="font-mono text-xs text-gray-400 mb-1 block">Subtotal *</label>
                                        <input type="number" placeholder="0.00" value={form.subtotal}
                                            onChange={e => handleSubtotalChange(e.target.value)}
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

                                {/* Fecha vencimiento + Notas */}
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

                                {/* PDF Upload */}
                                <div>
                                    <label className="font-mono text-xs text-gray-400 mb-1 block">PDF de Factura (Odoo)</label>
                                    {!pdfFile ? (
                                        <label className="flex flex-col items-center justify-center w-full h-28 bg-zinc-900 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500/50 transition-colors">
                                            <Upload className="h-6 w-6 text-gray-500 mb-2" />
                                            <span className="font-mono text-xs text-gray-500">Arrastra o click para subir PDF</span>
                                            <span className="font-mono text-[10px] text-gray-600 mt-1">Máx. 10 MB</span>
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
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4 border-t border-gray-800">
                                <Button onClick={handleSubmit} disabled={loading || !form.concepto || !form.total}
                                    className="font-mono bg-green-600 hover:bg-green-700 gap-2">
                                    {loading ? 'Guardando...' : 'Guardar Factura'}
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
