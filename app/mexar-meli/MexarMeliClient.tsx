"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
    ArrowRight,
    CheckCircle2,
    Target,
    Shield,
    Eye,
    Users,
    BarChart3,
    AlertTriangle,
    Lock,
    Unlock,
    Package,
    Store,
    TrendingUp,
    FileText,
    Zap,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"
import Image from "next/image"

export default function MexarMeliClient() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <main className="min-h-screen bg-[#0c0c0c]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-10 pb-32 md:pt-16 overflow-hidden">
                <div className="container px-4 mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
                            <div className="font-mono space-y-8">
                                <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                                    <span className="text-green-500 font-bold">netlab@mexar:~$</span>
                                    <span className="text-slate-100">iniciar-propuesta</span>
                                    <span className="text-purple-400">--concesion-digital</span>
                                    <span className="text-purple-400">--gobierno-marca</span>
                                    <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                                </div>

                                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Image src="/logo-netlab.png" alt="Netlab Logo" width={120} height={40} className="h-10 w-auto" />
                                        <span className="text-2xl text-slate-500">×</span>
                                        <div className="text-2xl font-bold text-purple-400 tracking-wider">MEXAR PHARMA</div>
                                    </div>

                                    <motion.h1
                                        className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        Modelo de <span className="text-purple-400">Concesión Digital Exclusiva</span> con{" "}
                                        <span className="text-green-400">Gobierno de Marca</span>
                                    </motion.h1>

                                    <motion.p
                                        className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                    >
                                        Una propuesta estratégica para Made4You: separar correctamente quién decide y quién ejecuta,
                                        permitiendo escalar sin perder el control del negocio.
                                    </motion.p>

                                    <motion.div
                                        className="pt-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.2 }}
                                    >
                                        <a
                                            href="#contexto"
                                            className="group relative inline-flex items-center justify-center px-8 py-3 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm"
                                        >
                                            <span className="mr-2">Ver propuesta completa</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </motion.div>

                                    <motion.div
                                        className="mt-12 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.8 }}
                                    >
                                        <p>{">"} Analizando modelo de negocio actual... [OK]</p>
                                        <p>{">"} Identificando oportunidades en retail digital... [OK]</p>
                                        <p>{">"} Diseñando estructura de control estratégico... [READY]</p>
                                    </motion.div>
                                </div>
                            </div>
                        </TerminalFrame>
                    </motion.div>
                </div>

                <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
            </section>

            {/* Contexto del Problema */}
            <section id="contexto" className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat contexto-real.txt</span>
                            </div>

                            <div className="space-y-6 text-slate-300 leading-relaxed">
                                <h2 className="text-3xl font-bold text-white">El contexto real del problema</h2>

                                <p className="text-lg">
                                    Mexar nace sólida desde dos pilares claros:{" "}
                                    <span className="text-green-400 font-semibold">la capacidad comercial</span> y{" "}
                                    <span className="text-purple-400 font-semibold">el conocimiento profundo del producto farmacéutico</span>.
                                </p>

                                <p className="text-slate-400">
                                    Ese modelo funcionó durante años en licitaciones públicas y privadas, donde el éxito depende de
                                    anticipación, cumplimiento, calidad y relaciones comerciales.
                                </p>

                                <div className="p-6 bg-purple-500/5 border-l-4 border-purple-500 rounded mt-8">
                                    <p className="text-lg text-white font-semibold mb-3">
                                        El paso al retail digital representa un negocio distinto, no una extensión natural del anterior.
                                    </p>
                                    <p className="text-slate-400">
                                        Aquí no gana quien tiene mejor producto, sino quien:
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-5 gap-4 mt-6">
                                    {[
                                        { icon: Zap, text: "Opera mejor" },
                                        { icon: TrendingUp, text: "Itera más rápido" },
                                        { icon: Package, text: "Menos errores logísticos" },
                                        { icon: BarChart3, text: "Controla costos reales" },
                                        { icon: Store, text: "Entiende cada canal" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded text-center">
                                            <item.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-300">{item.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-red-500/5 border-l-4 border-red-500 rounded">
                                    <p className="text-slate-300">
                                        <span className="text-red-400 font-semibold">El problema actual:</span> No es que Mexar quiera crecer
                                        en retail. El problema es intentar hacerlo desde una lógica de{" "}
                                        <span className="text-white font-semibold">control operativo</span>, cuando el retail digital se
                                        gobierna mejor desde <span className="text-green-400 font-semibold">control estratégico y contractual</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Idea Central */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat idea-central.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">La idea central de la propuesta</h2>

                                <p className="text-lg text-slate-300 leading-relaxed">
                                    La propuesta consiste en que Mexar otorgue a un operador especializado la{" "}
                                    <span className="text-purple-400 font-semibold">concesión exclusiva</span> para administrar:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div className="p-6 bg-purple-500/10 border-2 border-purple-500/30 rounded">
                                        <Store className="w-10 h-10 text-purple-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Ecommerce Oficial</h3>
                                        <p className="text-sm text-slate-400">Tienda online propia con control total de experiencia</p>
                                    </div>

                                    <div className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded">
                                        <Package className="w-10 h-10 text-green-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Marketplaces</h3>
                                        <p className="text-sm text-slate-400">Mercado Libre, Amazon, y otros canales digitales</p>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-green-500/5 border border-green-500/30 rounded">
                                    <p className="text-lg text-slate-300">
                                        Mientras Mexar conserva el <span className="text-green-400 font-semibold">control total</span> del
                                        producto, la marca, el mensaje, el pricing estratégico y las decisiones de negocio.
                                    </p>
                                </div>

                                <div className="mt-6 p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                                    <p className="text-2xl font-bold text-white mb-2">Esto no es "soltar el negocio".</p>
                                    <p className="text-slate-400">
                                        Es separar claramente <span className="text-purple-400 font-semibold">quién decide</span> y{" "}
                                        <span className="text-green-400 font-semibold">quién ejecuta</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Error Conceptual */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat error-conceptual.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">El error conceptual que genera el miedo al "no control"</h2>

                                <p className="text-lg text-slate-300">
                                    El miedo de los dueños no nace de una falla lógica, sino de una confusión común:
                                </p>

                                <div className="text-center py-8">
                                    <p className="text-3xl font-bold text-red-400">Confundir control con ejecución.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-red-500/5 border border-red-500/30 rounded">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Unlock className="w-8 h-8 text-red-400" />
                                            <h3 className="text-xl font-bold text-red-400">Ejecución es:</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Subir productos
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Gestionar pedidos
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Contestar clientes
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Mover inventario
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Optimizar campañas
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Resolver devoluciones
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-green-500/5 border border-green-500/30 rounded">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Lock className="w-8 h-8 text-green-400" />
                                            <h3 className="text-xl font-bold text-green-400">Control es:</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Decidir el precio mínimo
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Definir qué se puede prometer
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Aprobar mensajes y claims
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Decidir qué producto se lanza
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Fijar objetivos y medir resultados
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Corregir o terminar una relación
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-purple-500/5 border-l-4 border-purple-500 rounded">
                                    <p className="text-slate-300">
                                        Hoy los dueños sienten que <span className="text-red-400">"si no lo hacen ellos, pierden control"</span>,
                                        cuando en realidad lo único que perderían es{" "}
                                        <span className="text-green-400 font-semibold">carga operativa</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Dónde vive el control */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-green-500/30">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat donde-vive-control.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Dónde vive realmente el control en este modelo</h2>

                                <p className="text-lg text-slate-300">
                                    El control no vive en estar encima de la operación. El control vive en:
                                </p>

                                <div className="grid md:grid-cols-3 gap-4 mt-8">
                                    {[
                                        { icon: FileText, title: "Acuerdos iniciales", desc: "Reglas claras desde el día uno" },
                                        { icon: Lock, title: "El contrato", desc: "Marco legal que protege" },
                                        { icon: Target, title: "Los KPIs", desc: "Métricas objetivas de éxito" },
                                        { icon: BarChart3, title: "Las métricas", desc: "Datos para tomar decisiones" },
                                        { icon: AlertTriangle, title: "Las consecuencias", desc: "Incentivos y penalizaciones" },
                                        { icon: Shield, title: "Cláusulas de salida", desc: "Libertad para terminar" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-green-500/5 border border-green-500/20 rounded">
                                            <item.icon className="w-6 h-6 text-green-400 mb-3" />
                                            <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-400">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-green-500 rounded">
                                    <p className="text-lg text-slate-300">
                                        Si el control depende de estar vigilando todos los días, entonces{" "}
                                        <span className="text-red-400 font-semibold">no hay control</span>: hay{" "}
                                        <span className="text-red-400">dependencia y desgaste</span>.
                                    </p>
                                    <p className="text-lg text-white font-semibold mt-4">
                                        En este modelo, Mexar controla sin ejecutar, y eso es exactamente lo que permite escalar sin perder
                                        rumbo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Por qué incluir ecommerce */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat ecommerce-concesion.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Por qué incluir también el ecommerce en la concesión</h2>

                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div className="p-6 bg-red-500/5 border border-red-500/30 rounded">
                                        <h3 className="text-xl font-bold text-red-400 mb-4">❌ Separar ecommerce y marketplaces:</h3>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li>• Fragmenta inventarios</li>
                                            <li>• Genera conflictos de precio</li>
                                            <li>• Duplica costos logísticos</li>
                                            <li>• Rompe la experiencia del cliente</li>
                                            <li>• Dificulta la lectura real de datos</li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-green-500/5 border border-green-500/30 rounded">
                                        <h3 className="text-xl font-bold text-green-400 mb-4">✓ Un solo operador:</h3>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Reduce fricción
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Opera con coherencia
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Optimiza costos
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Aprende más rápido
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded mt-6">
                                    <p className="text-slate-300 text-center text-lg">
                                        <span className="text-purple-400 font-semibold">El dominio, la marca y los datos</span> siguen siendo
                                        de Mexar.
                                        <br />
                                        <span className="text-green-400 font-semibold">La operación diaria</span> la ejecuta quien sabe
                                        hacerlo mejor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Rol de Mexar */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat rol-mexar.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">El rol correcto de Mexar en este modelo</h2>

                                <p className="text-lg text-slate-400">
                                    Mexar no se retira del retail digital. Mexar asume el{" "}
                                    <span className="text-green-400 font-semibold">rol estratégico correcto</span>.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-purple-400">Mexar es responsable de:</h3>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            {[
                                                "Desarrollo y calidad del producto",
                                                "Cumplimiento regulatorio",
                                                "Narrativa de marca",
                                                "Lineamientos visuales",
                                                "Claims permitidos",
                                                "Precio mínimo y precio sugerido",
                                                "Arquitectura del catálogo",
                                                "Inversión inicial para activación y rotación",
                                                "Evaluación del desempeño del operador",
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-purple-500/5 border border-purple-500/30 rounded flex flex-col justify-center">
                                        <p className="text-2xl font-bold text-white text-center mb-4">
                                            Mexar <span className="text-purple-400">dirige</span> la marca y el negocio.
                                        </p>
                                        <p className="text-xl text-slate-400 text-center">
                                            El operador <span className="text-green-400">ejecuta</span> la venta y la operación.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Exclusividad */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat exclusividad.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Sobre la exclusividad (por qué es necesaria)</h2>

                                <p className="text-lg text-slate-300 font-semibold">
                                    La exclusividad no es un favor al distribuidor. Es un{" "}
                                    <span className="text-green-400">mecanismo de alineación</span>.
                                </p>

                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div className="p-6 bg-red-500/5 border border-red-500/30 rounded">
                                        <h3 className="text-lg font-bold text-red-400 mb-4">Sin exclusividad:</h3>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li>• El operador prioriza otras marcas</li>
                                            <li>• No invierte realmente</li>
                                            <li>• Dispersa esfuerzos</li>
                                            <li>• Made4You es "una más"</li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-green-500/5 border border-green-500/30 rounded">
                                        <h3 className="text-lg font-bold text-green-400 mb-4">Con exclusividad:</h3>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                El operador tiene incentivos reales
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Invierte tiempo, dinero y foco
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Construye marca a largo plazo
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded mt-6">
                                    <p className="text-slate-300">
                                        <span className="text-purple-400 font-semibold">Eso sí:</span> la exclusividad debe estar{" "}
                                        <span className="text-white font-semibold">condicionada, no regalada</span>.
                                    </p>
                                    <ul className="mt-4 space-y-1 text-sm text-slate-400">
                                        <li>• Duración limitada</li>
                                        <li>• KPIs claros</li>
                                        <li>• Revisiones periódicas</li>
                                        <li>• Cláusulas de salida</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Qué asume cada parte */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Inversión Mexar */}
                        <TerminalFrame>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-purple-400 font-mono mb-4">
                                    <Target className="w-6 h-6" />
                                    <span className="text-xl font-bold">Inversión de Mexar</span>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-green-400 font-semibold">✓ La inversión correcta es:</h4>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li>• Asegurar inventario suficiente</li>
                                        <li>• Permitir rotación sana</li>
                                        <li>• Apoyar lanzamientos</li>
                                        <li>• Fortalecer la marca</li>
                                    </ul>
                                </div>

                                <div className="space-y-4 mt-6">
                                    <h4 className="text-red-400 font-semibold">✕ No es:</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li>• Pagar ads sin control</li>
                                        <li>• Absorber devoluciones mal gestionadas</li>
                                        <li>• Cubrir ineficiencias operativas</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded mt-4">
                                    <p className="text-sm text-slate-300">
                                        <span className="text-green-400 font-semibold">Invertir con reglas</span> no debilita el control, lo
                                        fortalece.
                                    </p>
                                </div>
                            </div>
                        </TerminalFrame>

                        {/* Qué asume operador */}
                        <TerminalFrame>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-green-400 font-mono mb-4">
                                    <Users className="w-6 h-6" />
                                    <span className="text-xl font-bold">Qué asume el operador</span>
                                </div>

                                <ul className="space-y-2 text-sm text-slate-300">
                                    {[
                                        "Logística",
                                        "Fulfillment",
                                        "Atención al cliente",
                                        "Marketplaces",
                                        "Ecommerce",
                                        "Publicidad performance",
                                        "Ejecución diaria",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded mt-6">
                                    <p className="text-sm text-slate-300 font-semibold mb-2">Su incentivo es claro:</p>
                                    <ul className="space-y-1 text-xs text-slate-400">
                                        <li>• Vende más → gana más</li>
                                        <li>• Cuida la marca → conserva la concesión</li>
                                        <li>• Falla → pierde el acuerdo</li>
                                    </ul>
                                </div>
                            </div>
                        </TerminalFrame>
                    </div>
                </div>
            </section>

            {/* Datos y Transparencia */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat transparencia.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Datos, métricas y transparencia</h2>

                                <p className="text-lg text-slate-400">Mexar tiene acceso a:</p>

                                <div className="grid md:grid-cols-3 gap-4 mt-6">
                                    {[
                                        { icon: BarChart3, text: "Ventas por canal" },
                                        { icon: TrendingUp, text: "Margen real" },
                                        { icon: Target, text: "Gasto publicitario" },
                                        { icon: Package, text: "Rotación de inventario" },
                                        { icon: AlertTriangle, text: "Devoluciones" },
                                        { icon: Shield, text: "Nivel de servicio" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded flex items-center gap-3">
                                            <item.icon className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            <span className="text-sm text-slate-300">{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-green-500/5 border-l-4 border-green-500 rounded mt-8">
                                    <p className="text-xl font-bold text-white mb-2">No se delega la información.</p>
                                    <p className="text-lg text-slate-400">Se delega la ejecución.</p>
                                    <p className="text-sm text-slate-500 mt-4">
                                        Esto permite: tomar decisiones informadas, corregir a tiempo, evitar dependencia ciega.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Riesgos Mitigados */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat riesgos-mitigados.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Los riesgos que preocupan a los dueños</h2>
                                <p className="text-slate-400">Y cómo están mitigados:</p>

                                <div className="space-y-4 mt-8">
                                    {[
                                        {
                                            q: "¿Y si perdemos el control?",
                                            a: "El control está en el contrato, no en la operación.",
                                        },
                                        {
                                            q: "¿Y si no lo hacen como queremos?",
                                            a: "No importa: las reglas no dependen de confianza, dependen de métricas.",
                                        },
                                        {
                                            q: "¿Y si dependemos demasiado del distribuidor?",
                                            a: "KPIs, cláusula de salida, transición ordenada.",
                                        },
                                        {
                                            q: "¿Y si dañan la marca?",
                                            a: "Gobierno de marca, aprobación de contenido, sanciones claras.",
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                                            <p className="text-red-400 font-semibold mb-2">"{item.q}"</p>
                                            <p className="text-green-400">→ {item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Idea Clave */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-purple-500/30">
                        <div className="text-center space-y-6 py-8">
                            <div className="inline-block">
                                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                    <span className="text-lg">$</span>
                                    <span className="text-lg">echo $IDEA_CLAVE</span>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                El control real no está en <span className="text-red-400">hacer</span>.
                            </h2>
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                Está en poder <span className="text-green-400">decidir</span>,{" "}
                                <span className="text-purple-400">medir</span>, <span className="text-blue-400">corregir</span> y{" "}
                                <span className="text-green-400">terminar</span>.
                            </h2>

                            <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded max-w-3xl mx-auto">
                                <p className="text-lg text-slate-400">
                                    Un negocio donde "todo pasa por los dueños" no es un negocio controlado.
                                    <br />
                                    <span className="text-red-400 font-semibold">Es un negocio frágil.</span>
                                </p>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Conclusión */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-green-500/30">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat conclusion.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Conclusión final</h2>

                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-red-400 mb-4">Esta propuesta NO:</h3>
                                        <ul className="space-y-2 text-slate-400">
                                            <li>• Reduce control</li>
                                            <li>• Aumenta riesgo</li>
                                            <li>• Debilita a Mexar</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-green-400 mb-4">Esta propuesta SÍ:</h3>
                                        <ul className="space-y-2 text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Protege la marca
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Reduce desgaste
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Acelera aprendizaje
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Permite escalar
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Mantiene foco en lo que Mexar hace mejor
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-6 bg-green-500/5 border-l-4 border-green-500 rounded mt-8">
                                    <p className="text-lg text-white">
                                        El control que hoy sienten que necesitan no se pierde.
                                        <br />
                                        <span className="text-green-400 font-semibold">
                                            Se rediseña correctamente desde el inicio, a través de acuerdos, métricas y gobierno.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-green-500/30">
                        <div className="text-center space-y-8 py-8">
                            <div className="flex items-center justify-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">root@netlab:~/mexar#</span>
                                <span className="text-lg">siguiente-paso</span>
                                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white">¿Listos para el siguiente paso?</h2>

                            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                                El siguiente paso es revisar este modelo juntos, resolver dudas y definir el marco de colaboración.
                            </p>

                            <div className="pt-6">
                                <a
                                    href="https://wa.me/5215513180427?text=Hola%2C%20quiero%20más%20información%20sobre%20el%20modelo%20de%20concesión%20digital%20para%20Mexar"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm text-lg"
                                >
                                    <span className="mr-2">Agendar reunión</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>

                            <p className="text-sm text-slate-500 font-mono">O escríbenos directamente: contacto@netlab.mx</p>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            <Footer />
        </main>
    )
}
