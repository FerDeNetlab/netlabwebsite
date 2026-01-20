"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Target, TrendingUp, Zap, Shield, BarChart3 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"
import Image from "next/image"

export default function GomwaterClient() {
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
                  <span className="text-green-500 font-bold">netlab@gomwater:~$</span>
                  <span className="text-slate-100">iniciar-colaboracion</span>
                  <span className="text-purple-400">--proyecto</span>
                  <span className="text-purple-400">--comision</span>
                  <span className="text-purple-400">--escalable</span>
                  <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Image src="/logo-netlab.png" alt="Netlab Logo" width={120} height={40} className="h-10 w-auto" />
                    <span className="text-2xl text-slate-500">×</span>
                    <div className="text-2xl font-bold text-green-500 tracking-wider">GOMWATER</div>
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Modelo de colaboración por <span className="text-purple-400">proyecto, comisión y evolución</span>{" "}
                    continua
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Una propuesta estratégica diseñada para GOMWATER: gestión profesional de proyectos a medida, orden
                    operativo y tecnología aplicada, sin costos fijos innecesarios.
                  </motion.p>

                  <motion.div
                    className="pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <a
                      href="#modelo"
                      className="group relative inline-flex items-center justify-center px-8 py-3 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm"
                    >
                      <span className="mr-2">Ver modelo completo</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>

                  <motion.div
                    className="mt-12 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Analizando operación actual... [OK]</p>
                    <p>{">"} Identificando puntos críticos... [OK]</p>
                    <p>{">"} Generando propuesta de valor... [READY]</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      {/* Contexto GOMWATER */}
      <section id="contexto" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat contexto-gomwater.txt</span>
              </div>

              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  GOMWATER es una empresa técnica especializada en soluciones de tratamiento de agua
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-400 mb-2">Operación Recurrente (Run-rate)</h3>
                        <p className="text-sm text-slate-400">
                          Márgenes más bajos, volumen constante, generación de flujo. Altamente estandarizable y
                          autooperable con procesos claros.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-purple-400 rounded-full flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-purple-400 mb-2">Proyectos a Medida e Industriales</h3>
                        <p className="text-sm text-slate-400">
                          Ticket alto, mayor complejidad técnica, alta variabilidad y riesgo operativo. Concentran
                          errores de margen y desgaste administrativo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                  <p className="text-slate-300">
                    <span className="text-purple-400 font-semibold">Desafío principal:</span> Conforme aumenta el
                    volumen de proyectos, se genera presión operativa, pérdida de visibilidad y desgaste constante del
                    equipo directivo.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Objetivo de la colaboración */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat objetivo.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Objetivo de la Colaboración</h2>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Ayudar a GOMWATER a ejecutar mejor sus proyectos a medida, reduciendo errores, riesgos y desgaste
                  operativo, mediante una{" "}
                  <span className="text-green-400 font-semibold">asesoría integral en procesos</span>,{" "}
                  <span className="text-purple-400 font-semibold">control interno</span> y{" "}
                  <span className="text-blue-400 font-semibold">tecnología aplicada</span>.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <Shield className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Sin costos fijos innecesarios</h3>
                    <p className="text-sm text-slate-400">Modelo 100% alineado a proyectos reales</p>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <Target className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Respeta tu etapa actual</h3>
                    <p className="text-sm text-slate-400">Crece conforme el negocio lo necesita</p>
                  </div>

                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                    <Zap className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="font-semibold text-white mb-2">Socio operativo real</h3>
                    <p className="text-sm text-slate-400">No solo gestor, sino aliado estratégico</p>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Modelo de colaboración - 4 Etapas */}
      <section id="modelo" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Modelo de Colaboración en 4 Etapas</h2>
            <p className="text-slate-400 text-lg">Progresivo, escalable y alineado al negocio real</p>
          </div>

          <div className="space-y-8">
            {/* Etapa 1 */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-500 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-white">Gestión de Proyectos a Medida</h3>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Netlab participa activamente como{" "}
                  <span className="text-green-400 font-semibold">Project Manager</span> y asesor operativo en proyectos
                  especiales, industriales o a medida.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-3">Acompañamiento incluye:</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Planeación del proyecto y definición de alcance
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Coordinación operativa y seguimiento continuo
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Gestión de cambios y control de desviaciones
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Cierre operativo y administrativo
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-green-500/5 border border-green-500/20 rounded">
                    <h4 className="text-green-400 font-semibold mb-3">Esquema Económico:</h4>
                    <div className="space-y-3 text-slate-300">
                      <div>
                        <p className="text-2xl font-bold text-green-400">3%</p>
                        <p className="text-sm text-slate-400">Comisión sobre valor total del proyecto</p>
                      </div>
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-2xl font-bold text-green-400">+ 5%</p>
                        <p className="text-sm text-slate-400">Sobre la utilidad real del proyecto</p>
                      </div>
                      <p className="text-xs text-slate-500 pt-3 border-t border-slate-700">
                        ✓ Solo aplica a proyectos a medida e industriales
                        <br />✓ Comisión generada al momento del cobro
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Etapa 2 */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-400/10 border-2 border-purple-400 flex items-center justify-center text-purple-400 font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-white">Orden Operativo y Control Interno</h3>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  En paralelo a la gestión de proyectos, trabajamos en separar la operación recurrente de los proyectos
                  especiales.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <h4 className="text-purple-400 font-semibold mb-2 text-sm">Documentación</h4>
                    <p className="text-xs text-slate-400">Procesos simples y flujos claros</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <h4 className="text-purple-400 font-semibold mb-2 text-sm">Definición</h4>
                    <p className="text-xs text-slate-400">Roles, responsabilidades y puntos de control</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <h4 className="text-purple-400 font-semibold mb-2 text-sm">Autooperación</h4>
                    <p className="text-xs text-slate-400">Run-rate sin consumir tiempo crítico</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded">
                  <p className="text-sm text-slate-400">
                    <span className="text-purple-400 font-semibold">Nota:</span> En esta etapa no existe PM ni comisión.
                    El objetivo es reducir fricción sin frenar la operación.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            {/* Etapa 3 */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-400/10 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-white">Tecnología Aplicada y Herramientas</h3>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  La tecnología no como producto, sino como{" "}
                  <span className="text-blue-400 font-semibold">habilitador de control y visibilidad</span>.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-blue-400 font-semibold">Herramientas según necesidad:</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        CRM para oportunidades y proyectos
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        Herramientas colaborativas para seguimiento
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        Repositorios documentales por proyecto
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                        Tableros operativos y automatizaciones
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded">
                    <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      La tecnología se implementa <span className="text-blue-400 font-semibold">únicamente</span> cuando
                      reduce errores, ahorra tiempo o da claridad real. No por moda.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Etapa 4 */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-400/10 border-2 border-green-400 flex items-center justify-center text-green-400 font-bold text-xl">
                    4
                  </div>
                  <h3 className="text-2xl font-bold text-white">Evolución a Modelo de Iguala</h3>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  La iguala <span className="text-green-400 font-semibold">no se propone desde el inicio</span>. Se
                  evalúa de común acuerdo cuando existe madurez operativa.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-3">Cuándo evaluar la iguala:</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Volumen constante de proyectos
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Comisión mensual ya es significativa
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Procesos están definidos y funcionando
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Rol evoluciona a asesoría continua
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-green-500/5 border border-green-500/20 rounded">
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      La iguala se presenta como una <span className="text-green-400 font-semibold">optimización</span>{" "}
                      del modelo, no como un costo adicional.
                    </p>
                    <p className="text-xs text-slate-500">
                      Incluye: asesoría continua, optimización de procesos y mejora tecnológica constante.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      {/* Qué incluye y qué no incluye */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-xl font-bold">Qué SÍ incluye</span>
                </div>

                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Asesoría integral en procesos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Control operativo y financiero de proyectos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Acompañamiento real en proyectos críticos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tecnología práctica y gradual</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Modelo escalable por proyectos</span>
                  </li>
                </ul>
              </div>
            </TerminalFrame>

            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-400 font-mono mb-6">
                  <div className="w-6 h-6 rounded-full border-2 border-red-400 flex items-center justify-center text-xs">
                    ✕
                  </div>
                  <span className="text-xl font-bold">Qué NO incluye</span>
                </div>

                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400/50 flex items-center justify-center text-xs text-red-400 mt-0.5 flex-shrink-0">
                      ✕
                    </div>
                    <span>Costos fijos iniciales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400/50 flex items-center justify-center text-xs text-red-400 mt-0.5 flex-shrink-0">
                      ✕
                    </div>
                    <span>Burocracia innecesaria</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400/50 flex items-center justify-center text-xs text-red-400 mt-0.5 flex-shrink-0">
                      ✕
                    </div>
                    <span>PM para operación recurrente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400/50 flex items-center justify-center text-xs text-red-400 mt-0.5 flex-shrink-0">
                      ✕
                    </div>
                    <span>Implementaciones tecnológicas complejas sin valor inmediato</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-400/50 flex items-center justify-center text-xs text-red-400 mt-0.5 flex-shrink-0">
                      ✕
                    </div>
                    <span>Esquemas corporativos rígidos</span>
                  </li>
                </ul>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      {/* Mensaje clave */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame className="border-purple-500/30">
            <div className="text-center space-y-6 py-8">
              <div className="inline-block">
                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                  <span className="text-lg">$</span>
                  <span className="text-lg">echo $MENSAJE_CLAVE</span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                <span className="text-green-400">Proyecto hoy</span>,{" "}
                <span className="text-purple-400">control mañana</span>,{" "}
                <span className="text-blue-400">estructura continua</span>
              </h2>

              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Un modelo de colaboración diseñado para crecer con el negocio, sin imposiciones ni costos fijos que no
                aporten valor inmediato.
              </p>
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
                <span className="text-lg">root@netlab:~/gomwater#</span>
                <span className="text-lg">siguiente-paso</span>
                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">¿Listo para comenzar?</h2>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                El siguiente paso es revisar esta propuesta en una reunión conjunta para resolver dudas, alinear
                expectativas y definir el primer proyecto.
              </p>

              <div className="pt-6">
                <a
                  href="https://wa.me/5215513180427?text=Hola%2C%20quiero%20más%20información%20sobre%20la%20colaboración%20Netlab%20×%20GOMWATER"
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
