'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Ticket as TicketIcon, Plus, ArrowLeft, ExternalLink, Copy, CheckCheck, Trash2, Lock, Globe } from 'lucide-react'
import type { TicketProyecto } from '@/lib/types/tickets'

export default function TicketsAdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [proyectos, setProyectos] = useState<TicketProyecto[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    const fetchProyectos = async () => {
        try {
            const res = await fetch('/api/tickets/proyectos')
            if (res.ok) setProyectos(await res.json())
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchProyectos()
    }, [])

    const copyLink = (token: string, id: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/t/${token}`)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const eliminar = async (id: string, nombre: string) => {
        if (!confirm(`¿Eliminar la ticketera "${nombre}" y todos sus tickets?`)) return
        const res = await fetch(`/api/tickets/proyectos/${id}`, { method: 'DELETE' })
        if (res.ok) fetchProyectos()
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary font-mono">Cargando sesión...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16">
                <Button
                    onClick={() => router.push('/admin')}
                    variant="outline"
                    className="font-mono gap-2 mb-6 bg-transparent"
                    size="sm"
                >
                    <ArrowLeft className="h-4 w-4" /> Volver al panel
                </Button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <TerminalFrame title={`${session?.user?.email ?? 'netlab'}@netlab:~/tickets`} borderColor="blue">
                        <div className="p-6 space-y-8">
                            {/* Header */}
                            <div className="border-b border-blue-500/20 pb-4">
                                <h1 className="text-3xl font-mono text-blue-400 mb-2 flex items-center gap-3">
                                    <TicketIcon className="h-7 w-7" />
                                    Tickets
                                </h1>
                                <p className="text-gray-400 font-mono text-sm">
                                    Crea una ticketera por cliente y comparte el link para que levante sus issues
                                </p>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-between items-center">
                                <p className="text-gray-400 font-mono text-sm">
                                    Total: <span className="text-blue-400">{proyectos.length}</span> ticketeras
                                </p>
                                <Button onClick={() => setShowNew(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-mono gap-2">
                                    <Plus className="h-4 w-4" /> Nueva Ticketera
                                </Button>
                            </div>

                            {showNew && (
                                <NuevaTicketeraModal
                                    onClose={() => setShowNew(false)}
                                    onCreated={() => { setShowNew(false); fetchProyectos() }}
                                />
                            )}

                            {/* Lista */}
                            {loading ? (
                                <p className="text-gray-400 font-mono text-center py-12">Cargando...</p>
                            ) : proyectos.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-gray-400 font-mono mb-4">Aún no hay ticketeras</p>
                                    <Button onClick={() => setShowNew(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-mono gap-2">
                                        <Plus className="h-4 w-4" /> Crear la primera
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {proyectos.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                            className="bg-zinc-900/50 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3
                                                    className="text-lg font-mono text-blue-400 cursor-pointer hover:text-blue-300"
                                                    onClick={() => router.push(`/admin/tickets/${p.id}`)}
                                                >
                                                    {p.nombre}
                                                </h3>
                                                {p.is_public ? (
                                                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> público
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-mono text-yellow-400 flex items-center gap-1">
                                                        <Lock className="h-3 w-3" /> privado
                                                    </span>
                                                )}
                                            </div>

                                            {p.cliente_empresa && (
                                                <p className="text-gray-400 text-sm font-mono mb-2">
                                                    Cliente: <span className="text-gray-300">{p.cliente_empresa}</span>
                                                </p>
                                            )}

                                            <div className="flex items-center gap-3 text-xs font-mono mb-4">
                                                <span className="text-gray-500">
                                                    {Number(p.total_tickets ?? 0)} tickets
                                                </span>
                                                {Number(p.abiertos ?? 0) > 0 && (
                                                    <span className="text-amber-400">{Number(p.abiertos)} abiertos</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                                                <button
                                                    onClick={() => router.push(`/admin/tickets/${p.id}`)}
                                                    className="flex-1 bg-blue-600/10 border border-blue-500/50 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all rounded-sm px-3 py-1.5 text-xs font-mono"
                                                >
                                                    Abrir
                                                </button>
                                                <button
                                                    onClick={() => copyLink(p.public_token, p.id)}
                                                    title="Copiar link del cliente"
                                                    className="bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 hover:border-blue-500/50 rounded-sm px-3 py-1.5 text-gray-300 hover:text-blue-400 transition-all"
                                                >
                                                    {copiedId === p.id ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                </button>
                                                <a
                                                    href={`/t/${p.public_token}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Abrir portal del cliente"
                                                    className="bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 hover:border-blue-500/50 rounded-sm px-3 py-1.5 text-gray-300 hover:text-blue-400 transition-all"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                                <button
                                                    onClick={() => eliminar(p.id, p.nombre)}
                                                    title="Eliminar"
                                                    className="bg-zinc-800/50 hover:bg-red-900/30 border border-gray-700 hover:border-red-500/50 rounded-sm px-3 py-1.5 text-gray-300 hover:text-red-400 transition-all"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}

interface ClienteOption { id: string; nombre: string; empresa: string }

function NuevaTicketeraModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [clienteId, setClienteId] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const [clientes, setClientes] = useState<ClienteOption[]>([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch('/api/clientes')
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setClientes(Array.isArray(data) ? data : []))
            .catch(() => setClientes([]))
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        setSaving(true)
        const res = await fetch('/api/tickets/proyectos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, cliente_id: clienteId || null, is_public: isPublic }),
        })
        setSaving(false)
        if (res.ok) onCreated()
        else alert('Error al crear ticketera')
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-blue-500/30 rounded-lg p-6 font-mono" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl text-blue-400 mb-4">$ nueva-ticketera --crear</h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Nombre *</label>
                        <input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="ej. Soporte Odoo CSsales"
                            className="w-full px-4 py-2 bg-zinc-900 border border-blue-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Cliente (opcional)</label>
                        <select
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-blue-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="">— Sin cliente —</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.id}>{c.empresa} ({c.nombre})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 bg-zinc-900 border border-blue-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-blue-500" />
                        Link público activo
                    </label>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-mono">Cancelar</Button>
                        <Button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono">
                            {saving ? 'Creando...' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
