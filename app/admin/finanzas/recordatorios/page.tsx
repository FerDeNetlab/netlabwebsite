'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Send, Trash2, MessageCircle, Bell, RefreshCw, Plus } from 'lucide-react'

interface Chat {
    id: string; chat_id: string; user_email?: string; cliente_id?: string;
    cliente_nombre?: string; username?: string; nombre?: string; activo: boolean; created_at: string
}
interface Cliente { id: string; nombre: string; empresa?: string }
interface Recordatorio {
    id: string; factura_id?: string; gasto_id?: string; tipo_evento: string; canal: string;
    destinatario: string; enviado_at: string; ok: boolean; error?: string;
    numero_factura?: string; gasto_concepto?: string
}

export default function RecordatoriosPage() {
    const { status } = useSession()
    const router = useRouter()
    const [chats, setChats] = useState<Chat[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ chat_id: '', user_email: '', cliente_id: '', nombre: '', activo: true })
    const [running, setRunning] = useState(false)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchData = async () => {
        const [c, cl, r] = await Promise.all([
            fetch('/api/finanzas/telegram-chats').then(r => r.json()),
            fetch('/api/clientes').then(r => r.json()).catch(() => ({ clientes: [] })),
            fetch('/api/finanzas/recordatorios').then(r => r.json()),
        ])
        setChats(c.chats || [])
        setClientes(cl.clientes || cl || [])
        setRecordatorios(r.recordatorios || [])
        setLoading(false)
    }

    useEffect(() => { if (status === 'authenticated') fetchData() }, [status])

    const handleSave = async () => {
        if (!form.chat_id) return alert('chat_id requerido')
        await fetch('/api/finanzas/telegram-chats', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                user_email: form.user_email || null,
                cliente_id: form.cliente_id || null,
            })
        })
        setShowForm(false)
        setForm({ chat_id: '', user_email: '', cliente_id: '', nombre: '', activo: true })
        fetchData()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este chat?')) return
        await fetch(`/api/finanzas/telegram-chats?id=${id}`, { method: 'DELETE' })
        fetchData()
    }

    const ejecutarCron = async () => {
        if (!confirm('¿Ejecutar manualmente el cron de recordatorios? Esto enviará emails y mensajes de Telegram reales.')) return
        setRunning(true)
        try {
            const r = await fetch('/api/cron/recordatorios-financieros')
            const data = await r.json()
            alert(`Ejecutado:\nFacturas: ${data.facturas_revisadas}\nGastos: ${data.gastos_revisados}\nEmails: ${data.emails_enviados}\nTelegrams: ${data.telegrams_enviados}\nDuplicados omitidos: ${data.skipped_duplicates}\nErrores: ${data.errores?.length || 0}`)
            fetchData()
        } finally { setRunning(false) }
    }

    const inputCls = "w-full bg-zinc-800 border border-gray-700 rounded px-3 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none"

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/recordatorios">
                        <div className="p-6 space-y-6">
                            <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-cyan-400">Recordatorios financieros</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Cron diario 9:00 AM CDMX · email + Telegram</p>
                                </div>
                                <Button onClick={ejecutarCron} disabled={running} className="font-mono gap-2 bg-cyan-700 hover:bg-cyan-800" size="sm">
                                    {running ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    {running ? 'Ejecutando...' : 'Ejecutar ahora'}
                                </Button>
                            </div>

                            {/* Onboarding Telegram */}
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-4 font-mono text-xs text-gray-300 space-y-2">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold"><MessageCircle className="h-4 w-4" /> Cómo conectar Telegram</div>
                                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                                    <li>Buscar el bot configurado por Netlab y enviarle <code className="text-cyan-300">/start</code>.</li>
                                    <li>El bot responde con tu <code className="text-cyan-300">chat_id</code>.</li>
                                    <li>Pega ese chat_id aquí abajo y vincúlalo con un usuario o un cliente.</li>
                                </ol>
                            </div>

                            {/* Lista de chats */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-mono text-sm text-cyan-400 flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Chats Telegram ({chats.length})</h3>
                                    <Button onClick={() => setShowForm(!showForm)} size="sm" className="font-mono gap-2 bg-cyan-700 hover:bg-cyan-800"><Plus className="h-4 w-4" /> Nuevo</Button>
                                </div>

                                {showForm && (
                                    <div className="bg-zinc-900/50 border border-cyan-500/30 rounded-lg p-4 mb-3 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">chat_id *</label>
                                                <input value={form.chat_id} onChange={e => setForm(f => ({ ...f, chat_id: e.target.value }))} placeholder="123456789" className={inputCls + ' mt-1'} />
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Nombre</label>
                                                <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Fer Netlab" className={inputCls + ' mt-1'} />
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Activo</label>
                                                <select value={form.activo ? '1' : '0'} onChange={e => setForm(f => ({ ...f, activo: e.target.value === '1' }))} className={inputCls + ' mt-1'}>
                                                    <option value="1">Sí</option><option value="0">No</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">Email Netlab (interno)</label>
                                                <input value={form.user_email} onChange={e => setForm(f => ({ ...f, user_email: e.target.value, cliente_id: e.target.value ? '' : f.cliente_id }))} placeholder="fer@netlab.mx" className={inputCls + ' mt-1'} />
                                            </div>
                                            <div>
                                                <label className="font-mono text-xs text-gray-500">o vincular a un cliente</label>
                                                <select value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value, user_email: e.target.value ? '' : f.user_email }))} className={inputCls + ' mt-1'}>
                                                    <option value="">— Ninguno —</option>
                                                    {clientes.map(c => <option key={c.id} value={c.id}>{c.empresa || c.nombre}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleSave} size="sm" className="font-mono bg-cyan-700 hover:bg-cyan-800">Guardar</Button>
                                            <Button onClick={() => setShowForm(false)} size="sm" variant="ghost" className="font-mono">Cancelar</Button>
                                        </div>
                                    </div>
                                )}

                                {chats.length === 0 ? (
                                    <p className="font-mono text-xs text-gray-500 text-center py-6">Sin chats registrados</p>
                                ) : (
                                    <div className="bg-zinc-900/50 border border-gray-800 rounded overflow-hidden">
                                        <table className="w-full font-mono text-xs">
                                            <thead className="bg-zinc-900 text-gray-500">
                                                <tr><th className="text-left p-2">chat_id</th><th className="text-left p-2">Nombre</th><th className="text-left p-2">Vinculado a</th><th className="text-center p-2">Activo</th><th></th></tr>
                                            </thead>
                                            <tbody>
                                                {chats.map(c => (
                                                    <tr key={c.id} className="border-t border-gray-800 hover:bg-zinc-800/30">
                                                        <td className="p-2 text-cyan-400">{c.chat_id}</td>
                                                        <td className="p-2 text-gray-300">{c.nombre || c.username || '—'}</td>
                                                        <td className="p-2 text-gray-400">{c.user_email || c.cliente_nombre || <span className="text-gray-600">— sin vincular —</span>}</td>
                                                        <td className="p-2 text-center">{c.activo ? <span className="text-green-400">●</span> : <span className="text-gray-600">○</span>}</td>
                                                        <td className="p-2 text-right"><button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Histórico recordatorios */}
                            <div>
                                <h3 className="font-mono text-sm text-cyan-400 flex items-center gap-2 mb-3"><Bell className="h-4 w-4" /> Histórico ({recordatorios.length})</h3>
                                {recordatorios.length === 0 ? (
                                    <p className="font-mono text-xs text-gray-500 text-center py-6">Sin recordatorios enviados todavía</p>
                                ) : (
                                    <div className="bg-zinc-900/50 border border-gray-800 rounded overflow-hidden max-h-[400px] overflow-y-auto">
                                        <table className="w-full font-mono text-xs">
                                            <thead className="bg-zinc-900 text-gray-500 sticky top-0">
                                                <tr><th className="text-left p-2">Fecha</th><th className="text-left p-2">Tipo</th><th className="text-left p-2">Canal</th><th className="text-left p-2">Destino</th><th className="text-left p-2">Documento</th><th className="text-center p-2">OK</th></tr>
                                            </thead>
                                            <tbody>
                                                {recordatorios.map(r => (
                                                    <tr key={r.id} className="border-t border-gray-800">
                                                        <td className="p-2 text-gray-500">{new Date(r.enviado_at).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                                                        <td className="p-2 text-yellow-400">{r.tipo_evento}</td>
                                                        <td className="p-2 text-gray-400">{r.canal}</td>
                                                        <td className="p-2 text-gray-300 truncate max-w-[200px]">{r.destinatario}</td>
                                                        <td className="p-2 text-gray-400">{r.numero_factura || r.gasto_concepto || '—'}</td>
                                                        <td className="p-2 text-center">{r.ok ? <span className="text-green-400">✓</span> : <span className="text-red-400" title={r.error}>✗</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="text-[10px] font-mono text-gray-600 border-t border-gray-800 pt-3">
                                <p>Variables de entorno requeridas: <code>SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, NETLAB_FINANZAS_EMAIL, TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, CRON_SECRET</code></p>
                            </div>
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
