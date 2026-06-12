"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Bot,
  BarChart3,
  Layers,
  RefreshCw,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

const componentes = [
  {
    num: 1,
    title: "Chatbot IA Ejecutivo",
    icon: Bot,
    color: "text-blue-400",
    border: "border-blue-500",
    bg: "bg-blue-500/10",
    items: [
      "Conectado directamente a la API de Odoo Enterprise de Prodetecs.",
      "Motor de razonamiento: Claude Sonnet 4.7 (Anthropic).",
      "Responde preguntas de negocio en lenguaje natural sin filtros tecnicos.",
      "Contexto de empresa siempre activo — sabe de que area viene cada consulta.",
    ],
  },
  {
    num: 2,
    title: "Generative Components",
    icon: Layers,
    color: "text-purple-400",
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    items: [
      "Tablas dinamicas generadas automaticamente segun la consulta.",
      "Graficos ejecutivos (barras, lineas, pastel) renderizados al instante.",
      "Archivos exportables (Excel, CSV) listos para revision y presentacion.",
      "Respuestas estructuradas con formato visual, no solo texto plano.",
    ],
  },
  {
    num: 3,
    title: "Dashboards en Tiempo Real",
    icon: BarChart3,
    color: "text-cyan-400",
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    items: [
      "Dashboards generales conectados al Odoo Enterprise via API.",
      "Datos en vivo: ventas, inventario, compras, cuentas por cobrar.",
      "Vistas directivas configuradas para los KPIs que importan a Prodetecs.",
      "Sin exportaciones manuales, sin esperar reportes del equipo.",
    ],
  },
  {
    num: 4,
    title: "Evolucion Mensual",
    icon: RefreshCw,
    color: "text-green-400",
    border: "border-green-500",
    bg: "bg-green-500/10",
    items: [
      "Ajustes mensuales de metricas, KPIs y visualizaciones.",
      "Nuevas preguntas de negocio integradas al chatbot cada ciclo.",
      "Optimizacion continua de respuestas y componentes generativos.",
      "El sistema mejora conforme Prodetecs lo usa y pide nuevas vistas.",
    ],
  },
]

export default function ProdetecsIAClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fmt = (n: number) => `$${n.toLocaleString("es-MX")}`

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-10 pb-20 md:pt-16 overflow-hidden">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
              <div className="font-mono space-y-8">
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                  <span className="text-green-500 font-bold">netlab@prodetecs:~$</span>
                  <span className="text-slate-100">generar-propuesta</span>
                  <span className="text-blue-400">--ia-analytics</span>
                  <span className="text-blue-400">--odoo-enterprise</span>
                  <span className="text-blue-400">--claude-sonnet</span>
                  <span className="w-2.5 h-5 bg-blue-400 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="text-xl md:text-2xl text-slate-500">netlab.mx</span>
                    <span className="text-xl md:text-2xl text-slate-500">x</span>
                    <div className="text-xl md:text-2xl font-bold text-blue-400 tracking-wider">PRODETECS</div>
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Odoo Enterprise tiene los datos.
                    <br />
                    <span className="text-blue-400">Ya es hora de que Direccion pueda leerlos.</span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Netlab construyo una capa de inteligencia artificial sobre el Odoo Enterprise de Prodetecs:{" "}
                    <span className="text-blue-400">chatbot ejecutivo, dashboards en tiempo real y componentes generativos</span>{" "}
                    que convierten preguntas de negocio en tablas, graficos y archivos al instante.
                  </motion.p>

                  <motion.div
                    className="pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <div className="inline-block px-4 py-2 bg-slate-900 border border-blue-500/30 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                      Propuesta Comercial · Prodetecs · Junio 2026 · v1.0
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Conectando con API Odoo Enterprise de Prodetecs... [OK]</p>
                    <p>{">"} Inicializando motor Claude Sonnet 4.7 (Anthropic)... [OK]</p>
                    <p>{">"} Plataforma IA Analytics + dashboards en tiempo real... [READY]</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      {/* CONTEXTO */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat prodetecs-situacion.txt</span>
              </div>
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  Prodetecs opera con Odoo Enterprise. El problema es que Odoo no esta entregando los dashboards y las metricas que Direccion necesita para tomar decisiones en tiempo real.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <h3 className="font-semibold text-red-400 text-lg">Lo que no esta funcionando</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {[
                        "Los reportes nativos de Odoo no responden las preguntas reales de Direccion.",
                        "Obtener una metrica especifica requiere tiempo, exportaciones y trabajo manual.",
                        "No hay una vista ejecutiva consolidada de la operacion en tiempo real.",
                        "Los dashboards disponibles son genericos, no adaptados al negocio de Prodetecs.",
                      ].map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="text-red-500 font-bold mt-0.5">x</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-blue-400" />
                      <h3 className="font-semibold text-blue-400 text-lg">Lo que Netlab resuelve</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {[
                        "Direccion pregunta en lenguaje natural, la IA responde con datos reales de Odoo.",
                        "Graficos, tablas y archivos generados al instante sin involucrar al equipo tecnico.",
                        "Dashboards configurados para los KPIs que importan a Prodetecs.",
                        "Evolucion mensual: el sistema mejora conforme se usa y se piden nuevas vistas.",
                      ].map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold mt-0.5">→</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-blue-500 rounded">
                  <p className="text-slate-300">
                    <span className="text-blue-400 font-semibold">El punto central:</span> Prodetecs ya hizo la inversion en Odoo Enterprise.
                    El dato esta ahi. Lo que falta es la capa inteligente que lo convierte en visibilidad real para quien toma decisiones.
                    Eso es exactamente lo que Netlab entrega.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* QUE INCLUYE */}
      <section id="plataforma" className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Prodetecs IA Analytics Layer</h2>
            <p className="text-slate-400 text-base md:text-lg">4 componentes clave + tokens incluidos + evolucion mensual</p>
          </div>
          <div className="space-y-6">
            {componentes.map((comp) => {
              const Icon = comp.icon
              return (
                <TerminalFrame key={comp.num}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${comp.bg} border-2 ${comp.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${comp.color}`} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">Componente {comp.num}</div>
                        <h3 className="text-xl font-bold text-white">{comp.title}</h3>
                      </div>
                    </div>
                    <div className="md:pl-16">
                      <ul className="space-y-2 text-sm text-slate-400">
                        {comp.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${comp.color} mt-0.5 flex-shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TerminalFrame>
              )
            })}
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/50 border border-blue-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-blue-400 mb-3" />
              <h4 className="text-white font-semibold mb-1">Tokens de IA incluidos</h4>
              <p className="text-xs text-slate-400">El consumo mensual de Claude Sonnet 4.7 esta cubierto dentro del servicio. Sin costos ocultos por uso.</p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-blue-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-blue-400 mb-3" />
              <h4 className="text-white font-semibold mb-1">Datos en tu Odoo, no fuera</h4>
              <p className="text-xs text-slate-400">La IA consulta tu Odoo Enterprise via API. Los datos de Prodetecs no salen de tu entorno.</p>
            </div>
            <div className="p-5 bg-slate-900/50 border border-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400 mb-3" />
              <h4 className="text-white font-semibold mb-1">Mejora cada mes</h4>
              <p className="text-xs text-slate-400">No es un producto estatico. Cada mes se ajusta a las nuevas preguntas y necesidades de analisis de Prodetecs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INVERSION */}
      <section id="precios" className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Inversion</h2>
            <p className="text-slate-400 text-base md:text-lg">Servicio mensual recurrente. Tokens incluidos. Sin sorpresas.</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-8 bg-gradient-to-br from-blue-500/10 to-slate-900 border-2 border-blue-500/40 rounded-xl">
              <div className="text-[10px] text-blue-400 font-mono uppercase tracking-widest mb-4">Prodetecs IA Analytics Layer — Mensual Recurrente</div>
              <div className="text-center mb-8">
                <div className="text-sm text-slate-500 font-mono mb-2">Inversion mensual</div>
                <div className="text-5xl font-bold text-blue-400">{fmt(3700)}</div>
                <div className="text-slate-500 text-sm mt-1">MXN sin IVA</div>
                <div className="text-2xl font-bold text-slate-300 mt-2">{fmt(4292)} <span className="text-base text-slate-500">MXN con IVA</span></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/80 border border-blue-500/30 rounded-lg">
                  <div className="text-[10px] text-blue-400 font-mono uppercase tracking-widest mb-3">Incluye</div>
                  <ul className="space-y-2">
                    {[
                      "Plataforma inicial entregada y operativa",
                      "Chatbot IA con Claude Sonnet 4.7",
                      "Dashboards conectados a Odoo Enterprise",
                      "Generative components (tablas, graficos, archivos)",
                      "Tokens de IA incluidos en el servicio",
                      "Ajustes y evolucion mensual de analisis",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">No incluye</div>
                  <ul className="space-y-2">
                    {[
                      "Licencias Odoo Enterprise (ya contratadas por Prodetecs)",
                      "Modificaciones al core de Odoo fuera de la capa IA",
                      "Desarrollos fuera del alcance de analitica",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="text-slate-600 font-bold mt-0.5 flex-shrink-0">-</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-3 bg-slate-800/50 rounded text-xs text-slate-500 font-mono text-center">
                Precios sin IVA. IVA 16% segun regimen fiscal de Prodetecs. Facturacion mensual anticipada. Vigencia: 27 de junio de 2026
              </div>
            </div>
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-4">Anexo A · Cotizacion formal</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-500 font-mono pb-2 font-normal">Concepto</th>
                    <th className="text-right text-slate-500 font-mono pb-2 font-normal">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-3 text-slate-300">Prodetecs IA Analytics Layer (mensual)</td>
                    <td className="py-3 text-right text-slate-300">{fmt(3700)} MXN</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-3 text-slate-400">IVA 16%</td>
                    <td className="py-3 text-right text-slate-400">{fmt(592)} MXN</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-white font-semibold">Total mensual</td>
                    <td className="py-3 text-right text-blue-400 font-bold">{fmt(4292)} MXN</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SIGUIENTES PASOS */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat siguientes-pasos.txt</span>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2">Siguientes Pasos</h2>
                <p className="text-slate-400 mb-8">Del si a Direccion con datos en tiempo real</p>
                <div className="space-y-3">
                  {[
                    { num: 1, text: "Prodetecs revisa y aprueba esta propuesta", detail: "Cualquier duda se resuelve antes de avanzar." },
                    { num: 2, text: "Confirmacion formal de aceptacion", detail: "Correo o WhatsApp a Fer." },
                    { num: 3, text: "Primera factura mensual", detail: "Netlab emite factura. Pago anticipado mensual." },
                    { num: 4, text: "Kick Off tecnico", detail: "Revisamos el entorno de Odoo Enterprise y definimos los primeros KPIs y dashboards." },
                    { num: 5, text: "Plataforma inicial activa", detail: "Chatbot IA + dashboards operativos conectados al Odoo Enterprise de Prodetecs." },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded hover:border-blue-500/20 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-400 text-black flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {step.num}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{step.text}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame className="border-blue-500/30">
            <div className="text-center space-y-6 md:space-y-8 py-6 md:py-8">
              <div className="flex items-center justify-center gap-2 md:gap-3 text-green-500 font-mono mb-6 flex-wrap text-xs md:text-lg">
                <span className="text-lg">root@netlab:~/prodetecs#</span>
                <span className="text-lg">siguiente-paso</span>
                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Empezamos?</h2>
              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
                Prodetecs ya tiene los datos en Odoo Enterprise. El siguiente paso es que Direccion
                pueda leerlos sin esperar reportes. Netlab lo tiene listo.
              </p>
              <div className="pt-6 space-y-4">
                <a
                  href="https://wa.me/523333521742?text=Hola%20Fer%2C%20soy%20de%20Prodetecs.%20Revise%20la%20propuesta%20de%20IA%20Analytics%20sobre%20Odoo%20Enterprise%20y%20quiero%20avanzar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-black transition-all duration-200 bg-blue-400 hover:bg-blue-300 rounded-sm text-lg w-full md:w-auto"
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  <span>Confirmar por WhatsApp</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
                <p className="text-sm text-slate-500 font-mono">O escribenos directo: <span className="text-slate-400 font-semibold">fer@netlab.mx</span></p>
                <div className="pt-4 text-[10px] text-slate-600 uppercase tracking-widest">
                  Propuesta valida hasta: 27 de junio de 2026
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
