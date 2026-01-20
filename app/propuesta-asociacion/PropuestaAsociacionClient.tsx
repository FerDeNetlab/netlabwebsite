"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Target,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Users,
  DollarSign,
  Eye,
  Rocket,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"
import Image from "next/image"

export default function PropuestaAsociacionClient() {
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
                  <span className="text-green-500 font-bold">netlab@propuesta:~$</span>
                  <span className="text-slate-100">nueva-etapa-2026</span>
                  <span className="text-purple-400">--confidencial</span>
                  <span className="text-purple-400">--edgar-cervantes</span>
                  <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Image src="/logo-netlab.png" alt="Netlab Logo" width={140} height={46} className="h-12 w-auto" />
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Propuesta de Asociación Estratégica
                    <br />
                    <span className="text-purple-400">Nueva Etapa 2026</span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Una propuesta de entrada como socio activo de NetLab: desarrollo de software con Odoo, inteligencia
                    artificial y un modelo operativo claro, transparente y escalable.
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
                    <p>{">"} Documento confidencial</p>
                    <p>{">"} Destinatario: Edgar Cervantes Araujo</p>
                    <p>{">"} Fecha: Enero 2026</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      {/* Contexto y Evolución */}
      <section id="contexto" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 01_contexto_evolucion.txt</span>
              </div>

              <div className="space-y-6 text-slate-300 leading-relaxed">
                <h2 className="text-3xl font-bold text-white">Contexto y Evolución de NetLab</h2>

                <p className="text-lg">
                  NetLab es un proyecto que lleva más de{" "}
                  <span className="text-green-400 font-semibold">cuatro años</span> de trabajo continuo, aprendizaje y
                  evolución.
                </p>

                <div className="p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                  <p className="text-slate-300">
                    Durante 2025 se realizó un experimento enfocado en la comercialización de hardware, el cual, aunque
                    no fue exitoso financieramente, permitió adquirir un{" "}
                    <span className="text-purple-400 font-semibold">know-how clave</span>: entendimiento del mercado,
                    contacto con clientes reales, validación de procesos comerciales y, sobre todo, claridad absoluta
                    sobre hacia dónde debe ir NetLab.
                  </p>
                </div>

                <p className="text-xl font-semibold text-white mt-8">
                  Hoy, NetLab entra en una nueva etapa, mucho más definida y enfocada.
                </p>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Visión 2026 */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 02_vision_2026.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Visión Actual de NetLab (2026)</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  A partir de 2026, NetLab se posiciona como una empresa{" "}
                  <span className="text-green-400 font-semibold">100% enfocada en desarrollo de software</span>, con una
                  estrategia clara:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <Rocket className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Oferta Principal</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        Venta e implementación de <span className="text-green-400">Odoo</span> como ERP base
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        Desarrollo de software a la medida a partir de Odoo
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        Operación completamente remota
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <Zap className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Ventaja Competitiva</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Uso intensivo de inteligencia artificial para desarrollo rápido y eficiente:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        ChatGPT / OpenAI
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        GitHub Copilot & Codex
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Automatización de flujos
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded">
                  <h4 className="text-green-400 font-semibold mb-3">Este modelo permite:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        Reducir drásticamente costos operativos
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        No depender de equipos grandes de desarrollo
                      </li>
                    </ul>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        Entregar software más rápido
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-green-400 rounded-full flex-shrink-0" />
                        Escalar sin crecer estructura fija
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Situación Socios Fundadores */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 03_situacion_actual.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Situación Actual de los Socios Fundadores</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Los socios actuales (<span className="text-green-400 font-semibold">Luis Fernando Limón</span> y{" "}
                  <span className="text-green-400 font-semibold">Juan Carlos Castrejón</span>) han invertido, de forma
                  directa e indirecta, aproximadamente{" "}
                  <span className="text-purple-400 font-bold">$1,000,000 – $1,200,000 MXN</span> a lo largo de estos
                  cuatro años, además de tiempo completo de trabajo sin sueldos formales.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                    <h3 className="text-purple-400 font-semibold mb-3">Lo que tenemos hoy:</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Know-how técnico sólido
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Metodología clara
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Oferta comercial definida
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Capacidad real de entrega
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-slate-900/50 border-l-4 border-green-500 rounded">
                    <h3 className="text-green-400 font-semibold mb-3">Lo que necesitamos:</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Capital para cubrir gastos operativos iniciales
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Dar estabilidad a la operación
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Invertir en campañas comerciales
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Acelerar el crecimiento
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Rol de Edgar */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 04_rol_edgar.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Rol Estratégico de Edgar Cervantes Araujo</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Edgar entra a NetLab por una razón muy{" "}
                  <span className="text-green-400 font-semibold">específica y estratégica</span>.
                </p>

                <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded">
                  <Users className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Perfil 100% Comercial</h3>
                  <p className="text-slate-300 mb-4">Con experiencia probada en:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        Generación de leads
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        Creación y optimización de campañas
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        Diseño de procesos comerciales
                      </li>
                    </ul>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        Cierre de ventas
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        Escalamiento de equipos comerciales
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                        Multiplicación exponencial de ventas
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded">
                  <h3 className="text-purple-400 font-semibold text-lg mb-4">Responsabilidades Comerciales</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm">Alcance del Rol:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Diseño y ejecución de estrategia comercial
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Construcción y seguimiento de pipeline
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Apoyo en cierres estratégicos
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm">Métricas de Referencia:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Leads generados mensualmente
                        </li>
                        <li className="flex items-start gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Pipeline activo y conversión
                        </li>
                        <li className="flex items-start gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          MRR (Monthly Recurring Revenue)
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-700">
                    Las métricas específicas serán definidas de manera conjunta, revisadas trimestralmente y ajustadas
                    según la etapa del negocio. Se entienden como referencias de alineación y seguimiento, no como
                    garantías de resultados.
                  </p>
                </div>

                <div className="mt-8 p-6 bg-green-500/5 border-l-4 border-green-500 rounded">
                  <h3 className="text-green-400 font-semibold text-xl mb-3">La visión es clara:</h3>
                  <div className="space-y-4 text-slate-300">
                    <p className="flex items-center gap-3">
                      <span className="text-2xl">→</span>
                      <span>
                        <span className="text-green-400 font-semibold">Edgar</span> genera leads y oportunidades
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-2xl">→</span>
                      <span>
                        <span className="text-purple-400 font-semibold">NetLab</span> convierte, ejecuta y retiene
                      </span>
                    </p>
                    <p className="text-sm text-slate-400 mt-4 pt-4 border-t border-slate-700">
                      Es una combinación natural entre <span className="text-green-400">fuerza comercial</span> y{" "}
                      <span className="text-purple-400">capacidad técnica</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Propuesta de Entrada */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 05_propuesta_entrada.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Propuesta de Entrada como Socio</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Se propone que Edgar entre como <span className="text-green-400 font-semibold">socio activo</span>,
                  aportando:
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <h3 className="text-green-400 font-semibold text-lg mb-4">a) Capital Intelectual</h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Diseño y ejecución de la estrategia comercial
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Generación constante de leads
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Optimización del proceso de ventas
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Participación activa en decisiones comerciales
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-purple-500/10 border-2 border-purple-500/30 rounded">
                    <DollarSign className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-purple-400 font-semibold text-lg mb-4">b) Aportación Económica</h3>
                    <div className="text-center mb-4">
                      <p className="text-4xl font-bold text-white">$400,000</p>
                      <p className="text-sm text-slate-400 mt-1">MXN</p>
                    </div>
                    <p className="text-xs text-slate-400 pt-4 border-t border-slate-700">
                      Esta cifra responde a: el valor del know-how construido, la inversión histórica realizada, el
                      porcentaje accionario ofrecido y la necesidad real de capital
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded">
                  <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Uso del Capital Aportado
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    El capital se destinará exclusivamente a fines relacionados con la operación y crecimiento de
                    NetLab:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-semibold mb-3 text-sm">Usos Permitidos:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Campañas comerciales y marketing
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Herramientas de software y licencias
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Infraestructura tecnológica
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Gastos operativos de la empresa
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-red-400 font-semibold mb-3 text-sm">No Permitido:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-red-400 rounded mt-0.5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-red-400" />
                          </div>
                          Gastos personales
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-red-400 rounded mt-0.5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-red-400" />
                          </div>
                          Compensaciones no acordadas
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-4 h-4 border-2 border-red-400 rounded mt-0.5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-red-400" />
                          </div>
                          Inversiones ajenas al objeto social
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                  <p className="text-sm text-slate-300">
                    <span className="text-blue-400 font-semibold">Transparencia Financiera:</span> Se presentará un
                    reporte financiero básico mensual que incluirá ingresos, gastos, burn rate y runway estimado.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Estructura Operativa */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 06_estructura_operativa.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Estructura Operativa, Gastos y Sueldos</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Para garantizar la correcta operación y sostenibilidad de NetLab en esta etapa, se establece una{" "}
                  <span className="text-green-400 font-semibold">prioridad clara</span> en el uso de los recursos:
                </p>

                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4 p-4 bg-slate-900/50 border-l-4 border-green-500 rounded">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-500 font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Gastos Operativos Fijos</h3>
                      <p className="text-sm text-slate-400">
                        Infraestructura tecnológica, líneas telefónicas, herramientas, servicios y plataformas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center text-purple-500 font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Pago de Nómina</h3>
                      <p className="text-sm text-slate-400">
                        Del equipo operativo clave para la ejecución de proyectos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-900/50 border-l-4 border-blue-500 rounded">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Sueldos Operativos de Socios</h3>
                      <p className="text-sm text-slate-400">
                        Para socios fundadores que participan activamente en la ejecución diaria
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded">
                  <h3 className="text-green-400 font-semibold mb-4">En esta etapa se contempla:</h3>
                  <div className="space-y-4 text-slate-300">
                    <p className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Gastos operativos mensuales asociados a la operación tecnológica y comercial</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Nómina del equipo clave para la ejecución de proyectos</span>
                    </p>
                    <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded mt-4">
                      <DollarSign className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="mb-2">
                          Un{" "}
                          <span className="text-green-400 font-semibold">
                            sueldo operativo para el socio fundador responsable de la operación general
                          </span>
                          , por un monto aproximado de:
                        </p>
                        <p className="text-2xl font-bold text-white">$15,000 MXN mensuales</p>
                        <p className="text-xs text-slate-400 mt-2">
                          Sujeto a la disponibilidad de flujo y revisable conforme la empresa crezca
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <p className="text-sm text-slate-300">
                    <span className="text-yellow-400 font-semibold">Importante:</span> Este sueldo{" "}
                    <span className="underline">no representa distribución de utilidades</span>, sino un gasto operativo
                    necesario para asegurar la continuidad, estabilidad y correcta ejecución del negocio.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Retorno de Inversión */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 07_retorno_inversion.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Retorno de Inversión y Expectativas Financieras</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  La aportación de capital realizada por Edgar tiene como objetivo participar en el crecimiento de
                  NetLab a <span className="text-green-400 font-semibold">mediano y largo plazo</span>.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Participación en Utilidades</h3>
                    <p className="text-sm text-slate-400">
                      Una vez que la empresa sea rentable y financieramente estable
                    </p>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <BarChart3 className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Valorización Accionaria</h3>
                    <p className="text-sm text-slate-400">
                      Conforme NetLab incremente su facturación, cartera y posicionamiento
                    </p>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <DollarSign className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Escenarios de Salida</h3>
                    <p className="text-sm text-slate-400">
                      Posibles liquidez futura, definidos en el Anexo de Términos
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-purple-500/10 border-l-4 border-purple-500 rounded">
                  <h3 className="text-purple-400 font-semibold mb-3">Durante la etapa inicial:</h3>
                  <p className="text-slate-300 mb-4">
                    Se priorizará la <span className="text-purple-400 font-semibold">reinversión de utilidades</span>{" "}
                    para consolidar la operación, acelerar el crecimiento y construir valor.
                  </p>
                  <p className="text-sm text-slate-400">
                    No se contemplan retornos garantizados ni plazos forzosos de recuperación de capital, en línea con
                    las mejores prácticas de inversión en startups.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Transparencia */}
      {/* Renamed to Transparencia y Gobierno Societario */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              {/* Updated file name */}
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 08_transparencia_gobierno.txt</span>
              </div>

              <div className="space-y-6">
                {/* Updated heading */}
                <h2 className="text-3xl font-bold text-white">Transparencia y Gobierno Societario</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  NetLab operará bajo un esquema de{" "}
                  <span className="text-green-400 font-semibold">corresponsabilidad</span>, con roles claros y procesos
                  de decisión eficientes.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <h3 className="text-green-400 font-semibold mb-4">Decisiones Operativas</h3>
                    <p className="text-sm text-slate-300 mb-3">
                      Las decisiones del día a día podrán ser tomadas por el socio responsable de cada área:
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="text-green-400">Estrategia comercial</span> → socio comercial
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="text-purple-400">Operación técnica</span> → socios técnicos
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded">
                    <h3 className="text-purple-400 font-semibold mb-4">Decisiones Estratégicas</h3>
                    <p className="text-sm text-slate-300 mb-3">Requerirán acuerdo entre los socios:</p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Cambios relevantes de modelo de negocio
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Inversiones significativas
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Endeudamiento relevante
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Modificación de estructura accionaria
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-green-500 rounded">
                  <h3 className="text-green-400 font-semibold mb-3">Principios de Transparencia:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Total transparencia financiera
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Definición clara de gastos operativos
                      </li>
                    </ul>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Sueldos razonables y alineados
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Capital enfocado al crecimiento
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-white">
                      Todos los socios alineados, protegidos y con reglas claras desde el día uno
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Estructura Accionaria */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 09_estructura_accionaria.txt</span>
              </div>

              <div className="space-y-6">
                {/* Updated heading */}
                <h2 className="text-3xl font-bold text-white">Estructura Accionaria y Modelo de Vesting</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Tras la entrada de Edgar, la estructura accionaria quedaría de la siguiente forma:
                </p>

                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-900/50 border-2 border-green-500 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">Luis Fernando Limón</h3>
                          <p className="text-sm text-slate-400">Socio Fundador</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-green-400">34%</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 border-2 border-purple-400 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">Juan Carlos Castrejón</h3>
                          <p className="text-sm text-slate-400">Socio Fundador</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-purple-400">33%</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 border-2 border-blue-400 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">Edgar Cervantes Araujo</h3>
                          <p className="text-sm text-slate-400">Socio Comercial</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-blue-400">33%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-slate-900/50 border border-slate-700 rounded text-center">
                    <p className="text-slate-300">
                      Una estructura <span className="text-green-400 font-semibold">equilibrada</span>, con pesos
                      similares y representación clara de cada rol
                    </p>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded">
                  <h3 className="text-blue-400 font-semibold text-xl mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Mecanismo de Vesting
                  </h3>
                  <p className="text-slate-300 mb-6">
                    La participación accionaria de Edgar se consolidará progresivamente en función de su permanencia,
                    contribución activa y alineación con la visión del proyecto.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-slate-900/50 border border-slate-700 rounded">
                      <p className="text-sm text-slate-400 mb-1">Participación Total</p>
                      <p className="text-2xl font-bold text-white">33%</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 border border-slate-700 rounded">
                      <p className="text-sm text-slate-400 mb-1">Periodo de Vesting</p>
                      <p className="text-2xl font-bold text-white">36 meses</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 border border-slate-700 rounded">
                      <p className="text-sm text-slate-400 mb-1">Consolidación</p>
                      <p className="text-2xl font-bold text-white">Progresiva</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-slate-300 mb-2">
                      <span className="text-blue-400 font-semibold">En caso de salida anticipada:</span>
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        El porcentaje no consolidado podrá ser recomprado por la sociedad o socios restantes
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        La valuación se definirá mediante fórmula preacordada o avalúo externo
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        En salidas justificadas (salud, fuerza mayor) se evaluarán esquemas especiales
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded">
                  <h3 className="text-white font-semibold text-lg mb-4">Estructura Legal del Capital</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-green-400 font-semibold mb-3 text-sm">Capital Social Fijo:</h4>
                      <div className="p-4 bg-slate-800/50 rounded">
                        <p className="text-2xl font-bold text-white mb-1">$75,000 MXN</p>
                        <p className="text-xs text-slate-400">Distribuido proporcionalmente según porcentajes</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-purple-400 font-semibold mb-3 text-sm">Capital Variable:</h4>
                      <div className="p-4 bg-slate-800/50 rounded">
                        <p className="text-2xl font-bold text-white mb-1">$375,000 MXN</p>
                        <p className="text-xs text-slate-400">De la aportación económica de Edgar</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <p className="text-xs text-slate-300">
                      <span className="text-yellow-400 font-semibold">Nota:</span> El capital variable otorga derechos
                      económicos conforme a la participación, no es reembolsable salvo acuerdo expreso, y permite
                      flexibilidad financiera y claridad contable.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded">
                  <h3 className="text-purple-400 font-semibold text-lg mb-4">Escenarios de Salida</h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    Los socios acuerdan que una salida ordenada es preferible a un conflicto prolongado.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-sm">Escenarios contemplados:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Salida voluntaria
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Falta de tracción prolongada
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Cambio de prioridades personales
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Venta total o parcial
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-sm">Mecanismo de valuación:</h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Fórmula preacordada
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Avalúo externo independiente
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          Última valuación de referencia
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat 10_cierre.txt</span>
              </div>

              <div className="space-y-6 text-center">
                <h2 className="text-4xl font-bold text-white">Cierre</h2>

                <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed">
                  <p>
                    NetLab entra en una etapa con <span className="text-green-400 font-semibold">enorme potencial</span>
                    : un modelo probado, costos bajos, alta velocidad de ejecución y un mercado en crecimiento.
                  </p>

                  <p>
                    La entrada de Edgar no es solo una inversión económica, sino la incorporación de un{" "}
                    <span className="text-purple-400 font-semibold">socio clave</span> para escalar el proyecto.
                  </p>

                  <p className="text-xl font-semibold text-white pt-6">
                    El objetivo es construir una empresa <span className="text-green-400">sólida</span>,{" "}
                    <span className="text-purple-400">transparente</span> y{" "}
                    <span className="text-blue-400">rentable</span> para todos los socios.
                  </p>
                </div>

                <div className="pt-12">
                  <a
                    href="https://wa.me/5215513180427?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20la%20propuesta%20de%20asociaci%C3%B3n%20de%20NetLab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm text-lg"
                  >
                    <span className="mr-2">Contactar a Fer</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                <div className="pt-8">
                  <p className="text-sm text-slate-500 font-mono">
                    root@netlab:~/propuesta-asociacion# <span className="animate-pulse">█</span>
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <Footer />
    </main>
  )
}
