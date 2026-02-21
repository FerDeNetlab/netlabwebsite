'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

interface Evento {
    id: string; titulo: string; monto: number; fecha: string; estado: string;
    cliente_nombre: string; tipo: string; categoria_color?: string
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function CalendarioPage() {
    const { status } = useSession()
    const router = useRouter()
    const [eventos, setEventos] = useState<Evento[]>([])
    const [loading, setLoading] = useState(true)
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [anio, setAnio] = useState(new Date().getFullYear())
    const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null)

    useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login') }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        setLoading(true)
        fetch(`/api/finanzas/calendario?mes=${mes}&anio=${anio}`)
            .then(r => r.json())
            .then(data => { setEventos(data.eventos || []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [status, mes, anio])

    const prevMes = () => { if (mes === 1) { setMes(12); setAnio(a => a - 1) } else setMes(m => m - 1); setDiaSeleccionado(null) }
    const nextMes = () => { if (mes === 12) { setMes(1); setAnio(a => a + 1) } else setMes(m => m + 1); setDiaSeleccionado(null) }

    // Build calendar grid
    const primerDia = new Date(anio, mes - 1, 1).getDay()
    const diasEnMes = new Date(anio, mes, 0).getDate()
    const celdas: (number | null)[] = []
    for (let i = 0; i < primerDia; i++) celdas.push(null)
    for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

    const eventosDelDia = (dia: number) => {
        const dateStr = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
        return eventos.filter(e => e.fecha && e.fecha.startsWith(dateStr))
    }

    const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
    const hoy = new Date()
    const esHoy = (d: number) => d === hoy.getDate() && mes === hoy.getMonth() + 1 && anio === hoy.getFullYear()

    if (status === 'loading' || loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>

    const eventosDiaSeleccionado = diaSeleccionado ? eventosDelDia(diaSeleccionado) : []

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TerminalFrame title="root@netlab:~/finanzas/calendario">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
                                <div>
                                    <Button onClick={() => router.push('/admin/finanzas')} variant="ghost" className="font-mono gap-2 text-sm mb-2"><ArrowLeft className="h-4 w-4" /> Finanzas</Button>
                                    <h1 className="text-3xl font-mono text-blue-400">Calendario de Pagos</h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={prevMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft className="h-5 w-5 text-gray-400" /></button>
                                    <span className="font-mono text-white text-lg min-w-[160px] text-center">{MESES[mes - 1]} {anio}</span>
                                    <button onClick={nextMes} className="p-1 hover:bg-zinc-800 rounded"><ChevronRight className="h-5 w-5 text-gray-400" /></button>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex gap-4 font-mono text-xs">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Cobro esperado</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Pago a realizar</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Ingreso recibido</span>
                            </div>

                            {/* Calendar Grid */}
                            <div className="bg-zinc-900/50 border border-gray-700 rounded-lg overflow-hidden">
                                {/* Day headers */}
                                <div className="grid grid-cols-7 bg-zinc-800/50 border-b border-gray-700">
                                    {DIAS.map(d => (
                                        <div key={d} className="p-2 text-center font-mono text-xs text-gray-400">{d}</div>
                                    ))}
                                </div>
                                {/* Day cells */}
                                <div className="grid grid-cols-7">
                                    {celdas.map((dia, i) => {
                                        if (dia === null) return <div key={`e${i}`} className="min-h-[80px] border-b border-r border-gray-800 bg-zinc-900/30" />
                                        const evts = eventosDelDia(dia)
                                        const cobros = evts.filter(e => e.tipo === 'cobro' || e.tipo === 'ingreso')
                                        const pagos = evts.filter(e => e.tipo === 'pago')
                                        const isSelected = diaSeleccionado === dia

                                        return (
                                            <div key={dia} onClick={() => setDiaSeleccionado(dia === diaSeleccionado ? null : dia)}
                                                className={`min-h-[80px] border-b border-r border-gray-800 p-1.5 cursor-pointer transition-colors
                          ${esHoy(dia) ? 'bg-green-500/5' : ''} ${isSelected ? 'bg-blue-500/10 ring-1 ring-blue-500/30' : 'hover:bg-zinc-800/30'}`}>
                                                <div className={`font-mono text-xs mb-1 ${esHoy(dia) ? 'text-green-400 font-bold' : 'text-gray-500'}`}>{dia}</div>
                                                {cobros.length > 0 && (
                                                    <div className="text-[10px] font-mono text-green-400 bg-green-400/10 rounded px-1 py-0.5 mb-0.5 truncate">
                                                        +{fmt(cobros.reduce((s, e) => s + Number(e.monto), 0))}
                                                    </div>
                                                )}
                                                {pagos.length > 0 && (
                                                    <div className="text-[10px] font-mono text-red-400 bg-red-400/10 rounded px-1 py-0.5 truncate">
                                                        -{fmt(pagos.reduce((s, e) => s + Number(e.monto), 0))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Selected day detail */}
                            {diaSeleccionado && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-zinc-900/50 border border-blue-500/30 rounded-lg p-5">
                                    <h3 className="font-mono text-blue-400 text-sm mb-3">{diaSeleccionado} de {MESES[mes - 1]} {anio}</h3>
                                    {eventosDiaSeleccionado.length > 0 ? (
                                        <div className="space-y-2">
                                            {eventosDiaSeleccionado.map((e, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                                                    <div>
                                                        <div className="font-mono text-sm text-white">{e.titulo}</div>
                                                        <div className="font-mono text-xs text-gray-500">{e.cliente_nombre || ''} • {e.tipo}</div>
                                                    </div>
                                                    <div className={`font-mono text-sm font-bold ${e.tipo === 'pago' ? 'text-red-400' : 'text-green-400'}`}>
                                                        {e.tipo === 'pago' ? '-' : '+'}{fmt(Number(e.monto))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="font-mono text-gray-500 text-sm">Sin eventos este día</p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
