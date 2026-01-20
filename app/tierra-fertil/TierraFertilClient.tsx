"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  Shield,
  Layers,
  Monitor,
  Tablet,
  Wifi,
  Printer,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"
import Image from "next/image"

export default function TierraFertilClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-6 pb-16 md:pt-16 md:pb-32 overflow-hidden">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TerminalFrame className="min-h-[400px] md:min-h-[500px] border-slate-800 bg-[#050505]">
              <div className="font-mono space-y-6 md:space-y-8">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-lg mb-6 md:mb-8">
                  <span className="text-green-500 font-bold">netlab@tierra-fertil:~$</span>
                  <span className="text-slate-100">iniciar-sistema</span>
                  <span className="text-purple-400">--nivel-1</span>
                  <span className="w-2 h-4 md:w-2.5 md:h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-4 md:space-y-6 pl-3 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 md:mb-6">
                    <Image
                      src="/logo-netlab.png"
                      alt="Netlab Logo"
                      width={100}
                      height={32}
                      className="h-8 md:h-10 w-auto"
                    />
                    <span className="hidden sm:block text-xl md:text-2xl text-slate-500">×</span>
                    <div className="text-xl md:text-2xl font-bold text-green-500 tracking-wider">TIERRA FÉRTIL</div>
                  </div>

                  <motion.h1
                    className="text-2xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Sistema Base Operativo <span className="text-purple-400">Nivel 1</span>
                  </motion.h1>

                  <motion.p
                    className="text-sm md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Una solución diseñada para{" "}
                    <span className="text-green-400">ordenar, registrar y dar visibilidad</span> a tu operación diaria,
                    sin introducir complejidad innecesaria.
                  </motion.p>

                  <motion.div
                    className="pt-4 md:pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <a
                      href="#propuesta"
                      className="group relative inline-flex items-center justify-center px-5 md:px-8 py-2.5 md:py-3 font-mono font-bold text-sm md:text-base text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm"
                    >
                      <span className="mr-2">Ver propuesta</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>

                  <motion.div
                    className="mt-6 md:mt-12 p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded text-[10px] md:text-sm font-mono text-slate-500 hidden sm:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Analizando operación actual... [OK]</p>
                    <p>{">"} Identificando necesidades básicas... [OK]</p>
                    <p>{">"} Preparando sistema de orden... [READY]</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      {/* Contexto - Por qué Nivel 1 */}
      <section id="contexto" className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat contexto.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6 text-slate-300 leading-relaxed">
                <p className="text-lg md:text-xl font-semibold text-white">
                  Tierra Fértil es un negocio operativo que hoy funciona principalmente con registros manuales
                </p>

                <p className="text-sm md:text-base text-slate-400">
                  Esto limita la visibilidad de la operación diaria y dificulta la toma de decisiones. No necesitas un
                  sistema complejo, necesitas{" "}
                  <span className="text-green-400 font-semibold">orden y control básico</span>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 mt-1 text-red-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-red-400 mb-2">La situación actual</h3>
                        <ul className="text-xs md:text-sm text-slate-400 space-y-1.5 md:space-y-2">
                          <li>- Registros en papel o informales</li>
                          <li>- Sin visibilidad clara de ventas y compras</li>
                          <li>- Dificultad para saber existencias reales</li>
                          <li>- Decisiones basadas en intuición</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-400 mb-2">Lo que necesitas</h3>
                        <ul className="text-xs md:text-sm text-slate-400 space-y-1.5 md:space-y-2">
                          <li>- Digitalizar registros sin complicaciones</li>
                          <li>- Ver qué entra, qué sale, qué tienes</li>
                          <li>- Saber cuánto dinero hay en movimiento</li>
                          <li>- Control simple que cualquiera pueda usar</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                  <p className="text-sm md:text-base text-slate-300">
                    <span className="text-purple-400 font-semibold">Filosofía Nivel 1:</span> Este sistema no busca
                    optimizar ni automatizar todo. Busca{" "}
                    <span className="text-white font-semibold">poner orden y control básico</span> como primer paso
                    hacia una operación más profesional.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Niveles de Software */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat niveles-sistema.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Software por Niveles de Netlab</h2>
                <p className="text-sm md:text-base text-slate-400">
                  Cada negocio tiene necesidades diferentes. Por eso creamos un sistema de niveles que crece contigo.
                </p>

                <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-4 mt-6 md:mt-8 overflow-x-auto pb-4 md:pb-0 -mx-3 px-3 md:mx-0 md:px-0">
                  <div className="p-3 md:p-4 bg-green-500/10 border-2 border-green-500 rounded relative min-w-[140px] md:min-w-0 flex-shrink-0">
                    <div className="absolute -top-3 left-2 md:left-3 bg-green-500 text-black text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded">
                      TU NIVEL
                    </div>
                    <Layers className="w-5 md:w-6 h-5 md:h-6 text-green-500 mb-2" />
                    <h4 className="text-green-400 font-bold mb-1 text-sm md:text-base">Nivel 1</h4>
                    <p className="text-[10px] md:text-xs text-slate-400">Orden básico</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 mt-2">Para empezar a organizarse</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-700 rounded opacity-60 min-w-[140px] md:min-w-0 flex-shrink-0">
                    <Layers className="w-5 md:w-6 h-5 md:h-6 text-slate-500 mb-2" />
                    <h4 className="text-slate-400 font-bold mb-1 text-sm md:text-base">Nivel 2</h4>
                    <p className="text-[10px] md:text-xs text-slate-500">Control intermedio</p>
                    <p className="text-[9px] md:text-[10px] text-slate-600 mt-2">Reportes y análisis</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-700 rounded opacity-60 min-w-[140px] md:min-w-0 flex-shrink-0">
                    <Layers className="w-5 md:w-6 h-5 md:h-6 text-slate-500 mb-2" />
                    <h4 className="text-slate-400 font-bold mb-1 text-sm md:text-base">Nivel 3</h4>
                    <p className="text-[10px] md:text-xs text-slate-500">Gestión completa</p>
                    <p className="text-[9px] md:text-[10px] text-slate-600 mt-2">Procesos integrados</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-700 rounded opacity-60 min-w-[140px] md:min-w-0 flex-shrink-0">
                    <Layers className="w-5 md:w-6 h-5 md:h-6 text-slate-500 mb-2" />
                    <h4 className="text-slate-400 font-bold mb-1 text-sm md:text-base">Nivel 4</h4>
                    <p className="text-[10px] md:text-xs text-slate-500">Optimización</p>
                    <p className="text-[9px] md:text-[10px] text-slate-600 mt-2">Automatizaciones</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-700 rounded opacity-60 min-w-[140px] md:min-w-0 flex-shrink-0">
                    <Layers className="w-5 md:w-6 h-5 md:h-6 text-slate-500 mb-2" />
                    <h4 className="text-slate-400 font-bold mb-1 text-sm md:text-base">Nivel 5</h4>
                    <p className="text-[10px] md:text-xs text-slate-500">ERP completo</p>
                    <p className="text-[9px] md:text-[10px] text-slate-600 mt-2">Odoo Enterprise</p>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-500 mt-4">
                  Conforme tu negocio crezca y se profesionalice, podrás evolucionar al siguiente nivel sin perder lo
                  avanzado.
                </p>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Objetivo del Servicio */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat objetivo.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Objetivo del Sistema</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
                  <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded flex items-start gap-3 md:gap-4">
                    <FileText className="w-6 md:w-8 h-6 md:h-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 md:mb-2 text-sm md:text-base">
                        Digitalizar registros
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400">
                        Pasar de papel a digital la operación diaria sin complicaciones
                      </p>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded flex items-start gap-3 md:gap-4">
                    <Eye className="w-6 md:w-8 h-6 md:h-8 text-purple-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 md:mb-2 text-sm md:text-base">
                        Centralizar información
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400">
                        Ventas, compras, inventario y dinero en un solo lugar
                      </p>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded flex items-start gap-3 md:gap-4">
                    <Shield className="w-6 md:w-8 h-6 md:h-8 text-blue-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 md:mb-2 text-sm md:text-base">
                        Reducir dependencia
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400">
                        Menos papel, menos procesos informales, más control
                      </p>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded flex items-start gap-3 md:gap-4">
                    <Layers className="w-6 md:w-8 h-6 md:h-8 text-green-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-1 md:mb-2 text-sm md:text-base">Base para crecer</h3>
                      <p className="text-xs md:text-sm text-slate-400">
                        Establecer cimientos sobre los que tu negocio pueda evolucionar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Alcance Incluido */}
      <section id="propuesta" className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">Alcance del Sistema Nivel 1</h2>
            <p className="text-sm md:text-lg text-slate-400">Todo lo que incluye la implementación</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Ventas */}
            <TerminalFrame>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                    <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Ventas</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">Funcionalidad:</h4>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Registro de ventas diarias
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Producto, cantidad y precio
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Historial consultable
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 md:p-4 bg-green-500/5 border border-green-500/20 rounded">
                    <p className="text-xs md:text-sm text-slate-300">
                      <span className="text-green-400 font-semibold">Resultado:</span> Sabrás exactamente qué vendiste,
                      cuánto y a qué precio cada día.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Compras */}
            <TerminalFrame>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-purple-400/10 border-2 border-purple-400 flex items-center justify-center">
                    <Package className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Compras</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">Funcionalidad:</h4>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Registro de compras
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Producto, cantidad y costo
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Historial de proveedores
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 md:p-4 bg-purple-500/5 border border-purple-500/20 rounded">
                    <p className="text-xs md:text-sm text-slate-300">
                      <span className="text-purple-400 font-semibold">Resultado:</span> Control claro de lo que compras,
                      a quién y a qué costo.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Inventario */}
            <TerminalFrame>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-blue-400/10 border-2 border-blue-400 flex items-center justify-center">
                    <Package className="w-5 md:w-6 h-5 md:h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Inventario</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">Funcionalidad:</h4>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        Control de entradas y salidas
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        Existencias por bodega
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        Alertas simples de caducidad
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 md:p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                    <p className="text-xs md:text-sm text-slate-300">
                      <span className="text-blue-400 font-semibold">Resultado:</span> Siempre sabrás qué tienes, dónde
                      está y si está por caducar.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Ingresos y Egresos */}
            <TerminalFrame>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-green-400/10 border-2 border-green-400 flex items-center justify-center">
                    <DollarSign className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Ingresos y Egresos</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">Funcionalidad:</h4>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Registro de ingresos
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Registro de egresos
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        Visualización básica del flujo de dinero
                      </li>
                    </ul>
                  </div>
                  <div className="p-3 md:p-4 bg-green-500/5 border border-green-500/20 rounded">
                    <p className="text-xs md:text-sm text-slate-300">
                      <span className="text-green-400 font-semibold">Resultado:</span> Visibilidad clara de cuánto
                      entra, cuánto sale y cómo fluye tu dinero.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Usuarios y Reportes */}
            <TerminalFrame>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-purple-400/10 border-2 border-purple-400 flex items-center justify-center">
                    <Users className="w-5 md:w-6 h-5 md:h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Usuarios, Permisos y Reportes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">Funcionalidad:</h4>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Creación de usuarios
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Roles: Operativo, Administrativo, Responsable
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Permisos personalizados
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">
                      Reportes incluidos:
                    </h4>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <FileText className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Ventas por periodo
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Compras por periodo
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Existencias por bodega
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-3.5 md:w-4 h-3.5 md:h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        Ingresos y egresos
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat metodologia.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Metodología de Trabajo</h2>
                <p className="text-sm md:text-base text-slate-400">Implementación guiada y estructurada en 5 etapas:</p>

                <div className="space-y-3 md:space-y-4 mt-6 md:mt-8">
                  {[
                    { num: 1, title: "Levantamiento operativo", desc: "Entendemos tu operación actual" },
                    { num: 2, title: "Configuración base", desc: "Preparamos la estructura del sistema" },
                    { num: 3, title: "Configuración funcional", desc: "Activamos los módulos necesarios" },
                    { num: 4, title: "Uso con operación real", desc: "Empezamos a usar el sistema con datos reales" },
                    { num: 5, title: "Ajustes de estabilización", desc: "Afinamos detalles hasta que todo funcione" },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded"
                    >
                      <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs md:text-sm flex-shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm md:text-base">{step.title}</h4>
                        <p className="text-xs md:text-sm text-slate-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-green-500/5 border border-green-500/20 rounded flex items-center gap-3 md:gap-4">
                  <Clock className="w-6 md:w-8 h-6 md:h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-green-400 font-semibold text-sm md:text-base">
                      Duración estimada: 3 a 5 semanas
                    </h4>
                    <p className="text-xs md:text-sm text-slate-400">
                      Netlab acompaña todo el proceso hasta dejar el sistema operando
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Inversión */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat inversion.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Inversión</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="p-5 md:p-8 bg-green-500/5 border-2 border-green-500 rounded">
                    <h3 className="text-sm md:text-lg text-slate-400 mb-2">Sistema Base Operativo – Nivel 1</h3>
                    <div className="text-3xl md:text-5xl font-bold text-green-400 mb-4">
                      $80,000 <span className="text-base md:text-xl font-normal text-slate-400">MXN + IVA</span>
                    </div>
                    <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Implementación completa del alcance
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Acompañamiento guiado durante implementación
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Puesta en marcha con operación real
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        Entrega del sistema funcional
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded">
                      <h4 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">
                        Condiciones de pago:
                      </h4>
                      <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>
                            <span className="text-green-400 font-semibold">50%</span> de anticipo para iniciar
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>
                            <span className="text-green-400 font-semibold">50%</span> contra entrega funcional
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 md:p-6 bg-red-500/5 border border-red-500/20 rounded">
                      <h4 className="text-red-400 font-semibold mb-2 md:mb-3 text-sm md:text-base">No incluido:</h4>
                      <ul className="space-y-1 text-[10px] md:text-xs text-slate-400">
                        <li>- Contabilidad / Nómina / Impuestos</li>
                        <li>- Facturación fiscal avanzada</li>
                        <li>- Automatizaciones complejas</li>
                        <li>- Integraciones externas</li>
                        <li>- Reportes a la medida</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Comparativa Odoo */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat comparativa-odoo.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">¿Por qué no Odoo directamente?</h2>
                <p className="text-sm md:text-base text-slate-400">
                  <span className="text-purple-400 font-semibold">Nosotros vendemos e implementamos Odoo</span>, es una
                  de nuestras principales especialidades. Sin embargo, para Tierra Fértil, creemos que
                  <span className="text-green-400"> el primer paso debe ser aprender a usar la tecnología</span> antes
                  de saltar a un ERP empresarial completo.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-8">
                  {/* Odoo */}
                  <div className="p-4 md:p-6 bg-red-500/5 border border-red-500/30 rounded">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 md:w-10 h-8 md:h-10 rounded bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-4 md:w-5 h-4 md:h-5 text-red-400" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-red-400">Odoo Enterprise</h3>
                    </div>

                    <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Licencia mensual (10 usuarios)</p>
                        <p className="text-white font-semibold text-sm md:text-base">
                          $5,840 MXN/mes <span className="text-slate-500 font-normal text-xs">(~$292 × 10)</span>
                        </p>
                        <p className="text-red-400 text-[10px] md:text-xs mt-1">= $70,080 MXN/año solo en licencias</p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Implementación básica</p>
                        <p className="text-white font-semibold text-sm md:text-base">$150,000 - $300,000 MXN</p>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                          Dependiendo de módulos y complejidad
                        </p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Capacitación (hora consultor)</p>
                        <p className="text-white font-semibold text-sm md:text-base">$2,000 - $2,500 MXN/hora</p>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                          Mínimo 40-60 horas para equipo de 10
                        </p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Curva de aprendizaje</p>
                        <p className="text-red-400 font-semibold text-sm md:text-base">3-6 meses para dominio básico</p>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                          Sistema complejo para usuarios sin experiencia digital
                        </p>
                      </div>

                      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-red-500/20">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Inversión primer año estimada</p>
                        <p className="text-xl md:text-2xl font-bold text-red-400">$320,000 - $470,000 MXN</p>
                      </div>
                    </div>
                  </div>

                  {/* Sistema Nivel 1 */}
                  <div className="p-4 md:p-6 bg-green-500/5 border border-green-500/30 rounded">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-8 md:w-10 h-8 md:h-10 rounded bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-green-500" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-green-400">Sistema Nivel 1</h3>
                    </div>

                    <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Licencia</p>
                        <p className="text-white font-semibold text-sm md:text-base">$0 MXN/mes</p>
                        <p className="text-green-400 text-[10px] md:text-xs mt-1">
                          Sin costos recurrentes de licenciamiento
                        </p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Implementación completa</p>
                        <p className="text-white font-semibold text-sm md:text-base">$80,000 MXN</p>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1">Todo incluido, sin sorpresas</p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Capacitación</p>
                        <p className="text-white font-semibold text-sm md:text-base">Incluida en implementación</p>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                          Sistema diseñado para ser intuitivo
                        </p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-slate-900/50 rounded">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Curva de aprendizaje</p>
                        <p className="text-green-400 font-semibold text-sm md:text-base">1-2 semanas</p>
                        <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                          Interfaz simple pensada para cualquier usuario
                        </p>
                      </div>

                      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-green-500/20">
                        <p className="text-slate-500 text-[10px] md:text-xs mb-1">Inversión total</p>
                        <p className="text-xl md:text-2xl font-bold text-green-400">$80,000 MXN</p>
                        <p className="text-green-400 text-[10px] md:text-xs mt-1">
                          Ahorro de hasta $390,000 MXN el primer año
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-purple-500/5 border border-purple-500/20 rounded">
                  <p className="text-sm md:text-base text-slate-300">
                    <span className="text-purple-400 font-semibold">Nuestra recomendación:</span> Comienza con el Nivel
                    1 para que tu equipo aprenda a trabajar con tecnología. Cuando dominen lo básico y el negocio lo
                    requiera, podremos migrar a Odoo sin perder lo avanzado.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Inversiones Adicionales de Hardware */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat hardware-necesario.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Inversiones Adicionales (Hardware)</h2>
                <p className="text-sm md:text-base text-slate-400">
                  Para operar el sistema de manera óptima, tu negocio puede requerir equipo adicional.{" "}
                  <span className="text-purple-400">Esto no está incluido en la propuesta</span>, pero podemos ayudarte
                  a conseguirlo.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded text-center">
                    <Tablet className="w-6 md:w-8 h-6 md:h-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold text-xs md:text-sm">Tablets</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">Para registro en campo</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded text-center">
                    <Monitor className="w-6 md:w-8 h-6 md:h-8 text-green-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold text-xs md:text-sm">Computadoras</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">Para administración</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded text-center">
                    <Printer className="w-6 md:w-8 h-6 md:h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="text-white font-semibold text-xs md:text-sm">Impresoras</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">Para tickets/reportes</p>
                  </div>

                  <div className="p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded text-center">
                    <Wifi className="w-6 md:w-8 h-6 md:h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="text-white font-semibold text-xs md:text-sm">Internet</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1">Conexión estable</p>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-green-500/5 border border-green-500/20 rounded">
                  <h4 className="text-green-400 font-semibold mb-2 text-sm md:text-base">
                    Opciones para adquirir hardware:
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-white font-semibold">Tú lo consigues:</span> Puedes adquirir el equipo por
                        tu cuenta donde prefieras
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 md:w-4 h-3.5 md:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-white font-semibold">Netlab te ayuda:</span> Podemos conseguirte precios
                        de mayoreo en todo el equipo que necesites
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* Siguientes Pasos */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-3 md:px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 md:gap-3 text-green-500 font-mono mb-4 md:mb-6">
                <span className="text-base md:text-lg">$</span>
                <span className="text-sm md:text-lg">cat siguientes-pasos.txt</span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Siguientes Pasos</h2>

                <div className="space-y-3 md:space-y-4 mt-6 md:mt-8">
                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs md:text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base">Revisión de esta propuesta</h4>
                      <p className="text-xs md:text-sm text-slate-400">Analiza el alcance y resuelve cualquier duda</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs md:text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base">Confirmación de inicio</h4>
                      <p className="text-xs md:text-sm text-slate-400">Anticipo del 50% para comenzar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs md:text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base">Agenda de sesión inicial</h4>
                      <p className="text-xs md:text-sm text-slate-400">
                        Levantamiento operativo para entender tu negocio
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-12 text-center">
                  <a
                    href="https://wa.me/5215513180427?text=Hola%2C%20me%20interesa%20la%20propuesta%20del%20Sistema%20Nivel%201%20para%20Tierra%20Fértil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-6 md:px-10 py-3 md:py-4 font-mono font-bold text-sm md:text-lg text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm"
                  >
                    <span className="mr-2">Contactar a Netlab</span>
                    <ArrowRight className="w-4 md:w-5 h-4 md:h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                  <p className="text-xs md:text-sm text-slate-500 mt-4">
                    Habla directamente con Fer para resolver dudas o iniciar el proyecto
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
