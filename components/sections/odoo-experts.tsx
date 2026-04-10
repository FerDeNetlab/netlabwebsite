"use client"
import { motion } from "framer-motion"
import { BadgeCheck, Users, Building2, Layers, Award } from "lucide-react"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { CommandPrompt } from "@/components/ui/command-prompt"

const stats = [
  {
    icon: Building2,
    value: "20+",
    label: "empresas implementadas",
    sublabel: "por mes en México",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-500/20",
  },
  {
    icon: Users,
    value: "100+",
    label: "usuarios en producción",
    sublabel: "en una sola empresa",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-500/20",
  },
  {
    icon: Layers,
    value: "8+",
    label: "industrias atendidas",
    sublabel: "farmacéutica, manufactura, retail…",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Award,
    value: "Cert.",
    label: "certificados en Odoo",
    sublabel: "consultores con credenciales oficiales",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-500/20",
  },
]

const industries = [
  "Farmacéutica",
  "Comercializadoras",
  "Importadoras",
  "Transporte",
  "Manufactura",
  "Construcción",
  "Educativo",
  "Deportivo",
]

export function OdooExpertsSection() {
  return (
    <section id="expertos" className="py-12 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-5xl">
        <CommandPrompt
          command="describir-netlab --odoo-ce --expertos"
          path="~/odoo"
          user="netlab@consulting"
        />

        {/* Headline */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-white leading-tight mb-2">
            Los consultores de{" "}
            <span className="text-green-400">Odoo Community</span>{" "}
            más activos en México.
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-mono max-w-3xl leading-relaxed">
            Consultores de negocio que entienden Odoo: sin licencias, sin dependencias, sin contratos anuales.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <TerminalFrame
                className={`p-0 border ${stat.border} hover:border-opacity-60 transition-colors`}
              >
                <div className={`flex flex-col items-center text-center py-3 px-2 md:py-4 md:px-3 ${stat.bg} rounded-b-lg`}>
                  <stat.icon className={`w-5 h-5 mb-1.5 md:mb-2 ${stat.color}`} />
                  <span className={`text-xl md:text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs md:text-sm font-mono text-slate-300 mt-0.5 md:mt-1">{stat.label}</span>
                  <span className="text-xs font-mono text-slate-500 hidden md:block mt-0.5">{stat.sublabel}</span>
                </div>
              </TerminalFrame>
            </motion.div>
          ))}
        </div>

        {/* Two-column content */}
        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Differentiator */}
          <TerminalFrame className="border-slate-800" borderColor="green">
            <div className="space-y-2">
              <div className="font-mono text-xs text-green-500 mb-2">
                <span className="text-green-500">{">"}</span> cat diferenciadores.txt
              </div>
              <h3 className="text-white font-mono font-bold text-base">Por qué elegirnos</h3>
              <ul className="space-y-1.5">
                {[
                  "Consultores: negocio antes que tech",
                  "Proceso diseñado vs. solo código",
                  "Odoo CE: $0 licencias, de por vida",
                  "Módulos reales en producción",
                  "Capacitación hasta que funcione",
                  "Soporte 30-60 días post-launch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs md:text-sm font-mono text-slate-300">
                    <BadgeCheck className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-2 font-mono text-xs text-green-500">
                [OK] Operación lista para iniciar
              </div>
            </div>
          </TerminalFrame>

          {/* Industries */}
          <TerminalFrame className="border-slate-800" borderColor="purple">
            <div className="space-y-2">
              <div className="font-mono text-xs text-purple-400 mb-2">
                <span className="text-purple-400">{">"}</span> ls industrias-implementadas/
              </div>
              <h3 className="text-white font-mono font-bold text-base">Industrias en producción</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                {industries.map((ind, i) => (
                  <div
                    key={ind}
                    className="flex items-center gap-1 text-xs md:text-sm font-mono text-slate-400 py-1 px-1.5 md:py-1.5 md:px-2 border border-slate-800 rounded-sm hover:border-purple-500/40 hover:text-slate-300 transition-colors"
                  >
                    <span className="text-purple-400 text-xs hidden md:inline">{String(i + 1).padStart(2, "0")}/</span>
                    {ind}
                  </div>
                ))}
              </div>
              <div className="pt-2 font-mono text-xs text-slate-500">
                {">"} y más sectores en expansión...
              </div>
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </section>
  )
}
