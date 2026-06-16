"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2,
    BarChart3,
    Layers,
    Cpu,
    Database,
    ChevronRight,
    Package,
    AlertTriangle,
    ArrowLeftRight,
    ScanBarcode,
    ClipboardList,
    Users,
    Warehouse,
    TrendingDown,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

export default function PIASAClient() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <main className="min-h-screen bg-[#0c0c0c] text-slate-300 font-mono selection:bg-amber-500 selection:text-black">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-12 pb-24 overflow-hidden">
                <div className="container px-4 mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <TerminalFrame borderColor="gray" title="netlab@piasa:~/wms_proposal_v1.0" className="bg-[#0f172a]/20 border-slate-800">
                            <div className="space-y-8 py-4">
                                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base opacity-70">
                                    <span className="text-amber-500 font-bold">root@netlab:~$</span>
                                    <span>./init-project --client=piasa --type=wms --users=40</span>
                                    <span className="w-2 h-5 bg-amber-500 animate-pulse inline-block align-middle ml-1" />
                                </div>

                                <div className="space-y-6 md:pl-8 border-l border-slate-800 ml-1">
                                    <div className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2">
                                        Estatus: Propuesta Técnica v1.0
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight md:leading-none">
                                        WMS INDUSTRIAL <br />
                                        <span className="text-amber-500">PIASA</span>
                                    </h1>

                                    <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                                        Sistema de Gestión de Almacén diseñado para la operación industrial de acero.
                                        Control total de <span className="text-white">activos fijos</span>,{" "}
                                        <span className="text-white">consumibles</span> y{" "}
                                        <span className="text-white">refacciones</span> — sin caos, con trazabilidad real.
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm italic">
                                            [ USUARIOS: ~40 ]
                                        </div>
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm italic">
                                            [ SCOPE: OPERATIVO_INDUSTRIAL ]
                                        </div>
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm italic">
                                            [ FILOSOFÍA: ORDEN_ANTES_QUE_COMPLEJIDAD ]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TerminalFrame>
                    </motion.div>
                </div>
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
            </section>

            {/* El problema */}
            <section className="py-20 border-t border-slate-900 bg-[#080808]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="mb-16">
                        <div className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-3">// Diagnóstico</div>
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">
                            Lo que pasa sin un WMS
                        </h2>
                        <p className="text-slate-500 text-sm">Los costos ocultos del almacén desordenado en planta industrial.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ProblemCard
                            icon={<AlertTriangle className="text-amber-500" size={32} />}
                            title="Sin visibilidad"
                            description="No sabes qué tienes, dónde está, ni quién lo tiene. Las búsquedas cuestan tiempo de producción."
                        />
                        <ProblemCard
                            icon={<TrendingDown className="text-amber-500" size={32} />}
                            title="Paros por falta de refacciones"
                            description="Los niveles mínimos no se respetan. Te enteras que falta algo cuando ya paraste la línea."
                        />
                        <ProblemCard
                            icon={<Users className="text-amber-500" size={32} />}
                            title="Sin responsabilidad"
                            description="No hay registro de quién sacó qué ni cuándo. Las pérdidas se diluyen entre áreas."
                        />
                    </div>
                </div>
            </section>

            {/* Módulos del sistema */}
            <section className="py-20 border-t border-slate-900 bg-[#0c0c0c]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="mb-16">
                        <div className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-3">// Solución</div>
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">
                            Módulos del WMS
                        </h2>
                        <p className="text-slate-500 text-sm">Lo que el sistema hace por ti, desde el primer día.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Package className="text-amber-500" size={28} />}
                            title="Catálogo Unificado"
                            description="Un solo registro para activos fijos, consumibles y refacciones. Con código, descripción, unidad y ubicación."
                        />
                        <FeatureCard
                            icon={<ArrowLeftRight className="text-amber-500" size={28} />}
                            title="Entradas y Salidas"
                            description="Registro de cada movimiento: quién lo saca, para qué área, en qué fecha. Trazabilidad completa."
                        />
                        <FeatureCard
                            icon={<Warehouse className="text-amber-500" size={28} />}
                            title="Ubicaciones de Almacén"
                            description="Control por pasillo, rack o área. Sabes exactamente dónde está cada artículo en planta."
                        />
                        <FeatureCard
                            icon={<AlertTriangle className="text-amber-500" size={28} />}
                            title="Alertas de Mínimos"
                            description="Niveles mínimos configurables por artículo. El sistema te avisa antes de que se acabe."
                        />
                        <FeatureCard
                            icon={<ScanBarcode className="text-amber-500" size={28} />}
                            title="Código de Barras / QR"
                            description="Etiquetado físico de artículos y ubicaciones. Captura rápida desde celular o lector."
                        />
                        <FeatureCard
                            icon={<ClipboardList className="text-amber-500" size={28} />}
                            title="Reportes y Auditoría"
                            description="Historial de movimientos, inventario actual, rotación y reporte de salidas por área o responsable."
                        />
                    </div>
                </div>
            </section>

            {/* Fases del proyecto */}
            <section className="py-24 bg-[#080808] border-t border-slate-900">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <div className="text-xs text-amber-500 uppercase tracking-widest font-bold">// Plan de entrega</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">Desglose del Proyecto</h2>
                        <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">Tres fases. Valor desde la primera.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-px bg-slate-800 border border-slate-800 font-mono">
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <h3 className="text-amber-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <Layers size={18} /> Fase 1: Cimientos
                            </h3>
                            <p className="text-xs text-slate-600 italic">Semanas 1–3</p>
                            <ul className="space-y-3">
                                {["Catálogo de artículos (activos, consumibles, refacciones)", "Estructura de ubicaciones en almacén", "Gestión de usuarios y roles (40 usuarios)", "Módulo de entradas (compras/devoluciones)", "Módulo de salidas (por área / responsable)"].map(item => (
                                    <li key={item} className="text-sm text-slate-400 flex gap-2">
                                        <span className="text-amber-500 shrink-0">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <h3 className="text-amber-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <Cpu size={18} /> Fase 2: Control
                            </h3>
                            <p className="text-xs text-slate-600 italic">Semanas 4–6</p>
                            <ul className="space-y-3">
                                {["Niveles mínimos y alertas de reabasto", "Etiquetado QR / código de barras", "Captura desde dispositivo móvil", "Transferencias entre áreas o almacenes", "Historial de movimientos por artículo"].map(item => (
                                    <li key={item} className="text-sm text-slate-400 flex gap-2">
                                        <span className="text-amber-500 shrink-0">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <h3 className="text-amber-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={18} /> Fase 3: Visibilidad
                            </h3>
                            <p className="text-xs text-slate-600 italic">Semanas 7–8</p>
                            <ul className="space-y-3">
                                {["Dashboard operativo en tiempo real", "Reporte de rotación y consumo", "Reporte de salidas por área / turno", "Inventario físico asistido (conteo)", "Entrega, capacitación y puesta en marcha"].map(item => (
                                    <li key={item} className="text-sm text-slate-400 flex gap-2">
                                        <span className="text-amber-500 shrink-0">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Propuesta económica */}
            <section className="py-24 border-t border-slate-900 bg-[#0c0c0c]">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="bg-slate-900/10 border border-slate-800 p-8 md:p-12 rounded-sm space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Database size={200} />
                        </div>

                        <div className="space-y-4">
                            <div className="text-xs text-amber-500 uppercase tracking-widest font-bold">// Propuesta económica</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase">Inversión</h2>
                            <p className="text-slate-500 text-sm italic">[ Desarrollo completo, entrega en 8 semanas ]</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Inversión Total</div>
                                    <div className="text-5xl font-bold text-white">$45,000 <span className="text-lg font-normal text-slate-500">MXN + IVA</span></div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    {[
                                        "Desarrollo completo (Fases 1–3)",
                                        "Hasta 40 usuarios incluidos",
                                        "Módulo QR / código de barras",
                                        "1 año de hosting incluido",
                                        "Capacitación al equipo",
                                    ].map(item => (
                                        <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                            <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 bg-black/40 p-6 border border-slate-800">
                                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Esquema de Pago</h3>
                                <div className="space-y-8">
                                    <div className="relative pl-6 border-l-2 border-amber-500/20">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-amber-500" />
                                        <div className="font-bold text-white text-xl">50% — $22,500</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">Anticipo para inicio de desarrollo</div>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-amber-500/20">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-700" />
                                        <div className="font-bold text-white text-xl">50% — $22,500</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">Contra entrega y puesta en marcha</div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800">
                                    <p className="text-xs text-slate-600 italic">Ambos pagos más IVA correspondiente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 items-center flex flex-col">
                <div className="container px-4 mx-auto max-w-4xl text-center space-y-8">
                    <div className="inline-block px-4 py-1 border border-slate-800 bg-slate-900/50 text-[10px] text-amber-500 font-bold uppercase tracking-widest">
                        PIASA v1.0 // Ready for Deployment
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
                        ¿Ordenamos el almacén?
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto italic">
                        El proyecto arranca con el anticipo y la firma del{" "}
                        <span className="text-white">Scope Charter</span>.
                        En 8 semanas tienes un WMS operando en planta.
                    </p>
                    <div className="pt-8 flex flex-col items-center gap-6">
                        <a
                            href="https://wa.me/5215513180427"
                            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-black bg-amber-500 hover:bg-amber-400 transition-all duration-200 rounded-sm w-full md:w-auto text-lg"
                        >
                            AUTORIZAR DESARROLLO
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                            Propuesta válida · Netlab × PIASA 2026
                        </span>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function ProblemCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-[#080808] border border-slate-800 p-8 space-y-4">
            <div className="p-3 bg-slate-900/50 w-fit rounded-sm">
                {icon}
            </div>
            <h3 className="text-white font-bold text-lg uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-[#0c0c0c] border border-slate-800 p-6 space-y-4 hover:border-amber-500/30 transition-all duration-300 group">
            <div className="p-3 bg-slate-900/50 w-fit rounded-sm group-hover:bg-amber-500/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-white font-bold text-base uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
    )
}
