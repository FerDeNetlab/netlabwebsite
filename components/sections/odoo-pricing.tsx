"use client"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, Zap, Star, Building2 } from "lucide-react"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { CommandPrompt } from "@/components/ui/command-prompt"

const tiers = [
  {
    id: "starter",
    name: "STARTER",
    price: "$40,000",
    currency: "MXN",
    badge: null,
    tagline: "para 10 usuarios · de por vida",
    description: "Ideal para PyMEs que quieren ordenar su operación comercial y empezar con Odoo CE.",
    icon: Zap,
    color: "text-green-400",
    borderColor: "border-slate-700",
    borderColorHover: "hover:border-green-500/50",
    accentBg: "bg-green-400/10",
    cta: "Empezar con Starter",
    ctaStyle: "bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-500/30",
    modules: [
      "Sistema de ventas y cotizaciones",
      "CRM y seguimiento de oportunidades",
      "Control de inventarios",
      "Punto de venta (POS)",
      "Facturación electrónica CFDI",
      "Capacitación de tu equipo",
      "Soporte 30 días post-lanzamiento",
    ],
    note: null,
  },
  {
    id: "growth",
    name: "GROWTH",
    price: "$90,000",
    currency: "MXN",
    badge: "MÁS POPULAR",
    tagline: "para 25 usuarios · de por vida",
    description: "Para empresas con operación más compleja: compras, almacén, manufactura ligera y personalizaciones.",
    icon: Star,
    color: "text-purple-400",
    borderColor: "border-purple-500/40",
    borderColorHover: "hover:border-purple-400/70",
    accentBg: "bg-purple-400/10",
    cta: "Empezar con Growth",
    ctaStyle: "bg-purple-600 hover:bg-purple-500 text-white",
    modules: [
      "Todo lo de Starter",
      "Módulo de compras y proveedores",
      "Contabilidad básica integrada",
      "Manufactura ligera (MRP)",
      "Multi-almacén y trazabilidad",
      "Personalización de flujos (2 módulos)",
      "Capacitación avanzada de equipo",
      "Soporte 60 días post-lanzamiento",
    ],
    note: "Personalización de módulos incluida",
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: "A consultar",
    currency: "",
    badge: null,
    tagline: "usuarios ilimitados · módulos custom",
    description: "Para empresas grandes con requerimientos específicos, integraciones externas y SLA de soporte.",
    icon: Building2,
    color: "text-cyan-400",
    borderColor: "border-slate-700",
    borderColorHover: "hover:border-cyan-500/40",
    accentBg: "bg-cyan-400/10",
    cta: "Hablar con un consultor",
    ctaStyle: "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20",
    modules: [
      "Todo lo de Growth",
      "Usuarios ilimitados",
      "Desarrollo de módulos a medida",
      "Integraciones con APIs externas",
      "Multi-empresa y multi-moneda",
      "SLA de soporte prioritario",
      "Gestor de proyecto dedicado",
      "Revisiones de negocio mensuales",
    ],
    note: "Precio según alcance del proyecto",
  },
]

export function OdooPricingSection() {
  return (
    <section id="precios" className="py-12 bg-[#0a0a0a] border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <CommandPrompt
          command="ls planes-odoo --precios"
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
            Implementa Odoo{" "}
            <span className="text-green-400">desde $40K</span> 
            <span className="block md:inline text-sm md:text-base text-slate-400 font-normal">· sin licencias de por vida</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-mono mt-2">
            Odoo Community Edition: código abierto, $0 licencias.
          </p>
        </motion.div>

        {/* Licensing badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-green-500/30 bg-green-500/5 rounded-sm font-mono text-xs text-green-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Licencia $0 de por vida
        </motion.div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs font-mono font-bold rounded-sm tracking-widest">
                    {tier.badge}
                  </span>
                </div>
              )}
              <TerminalFrame
                className={`h-full border ${tier.borderColor} ${tier.borderColorHover} transition-colors`}
                title={`netlab@pricing: ${tier.id}`}
              >
                <div className="flex flex-col h-full space-y-3 md:space-y-4">
                  {/* Header */}
                  <div>
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-sm ${tier.accentBg} mb-2`}>
                      <tier.icon className={`w-3.5 h-3.5 ${tier.color}`} />
                      <span className={`font-mono font-bold text-xs tracking-widest ${tier.color}`}>
                        {tier.name}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`text-2xl md:text-3xl font-bold font-mono ${tier.color}`}>{tier.price}</span>
                      {tier.currency && (
                        <span className="text-slate-500 font-mono text-xs">{tier.currency}</span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-400 mb-2">{tier.tagline}</p>
                    <p className="text-xs md:text-sm font-mono text-slate-400 leading-snug">{tier.description}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-800" />

                  {/* Modules list */}
                  <ul className="flex-1 space-y-1">
                    {tier.modules.map((mod) => (
                      <div key={mod} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                        <CheckCircle2 className={`w-3 h-3 mt-0.5 shrink-0 ${tier.color}`} />
                        <span>{mod}</span>
                      </div>
                    ))}
                    {tier.note && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <p className={`text-xs font-mono ${tier.color}`}>
                          ★ {tier.note}
                        </p>
                      </div>
                    )}
                  </ul>

                  {/* CTA */}
                  <a
                    href={tier.id === "enterprise" ? "https://cal.com/ferdenetlab" : `/agendar?plan=${tier.id}`}
                    target={tier.id === "enterprise" ? "_blank" : undefined}
                    rel={tier.id === "enterprise" ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center justify-center gap-2 w-full px-3 py-2 font-mono font-bold text-xs md:text-sm transition-all rounded-sm ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </TerminalFrame>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          className="mt-8 p-2.5 md:p-3 bg-slate-900/40 border border-slate-800 rounded-sm font-mono text-xs text-slate-500 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p>
            <span className="text-green-500">{">"}"</span> Precios en MXN + IVA. Hosting ~$500-$2K MXN/mes según tamaño.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
