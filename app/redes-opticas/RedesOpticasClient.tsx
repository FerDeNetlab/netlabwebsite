"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  X,
  Zap,
  Shield,
  BarChart3,
  Layers,
  Smartphone,
  Clock,
  Users,
  Truck,
  Wrench,
  Package,
  Building2,
  ClipboardList,
  Headphones,
  Lock,
  Server,
  AlertCircle,
  CalendarDays,
  DollarSign,
  PhoneCall
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"
import Image from "next/image"

export default function RedesOpticasClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-10 pb-20 md:pt-16 overflow-hidden">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
              <div className="font-mono space-y-8">
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                  <span className="text-green-500 font-bold">netlab@redes-opticas:~$</span>
                  <span className="text-slate-100">generar-propuesta</span>
                  <span className="text-cyan-400">--erp</span>
                  <span className="text-cyan-400">--frabe</span>
                  <span className="text-cyan-400">--campo</span>
                  <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="text-xl md:text-2xl text-slate-500">netlab.mx</span>
                    <span className="text-xl md:text-2xl text-slate-500">×</span>
                    <div className="text-xl md:text-2xl font-bold text-cyan-400 tracking-wider">REDES ÓPTICAS</div>
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Tu operación en campo merece un sistema que <span className="text-cyan-400">hable su idioma</span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    ERP a medida Frabe: órdenes de servicio, almacenes, herramientas, flotillas y app de campo. 
                    Sistema operativo digital para empresas de instalaciones IT.
                  </motion.p>

                  <motion.div
                    className="pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <div className="inline-block px-4 py-2 bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                      Propuesta Comercial · Frabe v1.0
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Analizando operación actual... [OK]</p>
                    <p>{">"} Identificando puntos críticos... [OK]</p>
                    <p>{">"} Generando propuesta a medida... [READY]</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      {/* ═══ CONTEXTO ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat redes-opticas-perfil.txt</span>
              </div>

              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  Redes Ópticas es una empresa técnica especializada en instalaciones IT con operación en múltiples sucursales
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <h3 className="font-semibold text-red-400 text-lg">La Realidad Actual</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span> Órdenes en Excel / WhatsApp
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span> Sin visibilidad de costos reales
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span> Herramientas no rastreadas
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span> Gastos de flota desorganizados
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">✕</span> Instaladores sin acceso en campo
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                      <h3 className="font-semibold text-green-400 text-lg">Lo que Necesitas</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span> Control de órdenes de principio a fin
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span> Rentabilidad real por orden
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span> Trazabilidad de activos
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span> Gestión integrada de flotilla
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span> Instaladores productivos desde el móvil
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-cyan-500 rounded">
                  <p className="text-slate-300">
                    <span className="text-cyan-400 font-semibold">El reto real:</span> Conforme creces sin sistemas integrados, 
                    la operación se vuelve caótica. Pierdes dinero en ineficiencias, tus instaladores están desmotivados 
                    sin tecnología, y tu dirección no sabe dónde está cada peso que gasta.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ ¿QUÉ ES FRABE? — 5 CAPAS ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Qué es Frabe?</h2>
            <p className="text-slate-400 text-lg">Tu sistema operativo digital en 5 capas integradas</p>
          </div>

          <div className="space-y-6">
            {[
              { num: 1, title: "Órdenes de Servicio", desc: "Control de punta a punta: creación, asignación a instaladores, consumo de insumos, evidencias fotográficas, estados en tiempo real", icon: ClipboardList, color: "green", borderColor: "green" as const },
              { num: 2, title: "Almacenes & Herramientas", desc: "Multi-almacén, inventario en tiempo real, resguardo de herramientas con firma digital, alertas de stock bajo, auditorías", icon: Package, color: "purple", borderColor: "purple" as const },
              { num: 3, title: "Flotillas & Logística", desc: "Control vehicular completo: seguros, mantenimiento, gasolina, llantas, refrendos. Cálculo automático de costos de traslado por orden", icon: Truck, color: "blue", borderColor: "blue" as const },
              { num: 4, title: "Costos & Dirección", desc: "Rentabilidad por orden: insumos + mano de obra + traslado. Exportación nativa a CONTPAQi, dashboards ejecutivos, KPIs", icon: BarChart3, color: "orange", borderColor: "blue" as const },
              { num: 5, title: "App de Campo (PWA)", desc: "Instaladores operan desde celular: ver órdenes, cambiar estados, subir evidencias, firmas digitales, sincronización cuando hay red", icon: Smartphone, color: "cyan", borderColor: "blue" as const }
            ].map((layer) => {
              const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                green: { bg: "bg-green-500/10", border: "border-green-500", text: "text-green-400" },
                purple: { bg: "bg-purple-500/10", border: "border-purple-500", text: "text-purple-400" },
                blue: { bg: "bg-blue-500/10", border: "border-blue-500", text: "text-blue-400" },
                orange: { bg: "bg-orange-500/10", border: "border-orange-500", text: "text-orange-400" },
                cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500", text: "text-cyan-400" }
              }
              const c = colorMap[layer.color]
              const Icon = layer.icon
              return (
                <TerminalFrame key={layer.num} borderColor={layer.borderColor}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${c.bg} border-2 ${c.border} flex items-center justify-center ${c.text} font-bold text-xl`}>
                        {layer.num}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{layer.title}</h3>
                        <p className={`${c.text} font-mono text-sm`}>Capa {layer.num} del sistema</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{layer.desc}</p>
                  </div>
                </TerminalFrame>
              )
            })}

            <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <p className="text-slate-300">
                <span className="text-cyan-400 font-semibold">Lo importante:</span> No es software genérico con muchas cosas que 
                no necesitas. Frabe es <span className="text-white font-semibold">TU sistema operativo digital</span>, diseñado 
                específicamente para el flujo de trabajo de una empresa de instalaciones IT en múltiples sucursales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TABLA COMPARATIVA ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat comparativa-erps.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">¿Por qué un ERP a medida y no uno genérico?</h2>
                <p className="text-slate-400 text-lg">Comparación honesta: funcionalidad vs inversión</p>

                {/* Tabla comparativa */}
                <div className="overflow-x-auto -mx-6 md:mx-0">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-800">
                        <th className="text-left p-3 font-bold text-white bg-slate-900/50 min-w-[180px]">Criterio</th>
                        <th className="text-center p-3 font-bold text-green-400 bg-green-500/5 min-w-[120px]">Frabe</th>
                        <th className="text-center p-3 font-bold text-slate-400 bg-slate-900/30 min-w-[120px]">Competencia 1</th>
                        <th className="text-center p-3 font-bold text-slate-400 bg-slate-900/30 min-w-[120px]">Competencia 2</th>
                        <th className="text-center p-3 font-bold text-slate-400 bg-slate-900/30 min-w-[120px]">Competencia 3</th>
                        <th className="text-center p-3 font-bold text-red-400 bg-red-500/5 min-w-[120px]">Competencia 4</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        ["Órdenes de servicio en campo", true, false, false, true, false],
                        ["App móvil para instaladores", true, false, false, false, false],
                        ["Control de flotillas integrado", true, false, false, false, false],
                        ["Conciliación CONTPAQi nativa", true, false, false, false, false],
                        ["Multi-sucursal nativo", true, true, true, true, false],
                        ["Resguardo digital de herramientas", true, false, false, false, false],
                        ["Sin costo por usuario adicional", true, false, false, false, true],
                        ["Propiedad total del código", true, false, false, false, false],
                        ["Soporte técnico dedicado 24/7", true, false, false, false, false],
                        ["PWA para operación offline", true, false, false, false, false],
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-900/30 transition">
                          <td className="p-3 font-semibold text-slate-300 text-left">{row[0]}</td>
                          <td className="p-3 text-center text-green-400 font-bold bg-green-500/5">
                            {row[1] ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto" />}
                          </td>
                          <td className="p-3 text-center text-slate-500 bg-slate-900/20">
                            {row[2] ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto opacity-30" />}
                          </td>
                          <td className="p-3 text-center text-slate-500 bg-slate-900/20">
                            {row[3] ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto opacity-30" />}
                          </td>
                          <td className="p-3 text-center text-slate-500 bg-slate-900/20">
                            {row[4] ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto opacity-30" />}
                          </td>
                          <td className="p-3 text-center text-red-400 bg-red-500/5">
                            {row[5] ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto opacity-30" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Análisis económico */}
                <TerminalFrame className="border-green-500/30 mt-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Análisis de Inversión — 3 años de implementación</h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                        <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">Competencia 1</div>
                        <div className="text-2xl font-bold text-slate-400 mb-2">~$1.5M - 2.4M MXN</div>
                        <p className="text-xs text-slate-500">$500K-800K/año por licencias, consultor y hosting</p>
                      </div>

                      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                        <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">Competencia 2</div>
                        <div className="text-2xl font-bold text-slate-400 mb-2">~$1.2M - 2.1M MXN</div>
                        <p className="text-xs text-slate-500">$400K-700K/año por licencias por usuario y customización</p>
                      </div>

                      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                        <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">Competencia 3</div>
                        <div className="text-2xl font-bold text-slate-400 mb-2">~$600K - 1.2M MXN</div>
                        <p className="text-xs text-slate-500">$200K-400K/año por módulos, usuarios e implementación</p>
                      </div>

                      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded">
                        <div className="text-xs text-red-500 font-mono uppercase tracking-wider mb-2">Competencia 4 (Barato pero incompleto)</div>
                        <div className="text-2xl font-bold text-red-400 mb-2">~$240K - 450K MXN</div>
                        <p className="text-xs text-red-500/70">Pero SIN campo, flotillas, herramientas ni CONTPAQi</p>
                      </div>

                      <div className="p-4 bg-green-500/5 border-2 border-green-500/30 rounded lg:col-span-2">
                        <div className="text-xs text-green-400 font-mono uppercase tracking-wider mb-2">✓ Frabe (Completo)</div>
                        <div className="text-2xl font-bold text-green-400">Precio de lista: {fmt(1138200)}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                      <p className="text-green-400 font-bold text-lg">En 2 años recuperas tu inversión vs cualquier ERP genérico</p>
                    </div>
                  </div>
                </TerminalFrame>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ ¿POR QUÉ NETLAB? — BENEFICIOS PREMIUM ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Por qué Netlab?</h2>
            <p className="text-slate-400 text-lg">Beneficios que vienen en el paquete</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Equipo dedicado de 5 developers senior", borderClass: "border-green-500/20 hover:border-green-500/40", iconClass: "text-green-400" },
              { icon: Headphones, title: "Soporte técnico 24/7 durante y post-implementación", borderClass: "border-blue-500/20 hover:border-blue-500/40", iconClass: "text-blue-400" },
              { icon: Zap, title: "Actualizaciones y mejoras continuas incluidas", borderClass: "border-purple-500/20 hover:border-purple-500/40", iconClass: "text-purple-400" },
              { icon: Users, title: "Capacitación ilimitada para todo tu equipo", borderClass: "border-cyan-500/20 hover:border-cyan-500/40", iconClass: "text-cyan-400" },
              { icon: Lock, title: "Acceso directo al líder técnico (sin tickets, sin espera)", borderClass: "border-orange-500/20 hover:border-orange-500/40", iconClass: "text-orange-400" },
              { icon: Server, title: "Sistema 100% tuyo: código, base de datos, infraestructura", borderClass: "border-red-500/20 hover:border-red-500/40", iconClass: "text-red-400" },
              { icon: Clock, title: "SLA: máximo 2 horas en incidencias críticas", borderClass: "border-green-500/20 hover:border-green-500/40", iconClass: "text-green-400" },
              { icon: Shield, title: "Garantía de funcionamiento post-entrega", borderClass: "border-blue-500/20 hover:border-blue-500/40", iconClass: "text-blue-400" },
              { icon: ArrowRight, title: "Acompañamiento en adopción — no te dejamos solo", borderClass: "border-purple-500/20 hover:border-purple-500/40", iconClass: "text-purple-400" },
            ].map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <div key={i} className={`p-6 bg-slate-900/50 border rounded-lg transition ${benefit.borderClass}`}>
                  <Icon className={`w-8 h-8 mb-3 ${benefit.iconClass}`} />
                  <p className="text-slate-300 font-semibold text-sm">{benefit.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE DE IMPLEMENTACIÓN ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat fases-implementacion.txt</span>
              </div>

              <h2 className="text-3xl font-bold text-white">Cronograma de Implementación</h2>
              <p className="text-slate-400">Proyecto en 6 fases. Cada una entrega valor operativo real. <span className="text-green-400 font-semibold">~22 semanas de desarrollo</span></p>

              <div className="space-y-6">
                {[
                  { num: 0, title: "Arquitectura e Ingeniería Operativa", weeks: "2 sem", colorClass: "bg-slate-500/10 border-slate-500", badgeClass: "bg-slate-500/10 border-slate-500/30 text-slate-400", items: ["Infraestructura en Supabase", "Modelo de datos completo", "Levantamiento AS-IS del cliente"] },
                  { num: 1, title: "Core Operativo (MVP)", weeks: "6 sem", colorClass: "bg-green-500/10 border-green-500", badgeClass: "bg-green-500/10 border-green-500/30 text-green-400", items: ["Órdenes de servicio", "Almacenes y herramientas", "Dashboard operativo", "Primer piloto en sucursal"] },
                  { num: 2, title: "Logística y Flotillas", weeks: "4 sem", colorClass: "bg-blue-500/10 border-blue-500", badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-400", items: ["Control de flotilla", "Gestión de activos", "Integración con Fase 1"] },
                  { num: 3, title: "Control de Costos y RH", weeks: "4 sem", colorClass: "bg-orange-500/10 border-orange-500", badgeClass: "bg-orange-500/10 border-orange-500/30 text-orange-400", items: ["Costeo por orden", "Exportación CONTPAQi", "Módulo de RRHH"] },
                  { num: 4, title: "Dirección y Estrategia", weeks: "3 sem", colorClass: "bg-purple-500/10 border-purple-500", badgeClass: "bg-purple-500/10 border-purple-500/30 text-purple-400", items: ["Proyectos administrativos", "Dashboards ejecutivos", "KPIs y reportes"] },
                  { num: 5, title: "App Móvil / Campo (PWA)", weeks: "3 sem", colorClass: "bg-cyan-500/10 border-cyan-500", badgeClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", items: ["PWA responsive", "Órdenes en campo", "Sincronización offline"] },
                ].map((phase) => {
                  const circleColorMap: Record<number, string> = { 0: "bg-slate-500", 1: "bg-green-500", 2: "bg-blue-500", 3: "bg-orange-500", 4: "bg-purple-500", 5: "bg-cyan-500" }
                  const itemColorMap: Record<number, string> = { 0: "text-slate-400", 1: "text-green-400", 2: "text-blue-400", 3: "text-orange-400", 4: "text-purple-400", 5: "text-cyan-400" }
                  return (
                    <div key={phase.num} className="relative pl-8 border-l-2 border-slate-800/50 pb-6">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${circleColorMap[phase.num]} border-2 border-[#0c0c0c]`} />
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className={`px-3 py-1 ${phase.badgeClass} rounded-full text-[10px] font-mono font-bold`}>
                          Fase {phase.num}
                        </div>
                        <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                        <span className="text-slate-500 text-sm">({phase.weeks})</span>
                      </div>
                      <ul className="space-y-1 text-sm text-slate-400 ml-4">
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${itemColorMap[phase.num]} mt-0.5 flex-shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg mt-6">
                <p className="text-sm text-slate-400">
                  <span className="text-cyan-400 font-semibold">✓ Fases cerradas:</span> Cada fase tiene alcance definido y no obliga a ejecutar la siguiente. 
                  Tu equipo valida en campo antes de avanzar.
                </p>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ OPCIONES DE INVERSIÓN ═══ */}
      <section id="inversion" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Opciones de Inversión</h2>
            <p className="text-slate-400 text-lg">Elige según tu estrategia y presupuesto</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Opción A */}
            <TerminalFrame borderColor="blue">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-xl">A</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">MVP Rápido</h3>
                    <p className="text-orange-400 font-mono text-sm">Fases 0 + 1 (11 semanas)</p>
                  </div>
                </div>

                <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-lg text-center">
                  <div className="text-sm text-slate-500 font-mono mb-2">Inversión total</div>
                  <div className="text-5xl font-bold text-orange-400 mb-1">{fmt(429000)}</div>
                  <div className="text-xs text-slate-500">MXN (neto)</div>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-white text-sm">Control desde el día 1:</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      Órdenes de servicio operativas
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      Almacenes multi-sucursal
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      Herramientas con resguardo
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      Infraestructura completa
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 font-mono mb-3">Plan de pagos — 11 semanas</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded text-center">
                      <div className="text-[10px] text-slate-500">Enganche</div>
                      <div className="text-lg font-bold text-orange-400">{fmt(107250)}</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded text-center">
                      <div className="text-[10px] text-slate-500">10 pagos</div>
                      <div className="text-lg font-bold text-orange-400">{fmt(32175)}/sem</div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                  <p className="text-xs text-orange-400/80 mb-2">Después de Fase 1 decides si continúas con Fases 2-5.</p>
                  <p className="text-xs text-orange-400/60">Sin obligación de continuar.</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">✓ Opción de apartado 10% del enganche</p>
                  <div className="text-sm font-bold text-orange-400 mb-1">{fmt(10725)} apartado</div>
                  <p className="text-xs text-slate-500">Para respetar precio del dólar al momento de firma</p>
                </div>
              </div>
            </TerminalFrame>

            {/* Opción B */}
            <TerminalFrame borderColor="green">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-500 font-bold text-xl">B</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Sistema Completo</h3>
                    <p className="text-green-400 font-mono text-sm">Proyecto integro (52 semanas pago)</p>
                  </div>
                </div>

                <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-lg text-center">
                  <div className="text-sm text-slate-500 font-mono mb-2">Precio de lista</div>
                  <div className="text-4xl font-bold text-slate-500 line-through mb-3">{fmt(1138200)}</div>
                  
                  <div className="text-sm text-slate-500 font-mono mb-2">Con 17% descuento (pago 52 semanas)</div>
                  <div className="text-5xl font-bold text-green-400 mb-1">{fmt(944706)}</div>
                  <div className="text-xs text-slate-500">MXN (neto)</div>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-white text-sm">Sistema operativo 360°:</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Control de flotillas y costos
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      RH, nómina y expedientes digitales
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      PWA para instaladores en campo
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Dashboard BI para dirección
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 font-mono mb-3">Plan de pagos — 52 semanas</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded text-center">
                      <div className="text-[10px] text-slate-500">Enganche</div>
                      <div className="text-lg font-bold text-green-400">{fmt(120000)}</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded text-center">
                      <div className="text-[10px] text-slate-500">51 pagos</div>
                      <div className="text-lg font-bold text-green-400">{fmt(16171)}/sem</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                  <p className="text-xs text-green-400/80 mb-1">✓ Máxima flexibilidad financiera</p>
                  <p className="text-xs text-green-400/60">Desarrollo en 29 semanas, pagos en 52 semanas</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">✓ Opción de apartado 10% del enganche</p>
                  <div className="text-sm font-bold text-green-400 mb-1">{fmt(12000)} apartado</div>
                  <p className="text-xs text-slate-500">Para respetar precio del dólar al momento de firma</p>
                </div>
              </div>
            </TerminalFrame>
          </div>

          <div className="mt-12 p-6 bg-slate-900/50 border border-slate-800 rounded-lg space-y-4">
            <h3 className="font-semibold text-white">Notas importantes</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-slate-600">•</span>
                <span><span className="text-white font-semibold">Opción A</span>: Fases 0 + 1 (MVP). Control operativo inmediato. {fmt(429000)} en 11 semanas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600">•</span>
                <span><span className="text-white font-semibold">Opción B</span>: Todas las fases (0-5). Sistema 360°. 17% de descuento por pago en 52 semanas. {fmt(944706)} total.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600">•</span>
                <span>Hosting y mantenimiento post-lanzamiento: <span className="text-white font-semibold">$1,500 - $3,000 MXN/mes</span> (responsabilidad del cliente, pago directo a proveedor)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600">•</span>
                <span>En Opción A, después de Fase 1 decides si continúas con Fases 2-5. <span className="text-green-400">Sin obligación</span>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600">•</span>
                <span>Toda ampliación de alcance entra como <span className="text-white font-semibold">Acta de Cambio</span>. Scope duro por fase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600">•</span>
                <span>Cada fase requiere pago previo al inicio. <span className="text-white font-semibold">No se inician trabajos sin confirmación de pago.</span></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ INCLUYE / NO INCLUYE ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <TerminalFrame borderColor="green">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-xl font-bold">Qué SÍ incluye</span>
                </div>

                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Desarrollo completo de todas las fases contratadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Despliegue y puesta en producción</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Capacitación integral a tu equipo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Piloto operativo en una sucursal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Soporte crítico durante implementación</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Equipo dedicado de 5 developers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Acompañamiento post-entrega (2 meses)</span>
                  </li>
                </ul>
              </div>
            </TerminalFrame>

            <TerminalFrame borderColor="red">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-400 font-mono mb-6">
                  <X className="w-6 h-6" />
                  <span className="text-xl font-bold">Qué NO incluye</span>
                </div>

                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 opacity-50" />
                    <span>Hosting y mantenimiento post-lanzamiento (cliente lo gestiona)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 opacity-50" />
                    <span>Módulos de contabilidad completa (CONTPAQi es responsable)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 opacity-50" />
                    <span>Cambios de alcance sin Acta de Cambio formal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 opacity-50" />
                    <span>Migración de datos históricos de sistemas antigos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 opacity-50" />
                    <span>Integraciones con sistemas de terceros (fuera del MVP)</span>
                  </li>
                </ul>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame className="border-cyan-500/30">
            <div className="text-center space-y-8 py-8">
              <div className="flex items-center justify-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">root@netlab:~/redes-opticas#</span>
                <span className="text-lg">siguiente-paso</span>
                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">¿Empezamos con la Fase 0?</h2>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                El siguiente paso es revisar esta propuesta, aclarar dudas y firmar el Scope Charter. 
                Después arrancamos con la arquitectura.
              </p>

              <div className="pt-6 space-y-4">
                <a
                  href="https://wa.me/523333521742?text=Hola%2C%20me%20interesa%20la%20propuesta%20ERP%20Frabe%20para%20Redes%20Ópticas.%20Quiero%20agendar%20una%20reunión."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm text-lg w-full md:w-auto"
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  <span>Agendar reunión por WhatsApp</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>

                <p className="text-sm text-slate-500 font-mono">O escríbenos directamente: <span className="text-slate-400 font-semibold">contacto@netlab.mx</span></p>

                <div className="pt-4 text-[10px] text-slate-600 uppercase tracking-widest">
                  Propuesta válida hasta: 30 de abril de 2026
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
