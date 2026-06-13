'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Search, ChevronLeft, ChevronRight, X, FileText, FileCode2, TrendingUp, Tag, Pencil, Save, RefreshCw } from 'lucide-react'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface MovBancario {
    id: string
    fecha_operacion: string
    descripcion: string
    referencia: string | null
    monto: number
    etiqueta: string | null
    categoria: string | null
    notas: string | null
    conciliado: boolean
    cfdi_id: string | null
    banco: string
    numero_cuenta: string
    uuid_sat: string | null
    emisor_rfc: string | null
    emisor_nombre: string | null
    receptor_rfc: string | null
    receptor_nombre: string | null
    cfdi_total: number | null
    xml_nombre: string | null
    cfdi_tipo: string | null
}

interface CfdiEmitido {
    id: string; uuid_sat: string; fecha: string
    receptor_rfc: string; receptor_nombre: string | null
    subtotal: number; total: number; estado: string
    xml_nombre: string | null
}

export default function IngresosPage() {
    const { status } = useSession()
    const router = useRouter()
    const [movimientos, setMovimientos] = useState<MovBancario[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [tabPrincipal, setTabPrincipal] = useState<'abonos' | 'cfdis'>('abonos')

    const [ligandoMov, setLigandoMov] = useState<MovBancario | null>(null)
    const [cfdisDisp, setCfdisDisp] = useState<CfdiEmitido[]>([])
    const [loadingCfdisDisp, setLoadingCfdisDisp] = useState(false)
    const [searchCfdiPanel, setSearchCfdiPanel] = useState('')

    const [cfdisTab, setCfdisTab] = useState<CfdiEmitido[]>([])
    const [loadingCfdisTab, setLoadingCfdisTab] = useState(false)
    const [searchCfdiTab, setSearchCfdiTab] = useState('')

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState<{ etiqueta: string; notas: string }>({ etiqueta: '', notas: '' })

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1) }

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    const fetchMovimientos = () => {
        setLoading(true)
        fetch(`/api/finanzas/movimientos?tipo=abono&mes=${mes}&anio=${anio}`)
            .then(r => r.json())
            .then(d => { setMovimientos(d.movimientos || []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { if (status === 'authenticated') fetchMovimientos() }, [status, mes, anio])

    const fetchCfdisDisp = async () => {
        setLoadingCfdisDisp(true)
        const r = await fetch(`/api/finanzas/cfdi?tipo=emitida`)
        const d = await r.json()
        setCfdisDisp(d.cfdis ?? d ?? [])
        setLoadingCfdisDisp(false)
    }

    const fetchCfdisTab = async () => {
        setLoadingCfdisTab(true)
        const r = await fetch(`/api/finanzas/cfdi?tipo=emitida&mes=${mes}&anio=${anio}`)
        const d = await r.json()
        setCfdisTab(d.cfdis ?? d ?? [])
        setLoadingCfdisTab(false)
    }

    useEffect(() => {
        if (status === 'authenticated' && tabPrincipal === 'cfdis' && cfdisTab.length === 0) {
            fetchCfdisTab()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabPrincipal, status])

    const abrirPanelCfdi = (mov: MovBancario) => {
        setLigandoMov(mov)
        setSearchCfdiPanel('')
        setCfdisDisp([])
        fetchCfdisDisp()
    }

    const ligarCfdi = async (cfdiId: string) => {
        if (!ligandoMov) return
        const r = await fetch('/api/finanzas/movimientos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ligandoMov.id, cfdi_id: cfdiId }),
        })
        if (r.ok) { setLigandoMov(null); fetchMovimientos() }
        else alert('Error al ligar CFDI')
    }

    const desligarCfdi = async (movId: string) => {
        const r = await fetch('/api/finanzas/movimientos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: movId, cfdi_id: null }),
        })
        if (r.ok) fetchMovimientos()
    }

    const startEdit = (m: MovBancario) => {
        setEditingId(m.id)
        setEditForm({ etiqueta: m.etiqueta || '', notas: m.notas || '' })
    }

    const saveEdit = async (id: string) => {
        const r = await fetch('/api/finanzas/movimientos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                etiqueta: editForm.etiqueta.trim() || null,
                notas: editForm.notas.trim() || null,
            }),
        })
        if (r.ok) { setEditingId(null); fetchMovimientos() }
    }

    const filtered = movimientos.filter(m => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return m.descripcion.toLowerCase().includes(q) ||
            (m.etiqueta || '').toLowerCase().includes(q) ||
            (m.receptor_nombre || '').toLowerCase().includes(q) ||
            (m.referencia || '').toLowerCase().includes(q)
    })
    const totalAbonos = filtered.reduce((s, m) => s + Number(m.monto), 0)
    const conCfdi = filtered.filter(m => m.cfdi_id).length
    const sinCfdi = filtered.filter(m => !m.cfdi_id).length
    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    const cfdisFiltrados = cfdisDisp.filter(c => {
        if (!searchCfdiPanel.trim()) return true
        const q = searchCfdiPanel.toLowerCase()
        return (c.receptor_nombre || '').toLowerCase().includes(q) ||
            c.receptor_rfc.toLowerCase().includes(q) ||
            c.uuid_sat.toLowerCase().includes(q)
    })

    if (status === 'loading' || loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-primary font-mono">Cargando...</div>
        </div>
    )

    return (
    <>
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/ingresos">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                        <ArrowLeft className="h-4 w-4" /> Finanzas
                                    </Button>
                                    <h1 className="text-3xl font-mono text-green-400">Ingresos</h1>
                                    <p className="text-gray-400 font-mono text-sm mt-1">Abonos del estado de cuenta bancario</p>
                                </div>
                            </div>

                            <div className="flex gap-1 border-b border-green-500/20">
                                <button onClick={() => setTabPrincipal('abonos')}
                                    className={`px-4 py-2 font-mono text-xs border-b-2 -mb-px transition-colors ${tabPrincipal === 'abonos' ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                                    <TrendingUp className="h-3 w-3 inline mr-1" /> Abonos del mes
                                </button>
                                <button onClick={() => setTabPrincipal('cfdis')}
                                    className={`px-4 py-2 font-mono text-xs border-b-2 -mb-px transition-colors ${tabPrincipal === 'cfdis' ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                                    <FileCode2 className="h-3 w-3 inline mr-1" /> CFDIs emitidos
                                </button>
                            </div>

                            {tabPrincipal === 'abonos' && (<>

                            <div className="flex items-center justify-between bg-zinc-900/50 border border-green-500/20 rounded-lg px-4 py-2">
                                <button onClick={prevMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="text-center">
                                    <span className="font-mono text-green-400 text-sm font-bold">{MESES[mes - 1]} {anio}</span>
                                    <span className="font-mono text-gray-500 text-xs block">{filtered.length} movimiento{filtered.length !== 1 ? 's' : ''}</span>
                                </div>
                                <button onClick={nextMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-zinc-900/60 border border-green-500/20 rounded-lg px-3 py-2 font-mono">
                                    <div className="text-[10px] text-gray-500">total abonos</div>
                                    <div className="text-green-400 text-sm font-bold">{fmt(totalAbonos)}</div>
                                </div>
                                <div className="bg-zinc-900/60 border border-blue-500/20 rounded-lg px-3 py-2 font-mono">
                                    <div className="text-[10px] text-gray-500">con CFDI ligado</div>
                                    <div className="text-blue-400 text-sm font-bold">{conCfdi} mov</div>
                                </div>
                                <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg px-3 py-2 font-mono">
                                    <div className="text-[10px] text-gray-500">sin CFDI</div>
                                    <div className="text-yellow-400 text-sm font-bold">{sinCfdi} mov</div>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input type="text" placeholder="Buscar por descripcion, etiqueta, beneficiario..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-green-500 focus:outline-none" />
                            </div>

                            {movimientos.length === 0 ? (
                                <div className="text-center py-12">
                                    <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">No hay abonos en {MESES[mes - 1]} {anio}</p>
                                    <p className="font-mono text-gray-600 text-sm mt-1">Sube tu estado de cuenta en <a href="/admin/finanzas/conciliacion" className="text-green-400 hover:underline">Banco</a></p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <p className="text-center font-mono text-gray-500 py-8">Sin resultados</p>
                            ) : (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-zinc-800/50 border-b border-gray-700">
                                            <tr className="font-mono text-xs text-gray-400">
                                                <th className="text-left p-3">Fecha</th>
                                                <th className="text-left p-3">Descripcion</th>
                                                <th className="text-left p-3">Banco</th>
                                                <th className="text-right p-3">Monto</th>
                                                <th className="text-center p-3">CFDI</th>
                                                <th className="text-left p-3">Etiqueta</th>
                                                <th className="p-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm divide-y divide-gray-800">
                                            {filtered.map(m => (
                                                <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                                                    <td className="p-3 text-gray-400 whitespace-nowrap text-xs">
                                                        {new Date(m.fecha_operacion).toLocaleDateString('es-MX')}
                                                    </td>
                                                    <td className="p-3 max-w-[220px]">
                                                        <div className="text-gray-200 truncate text-xs">{m.descripcion}</div>
                                                        {m.referencia && <div className="text-gray-600 text-[10px] truncate">{String(m.referencia).split("|")[0].trim()}</div>}
                                                    </td>
                                                    <td className="p-3 text-gray-500 text-xs whitespace-nowrap">
                                                        {m.banco}<br /><span className="text-[10px]">{m.numero_cuenta}</span>
                                                    </td>
                                                    <td className="p-3 text-right text-green-400 font-bold whitespace-nowrap">
                                                        {fmt(m.monto)}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {m.cfdi_id ? (
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                                                    <FileText className="h-3 w-3" /> XML ok
                                                                </span>
                                                                {m.uuid_sat && <span className="text-[10px] text-gray-600">{m.uuid_sat.substring(0, 8)}...</span>}
                                                                <button onClick={() => desligarCfdi(m.id)} className="text-[10px] text-gray-600 hover:text-red-400 transition-colors">desligar</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => abrirPanelCfdi(m)}
                                                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-700/20 text-gray-500 border border-gray-700/20 hover:border-blue-500/30 hover:text-blue-400 transition-colors">
                                                                <FileText className="h-3 w-3" /> ligar XML
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className="p-3 min-w-[140px]">
                                                        {editingId === m.id ? (
                                                            <div className="space-y-1">
                                                                <input value={editForm.etiqueta} onChange={e => setEditForm(f => ({ ...f, etiqueta: e.target.value }))}
                                                                    placeholder="Etiqueta..."
                                                                    className="w-full bg-zinc-800 border border-yellow-500/30 rounded px-2 py-1 font-mono text-xs text-white focus:outline-none" />
                                                                <input value={editForm.notas} onChange={e => setEditForm(f => ({ ...f, notas: e.target.value }))}
                                                                    placeholder="Notas..."
                                                                    className="w-full bg-zinc-800 border border-yellow-500/30 rounded px-2 py-1 font-mono text-xs text-white focus:outline-none" />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {m.etiqueta
                                                                    ? <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-green-500/10 text-green-400 border border-green-500/20"><Tag className="h-2.5 w-2.5" />{m.etiqueta}</span>
                                                                    : <span className="text-gray-700 text-[10px]">sin etiqueta</span>
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                                        {editingId === m.id ? (
                                                            <>
                                                                <button onClick={() => saveEdit(m.id)} className="text-yellow-400 hover:text-yellow-300" title="Guardar"><Save className="h-3.5 w-3.5 inline" /></button>
                                                                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-300"><X className="h-3.5 w-3.5 inline" /></button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => startEdit(m)} className="text-gray-600 hover:text-yellow-400 transition-colors" title="Editar etiqueta"><Pencil className="h-3.5 w-3.5 inline" /></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            </>)}

                            {tabPrincipal === 'cfdis' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input type="text" placeholder="Buscar por RFC, nombre, UUID..."
                                                value={searchCfdiTab} onChange={e => setSearchCfdiTab(e.target.value)}
                                                className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-green-500 focus:outline-none" />
                                        </div>
                                        <button onClick={fetchCfdisTab}
                                            className="px-3 py-2 font-mono text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded transition-colors flex items-center gap-1">
                                            <RefreshCw className="h-3 w-3" /> actualizar
                                        </button>
                                    </div>
                                    {loadingCfdisTab ? (
                                        <p className="text-gray-500 font-mono text-xs">cargando CFDIs...</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full font-mono text-xs">
                                                <thead>
                                                    <tr className="text-gray-600 border-b border-green-500/10 text-left">
                                                        <th className="pb-2 pr-4 font-normal">fecha</th>
                                                        <th className="pb-2 pr-4 font-normal">receptor</th>
                                                        <th className="pb-2 pr-4 font-normal">UUID</th>
                                                        <th className="pb-2 pr-4 text-right font-normal">total</th>
                                                        <th className="pb-2 font-normal">estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-green-500/5">
                                                    {cfdisTab
                                                        .filter(c =>
                                                            !searchCfdiTab.trim() ||
                                                            (c.receptor_nombre || '').toLowerCase().includes(searchCfdiTab.toLowerCase()) ||
                                                            c.receptor_rfc.toLowerCase().includes(searchCfdiTab.toLowerCase()) ||
                                                            c.uuid_sat.toLowerCase().includes(searchCfdiTab.toLowerCase())
                                                        )
                                                        .map(c => (
                                                            <tr key={c.id} className="hover:bg-green-500/5 transition-colors">
                                                                <td className="py-2 pr-4 text-gray-400 whitespace-nowrap">
                                                                    {c.fecha ? new Date(c.fecha).toLocaleDateString('es-MX') : '-'}
                                                                </td>
                                                                <td className="py-2 pr-4">
                                                                    <div className="text-gray-200 truncate max-w-[200px]">{c.receptor_nombre || c.receptor_rfc}</div>
                                                                    <div className="text-gray-600 text-[10px]">{c.receptor_rfc}</div>
                                                                </td>
                                                                <td className="py-2 pr-4 text-gray-600 text-[10px]">{c.uuid_sat?.substring(0, 18)}...</td>
                                                                <td className="py-2 pr-4 text-right text-green-400 whitespace-nowrap">{fmt(c.total)}</td>
                                                                <td className="py-2">
                                                                    <span className={`text-[10px] ${c.estado === 'vigente' ? 'text-green-400' : c.estado === 'cancelado' ? 'text-red-400' : 'text-gray-500'}`}>{c.estado}</span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            {cfdisTab.length === 0 && !loadingCfdisTab && (
                                                <div className="text-center py-12">
                                                    <FileCode2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                                    <p className="font-mono text-gray-400">No hay CFDIs emitidos importados</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>

        {ligandoMov && (
            <div className="fixed inset-0 bg-black/80 flex justify-end z-50" onClick={() => setLigandoMov(null)}>
                <motion.div
                    initial={{ x: 420 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 28 }}
                    className="w-full max-w-md bg-[#0a0a0a] border-l border-green-500/20 h-full overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-green-500/20 pb-3">
                            <h2 className="font-mono text-sm text-green-400 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> ligar XML / CFDI emitido
                            </h2>
                            <button onClick={() => setLigandoMov(null)} className="text-gray-600 hover:text-gray-300"><X className="h-4 w-4" /></button>
                        </div>

                        <div className="bg-zinc-900/60 border border-green-500/10 rounded-lg p-4 font-mono">
                            <div className="text-white text-sm truncate">{ligandoMov.descripcion}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{new Date(ligandoMov.fecha_operacion).toLocaleDateString('es-MX')} - {ligandoMov.banco}</div>
                            <div className="mt-2 text-lg font-bold text-green-400">{fmt(ligandoMov.monto)}</div>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                                <input value={searchCfdiPanel} onChange={e => setSearchCfdiPanel(e.target.value)}
                                    placeholder="RFC, nombre o UUID..."
                                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none" />
                            </div>
                            <button onClick={fetchCfdisDisp} disabled={loadingCfdisDisp}
                                className="px-3 py-2 font-mono text-xs bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 rounded transition-colors disabled:opacity-50">
                                {loadingCfdisDisp ? '...' : <RefreshCw className="h-3.5 w-3.5" />}
                            </button>
                        </div>

                        {loadingCfdisDisp ? (
                            <p className="text-gray-600 font-mono text-xs">cargando CFDIs...</p>
                        ) : cfdisFiltrados.length === 0 ? (
                            <p className="font-mono text-xs text-gray-600 text-center py-4">No se encontraron CFDIs emitidos</p>
                        ) : (
                            <div className="space-y-2">
                                {cfdisFiltrados.map(c => (
                                    <div key={c.id} className="bg-zinc-900/60 border border-green-500/20 hover:border-green-500/40 rounded-lg p-3 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-mono text-xs text-white truncate">{c.receptor_nombre || c.receptor_rfc}</div>
                                                <div className="text-gray-600 text-[10px]">{c.receptor_rfc}</div>
                                                <div className="text-gray-500 text-[10px] mt-0.5">{c.fecha ? new Date(c.fecha).toLocaleDateString('es-MX') : '-'}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-mono text-sm text-green-400">{fmt(c.total)}</div>
                                                <button onClick={() => ligarCfdi(c.id)}
                                                    className="mt-1.5 font-mono text-[10px] bg-green-500/20 hover:bg-green-500/40 border border-green-500/40 text-green-300 px-2 py-0.5 rounded transition-colors">
                                                    ligar este
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
    </>
    )
}
