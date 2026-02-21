"use client"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight } from "lucide-react"

export function HeroAnimations() {
    return (
        <>
            <motion.div
                className="pt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
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

            <motion.div
                className="mt-12 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p>{">"} Inicializando estrategia... [OK]</p>
                <p>{">"} Verificando procesos actuales... [PENDING]</p>
                <p>{">"} Esperando input del usuario...</p>
            </motion.div>
        </>
    )
}
