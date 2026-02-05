"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    CheckCircle2,
    Target,
    Zap,
    Shield,
    BarChart3,
    Layers,
    Cpu,
    Database,
    RefreshCw,
    AlertCircle,
    Hash,
    Activity,
    ChevronRight,
    Terminal,
    Settings
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

export default function AuraClient() {
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
                        <TerminalFrame borderColor="gray" title="netlab@auramarket:~/proposal_v1.1" className="bg-[#0f172a]/20 border-slate-800">
                            <div className="space-y-8 py-4">
                                <div className="flex flex-wrap items-center gap-3 text-sm md:text-base opacity-70">
                                    <span className="text-green-500 font-bold">root@netlab:~$</span>
                                    <span>./analyze-operation --client=aura-market</span>
                                    <span className="w-2 h-5 bg-green-500 animate-none inline-block align-middle ml-1" />
                                </div>

                                <div className="space-y-6 md:pl-8 border-l border-slate-800 ml-1">
                                    <div className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-green-500 font-bold uppercase tracking-widest mb-2">
                                        Propuesta Técnica: Orquestador a Medida
                                    </div>

                                    <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-white leading-none">
                                        ORQUESTADOR DE <span className="text-green-500">MARKETPLACES</span>
                                    </h1>

                                    <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                                        Aura Market no necesita otra "plataforma genérica" con reglas rígidas. Necesita una
                                        infraestructura propia diseñada para escalar sus <span className="text-white">15,000 SKUs</span>.
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm">
                                            [ COMPETITIVE_EDGE: 100%_CUSTOM ]
                                        </div>
                                        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-800 px-3 py-2 rounded-sm">
                                            [ TARGET: NO_DEPENDENCY ]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TerminalFrame>
                    </motion.div>
                </div>

                {/* Clean Static Grid */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]"></div>
            </section>

            {/* Comparison Section: Custom vs Generic */}
            <section className="py-20 border-t border-slate-900 bg-[#0c0c0c]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">
                            Netlab vs. Plataformas Genéricas (Autoazur/Etc)
                        </h2>
                        <p className="text-slate-500 text-sm">¿Por qué un desarrollo a medida es tu mejor inversión?</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-px bg-slate-800 border border-slate-800">
                        <div className="bg-[#0c0c0c] p-8 space-y-6">
                            <div className="flex items-center gap-3 text-red-500/70 font-bold text-xs uppercase">
                                <AlertCircle size={16} /> Plataformas Genéricas
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-slate-500">
                                    <span className="text-red-900 font-bold">✕</span>
                                    <span>Reglas de negocio inflexibles</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-500">
                                    <span className="text-red-900 font-bold">✕</span>
                                    <span>Costos mensuales crecientes por volumen</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-500">
                                    <span className="text-red-900 font-bold">✕</span>
                                    <span>Sin propiedad sobre el código ni los datos</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-[#0f172a]/10 p-8 space-y-6 border-l md:border-l-0 border-slate-800">
                            <div className="flex items-center gap-3 text-green-500 font-bold text-xs uppercase">
                                <CheckCircle2 size={16} /> Netlab Orchestrator
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-slate-200">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>Diseñado específicamente para tus kits y bundles</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-200">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>Infraestructura propia: escala sin costos de licencia</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-200">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <span>Eres dueño de tu tecnología y tus automatizaciones</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo 1: Interactive Workflow Component */}
            <section className="py-20 bg-[#0c0c0c] border-y border-slate-900">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                                El "Orquestador": Tu nuevo cerebro operativo
                            </h2>
                            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                El sistema detecta cambios en tus proveedores (CVA/ERP) y actualiza automáticamente Mercado Libre.
                                Sin humanos, sin errores, sin Excel.
                            </p>

                            <div className="space-y-4 pt-4">
                                {[
                                    "Centralización total de pedidos",
                                    "Sincronización multi-canal",
                                    "Gestión inteligente de precios"
                                ].map(item => (
                                    <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <InteractiveWorkflowDemo />
                    </div>
                </div>
            </section>

            {/* Phase 1 Detailed Deliverables */}
            <section className="py-24 border-t border-slate-900 bg-[#080808]">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase">
                                Compromiso de <span className="text-green-500">Entrega</span>
                            </h2>
                            <p className="text-slate-500 max-w-xl text-sm">
                                Al finalizar la Fase 1, Aura Market tendrá una plataforma operativa propia,
                                lista para transaccionar y preparada para la escalabilidad.
                            </p>
                        </div>
                        <div className="px-4 py-2 border border-green-500/30 bg-green-500/5 text-green-500 text-xs font-bold uppercase tracking-widest">
                            Fase 1: Infraestructura Core
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800 border border-slate-800">
                        <DeliverableCard
                            title="Plataforma de Propiedad"
                            items={[
                                "Despliegue en dominio personalizado",
                                "Acceso multiplataforma (PC / Mobile)",
                                "Infraestructura Cloud de alto rendimiento",
                                "Panel de administración centralizado"
                            ]}
                        />
                        <DeliverableCard
                            title="Orquestador & APIs"
                            items={[
                                "API CVA (Consumo y Mapeo)",
                                "Arquitectura extensible para más proveedores",
                                "Conexión bidireccional Mercado Libre",
                                "Webhooks de actualización en tiempo real"
                            ]}
                        />
                        <DeliverableCard
                            title="Selector de Productos"
                            items={[
                                "Filtros técnicos por marca y categoría",
                                "Subida masiva selectiva (Pick & Sync)",
                                "Control manual de 'Muestra a gusto personal'",
                                "Gestor de publicaciones simplificado"
                            ]}
                        />
                        <DeliverableCard
                            title="Monitor Operativo"
                            items={[
                                "Dashboard de reportes básicos",
                                "Visualizador de pedidos centralizado",
                                "Historial de sincronizaciones",
                                "Métricas de ventas y rendimiento"
                            ]}
                        />
                        <DeliverableCard
                            title="Alertas & Notificaciones"
                            items={[
                                "Integración con Resend (Email API)",
                                "Notificaciones de cambios en precios",
                                "Alertas de quiebre de stock",
                                "Logs de errores y transacciones"
                            ]}
                        />
                        <DeliverableCard
                            title="Seguridad & Datos"
                            items={[
                                "Cifrado de credenciales de APIs",
                                "Backup de reglas de negocio",
                                "Propiedad total sobre tu base de datos",
                                "Acceso restringido por niveles"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Implementation Phases */}
            <section className="py-24">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">Estrategia por Fases</h2>
                        <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold font-mono">Modelo de crecimiento controlado</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <PhaseCard
                            number="01"
                            title="Módulo Core: CVA"
                            description="Integración de catálogo CVA y sincronización con Mercado Libre."
                            price="$40,000"
                            status="READY_TO_DEPLOY"
                            deliverables={[
                                "CVA API Connection",
                                "Catalog Mapping Store",
                                "Stock Auto-Sync Engine",
                                "Base Dashboard HUD"
                            ]}
                        />
                        <PhaseCard
                            number="02"
                            title="Llantas ERP"
                            description="Extensión de categorías desde tu ERP actual."
                            price="$10,000"
                            status="PENDING"
                            deliverables={[
                                "ERP Connector v1",
                                "Tire Specs Mapping",
                                "Logistics Flag Rules"
                            ]}
                        />
                        <PhaseCard
                            number="03"
                            title="Celulares ERP"
                            description="Nuevos flujos de sincronización para alta tecnología."
                            price="$10,000"
                            status="PENDING"
                            deliverables={[
                                "Tech Data Parser",
                                "Warranty Management",
                                "Meli Template Sync"
                            ]}
                        />
                        <PhaseCard
                            number="04"
                            title="Aura Gateway API"
                            description="Infraestructura propia para futuros canales de venta."
                            price="$15,000"
                            status="SYSTEM_LOCK"
                            deliverables={[
                                "Custom API Gateway",
                                "Unified Inventory Webhook",
                                "Admin Control Center"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <section className="py-32 border-t border-slate-900">
                <div className="container px-4 mx-auto max-w-4xl text-center">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1 border border-slate-800 bg-slate-900/50 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                            Aura Market v1.1 // System Ready
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
                            ¿Iniciamos la Fase 1?
                        </h2>
                        <p className="text-slate-400 text-lg">
                            El siguiente paso es la entrega y firma del <span className="text-white">Scope Charter</span> para formalizar el arranque técnico.
                        </p>
                        <div className="pt-8 flex flex-col items-center gap-6">
                            <a
                                href="https://wa.me/5215513180427"
                                className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-black bg-green-500 hover:bg-green-400 transition-all duration-200 rounded-sm w-full md:w-auto text-lg"
                            >
                                AUTORIZAR DESPLIEGUE
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <span className="text-[10px] text-slate-600 uppercase tracking-widest">Proposal valid until Feb 28, 2026</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function DeliverableCard({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="bg-[#0c0c0c] p-8 space-y-6 flex flex-col h-full">
            <h3 className="text-green-500 font-bold text-sm uppercase tracking-widest">{title}</h3>
            <ul className="space-y-3 flex-1">
                {items.map(item => (
                    <li key={item} className="flex gap-3 text-sm text-slate-400 font-mono">
                        <span className="text-green-500/50 font-bold">›</span>
                        <span className="leading-tight">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function PhaseCard({
    number,
    title,
    description,
    price,
    status,
    deliverables = []
}: {
    number: string,
    title: string,
    description: string,
    price: string,
    status: string,
    deliverables?: string[]
}) {
    const statusColors: any = {
        READY_TO_DEPLOY: "text-green-500 border-green-500/30 bg-green-500/5",
        PENDING: "text-slate-500 border-slate-800 bg-slate-900/20",
        SYSTEM_LOCK: "text-green-500/30 border-slate-800 bg-slate-900/10"
    }

    return (
        <div className="bg-[#0c0c0c] border border-slate-800 p-6 rounded-sm space-y-6 relative group overflow-hidden transition-all duration-300 hover:border-slate-700 h-full flex flex-col">
            <div className="flex justify-between items-start">
                <span className="text-4xl font-bold text-slate-800 group-hover:text-green-500/20 transition-colors uppercase">{number}</span>
                <div className={`text-[8px] font-bold px-1.5 py-0.5 border ${statusColors[status]} tracking-tighter`}>
                    {status}
                </div>
            </div>
            <div className="flex-1 space-y-4">
                <div>
                    <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-tighter">{title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-mono">{description}</p>
                </div>

                <ul className="space-y-1.5">
                    {deliverables.map(d => (
                        <li key={d} className="flex gap-2 items-center text-[10px] text-slate-500">
                            <div className="w-1 h-px bg-slate-800" /> {d}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-end">
                <div className="text-[10px] text-slate-600 uppercase font-bold">Inversión Fase</div>
                <div className="text-xl font-bold text-white uppercase">{price} <span className="text-[10px] text-slate-500 font-normal">MXN</span></div>
            </div>
        </div>
    )
}

function InteractiveWorkflowDemo() {
    const [activeStep, setActiveStep] = useState(0)
    const steps = [
        { label: "Supplier_Poll", icon: <Database size={16} />, log: "Checking CVA API for stock changes..." },
        { label: "Data_Filter", icon: <Settings size={16} />, log: "Filtering 15,000 SKUs. Optimization: Active." },
        { label: "Meli_Push", icon: <RefreshCw size={16} />, log: "Updating Mercado Libre prices/stock." },
        { label: "Operation_Safe", icon: <Shield size={16} />, log: "Broadcast Success. System Healthy." },
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length)
        }, 2500)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative p-6 bg-[#0c0c0c] border border-slate-800 rounded-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Integration Monitor</span>
            </div>

            <div className="space-y-4">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-4 p-3 border transition-all duration-500 ${activeStep === i ? "bg-slate-900 border-green-500/30" : "bg-transparent border-slate-900 opacity-40 scale-[0.98]"
                            }`}
                    >
                        <div className={`${activeStep === i ? "text-green-500" : "text-slate-600"}`}>
                            {step.icon}
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-tight mb-0.5">{step.label}</div>
                            <div className="text-[11px] text-slate-400 truncate">{step.log}</div>
                        </div>
                        {activeStep === i && (
                            <div className="text-[9px] font-bold text-green-500 px-1 border border-green-500/20">EXECUTING</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 p-3 bg-black rounded-sm border border-slate-800">
                <div className="text-[10px] font-mono text-green-500/60">
                    [{new Date().toLocaleTimeString()}] INF: Sychronizing channel: ML_MX... OK
                </div>
            </div>
        </div>
    )
}
