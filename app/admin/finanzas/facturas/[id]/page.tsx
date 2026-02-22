'use client'

import React from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Trash2, Building2, Mail, Phone, FileText, Eye, Pencil, X, Save } from 'lucide-react'

interface FacturaDetalle {
    id: string; numero_factura: string; concepto: string; subtotal: number; iva: number; total: number;
    estado: string; fecha_emision: string; fecha_vencimiento: string; fecha_envio: string; notas: string;
    cliente_nombre: string; cliente_empresa: string; cliente_email: string; cliente_telefono: string; cliente_rfc: string;
    archivo_nombre: string; tipo: string; recurrente: boolean; dia_mes: number; cliente_id: string;
}
interface Cliente { id: string; nombre: string; empresa: string }

export default function FacturaDetallePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { status } = useSession()
    const router = useRouter()
    const [factura, setFactura] = useState<FacturaDetalle | null>(null)
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editForm, setEditForm] = useState<Record<string, string | number | boolean | null>>({})

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchFactura = async () => {
        const r = await fetch(`/api/facturas/${id}`)
        if (r.ok) { setFactura(await r.json()) } else { alert('Factura no encontrada'); router.push('/admin/finanzas/facturas') }
        setLoading(false)
    }

    useEffect(() => {
        if (status === 'authenticated') {
            fetchFactura()
            fetch('/api/clientes').then(r => r.json()).then(setClientes).catch(() => { })
        }
    }, [status, id])

    const startEdit = () => {
        if (!factura) return
        setEditForm({
            cliente_id: factura.cliente_id || '',
            numero_factura: factura.numero_factura,
            concepto: factura.concepto,
            subtotal: Number(factura.subtotal),
            iva: Number(factura.iva),
            total: Number(factura.total),
            fecha_vencimiento: factura.fecha_vencimiento?.split('T')[0] || '',
            fecha_envio: factura.fecha_envio?.split('T')[0] || '',
            notas: factura.notas || '',
            tipo: factura.tipo || 'unico',
            recurrente: factura.recurrente || false,
            dia_mes: factura.dia_mes || '',
        })
        setEditing(true)
    }

    const handleSave = async () => {
        setSaving(true)
        const r = await fetch(`/api/facturas/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        })
        if (r.ok) { setEditing(false); fetchFactura() }
        else alert('Error al guardar')
        setSaving(false)
    }

    const handleSubtotalChange = (val: string) => {
        const sub = Number(val) || 0
        const iva = sub * 0.16
        setEditForm(f => ({ ...f, subtotal: sub, iva: Number(iva.toFixed(2)), total: Number((sub + iva).toFixed(2)) }))
    }

    const handleDelete = async () => {
        if (!confirm('¿Eliminar esta entrada?')) return
        const r = await fetch(`/api/facturas/${id}`, { method: 'DELETE' })
        if (r.ok) router.push('/admin/finanzas/facturas')
    }

    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
    const inputCls = "w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-green-500 focus:outline-none"

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>
    if (!factura) return null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title={`root@netlab:~/finanzas/facturas/${factura.numero_factura}`}>
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-start justify-between border-b border-green-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas/facturas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Cuentas por Cobrar</Button>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-mono text-green-400">{factura.numero_factura}</h1>
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${factura.tipo === 'recurrente' ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-500/30' : 'text-green-400 bg-green-400/10 border border-green-500/30'}`}>
                                            {factura.tipo === 'recurrente' ? '🔄 Recurrente' : '⚡ Único'}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 font-mono text-sm mt-1">{factura.concepto}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono text-green-400">{fmt(Number(factura.total))}</div>
                                    {factura.recurrente && factura.dia_mes && (
                                        <div className="text-sm font-mono text-cyan-400">Día {factura.dia_mes} de cada mes</div>
                                    )}
                                    {!factura.recurrente && factura.fecha_vencimiento && (
                                        <div className="text-sm font-mono text-gray-500">Vence: {new Date(factura.fecha_vencimiento).toLocaleDateString('es-MX')}</div>
                                    )}
                                </div>
                            </div>

                            {/* Invoice Timeline — only for one-time entries */}
                            {!factura.recurrente && factura.fecha_emision && (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-0 font-mono text-xs">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-green-400" />
                                            <div className="text-green-400 mt-1">Emitida</div>
                                            <div className="text-gray-500 text-[10px]">{new Date(factura.fecha_emision).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                        <div className={`flex-1 h-0.5 mx-1 ${factura.fecha_envio ? 'bg-blue-400' : 'bg-gray-700 border-t border-dashed border-gray-600'}`}>
                                            {factura.fecha_envio && (
                                                <div className="text-center text-[10px] text-blue-400 -mt-4">
                                                    {Math.round((new Date(factura.fecha_envio).getTime() - new Date(factura.fecha_emision).getTime()) / (1000 * 60 * 60 * 24))}d
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${factura.fecha_envio ? 'bg-blue-400' : 'bg-gray-600'}`} />
                                            <div className={factura.fecha_envio ? 'text-blue-400 mt-1' : 'text-gray-600 mt-1'}>Enviada</div>
                                            <div className="text-gray-500 text-[10px]">{factura.fecha_envio ? new Date(factura.fecha_envio).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) : '—'}</div>
                                        </div>
                                        <div className="flex-1 h-0.5 mx-1 bg-gray-700 border-t border-dashed border-gray-600" />
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-gray-600" />
                                            <div className="text-gray-600 mt-1">Cobrada</div>
                                            <div className="text-gray-500 text-[10px]">Ver en Movimientos</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={startEdit} variant="outline" className="font-mono gap-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent" size="sm">
                                    <Pencil className="h-4 w-4" /> Editar
                                </Button>
                                {factura.archivo_nombre && (
                                    <Button onClick={() => window.open(`/api/facturas/${id}/pdf`, '_blank')} variant="outline" className="font-mono gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent" size="sm">
                                        <Eye className="h-4 w-4" /> Ver PDF
                                    </Button>
                                )}
                                <Button onClick={handleDelete} variant="outline" className="font-mono gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent ml-auto" size="sm">
                                    <Trash2 className="h-4 w-4" /> Eliminar
                                </Button>
                            </div>

                            {/* Edit Form */}
                            {editing && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-zinc-900/50 border border-yellow-500/30 rounded-lg p-5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-mono text-yellow-400 text-sm flex items-center gap-2"><Pencil className="h-4 w-4" /> Editar Entrada</h3>
                                        <button onClick={() => setEditing(false)}><X className="h-4 w-4 text-gray-500" /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Cliente</label>
                                            <select value={String(editForm.cliente_id || '')} onChange={e => setEditForm(f => ({ ...f, cliente_id: e.target.value }))} className={inputCls + ' mt-1'}>
                                                <option value="">Sin cliente</option>
                                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}{c.empresa ? ` — ${c.empresa}` : ''}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Número</label>
                                            <input type="text" value={String(editForm.numero_factura || '')} onChange={e => setEditForm(f => ({ ...f, numero_factura: e.target.value }))} className={inputCls + ' mt-1'} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-mono text-xs text-gray-500">Concepto</label>
                                        <input type="text" value={String(editForm.concepto || '')} onChange={e => setEditForm(f => ({ ...f, concepto: e.target.value }))} className={inputCls + ' mt-1'} />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Subtotal</label>
                                            <input type="number" value={String(editForm.subtotal || '')} onChange={e => handleSubtotalChange(e.target.value)} className={inputCls + ' mt-1'} />
                                        </div>
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">IVA</label>
                                            <input type="number" value={String(editForm.iva || '')} onChange={e => setEditForm(f => ({ ...f, iva: Number(e.target.value), total: Number(f.subtotal || 0) + Number(e.target.value) }))} className={inputCls + ' mt-1'} />
                                        </div>
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Total</label>
                                            <input type="number" value={String(editForm.total || '')} readOnly className={inputCls + ' mt-1 cursor-not-allowed opacity-70'} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Tipo</label>
                                            <select value={String(editForm.tipo || 'unico')} onChange={e => setEditForm(f => ({ ...f, tipo: e.target.value, recurrente: e.target.value === 'recurrente' }))} className={inputCls + ' mt-1'}>
                                                <option value="unico">Pago Único</option>
                                                <option value="recurrente">Pago Recurrente</option>
                                            </select>
                                        </div>
                                        {editForm.tipo === 'recurrente' ? (
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Día del mes</label>
                                                <select value={String(editForm.dia_mes || '')} onChange={e => setEditForm(f => ({ ...f, dia_mes: Number(e.target.value) || null }))} className={inputCls + ' mt-1'}>
                                                    <option value="">Seleccionar</option>
                                                    {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>Día {i + 1}</option>)}
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Vencimiento</label>
                                                <input type="date" value={String(editForm.fecha_vencimiento || '')} onChange={e => setEditForm(f => ({ ...f, fecha_vencimiento: e.target.value }))} className={inputCls + ' mt-1'} />
                                            </div>
                                        )}
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Fecha de Envío</label>
                                            <input type="date" value={String(editForm.fecha_envio || '')} onChange={e => setEditForm(f => ({ ...f, fecha_envio: e.target.value }))} className={inputCls + ' mt-1'} />
                                        </div>
                                        <div>
                                            <label className="font-mono text-xs text-gray-500">Notas</label>
                                            <input type="text" value={String(editForm.notas || '')} onChange={e => setEditForm(f => ({ ...f, notas: e.target.value }))} className={inputCls + ' mt-1'} />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={handleSave} disabled={saving} className="font-mono bg-yellow-600 hover:bg-yellow-700 gap-2" size="sm">
                                            <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                                        </Button>
                                        <Button onClick={() => setEditing(false)} variant="ghost" className="font-mono" size="sm">Cancelar</Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Client Info */}
                            <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-5">
                                <h3 className="font-mono text-green-400 text-sm mb-3 flex items-center gap-2"><Building2 className="h-4 w-4" /> Cliente</h3>
                                <div className="space-y-1 font-mono text-sm">
                                    <div className="text-white font-bold">{factura.cliente_nombre || 'Sin cliente'}</div>
                                    {factura.cliente_empresa && <div className="text-gray-400">{factura.cliente_empresa}</div>}
                                    {factura.cliente_email && <div className="text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {factura.cliente_email}</div>}
                                    {factura.cliente_telefono && <div className="text-gray-400 flex items-center gap-1"><Phone className="h-3 w-3" /> {factura.cliente_telefono}</div>}
                                    {factura.cliente_rfc && <div className="text-yellow-400 flex items-center gap-1"><FileText className="h-3 w-3" /> RFC: {factura.cliente_rfc}</div>}
                                </div>
                            </div>

                            {factura.notas && (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg p-5">
                                    <h3 className="font-mono text-gray-400 text-sm mb-2">Notas</h3>
                                    <p className="font-mono text-gray-300 text-sm whitespace-pre-wrap">{factura.notas}</p>
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
