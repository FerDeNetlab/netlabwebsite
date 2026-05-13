"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  X,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  AlertCircle,
  Clock,
  Shield,
  BarChart3,
  Layers,
  RefreshCw,
  Target,
  BookOpen,
  Headphones,
  Lock,
  CalendarDays,
  PhoneCall,
  Wrench,
  TrendingUp,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

export default function DABSClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fmt = (n: number) => `$${n.toLocaleString("es-MX")}`

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
                  <span className="text-green-500 font-bold">netlab@grupo-dabs:~$</span>
                  <span className="text-slate-100">generar-propuesta</span>
                  <span className="text-amber-400">--odoo-ce</span>
                  <span className="text-amber-400">--starter</span>
                  <span className="text-amber-400">--dabs</span>
                  <span className="w-2.5 h-5 bg-amber-400 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="text-xl md:text-2xl text-slate-500">netlab.mx</span>
                    <span className="text-xl md:text-2xl text-slate-500">×</span>
                    <div className="text-xl md:text-2xl font-bold text-amber-400 tracking-wider">GRUPO DABS</div>
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Esta vez el sistema{" "}
                    <span className="text-amber-400">sí va a funcionar</span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Odoo Community Edition para tu distribuidora de partes diesel: inventario en tiempo real,
                    compras controladas, ventas trazadas y facturación electrónica — con el{" "}
                    <span className="text-amber-400">proceso diseñado antes de configurar</span>, para que tu equipo
                    lo adopte desde el primer día.
                  </motion.p>

                  <motion.div
                    className="pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <div className="inline-block px-4 py-2 bg-slate-900 border border-amber-500/30 text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                      Propuesta Comercial · Silvia Muñoz · Mayo 2026
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Analizando historial de implementaciones anteriores... [OK]</p>
                    <p>{">"} Identificando causa raíz del problema... [OK]</p>
                    <p>{">"} Diseñando solución con adopción garantizada... [READY]</p>
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
                <span className="text-lg">cat grupo-dabs-perfil.txt</span>
              </div>

              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  Grupo DABS es una distribuidora de partes para vehículos diesel — frenos, suspensión y motor — con un equipo de ~10 personas
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <h3 className="font-semibold text-red-400 text-lg">El Ciclo Que Se Repite</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        Implementan herramienta nueva
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        El equipo la resiste o no la adopta
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        Regresan a Excel, papel o WhatsApp
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        Sin visibilidad de inventario real
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        Compras sin control ni trazabilidad
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">✕</span>
                        Facturación manual, lenta y propensa a errores
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-amber-400" />
                      <h3 className="font-semibold text-amber-400 text-lg">La Causa Real</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      No es la herramienta. Es que ningún sistema funciona si los{" "}
                      <span className="text-white font-semibold">procesos no están definidos</span> antes de configurarlo.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">→</span>
                        El equipo no sabe cómo debería funcionar
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">→</span>
                        El sistema no refleja la realidad de la operación
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">→</span>
                        La capacitación es en sala, no en el trabajo real
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-amber-500 rounded">
                  <p className="text-slate-300">
                    <span className="text-amber-400 font-semibold">Lo que Netlab resuelve:</span> Primero diseñamos
                    cómo debe operar Grupo DABS — flujos reales de compra, inventario, ventas y facturación. Después
                    configuramos Odoo para que refleje exactamente esa realidad. El equipo aprende en su propio sistema,
                    no en una demo.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ POR QUÉ ODOO CE ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">¿Por qué Odoo Community Edition?</h2>
            <p className="text-slate-400 text-lg">Software libre, profesional y de por vida</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 border border-amber-500/20 rounded-lg text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">$0 en licencias</h3>
              <p className="text-sm text-slate-400">
                Odoo Community Edition es software libre. Sin pagos mensuales, sin renovaciones anuales.
                Son dueños del sistema <span className="text-amber-400">de por vida</span>.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-amber-500/20 rounded-lg text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Sistema probado globalmente</h3>
              <p className="text-sm text-slate-400">
                Usado por millones de empresas en el mundo. Inventario, compras, ventas y facturación
                electrónica en una sola plataforma.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-amber-500/20 rounded-lg text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Crece con ustedes</h3>
              <p className="text-sm text-slate-400">
                Cuando el sistema base esté estable, pueden expandir a ecommerce, Mercado Libre y más —
                sobre la misma plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MÓDULOS INCLUIDOS ═══ */}
      <section id="propuesta" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Netlab OS Starter — Lo que incluye</h2>
            <p className="text-slate-400 text-lg">8 módulos operativos + diseño de procesos + capacitación + soporte</p>
          </div>

          <div className="space-y-6">

            {/* Módulo 1 - Inventario */}
            <TerminalFrame>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">Módulo 1</div>
                    <h3 className="text-xl font-bold text-white">Inventario</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:pl-16">
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />Catálogo de productos (SKUs) con categorías</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />Recepciones de mercancía documentadas</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />Ajustes de inventario</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />Consulta de stock en tiempo real</li>
                  </ul>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded">
                    <p className="text-sm text-slate-300">
                      <span className="text-amber-400 font-semibold">Resultado:</span> Siempre sabrás exactamente qué piezas tienes, cuántas y dónde — sin conteo manual.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Módulo 2 - Compras */}
            <TerminalFrame>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">Módulo 2</div>
                    <h3 className="text-xl font-bold text-white">Compras</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:pl-16">
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />Órdenes de compra a proveedores</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />Recepción de mercancía contra OC</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />Historial de compras por proveedor</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />Control de costos de adquisición</li>
                  </ul>
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                    <p className="text-sm text-slate-300">
                      <span className="text-blue-400 font-semibold">Resultado:</span> Cada compra queda documentada y vinculada al inventario — sin discrepancias entre lo que llegó y lo que se esperaba.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Módulo 3 - Ventas */}
            <TerminalFrame>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">Módulo 3</div>
                    <h3 className="text-xl font-bold text-white">Ventas</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:pl-16">
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />Cotizaciones profesionales</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />Órdenes de venta trazadas</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />Registro de entregas</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />Listas de precio por segmento de cliente</li>
                  </ul>
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded">
                    <p className="text-sm text-slate-300">
                      <span className="text-green-400 font-semibold">Resultado:</span> De la cotización a la entrega en un solo flujo. Sabrás qué vendiste, a quién, a qué precio y si ya se entregó.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Módulo 4 - Facturación */}
            <TerminalFrame>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-0.5">Módulo 4</div>
                    <h3 className="text-xl font-bold text-white">Facturación Electrónica CFDI 4.0</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:pl-16">
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Timbrado CFDI 4.0 integrado con PAC</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Emisión directa desde la orden de venta</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Envío automático al cliente por correo</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />Historial de facturas emitidas</li>
                  </ul>
                  <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded">
                    <p className="text-sm text-slate-300">
                      <span className="text-purple-400 font-semibold">Resultado:</span> Facturas en segundos, sin procesos paralelos. La venta genera la factura — sin doble captura.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Módulos 5-8 en grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <TerminalFrame>
                <div className="space-y-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Módulo 5</div>
                      <h3 className="text-base font-bold text-white">Catálogo Clientes y Proveedores</h3>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />Base maestra de contactos unificada</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />Listas de precio por segmento o cliente</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />Historial de compras y ventas por contacto</li>
                  </ul>
                </div>
              </TerminalFrame>

              <TerminalFrame>
                <div className="space-y-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Módulo 6</div>
                      <h3 className="text-base font-bold text-white">Usuarios y Permisos por Rol</h3>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />Cada persona accede solo a lo que le corresponde</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />Roles por área: almacén, ventas, administración</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />Trazabilidad de quién hizo qué</li>
                  </ul>
                </div>
              </TerminalFrame>

              <TerminalFrame>
                <div className="space-y-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Módulo 7</div>
                      <h3 className="text-base font-bold text-white">CRM Básico</h3>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />Seguimiento de oportunidades de venta</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />Pipeline de ventas visible en tiempo real</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />Vinculado directamente a cotizaciones</li>
                  </ul>
                </div>
              </TerminalFrame>

              <TerminalFrame>
                <div className="space-y-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Módulo 8</div>
                      <h3 className="text-base font-bold text-white">Reportes Estándar</h3>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />Ventas por período, cliente y producto</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />Inventario y movimientos de stock</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />Compras por período y proveedor</li>
                  </ul>
                </div>
              </TerminalFrame>
            </div>

            {/* Servicios incluidos */}
            <div className="grid md:grid-cols-3 gap-6">
              <TerminalFrame>
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto">
                    <Wrench className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white">Diseño de Procesos</h3>
                  <p className="text-xs text-slate-400">Mapeamos tus flujos operativos por área <span className="text-amber-400">antes de configurar</span>. No al revés.</p>
                  <div className="text-[10px] text-amber-400/60 font-mono uppercase tracking-widest border border-amber-500/20 rounded px-2 py-1">Diferenciador Netlab</div>
                </div>
              </TerminalFrame>

              <TerminalFrame>
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white">Capacitación en Piso</h3>
                  <p className="text-xs text-slate-400">Tu equipo aprende en el sistema real, por rol, <span className="text-amber-400">haciendo su trabajo</span> — no en sala con demos.</p>
                  <div className="text-[10px] text-amber-400/60 font-mono uppercase tracking-widest border border-amber-500/20 rounded px-2 py-1">Adopción garantizada</div>
                </div>
              </TerminalFrame>

              <TerminalFrame>
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto">
                    <Headphones className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white">Soporte 60 Días</h3>
                  <p className="text-xs text-slate-400">Acompañamiento operativo post Go Live. <span className="text-amber-400">60 días naturales</span> para que el sistema se estabilice.</p>
                  <div className="text-[10px] text-amber-400/60 font-mono uppercase tracking-widest border border-amber-500/20 rounded px-2 py-1">Post Go Live</div>
                </div>
              </TerminalFrame>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CÓMO TRABAJAMOS ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat metodologia.txt</span>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Cómo Trabajamos</h2>
                <p className="text-slate-400 mb-10">El proceso que rompe el ciclo de implementaciones fallidas</p>

                <div className="space-y-4">
                  {[
                    {
                      num: "01",
                      title: "Kick Off",
                      desc: "Presentación formal del equipo, cronograma y primeros pasos. Tu único punto de contacto es Silvia.",
                      duration: "1 sesión",
                      color: "amber",
                    },
                    {
                      num: "02",
                      title: "Diseño de Procesos",
                      desc: "Mapeamos tus flujos operativos reales — compras, almacén, ventas y facturación — con tu equipo. Esto define cómo se va a configurar Odoo.",
                      duration: "1 semana",
                      color: "amber",
                    },
                    {
                      num: "03",
                      title: "Setup Técnico",
                      desc: "Servidor, empresa base en Odoo, usuarios iniciales y PAC para facturación. Netlab define el spec, Grupo DABS contrata.",
                      duration: "1 semana",
                      color: "amber",
                    },
                    {
                      num: "04",
                      title: "Implementación por Sprints",
                      desc: "Configuramos módulo por módulo: inventario → compras → ventas → facturación → CRM. Cada sprint termina con revisión y validación tuya antes de avanzar.",
                      duration: "4–5 semanas",
                      color: "amber",
                    },
                    {
                      num: "05",
                      title: "Revisión y Validación",
                      desc: "Presentamos el sistema completo. Validas que todo funciona exactamente como lo diseñamos en los procesos.",
                      duration: "1 semana",
                      color: "amber",
                    },
                    {
                      num: "06",
                      title: "Capacitación en Piso por Rol",
                      desc: "Cada persona aprende a usar la parte del sistema que le corresponde, en el sistema real, haciendo su trabajo. No en sala.",
                      duration: "1 semana",
                      color: "amber",
                    },
                    {
                      num: "07",
                      title: "Go Live",
                      desc: "Arranque oficial de operaciones en Odoo. Grupo DABS opera en producción desde este día.",
                      duration: "1 sesión",
                      color: "green",
                    },
                    {
                      num: "08",
                      title: "Soporte Post-Lanzamiento",
                      desc: "60 días de acompañamiento ante dudas, ajustes y estabilización. WhatsApp + videollamadas con el PM de Netlab.",
                      duration: "60 días",
                      color: "green",
                    },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-amber-500/20 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm font-mono ${
                        step.color === "green"
                          ? "bg-green-500 text-black"
                          : "bg-amber-400 text-black"
                      }`}>
                        {step.num}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <h4 className="font-semibold text-white">{step.title}</h4>
                          <span className="text-[10px] font-mono text-slate-500 border border-slate-700 rounded px-2 py-0.5">{step.duration}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-center gap-4">
                  <Clock className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-amber-400 font-semibold">Duración total estimada: ~10 semanas hasta Go Live</h4>
                    <p className="text-sm text-slate-400 mt-0.5">Las fechas exactas se definen en el Kick Off. Comunicación por WhatsApp + videollamadas de seguimiento por sprint.</p>
                  </div>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ EXCLUSIONES ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat exclusiones.txt</span>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Lo que NO está incluido</h2>
                <p className="text-slate-400 mb-8">Scope cerrado desde el inicio. Cualquier cambio genera un Acta de Control de Cambios firmada antes de ejecutarse.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { item: "Ecommerce / tienda en línea", reason: "Fase 2 — cuando el sistema base esté estabilizado" },
                    { item: "Integración con Mercado Libre", reason: "Fase 2 — propuesta independiente" },
                    { item: "Contabilidad avanzada", reason: "Fuera del paquete Starter" },
                    { item: "Desarrollo a la medida", reason: "Fuera del paquete Starter" },
                    { item: "Portal de clientes", reason: "Fuera del paquete Starter" },
                    { item: "Hosting del servidor", reason: `Costo a cargo de Grupo DABS (~${fmt(400)}–${fmt(1200)} MXN/mes). Netlab define el spec técnico.` },
                  ].map((excl) => (
                    <div key={excl.item} className="flex items-start gap-3 p-4 bg-slate-900/30 border border-slate-800 rounded">
                      <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-semibold text-slate-300">{excl.item}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{excl.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-900/50 border-l-4 border-slate-600 rounded text-sm text-slate-400">
                  <span className="text-white font-semibold">Nota: </span>Las exclusiones de Fase 2 (ecommerce, Mercado Libre) son el siguiente paso natural una vez que el sistema base lleve al menos 2–3 meses operando de forma estable.
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ INVERSIÓN ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Inversión</h2>
            <p className="text-slate-400 text-lg">Un solo pago estructurado en 2 hitos. Sin licencias mensuales, sin sorpresas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Card principal */}
            <div className="md:col-span-2 p-8 bg-gradient-to-br from-amber-500/10 to-slate-900 border-2 border-amber-500/40 rounded-xl">
              <div className="text-center mb-8">
                <div className="text-sm text-slate-500 font-mono mb-2">Inversión total del proyecto</div>
                <div className="text-5xl font-bold text-amber-400">{fmt(60000)}</div>
                <div className="text-slate-500 text-sm mt-1">MXN · sin IVA</div>
                <div className="text-2xl font-bold text-slate-300 mt-2">{fmt(69600)} <span className="text-base text-slate-500">MXN con IVA</span></div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/80 border border-amber-500/30 rounded-lg">
                  <div className="text-[10px] text-amber-400 font-mono uppercase tracking-widest mb-3">Pago 1 · A la aceptación</div>
                  <div className="text-3xl font-bold text-white">{fmt(40000)}</div>
                  <div className="text-slate-500 text-xs mt-0.5">MXN sin IVA · {fmt(46400)} con IVA</div>
                  <p className="text-xs text-slate-400 mt-3">Al confirmar la propuesta y firmar el acuerdo. Libera el inicio del proyecto.</p>
                </div>
                <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">Pago 2 · Al mes del Kick Off</div>
                  <div className="text-3xl font-bold text-white">{fmt(20000)}</div>
                  <div className="text-slate-500 text-xs mt-0.5">MXN sin IVA · {fmt(23200)} con IVA</div>
                  <p className="text-xs text-slate-400 mt-3">Un mes después del Kick Off, mientras el proyecto avanza en sprints.</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {[
                  "Diseño de procesos incluido",
                  "Capacitación en piso por rol incluida",
                  "Soporte 60 días post Go Live incluido",
                  "Licencias Odoo Community — $0 MXN, gratuitas de por vida",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-slate-800/50 rounded text-xs text-slate-500 font-mono text-center">
                Precios sin IVA. Se agrega según régimen fiscal de Grupo DABS. · Vigencia: 15 días naturales
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SIGUIENTES PASOS ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat siguientes-pasos.txt</span>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Siguientes Pasos</h2>
                <p className="text-slate-400 mb-8">Del "sí" al arranque de operaciones en Odoo</p>

                <div className="space-y-3">
                  {[
                    { num: 1, text: "Silvia revisa y aprueba esta propuesta", detail: "Cualquier duda se resuelve antes de avanzar" },
                    { num: 2, text: "Confirmación formal de aceptación", detail: "Correo o WhatsApp a Fer" },
                    { num: 3, text: "Pago 1 — $40,000 MXN", detail: "Transferencia bancaria. Netlab emite factura." },
                    { num: 4, text: "Netlab agenda el Kick Off", detail: "Reunión formal de inicio con el equipo de Grupo DABS" },
                    { num: 5, text: "El proyecto inicia", detail: "De aquí al Go Live: ~10 semanas" },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded hover:border-amber-500/20 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
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

      {/* ═══ CTA ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame className="border-amber-500/30">
            <div className="text-center space-y-8 py-8">
              <div className="flex items-center justify-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">root@netlab:~/grupo-dabs#</span>
                <span className="text-lg">siguiente-paso</span>
                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">¿Empezamos?</h2>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Esta vez el sistema sí va a funcionar — porque primero diseñamos el proceso, después configuramos Odoo.
                El siguiente paso es confirmar la propuesta y agendar el Kick Off.
              </p>

              <div className="pt-6 space-y-4">
                <a
                  href="https://wa.me/523333521742?text=Hola%20Fer%2C%20soy%20Silvia%20de%20Grupo%20DABS.%20Revisé%20la%20propuesta%20y%20quiero%20avanzar.%20¿Podemos%20agendar%20una%20reunión%3F"
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
                  Propuesta válida hasta: 26 de mayo de 2026
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
