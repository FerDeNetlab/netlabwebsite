"use client"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { CommandPrompt } from "@/components/ui/command-prompt"

const comparison = [
  {
    feature: "Costo de licencia por usuario",
    ce: "$0 MXN",
    ceOk: true,
    enterprise: "~$700 MXN/usuario/mes",
    enterpriseOk: false,
    highlight: true,
  },
  {
    feature: "Para 10 usuarios, costo anual",
    ce: "$0 MXN al año",
    ceOk: true,
    enterprise: "~$84,000 MXN/año",
    enterpriseOk: false,
    highlight: true,
  },
  {
    feature: "Código fuente abierto",
    ce: "Sí. Puedes modificar todo",
    ceOk: true,
    enterprise: "Parcial. Módulos propietarios",
    enterpriseOk: false,
  },
  {
    feature: "Actualizaciones de versión",
    ce: "Libres y sin costo",
    ceOk: true,
    enterprise: "Incluidas en suscripción",
    enterpriseOk: true,
  },
  {
    feature: "Personalización a medida",
    ce: "Total. Sin restricciones",
    ceOk: true,
    enterprise: "Limitada por contrato",
    enterpriseOk: false,
  },
  {
    feature: "Módulos: ventas, CRM, inv.",
    ce: "Todos disponibles en CE",
    ceOk: true,
    enterprise: "Incluidos en Enterprise",
    enterpriseOk: true,
  },
  {
    feature: "Dependencia del proveedor",
    ce: "Ninguna. Tú eres el dueño",
    ceOk: true,
    enterprise: "Alta. Sin suscripción no funciona",
    enterpriseOk: false,
  },
  {
    feature: "Inversión en 5 años (10 usr.)",
    ce: "Una sola vez. Sin más.",
    ceOk: true,
    enterprise: "~$420,000 MXN solo en licencias",
    enterpriseOk: false,
    highlight: true,
  },
]

export function OdooCEvsEnterpriseSection() {
  return (
    <section id="ce-vs-enterprise" className="py-12 bg-[#0c0c0c] border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-5xl">
        <CommandPrompt
          command="diff odoo-community odoo-enterprise"
          path="~/odoo"
          user="netlab@consulting"
        />

        {/* Headline */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-white leading-tight mb-2">
            CE vs Enterprise: <span className="text-green-400">$420K menos</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-mono max-w-3xl leading-relaxed">
            La mayoría no necesita Enterprise. CE tiene todos los módulos: ventas, CRM, inventarios, POS, facturación. Costo de licencia: $0 de por vida.
          </p>
        </motion.div>

        {/* Savings callout */}
        <motion.div
          className="mb-8 p-3 md:p-4 border border-green-500/30 bg-green-500/5 rounded-sm font-mono text-xs md:text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-green-500 text-xs mb-1"><span className="text-green-500">{">"}</span> ahorro en 5 años (10 usuarios)</p>
          <p className="text-white font-bold text-lg">
            <span className="text-green-400">$420,000+ MXN</span>
            <span className="text-slate-500 text-xs font-normal ml-2">en licencias</span>
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <TerminalFrame className="border-slate-800 overflow-auto">
            <div className="min-w-[480px]">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1.2fr_1.2fr] gap-3 pb-2 mb-2 border-b border-slate-800 font-mono text-xs text-slate-500 uppercase tracking-widest">
                <span>Feature</span>
                <span className="text-green-400">CE</span>
                <span className="text-slate-400">Enterprise</span>
              </div>

              {/* Table rows */}
              <div className="space-y-0.5">
                {comparison.map((row, i) => (
                  <motion.div
                    key={row.feature}
                  className={`grid grid-cols-[2fr_1.2fr_1.2fr] gap-3 py-1.5 md:py-2 px-1 md:px-2 rounded-sm font-mono text-xs md:text-sm transition-colors ${
                      row.highlight
                        ? "bg-green-500/5 border border-green-500/15"
                        : "hover:bg-slate-900/50"
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                  <span className="text-slate-300 text-xs md:text-sm">{row.feature}</span>
                  <span className="flex items-start gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-green-300 text-xs">{row.ce}</span>
                  </span>
                  <span className="flex items-start gap-1">
                    {row.enterpriseOk ? (
                      <CheckCircle2 className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-xs ${row.enterpriseOk ? "text-slate-400" : "text-red-300/70"}`}>
                        {row.enterprise}
                      </span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </TerminalFrame>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex-1">
            <p className="font-mono text-xs md:text-sm text-slate-400">
              <span className="text-green-400">{">"}"</span> Netlab implementa exclusivamente{" "}
              <span className="text-green-400 font-bold">Odoo Community.</span> Tu código, tu propiedad.
            </p>
          </div>
          <a
            href="#precios"
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 font-mono font-bold text-xs md:text-sm text-black bg-green-500 hover:bg-green-400 transition-colors rounded-sm shrink-0"
          >
            Ver precios
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
