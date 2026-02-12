"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2,
    Shield,
    BarChart3,
    Layers,
    Cpu,
    Database,
    RefreshCw,
    ChevronRight,
    Terminal,
    Box,
    QrCode,
    Smartphone,
    ArrowRight
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

export default function AQClient() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <main className="min-h-screen bg-[#0c0c0c] text-slate-300 font-mono selection:bg-green-500 selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-12 pb-24 overflow-hidden">
                <div className="container px-4 mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <TerminalFrame borderColor="gray" title="netlab@grupoaq:~/proposal_v1.1" className="bg-[#0f172a]/20 border-slate-800">
                            <div className="space-y-8 py-4">
                                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base opacity-70">
                                    <span className="text-green-500 font-bold">root@netlab:~$</span>
                                    <span>./init-project --client=grupo-aq --type=mvp</span>
                                    <span className="w-2 h-5 bg-green-500 animate-none inline-block align-middle ml-1" />
                                </div>

                                <div className="space-y-6 md:pl-8 border-l border-slate-800 ml-1">
                                    <div className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-green-500 font-bold uppercase tracking-widest mb-2">
                                        Estatus: Propuesta de Desarrollo MVP
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight md:leading-none">
                                        SISTEMA OPERATIVO <br />
                                        <span className="text-green-500">INVENTARIOS EN CAMPO</span>
                                    </h1>

                                    <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                                        Diseño y despliegue de una infraestructura propia para el control de activos y consumibles.
                                        Solución <span className="text-white">80/20</span> enfocada en la disciplina operativa y trazabilidad real.
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm italic">
                                            [ SCOPE: OPERATIVO_NO_FINANCIERO ]
                                        </div>
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm italic">
                                            [ PHILOSOPHY: MVP_REPLICABLE ]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TerminalFrame>
                    </motion.div>
                </div>
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
            </section>

            {/* Core Logic Section: How it works */}
            <section className="py-20 border-t border-slate-900 bg-[#0c0c0c]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">
                            Lógica del Sistema (MVP)
                        </h2>
                        <p className="text-slate-500 text-sm">El núcleo de la solución para resolver el caos en campo.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Box className="text-green-500" size={32} />}
                            title="Control Dual"
                            description="Gestión diferenciada de activos fijos reutilizables y consumibles por evento."
                        />
                        <FeatureCard
                            icon={<QrCode className="text-green-500" size={32} />}
                            title="Escaneo QR/Barras"
                            description="Etiquetado físico por contenedor para auditorías rápidas y registro de contenidos."
                        />
                        <FeatureCard
                            icon={<Smartphone className="text-green-500" size={32} />}
                            title="Operación Campo"
                            description="Registro de salidas y retornos con evidencia fotográfica desde dispositivos móviles."
                        />
                    </div>
                </div>
            </section>

            {/* Project Breakdown: MVP Strategy */}
            <section className="py-24 bg-[#080808]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">Desglose del Proyecto</h2>
                        <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">Fases de entrega y validación</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800 font-mono">
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <h3 className="text-green-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <Layers size={18} /> Fase 1: Core
                            </h3>
                            <ul className="space-y-3">
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Catálogo de Activos/Consumibles
                                </li>
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Módulo de Proyectos/Eventos
                                </li>
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Registro de Salida y Retorno
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <h3 className="text-green-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <Cpu size={18} /> Fase 2: Captura
                            </h3>
                            <ul className="space-y-3">
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Sistema de escaneo QR
                                </li>
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Gestión de Contenedores
                                </li>
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Evidencias Fotográficas
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <h3 className="text-green-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={18} /> Fase 3: Visibilidad
                            </h3>
                            <ul className="space-y-3">
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Dashboard Operativo Básico
                                </li>
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Historial de uso por Evento
                                </li>
                                <li className="text-sm text-slate-400 flex gap-2">
                                    <span className="text-green-500">›</span> Reportes de Supervisión
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Economic Proposal */}
            <section className="py-24 border-t border-slate-900 bg-[#0c0c0c]">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="bg-slate-900/10 border border-slate-800 p-8 md:p-12 rounded-sm space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Database size={200} />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase">Propuesta Económica</h2>
                            <p className="text-slate-500 text-sm italic">[ Inversión en infraestructura operativa ]</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Inversión Total MVP</div>
                                    <div className="text-5xl font-bold text-white">$25,000 <span className="text-lg font-normal text-slate-500">MXN + IVA</span></div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        <span>Desarrollo completo (Fases 1-3)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        <span>Demo funcional incluida</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        <span>1 Año de Hosting incluido</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 bg-black/40 p-6 border border-slate-800">
                                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Esquema de Pago</h3>
                                <div className="space-y-6">
                                    <div className="relative pl-6 border-l-2 border-green-500/20">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-green-500" />
                                        <div className="font-bold text-white text-lg">50% Anticipo</div>
                                        <div className="text-xs text-slate-500 font-mono">Para inicio de desarrollo</div>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-green-500/20">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-700" />
                                        <div className="font-bold text-white text-lg">50% Liquidación</div>
                                        <div className="text-xs text-slate-500 font-mono">Contra entrega de demo funcional</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <section className="py-32 items-center flex flex-col">
                <div className="container px-4 mx-auto max-w-4xl text-center space-y-8">
                    <div className="inline-block px-4 py-1 border border-slate-800 bg-slate-900/50 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                        Grupo AQ v1.1 // Ready for Deployment
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">¿Iniciamos la Fase 1?</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto italic">
                        El proyecto inicia oficialmente tras el primer pago y la firma del <span className="text-white">Scope Charter</span>.
                    </p>
                    <div className="pt-8 flex flex-col items-center gap-6">
                        <a
                            href="https://wa.me/5215513180427"
                            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-black bg-green-500 hover:bg-green-400 transition-all duration-200 rounded-sm w-full md:w-auto text-lg"
                        >
                            AUTORIZAR DESARROLLO
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">Proposal valid until Feb 28, 2026</span>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-[#0c0c0c] border border-slate-800 p-8 space-y-4 hover:border-green-500/30 transition-all duration-300 group">
            <div className="p-3 bg-slate-900/50 w-fit rounded-sm group-hover:bg-green-500/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-white font-bold text-xl uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
    )
}
