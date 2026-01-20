"use client"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight } from "lucide-react"
import { TerminalFrame } from "../ui/terminal-frame"

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-32 md:pt-16 overflow-hidden">
      <div className="container px-4 mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
            <div className="font-mono space-y-8">
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                <span className="text-green-500 font-bold">user@netlab:~$</span>
                <span className="text-slate-100">iniciar-sistema</span>
                <span className="text-purple-400">--odoo</span>
                <span className="text-purple-400">--erp</span>
                <span className="text-purple-400">--negocio</span>
                <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
              </div>
              {/* </CHANGE> */}

              <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                <motion.h1
                  className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Transforma tu PyME con un <span className="text-purple-400">sistema comercial y operativo</span>{" "}
                  conectado a <span className="text-purple-400">Odoo</span>.
                </motion.h1>
                {/* </CHANGE> */}

                <motion.p
                  className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  Implementamos Odoo, ERP para negocios, sistemas de ventas, punto de venta y control de inventarios
                  para que tu empresa crezca y tenga una operación ordenada.
                </motion.p>
                {/* </CHANGE> */}

                <motion.div
                  className="pt-8 flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                >
                  <a
                    href="#contacto"
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-sm"
                  >
                    <span className="mr-2">Optimizar mi negocio ahora</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>

                  <a
                    href="#proceso"
                    className="inline-flex items-center justify-center px-8 py-3 font-mono font-medium text-slate-300 transition-all duration-200 bg-transparent border border-slate-700 hover:border-purple-500 hover:text-purple-400 rounded-sm"
                  >
                    <span className="mr-2">Ver cómo trabajamos</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </motion.div>
                {/* </CHANGE> */}

                <motion.div
                  className="mt-12 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8 }}
                >
                  <p>{">"} Inicializando estrategia... [OK]</p>
                  <p>{">"} Verificando procesos actuales... [PENDING]</p>
                  <p>{">"} Esperando input del usuario...</p>
                </motion.div>
              </div>
            </div>
          </TerminalFrame>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
    </section>
  )
}
