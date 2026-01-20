import { CommandPrompt } from "../ui/command-prompt"
import { TerminalFrame } from "../ui/terminal-frame"
import { ShoppingCart, Users, Store, Package, FileText, Database, Settings, Globe, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export function SystemsSection() {
  const systems = [
    {
      icon: ShoppingCart,
      title: "Sistema de ventas",
      desc: "Cotizaciones, órdenes y seguimiento comercial completo.",
      slug: "ventas",
    },
    {
      icon: Users,
      title: "CRM para negocios",
      desc: "Gestión de oportunidades, clientes y embudo de ventas.",
      slug: "crm",
    },
    {
      icon: Store,
      title: "Punto de venta para negocios (POS)",
      desc: "Sistema POS conectado con inventarios y facturación.",
      slug: "pos",
    },
    {
      icon: Package,
      title: "Control de inventarios en tiempo real",
      desc: "Gestión de almacenes, entradas, salidas y trazabilidad.",
      slug: "inventarios",
    },
    {
      icon: FileText,
      title: "Sistema de facturación",
      desc: "Facturación electrónica integrada con ventas.",
      slug: "facturacion",
    },
    {
      icon: Database,
      title: "ERP para PyMEs",
      desc: "Sistema administrativo completo para tu empresa.",
      slug: "erp",
    },
    {
      icon: Settings,
      title: "Sistema administrativo completo",
      desc: "Compras, contabilidad, recursos humanos y más.",
      slug: "administrativo",
    },
    {
      icon: Globe,
      title: "Integración ecommerce + sistema",
      desc: "Conecta tu tienda online con inventarios y ventas.",
      slug: "ecommerce",
    },
    {
      icon: Zap,
      title: "Automatización de procesos",
      desc: "Flujos automáticos para ahorrar tiempo y errores.",
      slug: "automatizacion",
    },
  ]

  return (
    <section id="sistemas" className="py-20 bg-[#0a0a0a] border-y border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <CommandPrompt command="listar-sistemas" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-3">
          Sistemas para negocios que implementamos
        </h2>
        <p className="text-lg text-slate-400 font-mono mb-12">
          Software para negocios y soluciones para PyMEs que realmente funcionan.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {systems.map((system, index) => (
            <TerminalFrame
              key={index}
              title={`system_${index + 1}.sh`}
              borderColor="gray"
              className="bg-[#0d0d0d] hover:bg-[#111] transition-colors"
            >
              <div className="flex flex-col gap-4 p-2">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 mt-1 flex-shrink-0">
                    <system.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-2 font-mono leading-tight">{system.title}</h3>
                    <p className="text-sm text-slate-400 font-mono leading-relaxed">{system.desc}</p>
                  </div>
                </div>
                <Link href={`/sistemas/${system.slug}`} className="mt-auto" scroll={true}>
                  <Button
                    size="sm"
                    className="w-full bg-green-600/10 hover:bg-green-600/20 border border-green-500/30 hover:border-green-500/50 text-green-400 font-mono text-sm transition-all"
                  >
                    conóceme →
                  </Button>
                </Link>
              </div>
            </TerminalFrame>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded">
          <p className="text-purple-400 font-mono text-sm italic">
            {">"} Todos estos sistemas se integran en un solo ERP para negocios con Odoo.
          </p>
        </div>
      </div>
    </section>
  )
}
