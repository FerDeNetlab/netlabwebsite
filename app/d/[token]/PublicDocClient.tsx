'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { ChevronRight, ChevronLeft, FolderOpen, Target, Zap, ExternalLink, Maximize2, X, Menu } from 'lucide-react'
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
    const [menuOpen, setMenuOpen] = useState(false)
    const currentIdx = allFlujos.findIndex((f) => f.id === currentFlujoId)
    const currentFlujo = currentIdx >= 0 ? allFlujos[currentIdx] : null

    // Cierra el drawer al cambiar de flujo desde mobile
    const selectFlujo = (id: string) => {
        setCurrentFlujoId(id)
        setMenuOpen(false)
    }

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
                                {/* Selector de flujo MOBILE (botón que abre drawer) */}
                                <div className="lg:hidden">
                                    <button
                                        onClick={() => setMenuOpen(true)}
                                        className="w-full flex items-center justify-between gap-3 bg-zinc-900 border border-green-500/30 rounded-md px-4 py-3 font-mono text-left"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Flujo actual</p>
                                            <p className="text-sm text-green-400 truncate">
                                                {currentFlujo ? currentFlujo.nombre : 'Selecciona un flujo'}
                                            </p>
                                            {currentFlujo && (
                                                <p className="text-[10px] text-gray-500 truncate">{currentFlujo.categoria.nombre}</p>
                                            )}
                                        </div>
                                        <Menu className="h-5 w-5 text-green-400 flex-shrink-0" />
                                    </button>
                                    <p className="text-[10px] font-mono text-gray-500 mt-2 text-center">
                                        {allFlujos.length} flujo{allFlujos.length !== 1 ? 's' : ''} disponibles · toca arriba para ver el menu
                                    </p>
                                </div>

                                {/* Sidebar (DESKTOP fija, MOBILE drawer) */}
                                <Sidebar
                                    proyecto={proyecto}
                                    currentFlujoId={currentFlujoId}
                                    onSelectFlujo={selectFlujo}
                                    isOpen={menuOpen}
                                    onClose={() => setMenuOpen(false)}
                                />

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
                                                    ? () => selectFlujo(allFlujos[currentIdx - 1].id)
                                                    : undefined
                                            }
                                            onNext={
                                                currentIdx < allFlujos.length - 1
                                                    ? () => selectFlujo(allFlujos[currentIdx + 1].id)
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

// ───────────────────────────────────────────────────────────
// Sidebar de navegación (sticky en desktop, drawer en mobile)
// ───────────────────────────────────────────────────────────
function Sidebar({
    proyecto,
    currentFlujoId,
    onSelectFlujo,
    isOpen,
    onClose,
}: {
    proyecto: DocProyectoCompleto
    currentFlujoId: string | null
    onSelectFlujo: (id: string) => void
    isOpen: boolean
    onClose: () => void
}) {
    const content = (
        <div className="space-y-4">
            <div className="text-xs font-mono text-gray-500 hidden lg:block">$ ls categorías/</div>
            {proyecto.categorias.map((cat) => {
                const colorKey = (DOC_COLORES.includes(cat.color as DocColor) ? cat.color : 'green') as DocColor
                const c = DOC_COLOR_CLASES[colorKey]
                return (
                    <div key={cat.id}>
                        <div className={`px-3 py-2 rounded-md ${c.bg} ${c.border} border`}>
                            <h3 className={`text-sm font-mono ${c.text}`}>{cat.nombre}</h3>
                            {cat.modulo_odoo && (
                                <p className="text-[10px] font-mono text-gray-500 mt-0.5">{cat.modulo_odoo}</p>
                            )}
                        </div>
                        <ul className="mt-1.5 space-y-0.5 ml-2">
                            {cat.flujos.map((f) => (
                                <li key={f.id}>
                                    <button
                                        onClick={() => onSelectFlujo(f.id)}
                                        className={`w-full text-left text-sm font-mono px-2 py-2 rounded transition-all flex items-start gap-1.5 ${
                                            currentFlujoId === f.id
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'text-gray-400 hover:text-green-400 hover:bg-green-500/5'
                                        }`}
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                                        <span>{f.nombre}</span>
                                    </button>
                                </li>
                            ))}
                            {cat.flujos.length === 0 && (
                                <li className="text-xs font-mono text-gray-600 px-2 py-1">sin flujos aún</li>
                            )}
                        </ul>
                    </div>
                )
            })}
        </div>
    )

    return (
        <>
            {/* Sidebar fijo en desktop */}
            <aside className="hidden lg:block">{content}</aside>

            {/* Drawer mobile */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-zinc-950 border-r border-green-500/30 z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-zinc-950 border-b border-green-500/20 p-4 flex items-center justify-between">
                                <h3 className="font-mono text-green-400 text-sm">Flujos</h3>
                                <button onClick={onClose} aria-label="Cerrar menú" className="text-gray-400 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-4">{content}</div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
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

                {/* Pasos: carrusel uno por uno */}
                {flujo.pasos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-mono">
                        Este flujo aún no tiene pasos documentados
                    </div>
                ) : (
                    <PasosCarousel pasos={flujo.pasos} colorClasses={c} />
                )}

                {/* Navegacion entre FLUJOS (no confundir con la del carrusel) */}
                {(onPrev || onNext) && (
                    <div className="pt-6 border-t border-gray-800">
                        <p className="text-[10px] font-mono text-gray-500 mb-2 text-center uppercase tracking-wider">
                            — Saltar a otro flujo —
                        </p>
                        <div className="flex items-stretch justify-between gap-3">
                            {onPrev ? (
                                <button
                                    onClick={onPrev}
                                    className="flex items-center gap-2 text-left bg-zinc-900/50 hover:bg-zinc-800 border border-gray-700 hover:border-green-500/50 rounded-md px-3 py-2.5 text-gray-300 hover:text-green-400 transition-all flex-1 min-w-0 font-mono"
                                >
                                    <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-500">Flujo anterior</p>
                                        <p className="text-xs truncate">{prevLabel}</p>
                                    </div>
                                </button>
                            ) : (
                                <div className="flex-1" />
                            )}
                            {onNext ? (
                                <button
                                    onClick={onNext}
                                    className="flex items-center gap-2 text-right justify-end bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-600/20 hover:text-green-300 rounded-md px-3 py-2.5 transition-all flex-1 min-w-0 font-mono"
                                >
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-500">Flujo siguiente</p>
                                        <p className="text-xs truncate">{nextLabel}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                </button>
                            ) : (
                                <div className="flex-1" />
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

// ───────────────────────────────────────────────────────────
// Carrusel de pasos: un paso a la vez con flechas, swipe y teclado
// ───────────────────────────────────────────────────────────
function PasosCarousel({
    pasos,
    colorClasses,
}: {
    pasos: DocFlujoConPasos['pasos']
    colorClasses: { bg: string; border: string; text: string }
}) {
    const [idx, setIdx] = useState(0)
    const [lightbox, setLightbox] = useState(false)
    const touchStartX = useRef<number | null>(null)
    const touchEndX = useRef<number | null>(null)

    // Reset al cambiar de flujo (cuando cambian los pasos)
    useEffect(() => { setIdx(0) }, [pasos])

    const total = pasos.length
    const paso = pasos[idx]
    const goPrev = () => setIdx(i => Math.max(0, i - 1))
    const goNext = () => setIdx(i => Math.min(total - 1, i + 1))

    // Atajos de teclado
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (lightbox) {
                if (e.key === 'Escape') setLightbox(false)
                if (e.key === 'ArrowLeft') goPrev()
                if (e.key === 'ArrowRight') goNext()
                return
            }
            // Solo navega si no estás escribiendo en un input
            const tag = (e.target as HTMLElement)?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'ArrowRight') goNext()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightbox, total])

    // Preload de la siguiente captura para que el swipe sea instantáneo
    useEffect(() => {
        const next = pasos[idx + 1]
        if (next?.imagen_url) {
            const img = new window.Image()
            img.src = next.imagen_url
        }
    }, [idx, pasos])

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchEndX.current = null
    }
    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
    }
    const onTouchEnd = () => {
        if (touchStartX.current == null || touchEndX.current == null) return
        const diff = touchStartX.current - touchEndX.current
        if (Math.abs(diff) > 50) {
            if (diff > 0) goNext()
            else goPrev()
        }
        touchStartX.current = null
        touchEndX.current = null
    }

    return (
        <div className="space-y-4 pb-24 md:pb-4">
            {/* Header del paso — compacto en mobile */}
            <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-3 md:p-6">
                <div className="flex items-baseline gap-2 flex-wrap mb-2">
                    <span className={`text-[11px] md:text-sm font-mono ${colorClasses.text} ${colorClasses.bg} px-2 py-0.5 md:px-3 md:py-1.5 rounded font-bold whitespace-nowrap`}>
                        {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                    {paso.titulo && (
                        <h3 className="text-base md:text-2xl font-mono text-white leading-snug">{paso.titulo}</h3>
                    )}
                </div>
                {paso.accion && (
                    <p className="text-sm md:text-lg font-mono text-green-400 mb-1.5">→ {paso.accion}</p>
                )}
                {paso.descripcion && (
                    <p className="text-sm md:text-lg font-mono text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {paso.descripcion}
                    </p>
                )}
            </div>

            {/* Carrusel de imagen */}
            <div
                className="relative bg-zinc-900/50 border border-green-500/20 rounded-lg overflow-hidden select-none"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Mobile: imagen full sin chrome. Desktop: con chrome estilo terminal */}
                <div className="md:hidden relative bg-black">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={paso.id}
                            src={paso.imagen_url}
                            alt={paso.titulo || `Paso ${idx + 1}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={() => setLightbox(true)}
                            className="w-full max-h-[60vh] object-contain bg-black cursor-zoom-in"
                            loading="eager"
                        />
                    </AnimatePresence>
                    {/* Botón ampliar flotante */}
                    <button
                        onClick={() => setLightbox(true)}
                        aria-label="Ampliar imagen"
                        className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/70 border border-green-500/40 text-green-400 flex items-center justify-center z-20"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                    {/* Tap zones invisibles (solo mobile) para avanzar/retroceder tocando bordes */}
                    {idx > 0 && (
                        <button
                            onClick={goPrev}
                            aria-label="Paso anterior"
                            className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
                            style={{ background: 'transparent' }}
                        />
                    )}
                    {idx < total - 1 && (
                        <button
                            onClick={goNext}
                            aria-label="Siguiente paso"
                            className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
                            style={{ background: 'transparent' }}
                        />
                    )}
                </div>

                <div className="hidden md:block p-3 bg-[#050505]">
                    <div className="rounded-md border border-slate-800 overflow-hidden bg-[#0a0a0a] relative group">
                        <div className="flex items-center justify-between px-3 py-2 bg-[#1a1b26] border-b border-slate-800">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <button
                                onClick={() => setLightbox(true)}
                                className="text-gray-500 hover:text-green-400 transition-colors"
                                aria-label="Ampliar imagen"
                            >
                                <Maximize2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={paso.id}
                                src={paso.imagen_url}
                                alt={paso.titulo || `Paso ${idx + 1}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                onClick={() => setLightbox(true)}
                                className="w-full max-h-[70vh] object-contain bg-black cursor-zoom-in"
                                loading="eager"
                            />
                        </AnimatePresence>
                    </div>
                </div>

                {/* Flechas overlay desktop */}
                {idx > 0 && (
                    <button
                        onClick={goPrev}
                        aria-label="Paso anterior"
                        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-black/70 hover:bg-green-600/90 border border-green-500/40 text-green-400 hover:text-white transition-all"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}
                {idx < total - 1 && (
                    <button
                        onClick={goNext}
                        aria-label="Siguiente paso"
                        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-black/70 hover:bg-green-600/90 border border-green-500/40 text-green-400 hover:text-white transition-all"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Controles inferiores: solo desktop (mobile usa sticky bar) */}
            <div className="hidden md:block space-y-3">
                {/* Progreso */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${colorClasses.text} min-w-[3rem]`}>{idx + 1}/{total}</span>
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${((idx + 1) / total) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Botones prev/next */}
                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={goPrev}
                        disabled={idx === 0}
                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-800/60 hover:bg-zinc-800 border border-gray-700 hover:border-green-500/50 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-green-400 disabled:hover:text-gray-300 disabled:hover:border-gray-700 rounded-md px-4 py-2.5 font-mono text-sm transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </button>
                    <button
                        onClick={goNext}
                        disabled={idx === total - 1}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 hover:border-green-500 disabled:opacity-30 disabled:cursor-not-allowed text-green-300 hover:text-white rounded-md px-4 py-2.5 font-mono text-sm transition-all"
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Mini-thumbnails (desktop) */}
                {total > 1 && (
                    <div className="hidden md:flex gap-2 overflow-x-auto pb-2 pt-1">
                        {pasos.map((p, i) => (
                            <button
                                key={p.id}
                                onClick={() => setIdx(i)}
                                aria-label={`Ir al paso ${i + 1}`}
                                className={`relative flex-shrink-0 w-20 h-14 rounded border-2 overflow-hidden transition-all ${
                                    i === idx
                                        ? 'border-green-500 ring-2 ring-green-500/30'
                                        : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-green-500/50'
                                }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={p.imagen_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <span className="absolute bottom-0 right-0 bg-black/80 text-green-400 font-mono text-[9px] px-1 rounded-tl">
                                    {i + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                <p className="text-[11px] font-mono text-gray-500 text-center md:hidden">
                    👆 Desliza con el dedo para ver el siguiente paso
                </p>
                <p className="text-[11px] font-mono text-gray-500 text-center hidden md:block">
                    ← → con el teclado o click en la imagen para ampliar
                </p>
            </div>

            {/* Sticky bottom bar — solo mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur border-t border-green-500/30 px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
                {/* Barra de progreso */}
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${((idx + 1) / total) * 100}%` }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goPrev}
                        disabled={idx === 0}
                        aria-label="Paso anterior"
                        className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-full bg-zinc-800 disabled:opacity-30 text-gray-300 active:bg-zinc-700"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex-1 text-center font-mono text-xs text-gray-400 leading-tight">
                        <div className={`${colorClasses.text} font-bold text-sm`}>{idx + 1} / {total}</div>
                        <div className="text-[10px] text-gray-500 truncate">
                            {idx === total - 1 ? 'Último paso' : `Toca › o desliza`}
                        </div>
                    </div>
                    <button
                        onClick={goNext}
                        disabled={idx === total - 1}
                        aria-label="Siguiente paso"
                        className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-full bg-green-600 disabled:opacity-30 text-white active:bg-green-700"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Lightbox modal */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}
                    >
                        <button
                            onClick={() => setLightbox(false)}
                            className="absolute top-4 right-4 text-white hover:text-green-400 transition-colors"
                            aria-label="Cerrar"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        {idx > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goPrev() }}
                                aria-label="Paso anterior"
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/60 hover:bg-green-600 border border-green-500/40 text-white flex items-center justify-center transition-all"
                            >
                                <ChevronLeft className="h-7 w-7" />
                            </button>
                        )}
                        {idx < total - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goNext() }}
                                aria-label="Siguiente paso"
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/60 hover:bg-green-600 border border-green-500/40 text-white flex items-center justify-center transition-all"
                            >
                                <ChevronRight className="h-7 w-7" />
                            </button>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={paso.imagen_url}
                            alt={paso.titulo || `Paso ${idx + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 border border-green-500/30 rounded-md px-4 py-2 font-mono text-xs text-green-400">
                            Paso {idx + 1} de {total} {paso.titulo && `· ${paso.titulo}`}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
