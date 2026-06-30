'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Plus, Send, LifeBuoy, ArrowLeft, ImagePlus, X, Paperclip } from 'lucide-react'
import {
    URGENCIAS, ESTADO_LABEL, URGENCIA_LABEL,
    type PortalPublico, type Ticket, type TicketComentario, type EstadoTicket, type Urgencia,
} from '@/lib/types/tickets'

const ESTADO_COLOR: Record<EstadoTicket, string> = {
    nuevo: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
    en_progreso: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    resuelto: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    cerrado: 'text-gray-400 border-gray-500/40 bg-gray-500/10',
}
const URGENCIA_COLOR: Record<Urgencia, string> = {
    baja: 'text-gray-400', media: 'text-sky-400', alta: 'text-amber-400', critica: 'text-red-400',
}

export default function PublicTicketsClient({ portal, token }: { portal: PortalPublico; token: string }) {
    const [tickets, setTickets] = useState<Ticket[]>(portal.tickets)
    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        const res = await fetch(`/api/tickets/publico/${token}`, { cache: 'no-store' })
        if (res.ok) {
            const data: PortalPublico = await res.json()
            setTickets(data.tickets)
        }
    }, [token])

    return (
        <div className="container mx-auto px-4 pt-8 pb-16 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="text-center mb-6">
                    <Image src="/logo-netlab.png" alt="Netlab" width={160} height={48} className="mx-auto h-9 w-auto" />
                </div>

                <TerminalFrame title={`soporte:~/${portal.slug}`} borderColor="blue">
                    <div className="p-6 space-y-6">
                        <div className="border-b border-blue-500/20 pb-4">
                            <h1 className="text-2xl font-mono text-blue-400 flex items-center gap-3">
                                <LifeBuoy className="h-6 w-6" /> {portal.nombre}
                            </h1>
                            {portal.descripcion && <p className="text-gray-400 font-mono text-sm mt-2">{portal.descripcion}</p>}
                            <p className="text-gray-500 font-mono text-xs mt-2">
                                Levanta tus tickets de soporte y dale seguimiento aquí mismo.
                            </p>
                        </div>

                        {!showForm && (
                            <div className="flex justify-between items-center">
                                <p className="text-gray-400 font-mono text-sm">
                                    <span className="text-blue-400">{tickets.length}</span> tickets
                                </p>
                                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-mono gap-2">
                                    <Plus className="h-4 w-4" /> Nuevo ticket
                                </Button>
                            </div>
                        )}

                        {showForm && (
                            <NuevoTicketForm
                                token={token}
                                onCancel={tickets.length > 0 ? () => setShowForm(false) : undefined}
                                onCreated={() => { setShowForm(false); refresh() }}
                            />
                        )}

                        {/* Estado vacío */}
                        {!showForm && tickets.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 font-mono text-sm mb-4">
                                    Aún no has levantado ningún ticket.
                                </p>
                                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-mono gap-2">
                                    <Plus className="h-4 w-4" /> Crear mi primer ticket
                                </Button>
                            </div>
                        )}

                        {/* Lista */}
                        {tickets.length > 0 && (
                            <div className="space-y-2">
                                {tickets.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelected(t.id)}
                                        className="w-full text-left bg-zinc-900/50 border border-gray-800 hover:border-blue-500/40 rounded-lg p-4 transition-all"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-mono text-sm text-gray-200 truncate flex items-center gap-1.5">
                                                    <span className="text-gray-500">{t.folio}</span> · {t.titulo}
                                                    {t.imagenes?.length > 0 && <Paperclip className="h-3 w-3 text-gray-500 shrink-0" />}
                                                </p>
                                                <p className="text-gray-500 text-xs font-mono mt-1">
                                                    {new Date(t.created_at).toLocaleDateString('es-MX')}
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

                <p className="text-center text-gray-600 font-mono text-xs mt-6">Powered by Netlab</p>
            </motion.div>

            {selected && (
                <ClientTicketPanel token={token} ticketId={selected} onClose={() => setSelected(null)} />
            )}
        </div>
    )
}

function NuevoTicketForm({ token, onCancel, onCreated }: { token: string; onCancel?: () => void; onCreated: () => void }) {
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [urgencia, setUrgencia] = useState<Urgencia>('media')
    const [categoria, setCategoria] = useState('')
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [imagenes, setImagenes] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        setError('')
        setUploading(true)
        for (const file of Array.from(files)) {
            if (imagenes.length >= 10) break
            const fd = new FormData()
            fd.append('file', file)
            try {
                const res = await fetch(`/api/tickets/publico/${token}/upload`, { method: 'POST', body: fd })
                const data = await res.json()
                if (res.ok && data.url) setImagenes((prev) => [...prev, data.url])
                else setError(data.error || 'No se pudo subir la imagen')
            } catch {
                setError('Error al subir la imagen')
            }
        }
        setUploading(false)
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!titulo.trim() || !descripcion.trim()) {
            setError('Asunto y descripción son obligatorios')
            return
        }
        if (!nombre.trim()) {
            setError('Tu nombre es obligatorio')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Escribe un correo válido para enviarte la confirmación')
            return
        }
        setSaving(true)
        const res = await fetch(`/api/tickets/publico/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo, descripcion, urgencia,
                categoria: categoria || null,
                solicitante_nombre: nombre || null,
                solicitante_email: email || null,
                imagenes,
            }),
        })
        setSaving(false)
        if (res.ok) onCreated()
        else setError('No se pudo crear el ticket. Intenta de nuevo.')
    }

    return (
        <div className="bg-zinc-900/50 border border-blue-500/20 rounded-lg p-5 font-mono">
            <h2 className="text-lg text-blue-400 mb-4">$ nuevo-ticket</h2>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Asunto *</label>
                    <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="ej. No puedo generar facturas"
                        className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Descripción *</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4}
                        placeholder="Describe el problema con el mayor detalle posible..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Urgencia</label>
                        <select value={urgencia} onChange={(e) => setUrgencia(e.target.value as Urgencia)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                            {URGENCIAS.map((u) => <option key={u} value={u}>{URGENCIA_LABEL[u]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Categoría (opcional)</label>
                        <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="bug, duda, solicitud..."
                            className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Tu nombre *</label>
                        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required
                            className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Tu email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            placeholder="tu@correo.com"
                            className="w-full px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                    </div>
                </div>
                <p className="text-gray-500 text-[11px] -mt-2">Te enviaremos la confirmación y las actualizaciones de tu ticket a este correo.</p>
                {/* Capturas de pantalla */}
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Capturas (opcional)</label>
                    <div className="flex flex-wrap gap-2">
                        {imagenes.map((url, idx) => (
                            <div key={url} className="relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`captura ${idx + 1}`} className="h-20 w-20 object-cover rounded border border-blue-500/20" />
                                <button
                                    type="button"
                                    onClick={() => setImagenes((prev) => prev.filter((u) => u !== url))}
                                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5"
                                    title="Quitar"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                        {imagenes.length < 10 && (
                            <label className="h-20 w-20 flex flex-col items-center justify-center gap-1 rounded border border-dashed border-blue-500/30 text-gray-500 hover:text-blue-400 hover:border-blue-500/50 cursor-pointer transition-all">
                                <ImagePlus className="h-5 w-5" />
                                <span className="text-[10px]">{uploading ? 'Subiendo...' : 'Agregar'}</span>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    multiple
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
                                />
                            </label>
                        )}
                    </div>
                    <p className="text-gray-600 text-[11px] mt-1">PNG, JPG, WEBP o GIF. Máximo 4 MB c/u.</p>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex gap-3 pt-1">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 font-mono gap-2">
                            <ArrowLeft className="h-4 w-4" /> Cancelar
                        </Button>
                    )}
                    <Button type="submit" disabled={saving || uploading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono">
                        {saving ? 'Enviando...' : 'Enviar ticket'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

function ClientTicketPanel({ token, ticketId, onClose }: { token: string; ticketId: string; onClose: () => void }) {
    const [ticket, setTicket] = useState<(Ticket & { comentarios: TicketComentario[] }) | null>(null)
    const [mensaje, setMensaje] = useState('')
    const [sending, setSending] = useState(false)

    const load = useCallback(async () => {
        const res = await fetch(`/api/tickets/publico/${token}/${ticketId}`, { cache: 'no-store' })
        if (res.ok) setTicket(await res.json())
    }, [token, ticketId])

    useEffect(() => { load() }, [load])

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mensaje.trim()) return
        setSending(true)
        const res = await fetch(`/api/tickets/publico/${token}/${ticketId}/comentarios`, {
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
                    <p className="text-gray-400 text-center py-8">Cargando...</p>
                ) : (
                    <>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-500 text-xs">{ticket.folio}</p>
                                <h2 className="text-xl text-blue-400">{ticket.titulo}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs font-mono ${URGENCIA_COLOR[ticket.urgencia]}`}>{URGENCIA_LABEL[ticket.urgencia]}</span>
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded-sm border ${ESTADO_COLOR[ticket.estado]}`}>{ESTADO_LABEL[ticket.estado]}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-500 hover:text-white text-lg px-2">✕</button>
                        </div>

                        <div className="bg-zinc-900/50 border border-gray-800 rounded p-4 mb-4">
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{ticket.descripcion}</p>
                        </div>

                        {ticket.imagenes?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {ticket.imagenes.map((url, idx) => (
                                    <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`captura ${idx + 1}`} className="h-24 w-24 object-cover rounded border border-gray-700 hover:border-blue-500/50 transition-all" />
                                    </a>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Conversación</p>
                        <div className="space-y-3 mb-4">
                            {ticket.comentarios.length === 0 && <p className="text-gray-600 text-sm">Aún no hay respuestas.</p>}
                            {ticket.comentarios.map((c) => (
                                <div key={c.id} className={`rounded p-3 text-sm ${c.autor_tipo === 'netlab' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-zinc-900 border border-gray-800'}`}>
                                    <p className={`text-xs mb-1 ${c.autor_tipo === 'netlab' ? 'text-blue-400' : 'text-gray-400'}`}>
                                        {c.autor_tipo === 'netlab' ? 'Netlab' : (c.autor_nombre || 'Tú')} · {new Date(c.created_at).toLocaleString('es-MX')}
                                    </p>
                                    <p className="text-gray-200 whitespace-pre-wrap">{c.mensaje}</p>
                                </div>
                            ))}
                        </div>

                        {ticket.estado !== 'cerrado' && (
                            <form onSubmit={enviar} className="flex gap-2">
                                <input value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe un mensaje..."
                                    className="flex-1 px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                <Button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-700 text-white font-mono gap-2">
                                    <Send className="h-4 w-4" /> {sending ? '...' : 'Enviar'}
                                </Button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
