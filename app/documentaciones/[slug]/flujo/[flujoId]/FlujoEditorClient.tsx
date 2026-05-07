'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Upload, Trash2, Save, Loader2 } from 'lucide-react'
import type { DocFlujo, DocPaso } from '@/lib/types/documentaciones'

interface FlujoConContexto extends DocFlujo {
    proyecto_id: string
    categoria_nombre: string
    categoria_slug: string
    categoria_color: string
    pasos: DocPaso[]
}

export default function FlujoEditorClient({
    slug,
    flujoId,
    sessionEmail,
}: {
    slug: string
    flujoId: string
    sessionEmail: string
}) {
    const [flujo, setFlujo] = useState<FlujoConContexto | null>(null)
    const [loading, setLoading] = useState(true)
    const [savingMeta, setSavingMeta] = useState(false)

    const [nombre, setNombre] = useState('')
    const [proposito, setProposito] = useState('')
    const [accion, setAccion] = useState('')
    const [descripcion, setDescripcion] = useState('')

    const fetchFlujo = useCallback(async () => {
        const res = await fetch(`/api/documentaciones/flujos/${flujoId}`)
        if (res.ok) {
            const data = await res.json()
            setFlujo(data)
            setNombre(data.nombre ?? '')
            setProposito(data.proposito ?? '')
            setAccion(data.accion_principal ?? '')
            setDescripcion(data.descripcion ?? '')
        }
        setLoading(false)
    }, [flujoId])

    useEffect(() => {
        fetchFlujo()
    }, [fetchFlujo])

    const guardarMeta = async () => {
        setSavingMeta(true)
        await fetch(`/api/documentaciones/flujos/${flujoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                proposito,
                accion_principal: accion,
                descripcion,
            }),
        })
        setSavingMeta(false)
        fetchFlujo()
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-8">
                <p className="text-gray-400 font-mono text-center py-12">Cargando...</p>
            </div>
        )
    }
    if (!flujo) {
        return (
            <div className="container mx-auto px-4 pt-8">
                <p className="text-red-400 font-mono text-center py-12">Flujo no encontrado</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 pt-8 pb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <TerminalFrame
                    title={`${sessionEmail || 'netlab'}@netlab:~/documentaciones/${slug}/flujo/${flujo.slug}`}
                >
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="border-b border-green-500/20 pb-4">
                            <Link href={`/documentaciones/${slug}`}>
                                <Button variant="ghost" className="font-mono gap-2 text-sm mb-3">
                                    <ArrowLeft className="h-4 w-4" /> {flujo.categoria_nombre}
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-mono text-green-400 mb-2">{flujo.nombre}</h1>
                            <p className="text-gray-400 font-mono text-sm">
                                Categoría: <span className="text-gray-300">{flujo.categoria_nombre}</span>
                            </p>
                        </div>

                        {/* Meta del flujo */}
                        <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-5 space-y-4">
                            <h2 className="text-lg font-mono text-green-400">Metadatos del flujo</h2>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-mono">Nombre</label>
                                <input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-mono">Propósito</label>
                                <textarea
                                    value={proposito}
                                    onChange={(e) => setProposito(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-mono">Acción principal</label>
                                <input
                                    value={accion}
                                    onChange={(e) => setAccion(e.target.value)}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-mono">Descripción</label>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={guardarMeta}
                                    disabled={savingMeta}
                                    className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {savingMeta ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                            </div>
                        </div>

                        {/* Pasos */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-mono text-green-400">
                                    Pasos del flujo ({flujo.pasos.length})
                                </h2>
                            </div>

                            {flujo.pasos.map((paso, idx) => (
                                <PasoEditor
                                    key={paso.id}
                                    paso={paso}
                                    index={idx}
                                    onChanged={fetchFlujo}
                                />
                            ))}

                            <NuevoPasoUploader flujoId={flujoId} onUploaded={fetchFlujo} />
                        </div>
                    </div>
                </TerminalFrame>
            </motion.div>
        </div>
    )
}

function PasoEditor({
    paso,
    index,
    onChanged,
}: {
    paso: DocPaso
    index: number
    onChanged: () => void
}) {
    const [titulo, setTitulo] = useState(paso.titulo ?? '')
    const [accion, setAccion] = useState(paso.accion ?? '')
    const [descripcion, setDescripcion] = useState(paso.descripcion ?? '')
    const [saving, setSaving] = useState(false)
    const [dirty, setDirty] = useState(false)

    const guardar = async () => {
        setSaving(true)
        await fetch(`/api/documentaciones/pasos/${paso.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, accion, descripcion }),
        })
        setSaving(false)
        setDirty(false)
        onChanged()
    }

    const eliminar = async () => {
        if (!confirm('¿Eliminar este paso?')) return
        await fetch(`/api/documentaciones/pasos/${paso.id}`, { method: 'DELETE' })
        onChanged()
    }

    return (
        <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded">
                    PASO {String(index + 1).padStart(2, '0')}
                </span>
                <button
                    onClick={eliminar}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    title="Eliminar paso"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Imagen */}
                <div className="rounded border border-slate-800 overflow-hidden bg-[#0a0a0a]">
                    <div className="flex items-center px-3 py-1.5 bg-[#1a1b26] border-b border-slate-800">
                        <div className="flex space-x-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/80" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                            <div className="w-2 h-2 rounded-full bg-green-500/80" />
                        </div>
                    </div>
                    <div className="relative w-full aspect-video bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={paso.imagen_url} alt={titulo || `Paso ${index + 1}`} className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Campos */}
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block font-mono">Título</label>
                        <input
                            value={titulo}
                            onChange={(e) => { setTitulo(e.target.value); setDirty(true) }}
                            placeholder="ej. Abrir el menú de facturación"
                            className="w-full px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block font-mono">Acción a realizar</label>
                        <input
                            value={accion}
                            onChange={(e) => { setAccion(e.target.value); setDirty(true) }}
                            placeholder="ej. Click en 'Nueva factura'"
                            className="w-full px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block font-mono">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => { setDescripcion(e.target.value); setDirty(true) }}
                            rows={3}
                            placeholder="Detalles adicionales para el cliente"
                            className="w-full px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={guardar}
                            disabled={saving || !dirty}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2 disabled:opacity-50"
                        >
                            <Save className="h-3.5 w-3.5" />
                            {saving ? 'Guardando...' : dirty ? 'Guardar' : 'Sin cambios'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function NuevoPasoUploader({ flujoId, onUploaded }: { flujoId: string; onUploaded: () => void }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        setError(null)
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const upRes = await fetch('/api/documentaciones/upload', { method: 'POST', body: fd })
            if (!upRes.ok) {
                const data = await upRes.json().catch(() => ({}))
                throw new Error(data.error || 'Error al subir')
            }
            const { url } = await upRes.json()
            const createRes = await fetch(`/api/documentaciones/flujos/${flujoId}/pasos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagen_url: url }),
            })
            if (!createRes.ok) throw new Error('Error al crear paso')
            onUploaded()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                }}
            />
            <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-green-500/30 hover:border-green-500/60 rounded-lg p-8 text-center transition-all bg-green-500/5 hover:bg-green-500/10 disabled:opacity-50"
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-green-400 font-mono">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>Subiendo captura...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-green-400 font-mono">
                        <Upload className="h-8 w-8" />
                        <p className="text-sm">Subir captura para nuevo paso</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP o GIF (máx 5MB)</p>
                    </div>
                )}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-400 font-mono text-center">{error}</p>
            )}
        </div>
    )
}
