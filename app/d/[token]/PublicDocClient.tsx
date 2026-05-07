'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { ChevronRight, ChevronLeft, FolderOpen, Target, Zap, ExternalLink } from 'lucide-react'
import {
    DOC_COLORES,
    DOC_COLOR_CLASES,
    type DocColor,
    type DocProyectoCompleto,
    type DocFlujoConPasos,
} from '@/lib/types/documentaciones'

export default function PublicDocClient({
    proyecto,
    token,
}: {
    proyecto: DocProyectoCompleto
    token: string
}) {
    const allFlujos = useMemo(() => {
        return proyecto.categorias.flatMap((c) =>
            c.flujos.map((f) => ({ ...f, categoria: c }))
        )
    }, [proyecto])

    const [currentFlujoId, setCurrentFlujoId] = useState<string | null>(allFlujos[0]?.id ?? null)
    const currentIdx = allFlujos.findIndex((f) => f.id === currentFlujoId)
    const currentFlujo = currentIdx >= 0 ? allFlujos[currentIdx] : null

    return (
        <div className="container mx-auto px-4 pt-6 pb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <TerminalFrame title={`cliente@netlab:~/documentacion/${proyecto.slug}`}>
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="border-b border-green-500/20 pb-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                                <div className="flex items-center gap-3">
                                    <Link href="https://www.netlab.mx" target="_blank" rel="noopener noreferrer">
                                        <Image
                                            src="/logo-netlab.png"
                                            alt="Netlab"
                                            width={130}
                                            height={40}
                                            className="h-9 w-auto"
                                        />
                                    </Link>
                                    <span className="text-xs font-mono text-gray-500">/ documentación</span>
                                </div>
                                <Link
                                    href="https://www.netlab.mx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono text-gray-500 hover:text-green-400 transition-colors flex items-center gap-1"
                                >
                                    netlab.mx <ExternalLink className="h-3 w-3" />
                                </Link>
                            </div>
                            <h1 className="text-3xl font-mono text-green-400 mb-2">{proyecto.nombre}</h1>
                            {proyecto.descripcion && (
                                <p className="text-gray-400 font-mono text-sm">{proyecto.descripcion}</p>
                            )}
                        </div>

                        {proyecto.categorias.length === 0 ? (
                            <div className="text-center py-16">
                                <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400 font-mono">
                                    Esta documentación aún no tiene contenido
                                </p>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                                {/* Sidebar de categorías */}
                                <aside className="space-y-4">
                                    <div className="text-xs font-mono text-gray-500">
                                        $ ls categorías/
                                    </div>
                                    {proyecto.categorias.map((cat) => {
                                        const colorKey = (DOC_COLORES.includes(cat.color as DocColor)
                                            ? cat.color
                                            : 'green') as DocColor
                                        const c = DOC_COLOR_CLASES[colorKey]
                                        return (
                                            <div key={cat.id}>
                                                <div className={`px-3 py-2 rounded-md ${c.bg} ${c.border} border`}>
                                                    <h3 className={`text-sm font-mono ${c.text}`}>{cat.nombre}</h3>
                                                    {cat.modulo_odoo && (
                                                        <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                                                            {cat.modulo_odoo}
                                                        </p>
                                                    )}
                                                </div>
                                                <ul className="mt-1.5 space-y-0.5 ml-2">
                                                    {cat.flujos.map((f) => (
                                                        <li key={f.id}>
                                                            <button
                                                                onClick={() => setCurrentFlujoId(f.id)}
                                                                className={`w-full text-left text-xs font-mono px-2 py-1.5 rounded transition-all flex items-start gap-1.5 ${currentFlujoId === f.id
                                                                        ? 'bg-green-500/10 text-green-400'
                                                                        : 'text-gray-400 hover:text-green-400 hover:bg-green-500/5'
                                                                    }`}
                                                            >
                                                                <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                                <span>{f.nombre}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                    {cat.flujos.length === 0 && (
                                                        <li className="text-xs font-mono text-gray-600 px-2 py-1">
                                                            sin flujos aún
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )
                                    })}
                                </aside>

                                {/* Contenido principal */}
                                <main className="min-w-0">
                                    {!currentFlujo ? (
                                        <div className="text-center py-16 text-gray-400 font-mono">
                                            Selecciona un flujo para empezar
                                        </div>
                                    ) : (
                                        <FlujoView
                                            flujo={currentFlujo}
                                            categoriaColor={currentFlujo.categoria.color}
                                            categoriaNombre={currentFlujo.categoria.nombre}
                                            onPrev={
                                                currentIdx > 0
                                                    ? () => setCurrentFlujoId(allFlujos[currentIdx - 1].id)
                                                    : undefined
                                            }
                                            onNext={
                                                currentIdx < allFlujos.length - 1
                                                    ? () => setCurrentFlujoId(allFlujos[currentIdx + 1].id)
                                                    : undefined
                                            }
                                            prevLabel={
                                                currentIdx > 0 ? allFlujos[currentIdx - 1].nombre : undefined
                                            }
                                            nextLabel={
                                                currentIdx < allFlujos.length - 1
                                                    ? allFlujos[currentIdx + 1].nombre
                                                    : undefined
                                            }
                                        />
                                    )}
                                </main>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t border-green-500/20 pt-4 flex items-center justify-between flex-wrap gap-2">
                            <p className="text-xs font-mono text-gray-500">
                                $ powered_by{' '}
                                <Link
                                    href="https://www.netlab.mx"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                >
                                    netlab.mx
                                </Link>
                            </p>
                            <p className="text-xs font-mono text-gray-600 truncate max-w-xs">
                                token: {token.slice(0, 8)}...
                            </p>
                        </div>
                    </div>
                </TerminalFrame>
            </motion.div>
        </div>
    )
}

function FlujoView({
    flujo,
    categoriaColor,
    categoriaNombre,
    onPrev,
    onNext,
    prevLabel,
    nextLabel,
}: {
    flujo: DocFlujoConPasos
    categoriaColor: string
    categoriaNombre: string
    onPrev?: () => void
    onNext?: () => void
    prevLabel?: string
    nextLabel?: string
}) {
    const colorKey = (DOC_COLORES.includes(categoriaColor as DocColor) ? categoriaColor : 'green') as DocColor
    const c = DOC_COLOR_CLASES[colorKey]

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={flujo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {/* Header del flujo */}
                <div className={`p-5 rounded-lg ${c.bg} ${c.border} border`}>
                    <p className={`text-xs font-mono ${c.text} mb-1`}>{categoriaNombre}</p>
                    <h2 className="text-2xl font-mono text-white mb-3">{flujo.nombre}</h2>

                    {flujo.proposito && (
                        <div className="flex items-start gap-2 mt-3 text-sm font-mono text-gray-300">
                            <Target className={`h-4 w-4 mt-0.5 flex-shrink-0 ${c.text}`} />
                            <div>
                                <span className="text-gray-500">Propósito:</span> {flujo.proposito}
                            </div>
                        </div>
                    )}
                    {flujo.accion_principal && (
                        <div className="flex items-start gap-2 mt-2 text-sm font-mono text-gray-300">
                            <Zap className={`h-4 w-4 mt-0.5 flex-shrink-0 ${c.text}`} />
                            <div>
                                <span className="text-gray-500">Acción:</span> {flujo.accion_principal}
                            </div>
                        </div>
                    )}
                    {flujo.descripcion && (
                        <p className="text-sm font-mono text-gray-400 mt-3 leading-relaxed">{flujo.descripcion}</p>
                    )}
                </div>

                {/* Pasos */}
                {flujo.pasos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-mono">
                        Este flujo aún no tiene pasos documentados
                    </div>
                ) : (
                    <div className="space-y-6">
                        {flujo.pasos.map((paso, idx) => (
                            <motion.div
                                key={paso.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="bg-zinc-900/50 border border-green-500/20 rounded-lg overflow-hidden"
                            >
                                <div className="p-4 border-b border-green-500/10">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-xs font-mono ${c.text} ${c.bg} px-2 py-1 rounded`}>
                                            PASO {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        {paso.titulo && (
                                            <h3 className="text-lg font-mono text-white">{paso.titulo}</h3>
                                        )}
                                    </div>
                                    {paso.accion && (
                                        <p className="text-sm font-mono text-green-400 mt-1">→ {paso.accion}</p>
                                    )}
                                </div>

                                {/* Captura con marco terminal */}
                                <div className="p-3 bg-[#050505]">
                                    <div className="rounded-md border border-slate-800 overflow-hidden bg-[#0a0a0a]">
                                        <div className="flex items-center px-3 py-2 bg-[#1a1b26] border-b border-slate-800">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                            </div>
                                        </div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={paso.imagen_url}
                                            alt={paso.titulo || `Paso ${idx + 1}`}
                                            className="w-full max-h-[700px] object-contain bg-black"
                                        />
                                    </div>
                                </div>

                                {paso.descripcion && (
                                    <div className="p-4 border-t border-green-500/10">
                                        <p className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {paso.descripcion}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Navegación prev/next */}
                {(onPrev || onNext) && (
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-800">
                        {onPrev ? (
                            <button
                                onClick={onPrev}
                                className="flex items-center gap-2 text-left bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 hover:border-green-500/50 rounded-sm px-4 py-2 text-gray-300 hover:text-green-400 transition-all flex-1 max-w-xs font-mono"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <div>
                                    <p className="text-[10px] text-gray-500">Anterior</p>
                                    <p className="text-xs truncate">{prevLabel}</p>
                                </div>
                            </button>
                        ) : (
                            <div />
                        )}
                        {onNext ? (
                            <button
                                onClick={onNext}
                                className="flex items-center gap-2 text-right justify-end bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-600/20 hover:text-green-300 rounded-sm px-4 py-2 transition-all flex-1 max-w-xs font-mono"
                            >
                                <div>
                                    <p className="text-[10px] text-gray-500">Siguiente</p>
                                    <p className="text-xs truncate">{nextLabel}</p>
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <div />
                        )}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
