import { CommandPrompt } from "../ui/command-prompt"
import { TerminalFrame } from "../ui/terminal-frame"
import { Store, ShoppingBag, Package2, Users2, Building2, TrendingUp } from "lucide-react"

export function TargetBusinessSection() {
  const businessTypes = [
    {
      icon: Store,
      title: "Negocios con ventas físicas",
      desc: "Tiendas, distribuidoras y puntos de venta.",
    },
    {
      icon: ShoppingBag,
      title: "Negocios con ventas digitales",
      desc: "Ecommerce y ventas en línea.",
    },
    {
      icon: Package2,
      title: "Empresas con inventarios",
      desc: "Control de productos y almacenes.",
    },
    {
      icon: Users2,
      title: "Empresas con equipo comercial",
      desc: "Vendedores y equipos de ventas.",
    },
    {
      icon: Building2,
      title: "PyMEs con múltiples áreas operativas",
      desc: "Ventas, compras, almacén y administración.",
    },
    {
      icon: TrendingUp,
      title: "Negocios en expansión",
      desc: "Empresas que necesitan optimización de operaciones.",
    },
  ]

  return (
    <section className="py-20 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-6xl">
        <CommandPrompt command="tipos-de-negocio" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-3">
          Trabajamos con PyMEs y negocios en crecimiento
        </h2>
        <p className="text-lg text-slate-400 font-mono mb-12">
          Consultoría ERP y sistemas empresariales para todo tipo de industria.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {businessTypes.map((type, index) => (
            <TerminalFrame key={index} title={`business_${index + 1}.conf`} borderColor="gray" className="bg-[#111]">
              <div className="flex items-start gap-3">
                <div className="text-purple-400 mt-1">
                  <type.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1 font-mono">{type.title}</h3>
                  <p className="text-xs text-slate-500 font-mono leading-relaxed">{type.desc}</p>
                </div>
              </div>
            </TerminalFrame>
          ))}
        </div>
      </div>
    </section>
  )
}
