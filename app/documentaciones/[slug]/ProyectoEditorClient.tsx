'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import {
    ArrowLeft,
    Plus,
    FolderOpen,
    Edit,
    Trash2,
    Copy,
    CheckCheck,
    RefreshCw,
    ExternalLink,
    ChevronRight,
} from 'lucide-react'
import {
    DOC_COLORES,
    DOC_COLOR_CLASES,
    type DocColor,
    type DocProyectoCompleto,
    type DocCategoriaConFlujos,
} from '@/lib/types/documentaciones'

const MODULOS_ODOO = [
    'CRM',
    'Ventas',
    'Cobranza',
    'Facturación',
    'Inventario',
    'Compras',
    'Punto de Venta',
    'Contabilidad',
    'Recursos Humanos',
    'Proyectos',
    'Sitio Web',
    'eCommerce',
    'Marketing',
    'Otro',
]

export default function ProyectoEditorClient({ slug, sessionEmail }: { slug: string; sessionEmail: string }) {
    const router = useRouter()
    const [proyecto, setProyecto] = useState<DocProyectoCompleto | null>(null)
    const [loading, setLoading] = useState(true)
    const [showNewCat, setShowNewCat] = useState(false)
    const [editCat, setEditCat] = useState<DocCategoriaConFlujos | null>(null)
    const [newFlujoCatId, setNewFlujoCatId] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const fetchProyecto = useCallback(async () => {
        const res = await fetch(`/api/documentaciones/proyectos/${slug}`)
        if (res.ok) setProyecto(await res.json())
        setLoading(false)
    }, [slug])

    useEffect(() => {
        fetchProyecto()
    }, [fetchProyecto])

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-8">
                <p className="text-gray-400 font-mono text-center py-12">Cargando...</p>
            </div>
        )
    }

    if (!proyecto) {
        return (
            <div className="container mx-auto px-4 pt-8">
                <p className="text-red-400 font-mono text-center py-12">Proyecto no encontrado</p>
            </div>
        )
    }

    const copyLink = () => {
        const url = `${window.location.origin}/d/${proyecto.public_token}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const regenerarToken = async () => {
        if (!confirm('¿Regenerar el token público? El link actual dejará de funcionar.')) return
        const res = await fetch(`/api/documentaciones/proyectos/${proyecto.id}/regenerar-token`, { method: 'POST' })
        if (res.ok) fetchProyecto()
    }

    const eliminarCategoria = async (catId: string, nombre: string) => {
        if (!confirm(`¿Eliminar la categoría "${nombre}" y todos sus flujos?`)) return
        const res = await fetch(`/api/documentaciones/categorias/${catId}`, { method: 'DELETE' })
        if (res.ok) fetchProyecto()
    }

    const eliminarFlujo = async (flujoId: string, nombre: string) => {
        if (!confirm(`¿Eliminar el flujo "${nombre}"?`)) return
        const res = await fetch(`/api/documentaciones/flujos/${flujoId}`, { method: 'DELETE' })
        if (res.ok) fetchProyecto()
    }

    return (
        <div className="container mx-auto px-4 pt-8 pb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <TerminalFrame title={`${sessionEmail || 'netlab'}@netlab:~/documentaciones/${proyecto.slug}`}>
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="border-b border-green-500/20 pb-4">
                            <Link href="/documentaciones">
                                <Button variant="ghost" className="font-mono gap-2 text-sm mb-3">
                                    <ArrowLeft className="h-4 w-4" /> Documentaciones
                                </Button>
                            </Link>
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h1 className="text-3xl font-mono text-green-400 mb-2">{proyecto.nombre}</h1>
                                    {proyecto.descripcion && (
                                        <p className="text-gray-400 font-mono text-sm">{proyecto.descripcion}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={copyLink}
                                        className="bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-600/20 hover:text-green-300 transition-all rounded-sm px-3 py-1.5 text-xs font-mono flex items-center gap-2"
                                    >
                                        {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                        {copied ? 'Copiado!' : 'Copiar link cliente'}
                                    </button>
                                    <a
                                        href={`/d/${proyecto.public_token}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 hover:border-green-500/50 rounded-sm px-3 py-1.5 text-gray-300 hover:text-green-400 transition-all"
                                        title="Abrir vista pública"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                    <button
                                        onClick={regenerarToken}
                                        className="bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 hover:border-yellow-500/50 rounded-sm px-3 py-1.5 text-gray-300 hover:text-yellow-400 transition-all"
                                        title="Regenerar token"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400 font-mono text-sm">
                                <span className="text-green-400">{proyecto.categorias.length}</span> categorías ·{' '}
                                <span className="text-green-400">
                                    {proyecto.categorias.reduce((s, c) => s + c.flujos.length, 0)}
                                </span>{' '}
                                flujos
                            </p>
                            <Button
                                onClick={() => setShowNewCat(true)}
                                className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nueva categoría
                            </Button>
                        </div>

                        {/* Lista de categorías */}
                        {proyecto.categorias.length === 0 ? (
                            <div className="text-center py-12">
                                <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400 font-mono mb-4">Sin categorías aún</p>
                                <Button
                                    onClick={() => setShowNewCat(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Crear primera categoría
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {proyecto.categorias.map((cat, i) => {
                                    const colorKey = (DOC_COLORES.includes(cat.color as DocColor) ? cat.color : 'green') as DocColor
                                    const c = DOC_COLOR_CLASES[colorKey]
                                    return (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: i * 0.05 }}
                                            className={`bg-zinc-900/50 border ${c.border} ${c.borderHover} rounded-lg p-5 transition-all`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className={`text-xl font-mono ${c.text} mb-1`}>{cat.nombre}</h3>
                                                    {cat.modulo_odoo && (
                                                        <p className="text-gray-500 text-xs font-mono">
                                                            Módulo Odoo: {cat.modulo_odoo}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setEditCat(cat)}
                                                        className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => eliminarCategoria(cat.id, cat.nombre)}
                                                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Flujos */}
                                            <div className="space-y-2 ml-2">
                                                {cat.flujos.map((flujo) => (
                                                    <div
                                                        key={flujo.id}
                                                        className="flex items-center justify-between bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 rounded px-3 py-2 group"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                router.push(
                                                                    `/documentaciones/${proyecto.slug}/flujo/${flujo.id}`
                                                                )
                                                            }
                                                            className="flex items-center gap-2 text-left flex-1 text-gray-300 hover:text-green-400 transition-colors font-mono text-sm"
                                                        >
                                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                                            {flujo.nombre}
                                                            <span className="text-xs text-gray-600 ml-2">
                                                                ({flujo.pasos.length} paso{flujo.pasos.length !== 1 ? 's' : ''})
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => eliminarFlujo(flujo.id, flujo.nombre)}
                                                            className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setNewFlujoCatId(cat.id)}
                                                    className="w-full text-left text-xs font-mono text-gray-500 hover:text-green-400 px-3 py-2 border border-dashed border-gray-700 hover:border-green-500/50 rounded transition-all flex items-center gap-2"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Agregar flujo
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </TerminalFrame>
            </motion.div>

            {showNewCat && (
                <CategoriaModal
                    proyectoId={proyecto.id}
                    onClose={() => setShowNewCat(false)}
                    onSaved={() => {
                        setShowNewCat(false)
                        fetchProyecto()
                    }}
                />
            )}
            {editCat && (
                <CategoriaModal
                    proyectoId={proyecto.id}
                    categoria={editCat}
                    onClose={() => setEditCat(null)}
                    onSaved={() => {
                        setEditCat(null)
                        fetchProyecto()
                    }}
                />
            )}
            {newFlujoCatId && (
                <FlujoModal
                    categoriaId={newFlujoCatId}
                    onClose={() => setNewFlujoCatId(null)}
                    onSaved={() => {
                        setNewFlujoCatId(null)
                        fetchProyecto()
                    }}
                />
            )}
        </div>
    )
}

function CategoriaModal({
    proyectoId,
    categoria,
    onClose,
    onSaved,
}: {
    proyectoId: string
    categoria?: DocCategoriaConFlujos
    onClose: () => void
    onSaved: () => void
}) {
    const isEdit = !!categoria
    const [nombre, setNombre] = useState(categoria?.nombre ?? '')
    const [moduloOdoo, setModuloOdoo] = useState(categoria?.modulo_odoo ?? '')
    const [color, setColor] = useState<DocColor>(((categoria?.color as DocColor) || 'green'))
    const [saving, setSaving] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        setSaving(true)
        const url = isEdit
            ? `/api/documentaciones/categorias/${categoria.id}`
            : `/api/documentaciones/proyectos/${proyectoId}/categorias`
        const res = await fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, modulo_odoo: moduloOdoo || null, color }),
        })
        setSaving(false)
        if (res.ok) onSaved()
        else alert('Error al guardar')
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-[#0a0a0a] border border-green-500/30 rounded-lg p-6 font-mono"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl text-green-400 mb-4">
                    $ {isEdit ? 'editar' : 'nueva'}-categoria
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Nombre *</label>
                        <input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="ej. Cobranza"
                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Módulo Odoo</label>
                        <select
                            value={moduloOdoo}
                            onChange={(e) => setModuloOdoo(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        >
                            <option value="">— Ninguno —</option>
                            {MODULOS_ODOO.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {DOC_COLORES.map((c) => (
                                <button
                                    type="button"
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${DOC_COLOR_CLASES[c].text} ${DOC_COLOR_CLASES[c].bg} ${color === c ? DOC_COLOR_CLASES[c].border.replace('/20', '/60') + ' border-2' : 'border-transparent'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-mono">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-mono"
                        >
                            {saving ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function FlujoModal({
    categoriaId,
    onClose,
    onSaved,
}: {
    categoriaId: string
    onClose: () => void
    onSaved: () => void
}) {
    const [nombre, setNombre] = useState('')
    const [proposito, setProposito] = useState('')
    const [accion, setAccion] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [saving, setSaving] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        setSaving(true)
        const res = await fetch(`/api/documentaciones/categorias/${categoriaId}/flujos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                proposito,
                accion_principal: accion,
                descripcion,
            }),
        })
        setSaving(false)
        if (res.ok) onSaved()
        else alert('Error al crear flujo')
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-[#0a0a0a] border border-green-500/30 rounded-lg p-6 font-mono"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl text-green-400 mb-4">$ nuevo-flujo --crear</h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Nombre del flujo *</label>
                        <input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="ej. Crear factura desde una venta"
                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Propósito</label>
                        <textarea
                            value={proposito}
                            onChange={(e) => setProposito(e.target.value)}
                            rows={2}
                            placeholder="Para qué sirve este flujo"
                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Acción principal</label>
                        <input
                            value={accion}
                            onChange={(e) => setAccion(e.target.value)}
                            placeholder="ej. Generar factura electrónica"
                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Descripción adicional</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 font-mono">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-mono"
                        >
                            {saving ? 'Creando...' : 'Crear flujo'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
