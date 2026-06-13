'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Plus, Search, Receipt, ChevronLeft, ChevronRight, Landmark, GitMerge, X, FileText, FileCode2 } from 'lucide-react'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface Factura {
    id: string; numero_factura: string; concepto: string; total: number; tipo: string;
    cliente_nombre: string; cliente_empresa: string; fecha_vencimiento: string;
    recurrente: boolean; dia_mes: number; estado: string;
    movimiento_bancario_id?: string | null;
    fecha_pago_banco?: string | null;
    banco_descripcion?: string | null;
    cfdi_id?: string | null;
}
interface MovBanco {
    id: string; fecha_operacion: string; descripcion: string; referencia: string;
    cargo: number | null; abono: number | null; numero_cuenta: string; banco: string;
}
interface CfdiCandidato {
    id: string; uuid_sat: string; emisor_rfc: string; emisor_nombre: string | null;
    receptor_rfc: string; receptor_nombre: string | null; total: number; fecha: string; xml_nombre: string;
}
interface CfdiEmitido {
    id: string; uuid_sat: string; fecha: string; emisor_rfc: string;
    receptor_rfc: string; receptor_nombre: string | null;
    subtotal: number; total: number; moneda: string;
    estado: string; factura_id: string | null;
    xml_nombre: string | null;
}

export default function FacturasPage() {
    const { status } = useSession()
    const router = useRouter()
    const [facturas, setFacturas] = useState<Factura[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('todos')
    const [filtroEstado, setFiltroEstado] = useState<'todos' | 'con_banco' | 'sin_banco'>('todos')
    const [tabPrincipal, setTabPrincipal] = useState<'facturas' | 'cfdis'>('facturas')
    // Panel ligar banco (manual)
    const [ligandoFactura, setLigandoFactura] = useState<Factura | null>(null)
    const [movCandidatos, setMovCandidatos] = useState<MovBanco[]>([])
    const [loadMovCands, setLoadMovCands] = useState(false)
    const [busquedaBanco, setBusquedaBanco] = useState('')
    // Panel ligar CFDI (manual)
    const [ligandoCfdiFactura, setLigandoCfdiFactura] = useState<Factura | null>(null)
    const [cfdiCandidatos, setCfdiCandidatos] = useState<CfdiCandidato[]>([])
    const [loadCfdiCands, setLoadCfdiCands] = useState(false)
    const [busquedaCfdi, setBusquedaCfdi] = useState('')
    // Tab CFDIs emitidos
    const [cfdisEmitidos, setCfdisEmitidos] = useState<CfdiEmitido[]>([])
    const [loadingCfdis, setLoadingCfdis] = useState(false)
    const [searchCfdi, setSearchCfdi] = useState('')
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1) }

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        fetch('/api/facturas').then(r => r.json()).then(data => { setFacturas(data); setLoading(false) }).catch(() => setLoading(false))
    }, [status])

    const lastDay = new Date(anio, mes, 0).getDate()
    const filtered = facturas.filter(f => {
        const matchSearch = (f.numero_factura + f.concepto + f.cliente_nombre).toLowerCase().includes(search.toLowerCase())
        const matchTipo = filtroTipo === 'todos' || f.tipo === filtroTipo
        let matchMes = f.recurrente
        if (!f.recurrente && f.fecha_vencimiento) {
            const d = new Date(String(f.fecha_vencimiento).split('T')[0] + 'T12:00:00')
            // show if vence this month OR vence in a past month (rolling unpaid)
            const vencMes = d.getMonth() + 1; const vencAnio = d.getFullYear()
            matchMes = (vencAnio < anio) || (vencAnio === anio && vencMes <= mes)
        }
        const matchBanco = filtroEstado === 'todos' ? true : filtroEstado === 'con_banco' ? !!f.movimiento_bancario_id : !f.movimiento_bancario_id
        return matchSearch && matchTipo && matchMes && matchBanco
    })
    const totalMes = filtered.reduce((s, f) => s + Number(f.total), 0)
    const cobradoBanco = filtered.filter(f => f.movimiento_bancario_id).reduce((s, f) => s + f.total, 0)
    const sinConfirmar = totalMes - cobradoBanco

    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

    const abrirPanelLigar = (f: Factura) => {
        setLigandoFactura(f)
        setMovCandidatos([])
        setBusquedaBanco('')
    }

    const buscarMovBanco = async () => {
        if (!ligandoFactura) return
        setLoadMovCands(true)
        const fecha = ligandoFactura.fecha_vencimiento?.split('T')[0] || new Date().toISOString().split('T')[0]
        const params = new URLSearchParams({ monto: String(ligandoFactura.total), fecha, tipo: 'abono' })
        if (busquedaBanco.trim()) params.set('q', busquedaBanco.trim())
        const r = await fetch(`/api/finanzas/conciliacion/movimientos-candidatos?${params}`)
        const d = await r.json()
        setMovCandidatos(d.movimientos ?? [])
        setLoadMovCands(false)
    }

    const ligarMovimiento = async (movId: string) => {
        if (!ligandoFactura) return
        const r = await fetch('/api/finanzas/conciliacion', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: movId, factura_id: ligandoFactura.id, conciliado: true }),
        })
        if (r.ok) {
            setLigandoFactura(null)
            // refresh facturas
            fetch('/api/facturas').then(r => r.json()).then(data => setFacturas(data)).catch(() => {})
        } else alert('Error al ligar')
    }

    const abrirPanelCfdi = (f: Factura) => {
        setLigandoCfdiFactura(f)
        setCfdiCandidatos([])
        setBusquedaCfdi('')
    }

    const buscarCfdiCandidatos = async () => {
        if (!ligandoCfdiFactura) return
        setLoadCfdiCands(true)
        const params = new URLSearchParams({ monto: String(ligandoCfdiFactura.total), tipo: 'emitida' })
        if (busquedaCfdi.trim()) params.set('q', busquedaCfdi.trim())
        const r = await fetch(`/api/finanzas/conciliacion/cfdi-candidatos?${params}`)
        const d = await r.json()
        setCfdiCandidatos(d.cfdis ?? [])
        setLoadCfdiCands(false)
    }

    const fetchCfdisEmitidos = async () => {
        setLoadingCfdis(true)
        const r = await fetch('/api/finanzas/cfdi?tipo=emitida')
        const d = await r.json()
        setCfdisEmitidos(d.cfdis ?? d ?? [])
        setLoadingCfdis(false)
    }

    useEffect(() => {
        if (status === 'authenticated' && tabPrincipal === 'cfdis' && cfdisEmitidos.length === 0) {
            fetchCfdisEmitidos()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabPrincipal, status])

    const ligarCfdi = async (cfdiId: string) => {
        if (!ligandoCfdiFactura) return
        const r = await fetch(`/api/finanzas/cfdi/${cfdiId}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ factura_id: ligandoCfdiFactura.id }),
        })
        if (r.ok) {
            setLigandoCfdiFactura(null)
            fetch('/api/facturas').then(r => r.json()).then(data => setFacturas(data)).catch(() => {})
        } else alert('Error al ligar CFDI')
    }

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>
    }

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
                                    <p className="text-gray-400 font-mono text-sm mt-1">Cuentas por cobrar y CFDIs emitidos</p>
                                </div>
                                {tabPrincipal === 'facturas' && (
                                    <Button onClick={() => router.push('/admin/finanzas/facturas/nueva')} className="font-mono gap-2 bg-green-600 hover:bg-green-700" size="sm">
                                        <Plus className="h-4 w-4" /> Nueva Factura
                                    </Button>
                                )}
                            </div>

                            {/* Tabs principales */}
                            <div className="flex gap-1 border-b border-green-500/20">
                                <button onClick={() => setTabPrincipal('facturas')}
                                    className={`px-4 py-2 font-mono text-xs border-b-2 -mb-px transition-colors ${
                                        tabPrincipal === 'facturas' ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                                    }`}>
                                    <Receipt className="h-3 w-3 inline mr-1" /> Facturas manuales
                                </button>
                                <button onClick={() => setTabPrincipal('cfdis')}
                                    className={`px-4 py-2 font-mono text-xs border-b-2 -mb-px transition-colors ${
                                        tabPrincipal === 'cfdis' ? 'border-green-400 text-green-400' : 'border-transparent text-gray-500 hover:text-gray-300'
                                    }`}>
                                    <FileCode2 className="h-3 w-3 inline mr-1" /> CFDIs emitidos
                                </button>
                            </div>

                            {tabPrincipal === 'facturas' && (<>
                            {/* Month navigation */}
                            <div className="flex items-center justify-between bg-zinc-900/50 border border-green-500/20 rounded-lg px-4 py-2">
                                <button onClick={prevMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="text-center">
                                    <span className="font-mono text-green-400 text-sm font-bold">{MESES[mes - 1]} {anio}</span>
                                    <span className="font-mono text-gray-500 text-xs block">{filtered.length} entrada{filtered.length !== 1 ? 's' : ''}</span>
                                </div>
                                <button onClick={nextMes} className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input type="text" placeholder="Buscar por número, concepto, cliente..."
                                            value={search} onChange={(e) => setSearch(e.target.value)}
                                            className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-green-500 focus:outline-none" />
                                    </div>
                                    {['todos', 'recurrente', 'unico'].map(t => (
                                        <button key={t} onClick={() => setFiltroTipo(t)}
                                            className={`px-3 py-1.5 rounded font-mono text-xs border transition-all ${filtroTipo === t ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                                            {t === 'todos' ? 'Todos' : t === 'recurrente' ? '🔄 Recurrente' : '⚡ Único'}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {(['todos', 'con_banco', 'sin_banco'] as const).map(f => (
                                        <button key={f} onClick={() => setFiltroEstado(f)}
                                            className={`px-3 py-1 font-mono text-xs rounded border transition-colors ${filtroEstado === f ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                                            {f === 'todos' ? 'Todos' : f === 'con_banco' ? '🏦 Cobrado banco' : '⚠ Sin confirmar'}
                                        </button>
                                    ))}
                                </div>
                                {/* Resumen banco del mes */}
                                <div className="grid grid-cols-3 gap-3 pt-1">
                                    <div className="bg-zinc-900/60 border border-gray-700 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">por cobrar del mes</div>
                                        <div className="text-white text-sm font-bold">{fmt(totalMes)}</div>
                                    </div>
                                    <div className="bg-zinc-900/60 border border-green-500/20 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">🏦 cobrado banco</div>
                                        <div className="text-green-400 text-sm font-bold">{fmt(cobradoBanco)}</div>
                                    </div>
                                    <div className="bg-zinc-900/60 border border-yellow-500/20 rounded-lg px-3 py-2 font-mono">
                                        <div className="text-[10px] text-gray-500">⚠ sin confirmar</div>
                                        <div className="text-yellow-400 text-sm font-bold">{fmt(sinConfirmar)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            {filtered.length > 0 ? (
                                <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-zinc-800/50 border-b border-gray-700">
                                            <tr className="font-mono text-xs text-gray-400">
                                                <th className="text-left p-3">Número</th>
                                                <th className="text-left p-3">Tipo</th>
                                                <th className="text-left p-3">Cliente</th>
                                                <th className="text-left p-3">Concepto</th>
                                                <th className="text-right p-3">Monto</th>
                                                <th className="text-center p-3">Banco</th>
                                                <th className="text-center p-3">XML</th>
                                                <th className="text-right p-3">Frecuencia</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-mono text-sm">
                                            {filtered.map((f) => (
                                                <tr key={f.id} onClick={() => router.push(`/admin/finanzas/facturas/${f.id}`)}
                                                    className="border-b border-gray-800 last:border-0 hover:bg-zinc-800/30 cursor-pointer transition-colors">
                                                    <td className="p-3 text-green-400">{f.numero_factura}</td>
                                                    <td className="p-3">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${f.tipo === 'recurrente' ? 'text-cyan-400 bg-cyan-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                                            {f.tipo === 'recurrente' ? '🔄 Recurrente' : '⚡ Único'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-300">{f.cliente_nombre}</td>
                                                    <td className="p-3 text-gray-400 max-w-[200px] truncate">{f.concepto}</td>
                                                    <td className="p-3 text-right text-white">{fmt(f.total)}</td>
                                                    <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                                                        {f.movimiento_bancario_id ? (
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/30">
                                                                    <Landmark className="h-3 w-3" /> cobrado
                                                                </span>
                                                                {f.fecha_pago_banco && <span className="text-[10px] text-gray-500">{new Date(f.fecha_pago_banco).toLocaleDateString('es-MX')}</span>}
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => abrirPanelLigar(f)} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                                                                <GitMerge className="h-3 w-3" /> ligar
                                                            </button>
                                                        )}
                                                    </td>
                                                    {/* Columna XML/CFDI */}
                                                    <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                                                        <button onClick={() => abrirPanelCfdi(f)} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${f.cfdi_id ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-gray-700/20 text-gray-600 border border-gray-700/20 hover:border-blue-500/30 hover:text-blue-400'}`}>
                                                            <FileText className="h-3 w-3" /> {f.cfdi_id ? 'XML ✓' : 'XML'}
                                                        </button>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {f.recurrente && f.dia_mes ? (
                                                            <span className="text-cyan-400 text-xs">Día {f.dia_mes} / mes</span>
                                                        ) : f.fecha_vencimiento ? (
                                                            <span className="text-gray-400 text-xs">{new Date(f.fecha_vencimiento).toLocaleDateString('es-MX')}</span>
                                                        ) : (
                                                            <span className="text-gray-600 text-xs">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Receipt className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                    <p className="font-mono text-gray-400">{search ? 'Sin resultados para esa búsqueda' : 'No hay entradas registradas'}</p>
                                    <p className="font-mono text-gray-600 text-sm mt-1">Agrega ingresos esperados para rastrearlos</p>
                                </div>
                            )}
                            </>)}

                            {tabPrincipal === 'cfdis' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input type="text" placeholder="Buscar por RFC, nombre, UUID..."
                                                value={searchCfdi} onChange={e => setSearchCfdi(e.target.value)}
                                                className="w-full bg-zinc-900 border border-gray-700 rounded pl-10 pr-4 py-2 text-sm font-mono text-gray-300 focus:border-green-500 focus:outline-none" />
                                        </div>
                                        <button onClick={fetchCfdisEmitidos}
                                            className="px-4 py-2 font-mono text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded transition-colors">
                                            actualizar
                                        </button>
                                    </div>
                                    {loadingCfdis ? (
                                        <p className="text-gray-500 font-mono text-xs">cargando CFDIs...</p>
                                    ) : cfdisEmitidos.filter(c =>
                                        (c.receptor_nombre?.toLowerCase().includes(searchCfdi.toLowerCase()) ||
                                         c.receptor_rfc?.toLowerCase().includes(searchCfdi.toLowerCase()) ||
                                         c.uuid_sat?.toLowerCase().includes(searchCfdi.toLowerCase())) ?? true
                                    ).length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileCode2 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                            <p className="font-mono text-gray-400">No hay CFDIs emitidos importados</p>
                                            <p className="font-mono text-gray-600 text-sm mt-1">Importa XMLs del SAT en <a href="/admin/finanzas/cfdi" className="text-blue-400 hover:underline">CFDIs / XML SAT</a></p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full font-mono text-xs">
                                                <thead>
                                                    <tr className="text-gray-600 border-b border-green-500/10 text-left">
                                                        <th className="pb-2 pr-4 font-normal">fecha</th>
                                                        <th className="pb-2 pr-4 font-normal">receptor</th>
                                                        <th className="pb-2 pr-4 font-normal">UUID</th>
                                                        <th className="pb-2 pr-4 text-right font-normal">total</th>
                                                        <th className="pb-2 font-normal">factura</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-green-500/5">
                                                    {cfdisEmitidos
                                                        .filter(c =>
                                                            !searchCfdi.trim() ||
                                                            c.receptor_nombre?.toLowerCase().includes(searchCfdi.toLowerCase()) ||
                                                            c.receptor_rfc?.toLowerCase().includes(searchCfdi.toLowerCase()) ||
                                                            c.uuid_sat?.toLowerCase().includes(searchCfdi.toLowerCase())
                                                        )
                                                        .map(c => (
                                                            <tr key={c.id} className="hover:bg-green-500/5 transition-colors">
                                                                <td className="py-2 pr-4 text-gray-400 whitespace-nowrap">
                                                                    {c.fecha ? new Date(c.fecha).toLocaleDateString('es-MX') : '—'}
                                                                </td>
                                                                <td className="py-2 pr-4">
                                                                    <div className="text-gray-200 truncate max-w-[180px]">{c.receptor_nombre || c.receptor_rfc}</div>
                                                                    <div className="text-gray-600 text-[10px]">{c.receptor_rfc}</div>
                                                                </td>
                                                                <td className="py-2 pr-4 text-gray-600 text-[10px]">{c.uuid_sat?.substring(0, 18)}…</td>
                                                                <td className="py-2 pr-4 text-right text-green-400 whitespace-nowrap">{fmt(c.total)}</td>
                                                                <td className="py-2">
                                                                    {c.factura_id ? (
                                                                        <span className="text-blue-400 text-[10px]">✓ ligado</span>
                                                                    ) : (
                                                                        <span className="text-gray-600 text-[10px]">sin ligar</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>

        {/* Panel lateral ligar banco */}
        {ligandoFactura && (
            <div className="fixed inset-0 bg-black/80 flex justify-end z-50" onClick={() => setLigandoFactura(null)}>
                <motion.div
                    initial={{ x: 420 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 28 }}
                    className="w-full max-w-md bg-[#0a0a0a] border-l border-green-500/20 h-full overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-green-500/20 pb-3">
                            <h2 className="font-mono text-sm text-green-400 flex items-center gap-2">
                                <GitMerge className="h-4 w-4" /> ligar cobro del banco
                            </h2>
                            <button onClick={() => setLigandoFactura(null)} className="text-gray-600 hover:text-gray-300"><X className="h-4 w-4" /></button>
                        </div>

                        <div className="bg-zinc-900/60 border border-green-500/10 rounded-lg p-4 font-mono">
                            <div className="text-white text-sm">{ligandoFactura.numero_factura} — {ligandoFactura.cliente_nombre}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{ligandoFactura.concepto}</div>
                            {ligandoFactura.fecha_vencimiento && <div className="text-gray-600 text-[10px] mt-0.5">vence: {new Date(ligandoFactura.fecha_vencimiento).toLocaleDateString('es-MX')}</div>}
                            <div className="mt-3 text-lg font-bold text-green-400">{fmt(ligandoFactura.total)}</div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={busquedaBanco}
                                onChange={e => setBusquedaBanco(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && buscarMovBanco()}
                                placeholder="buscar por descripción o monto..."
                                className="flex-1 px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500/50"
                            />
                            <button onClick={buscarMovBanco} disabled={loadMovCands}
                                className="px-3 py-2 font-mono text-xs bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 rounded transition-colors disabled:opacity-50">
                                {loadMovCands ? '...' : 'buscar'}
                            </button>
                        </div>

                        {loadMovCands ? (
                            <p className="text-gray-600 font-mono text-xs">buscando...</p>
                        ) : movCandidatos.length === 0 ? (
                            <div className="font-mono text-xs text-gray-600 bg-zinc-900/40 border border-gray-800 rounded p-4 text-center">
                                No se encontraron abonos similares.<br />
                                <span className="text-gray-700">Sube el estado de cuenta BBVA en</span>{' '}
                                <a href="/admin/finanzas/conciliacion" className="text-yellow-500 hover:underline">Banco</a>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {movCandidatos.map(m => (
                                    <div key={m.id} className="bg-zinc-900/60 border border-green-500/20 hover:border-green-500/40 rounded-lg p-3 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-mono text-xs text-white truncate">{m.descripcion}</div>
                                                {m.referencia && <div className="text-gray-600 text-[10px] truncate">{m.referencia.split(' | ')[0]}</div>}
                                                <div className="text-gray-500 text-[10px] mt-0.5">{new Date(m.fecha_operacion).toLocaleDateString('es-MX')} · {m.banco} {m.numero_cuenta}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-mono text-sm text-green-400">{fmt(m.abono ?? 0)}</div>
                                                <button onClick={() => ligarMovimiento(m.id)}
                                                    className="mt-1.5 font-mono text-[10px] bg-green-500/20 hover:bg-green-500/40 border border-green-500/40 text-green-300 px-2 py-0.5 rounded transition-colors">
                                                    ✓ ligar este
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
        {/* Panel lateral ligar CFDI */}
        {ligandoCfdiFactura && (
            <div className="fixed inset-0 bg-black/80 flex justify-end z-50" onClick={() => setLigandoCfdiFactura(null)}>
                <motion.div
                    initial={{ x: 420 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 28 }}
                    className="w-full max-w-md bg-[#0a0a0a] border-l border-blue-500/20 h-full overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
                            <h2 className="font-mono text-sm text-blue-400 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> ligar XML / CFDI emitido
                            </h2>
                            <button onClick={() => setLigandoCfdiFactura(null)} className="text-gray-600 hover:text-gray-300"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="bg-zinc-900/60 border border-blue-500/10 rounded-lg p-4 font-mono">
                            <div className="text-white text-sm">{ligandoCfdiFactura.numero_factura} — {ligandoCfdiFactura.cliente_nombre}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{ligandoCfdiFactura.concepto}</div>
                            <div className="mt-2 text-lg font-bold text-green-400">{fmt(ligandoCfdiFactura.total)}</div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                value={busquedaCfdi}
                                onChange={e => setBusquedaCfdi(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && buscarCfdiCandidatos()}
                                placeholder="buscar por RFC, nombre o monto..."
                                className="flex-1 px-3 py-2 bg-zinc-900 border border-blue-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            />
                            <button onClick={buscarCfdiCandidatos} disabled={loadCfdiCands}
                                className="px-3 py-2 font-mono text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 rounded transition-colors disabled:opacity-50">
                                {loadCfdiCands ? '...' : 'buscar'}
                            </button>
                        </div>
                        {loadCfdiCands ? (
                            <p className="text-gray-600 font-mono text-xs">buscando...</p>
                        ) : cfdiCandidatos.length === 0 ? (
                            <div className="font-mono text-xs text-gray-600 bg-zinc-900/40 border border-gray-800 rounded p-4 text-center">
                                No se encontraron CFDIs emitidos similares.<br />
                                <span className="text-gray-700">Importa XMLs del SAT en</span>{' '}
                                <a href="/admin/finanzas/cfdi" className="text-blue-500 hover:underline">CFDIs</a>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {cfdiCandidatos.map(c => (
                                    <div key={c.id} className="bg-zinc-900/60 border border-blue-500/20 hover:border-blue-500/40 rounded-lg p-3 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-mono text-xs text-white truncate">{c.receptor_nombre || c.receptor_rfc}</div>
                                                <div className="text-gray-600 text-[10px] truncate">{c.uuid_sat}</div>
                                                <div className="text-gray-500 text-[10px] mt-0.5">{c.fecha ? new Date(c.fecha).toLocaleDateString('es-MX') : '—'}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-mono text-sm text-blue-400">{fmt(c.total)}</div>
                                                <button onClick={() => ligarCfdi(c.id)}
                                                    className="mt-1.5 font-mono text-[10px] bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/40 text-blue-300 px-2 py-0.5 rounded transition-colors">
                                                    ✓ ligar este
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
