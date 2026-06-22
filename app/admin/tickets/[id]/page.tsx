'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, Copy, CheckCheck, ExternalLink } from 'lucide-react'
import {
    ESTADOS, URGENCIAS, ESTADO_LABEL, URGENCIA_LABEL,
    type Ticket, type TicketComentario, type EstadoTicket, type Urgencia,
} from '@/lib/types/tickets'

const ESTADO_COLOR: Record<EstadoTicket, string> = {
    nuevo: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    en_progreso: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    resuelto: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    cerrado: 'text-gray-400 border-gray-500/40 bg-gray-500/10',
}
const URGENCIA_COLOR: Record<Urgencia, string> = {
    baja: 'text-gray-400',
    media: 'text-sky-400',
    alta: 'text-amber-400',
    critica: 'text-red-400',
}

interface ProyectoDetalle {
    id: string
    nombre: string
    public_token: string
    cliente_empresa?: string | null
    tickets: Ticket[]
}

export default function TicketeraDetailPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [filtro, setFiltro] = useState<'todos' | 'abiertos'>('abiertos')

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    const fetchProyecto = useCallback(async () => {
        try {
            const res = await fetch(`/api/tickets/proyectos/${id}`)
            if (res.ok) setProyecto(await res.json())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchProyecto()
    }, [fetchProyecto])

    const copyLink = () => {
        if (!proyecto) return
        navigator.clipboard.writeText(`${window.location.origin}/t/${proyecto.public_token}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary font-mono">Cargando...</div>
            </div>
        )
    }

    if (!proyecto) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 pt-24 text-center font-mono text-gray-400">
                    Ticketera no encontrada.
                </div>
            </div>
        )
    }

    const tickets = filtro === 'abiertos'
        ? proyecto.tickets.filter((t) => t.estado === 'nuevo' || t.estado === 'en_progreso')
        : proyecto.tickets

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16">
                <Button onClick={() => router.push('/admin/tickets')} variant="outline" className="font-mono gap-2 mb-6 bg-transparent" size="sm">
                    <ArrowLeft className="h-4 w-4" /> Ticketeras
                </Button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <TerminalFrame title={`netlab@netlab:~/tickets/${proyecto.nombre}`} borderColor="blue">
                        <div className="p-6 space-y-6">
                            <div className="flex items-start justify-between border-b border-blue-500/20 pb-4">
                                <div>
                                    <h1 className="text-2xl font-mono text-blue-400">{proyecto.nombre}</h1>
                                    {proyecto.cliente_empresa && (
                                        <p className="text-gray-400 font-mono text-sm mt-1">{proyecto.cliente_empresa}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={copyLink} variant="outline" size="sm" className="font-mono gap-2 bg-transparent">
                                        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Link cliente
                                    </Button>
                                    <a href={`/t/${proyecto.public_token}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="font-mono gap-2 bg-transparent">
                                            <ExternalLink className="h-4 w-4" /> Portal
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            {/* Filtro */}
                            <div className="flex gap-2 text-xs font-mono">
                                {(['abiertos', 'todos'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFiltro(f)}
                                        className={`px-3 py-1 rounded-sm border transition-all ${filtro === f ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : 'border-gray-700 text-gray-400'}`}
                                    >
                                        {f === 'abiertos' ? 'Abiertos' : 'Todos'}
                                    </button>
                                ))}
                            </div>

                            {tickets.length === 0 ? (
                                <p className="text-gray-500 font-mono text-center py-12 text-sm">
                                    {filtro === 'abiertos' ? 'No hay tickets abiertos.' : 'Aún no hay tickets en esta ticketera.'}
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {tickets.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelected(t.id)}
                                            className="w-full text-left bg-zinc-900/50 border border-gray-800 hover:border-blue-500/40 rounded-lg p-4 transition-all"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-mono text-sm text-gray-200 truncate">
                                                        <span className="text-gray-500">{t.folio}</span> · {t.titulo}
                                                    </p>
                                                    <p className="text-gray-500 text-xs font-mono mt-1">
                                                        {t.solicitante_nombre || 'Anónimo'} · {new Date(t.created_at).toLocaleDateString('es-MX')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`text-xs font-mono ${URGENCIA_COLOR[t.urgencia]}`}>{URGENCIA_LABEL[t.urgencia]}</span>
                                                    <span className={`text-xs font-mono px-2 py-0.5 rounded-sm border ${ESTADO_COLOR[t.estado]}`}>
                                                        {ESTADO_LABEL[t.estado]}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>

            {selected && (
                <TicketPanel
                    ticketId={selected}
                    autorNombre={session?.user?.name ?? 'Netlab'}
                    onClose={() => setSelected(null)}
                    onChanged={fetchProyecto}
                />
            )}
        </div>
    )
}

function TicketPanel({ ticketId, onClose, onChanged }: { ticketId: string; autorNombre: string; onClose: () => void; onChanged: () => void }) {
    const [ticket, setTicket] = useState<(Ticket & { comentarios: TicketComentario[] }) | null>(null)
    const [mensaje, setMensaje] = useState('')
    const [sending, setSending] = useState(false)

    const load = useCallback(async () => {
        const res = await fetch(`/api/tickets/tickets/${ticketId}`)
        if (res.ok) setTicket(await res.json())
    }, [ticketId])

    useEffect(() => { load() }, [load])

    const updateField = async (campo: 'estado' | 'urgencia', valor: string) => {
        const res = await fetch(`/api/tickets/tickets/${ticketId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [campo]: valor }),
        })
        if (res.ok) { await load(); onChanged() }
    }

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mensaje.trim()) return
        setSending(true)
        const res = await fetch(`/api/tickets/tickets/${ticketId}/comentarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje }),
        })
        setSending(false)
        if (res.ok) { setMensaje(''); load() }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#0a0a0a] border border-blue-500/30 rounded-lg p-6 font-mono" onClick={(e) => e.stopPropagation()}>
                {!ticket ? (
                    <p className="text-gray-400 text-center py-8">Cargando ticket...</p>
                ) : (
                    <>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-500 text-xs">{ticket.folio}</p>
                                <h2 className="text-xl text-blue-400">{ticket.titulo}</h2>
                                <p className="text-gray-500 text-xs mt-1">
                                    {ticket.solicitante_nombre || 'Anónimo'}
                                    {ticket.solicitante_email ? ` · ${ticket.solicitante_email}` : ''}
                                    {' · '}{new Date(ticket.created_at).toLocaleString('es-MX')}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-white text-lg px-2">✕</button>
                        </div>

                        {/* Controles */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Estado</label>
                                <select
                                    value={ticket.estado}
                                    onChange={(e) => updateField('estado', e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Urgencia</label>
                                <select
                                    value={ticket.urgencia}
                                    onChange={(e) => updateField('urgencia', e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    {URGENCIAS.map((u) => <option key={u} value={u}>{URGENCIA_LABEL[u]}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-gray-800 rounded p-4 mb-4">
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{ticket.descripcion}</p>
                        </div>

                        {/* Hilo */}
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Conversación</p>
                        <div className="space-y-3 mb-4">
                            {ticket.comentarios.length === 0 && (
                                <p className="text-gray-600 text-sm">Sin respuestas todavía.</p>
                            )}
                            {ticket.comentarios.map((c) => (
                                <div key={c.id} className={`rounded p-3 text-sm ${c.autor_tipo === 'netlab' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-zinc-900 border border-gray-800'}`}>
                                    <p className={`text-xs mb-1 ${c.autor_tipo === 'netlab' ? 'text-blue-400' : 'text-gray-400'}`}>
                                        {c.autor_tipo === 'netlab' ? 'Netlab' : 'Cliente'} · {c.autor_nombre || ''} · {new Date(c.created_at).toLocaleString('es-MX')}
                                    </p>
                                    <p className="text-gray-200 whitespace-pre-wrap">{c.mensaje}</p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={enviar} className="flex gap-2">
                            <input
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Responder al cliente..."
                                className="flex-1 px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <Button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-700 text-white font-mono gap-2">
                                <Send className="h-4 w-4" /> {sending ? '...' : 'Enviar'}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
