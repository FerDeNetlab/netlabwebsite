"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  X,
  AlertCircle,
  Boxes,
  ShoppingCart,
  Package,
  Users,
  ReceiptText,
  Wallet,
  UserRound,
  PhoneCall,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

const modulos = [
  {
    num: 1,
    title: "Compras e Importaciones",
    icon: ShoppingCart,
    color: "text-cyan-400",
    items: [
      "OC formales a proveedores de China y trazabilidad de compra.",
      "Seguimiento de mercancia en transito con estatus visible.",
      "Documentacion de importacion centralizada por compra.",
      "Entrada de inventario vinculada a orden de compra.",
    ],
  },
  {
    num: 2,
    title: "Inventario y Almacen",
    icon: Package,
    color: "text-green-400",
    items: [
      "Almacen con ubicaciones digitalizadas por racks.",
      "Control de stock en tiempo real por SKU.",
      "Inventarios diarios por seccion y alertas de reabasto.",
      "Transferencias entre dos ubicaciones fisicas.",
    ],
  },
  {
    num: 3,
    title: "Ventas y Cotizaciones",
    icon: Boxes,
    color: "text-blue-400",
    items: [
      "Flujo cotizacion -> pedido -> surtido -> remision -> factura.",
      "Listas de precios por tipo de cliente.",
      "Control de credito con bloqueo automatico.",
      "Acceso movil para vendedores.",
    ],
  },
  {
    num: 4,
    title: "CRM",
    icon: Users,
    color: "text-purple-400",
    items: [
      "Pipeline comercial por etapa.",
      "Seguimiento de prospectos y oportunidades.",
      "Historial comercial por cliente.",
      "Segmentacion para accion comercial.",
    ],
  },
  {
    num: 5,
    title: "Facturacion CFDI 4.0",
    icon: ReceiptText,
    color: "text-orange-400",
    items: [
      "Facturacion integrada al flujo de ventas.",
      "Complementos de pago PPD/PUE.",
      "Notas de credito con trazabilidad.",
      "Operacion fiscal alineada al proceso comercial.",
    ],
  },
  {
    num: 6,
    title: "Cobranza y CxC",
    icon: Wallet,
    color: "text-yellow-400",
    items: [
      "Control de cartera por cliente.",
      "Seguimiento de vencidas con alertas.",
      "Estados de cuenta automaticos.",
      "Bloqueo de ventas a morosos por politica.",
    ],
  },
  {
    num: 7,
    title: "RH Estandar",
    icon: UserRound,
    color: "text-cyan-300",
    items: [
      "Expedientes de personal centralizados.",
      "Estructura organizacional y contratos.",
      "Gestion de vacaciones.",
      "Orden administrativo base del equipo.",
    ],
  },
]

const comparativa = [
  ["Ubicaciones por rack y trazabilidad", "yes", "partial", "yes", "yes"],
  ["Pipeline CRM integrado", "yes", "no", "yes", "yes"],
  ["Flujo completo cotizacion a factura", "yes", "partial", "yes", "yes"],
  ["Sin costo de licencia por usuario", "yes", "no", "no", "yes"],
  ["Tiempo de implementacion controlado", "yes", "yes", "mid", "no"],
  ["Soporte tecnico + asesoria TI", "yes", "limited", "limited", "variable"],
] as const

export default function IsumaClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      <section className="relative pt-10 pb-20 md:pt-16 overflow-hidden">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
              <div className="font-mono space-y-8">
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                  <span className="text-green-500 font-bold">netlab@isuma:~$</span>
                  <span className="text-slate-100">generar-propuesta</span>
                  <span className="text-cyan-400">--growth</span>
                  <span className="text-cyan-400">--odoo-ce</span>
                  <span className="text-cyan-400">--operacion</span>
                  <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="text-xl md:text-2xl text-slate-500">netlab.mx</span>
                    <span className="text-xl md:text-2xl text-slate-500">x</span>
                    <div className="text-xl md:text-2xl font-bold text-cyan-400 tracking-wider">ISUMA (SUNNY)</div>
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Sistema operativo central para una distribuidora que necesita <span className="text-cyan-400">control real</span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    Propuesta comercial para Comercializadora ISUMA S.A. de C.V. (Sunny): implementacion de Odoo Community
                    Edition con paquete Growth de Netlab Consulting.
                  </motion.p>

                  <motion.div
                    className="pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <div className="inline-block px-4 py-2 bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                      Propuesta Comercial · Growth v1.0
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Decisor: Ernesto (Direccion) [OK]</p>
                    <p>{">"} Contacto operativo: Oscar (Director de Operaciones) [OK]</p>
                    <p>{">"} Paquete seleccionado: Growth [READY]</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat isuma-operacion.txt</span>
              </div>

              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  ISUMA importa producto terminado de China, opera ~1,900 SKUs activos, 25 usuarios y 30-40 cotizaciones por dia
                </p>

                <p className="text-slate-400">
                  Hoy la operacion se soporta con ASPEL SAE + Excel + Google Sheets sin integracion total entre compras,
                  almacen, ventas, cobranza y direccion.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <h3 className="font-semibold text-red-400 text-lg">Problemas criticos declarados</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">x</span> No se conocen ubicaciones de mercancia en racks
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">x</span> No hay control 100% de inventarios para vender con certeza
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">x</span> No hay seguimiento a prospectos (oportunidades perdidas)
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                      <h3 className="font-semibold text-green-400 text-lg">Objetivo operativo</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">ok</span> Inventario confiable por ubicacion y SKU
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">ok</span> Venta con certeza por disponibilidad real
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">ok</span> Seguimiento comercial disciplinado en CRM
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-cyan-500 rounded">
                  <p className="text-slate-300">
                    <span className="text-cyan-400 font-semibold">Valor Netlab:</span> Growth combina implementacion + soporte
                    tecnico + asesoria TI para resolver la operacion, no solo para instalar un sistema.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Paquete Growth en 7 modulos</h2>
            <p className="text-slate-400 text-lg">Odoo Community como sistema operativo central para ISUMA</p>
          </div>

          <div className="space-y-6">
            {modulos.map((mod) => {
              const Icon = mod.icon
              return (
                <TerminalFrame key={mod.num} borderColor="green">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-400 font-bold text-xl">
                        {mod.num}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white">{mod.title}</h3>
                        <p className="text-green-400 font-mono text-sm">Modulo {mod.num}</p>
                      </div>
                      <Icon className={`w-7 h-7 ${mod.color}`} />
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {mod.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TerminalFrame>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat comparativa-plataformas.txt</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Comparativa de alternativas</h2>
                <p className="text-slate-400 text-lg">Evaluacion orientada a control operativo real</p>

                <div className="overflow-x-auto -mx-6 md:mx-0">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-800">
                        <th className="text-left p-3 font-bold text-white bg-slate-900/50 min-w-[250px]">Criterio</th>
                        <th className="text-center p-3 font-bold text-green-400 bg-green-500/5 min-w-[150px]">Odoo CE + Growth</th>
                        <th className="text-center p-3 font-bold text-slate-400 bg-slate-900/30 min-w-[140px]">ASPEL SAE + Excel</th>
                        <th className="text-center p-3 font-bold text-slate-400 bg-slate-900/30 min-w-[140px]">ERP cerrado</th>
                        <th className="text-center p-3 font-bold text-slate-400 bg-slate-900/30 min-w-[150px]">Desarrollo desde cero</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {comparativa.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-900/30 transition">
                          <td className="p-3 font-semibold text-slate-300 text-left">{row[0]}</td>
                          <td className="p-3 text-center text-green-400 font-bold bg-green-500/5">
                            {row[1] === "yes" ? "SI" : "-"}
                          </td>
                          <td className="p-3 text-center text-slate-400 bg-slate-900/20">{row[2] === "yes" ? "SI" : row[2] === "partial" ? "PARCIAL" : row[2] === "limited" ? "LIMITADO" : "NO"}</td>
                          <td className="p-3 text-center text-slate-400 bg-slate-900/20">{row[3] === "yes" ? "SI" : row[3] === "mid" ? "MEDIO" : row[3] === "limited" ? "LIMITADO" : "NO"}</td>
                          <td className="p-3 text-center text-slate-400 bg-slate-900/20">{row[4] === "yes" ? "SI" : row[4] === "variable" ? "VARIABLE" : "NO"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat fases-implementacion.txt</span>
              </div>

              <h2 className="text-3xl font-bold text-white">Fases de implementacion</h2>
              <p className="text-slate-400">Duracion total estimada: 3-5 meses</p>

              <div className="space-y-6">
                <div className="relative pl-8 border-l-2 border-slate-800/50 pb-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-400 border-2 border-[#0c0c0c]" />
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="px-3 py-1 bg-slate-500/10 border border-slate-500/30 rounded-full text-[10px] font-mono font-bold text-slate-300">
                      Fase 0
                    </div>
                    <h3 className="text-lg font-bold text-white">Ingenieria Operativa</h3>
                    <span className="text-slate-500 text-sm">(2-3 semanas)</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-400 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5" />Mapeo del flujo de importacion.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5" />Diseno de estructura de almacen con ubicaciones.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5" />Definicion de catalogo base (SKUs, proveedores, clientes, listas de precios).</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-300 mt-0.5" />Definicion de roles y permisos.</li>
                  </ul>
                </div>

                <div className="relative pl-8 border-l-2 border-slate-800/50 pb-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0c0c0c]" />
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] font-mono font-bold text-green-400">
                      Fase 1
                    </div>
                    <h3 className="text-lg font-bold text-white">Implementacion Core</h3>
                    <span className="text-slate-500 text-sm">(8-12 semanas)</span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-400 ml-4">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />Configuracion de todos los modulos definidos.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />Migracion de datos desde ASPEL SAE.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />Capacitacion por area: ventas, almacen, cobranza y direccion.</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />Go-live asistido + 60 dias de soporte incluidos.</li>
                  </ul>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <section id="inversion" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Inversion</h2>
            <p className="text-slate-400 text-lg">Paquete Growth - Odoo Community Edition</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TerminalFrame borderColor="green">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Desglose economico</h3>
                  <p className="text-green-400 font-mono text-sm">Implementacion + fiscal</p>
                </div>

                <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-lg text-center">
                  <div className="text-sm text-slate-500 font-mono mb-2">Total</div>
                  <div className="text-5xl font-bold text-green-400 mb-1">$104,400 MXN</div>
                  <div className="text-xs text-slate-500">IVA incluido</div>
                </div>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between gap-4 border-b border-slate-800 pb-2"><span>Paquete Growth (neto)</span><span className="text-white">$90,000 MXN</span></li>
                  <li className="flex justify-between gap-4 border-b border-slate-800 pb-2"><span>IVA (16%)</span><span className="text-white">$14,400 MXN</span></li>
                  <li className="flex justify-between gap-4 border-b border-slate-800 pb-2"><span>Licencias Odoo CE</span><span className="text-green-400">$0 MXN (de por vida)</span></li>
                  <li className="flex justify-between gap-4"><span>Hosting post-lanzamiento</span><span className="text-white">~$500-$2,000 MXN/mes</span></li>
                </ul>
              </div>
            </TerminalFrame>

            <TerminalFrame borderColor="blue">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Plan de pagos</h3>
                  <p className="text-blue-400 font-mono text-sm">Esquema 70 / 30</p>
                </div>

                <div className="grid gap-3">
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">70% a la firma</div>
                    <div className="text-2xl font-bold text-green-400">$73,080 MXN</div>
                    <div className="text-xs text-slate-500">$63,000 + IVA</div>
                  </div>

                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">30% al go-live</div>
                    <div className="text-2xl font-bold text-green-400">$31,320 MXN</div>
                    <div className="text-xs text-slate-500">$27,000 + IVA</div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                  <p className="text-sm text-yellow-300">Vigencia de propuesta: 15 dias naturales.</p>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <TerminalFrame borderColor="green">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-xl font-bold">Que SI incluye</span>
                </div>

                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /><span>Implementacion de Fase 0 y Fase 1 del paquete Growth.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /><span>Migracion inicial desde ASPEL SAE.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /><span>Capacitacion por area y arranque operativo asistido.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /><span>60 dias de soporte tecnico.</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /><span>Asesoria TI para decisiones de operacion e infraestructura.</span></li>
                </ul>
              </div>
            </TerminalFrame>

            <TerminalFrame borderColor="red">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-400 font-mono mb-6">
                  <X className="w-6 h-6" />
                  <span className="text-xl font-bold">Que NO incluye</span>
                </div>

                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-400 mt-0.5 opacity-70" /><span>Operacion de reempaquetado de alimento (manufactura, lotes, SENASICA).</span></li>
                  <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-400 mt-0.5 opacity-70" /><span>Marketplace propio (Mercado Libre, Amazon).</span></li>
                  <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-400 mt-0.5 opacity-70" /><span>Integracion con paqueteria para guias automaticas.</span></li>
                  <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-400 mt-0.5 opacity-70" /><span>Integracion con WhatsApp Business.</span></li>
                  <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-400 mt-0.5 opacity-70" /><span>E-commerce propio y contabilidad externa (CONTPAQi / Aspel COI).</span></li>
                  <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-400 mt-0.5 opacity-70" /><span>Nomina Mexico y desarrollos a medida fuera de alcance.</span></li>
                </ul>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame className="border-cyan-500/30">
            <div className="text-center space-y-8 py-8">
              <div className="flex items-center justify-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">root@netlab:~/isuma#</span>
                <span className="text-lg">siguiente-paso</span>
                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">Empezamos con la Fase 0?</h2>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Si validamos alcance y calendario esta semana, arrancamos ingenieria operativa para estabilizar inventario,
                ordenar ventas y recuperar visibilidad comercial real.
              </p>

              <div className="pt-6 space-y-4">
                <a
                  href="https://wa.me/523300000000?text=Hola%2C%20quiero%20iniciar%20la%20Fase%200%20de%20ISUMA%20con%20el%20paquete%20Growth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm text-lg w-full md:w-auto"
                >
                  <PhoneCall className="w-5 h-5 mr-2" />
                  <span>Hablar por WhatsApp</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>

                <p className="text-sm text-slate-500 font-mono">
                  Contacto sugerido: <span className="text-slate-300 font-semibold">+52 33 XXXXXXXX</span> ·
                  Correo: <span className="text-slate-300 font-semibold">contacto@netlab.mx</span>
                </p>

                <div className="pt-4 text-[10px] text-slate-600 uppercase tracking-widest">
                  Propuesta valida por 15 dias naturales
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
