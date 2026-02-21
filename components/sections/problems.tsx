import { XCircle } from "lucide-react"
import { CommandPrompt } from "../ui/command-prompt"

export function ProblemsSection() {
  const problems = [
    "Tu negocio usa Excel, WhatsApp y sistemas viejos.",
    "No tienes un sistema para tu negocio que conecte ventas, inventario y facturación.",
    "Careces de un punto de venta para negocios ágil y conectado a inventarios.",
    "No sabes cuántos productos tienes: no hay control de inventarios real.",
    "Tus vendedores no usan tu CRM o no existe un proceso comercial claro.",
    "Tu empresa necesita un ERP para PyMEs, pero no sabes cuál.",
    "Tu sistema de ventas no se conecta con tu facturación o tu ecommerce.",
    "Ya tienes Odoo pero tu negocio no lo usa bien.",
  ]


  return (
    <section className="py-20 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-4xl">
        <CommandPrompt
          command="detectar-problemas-negocio"
          output={
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                ¿Tu negocio tiene alguno de estos problemas?
              </h2>

              <ul className="space-y-3 font-mono">
                {problems.map((problem, i) => (
                  <li key={i} className="flex items-start text-slate-300 group">
                    <span className="mr-3 text-red-500 mt-1 select-none">
                      <XCircle className="w-4 h-4" />
                    </span>
                    <span className="group-hover:text-red-400 transition-colors">{problem}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-4 border-t border-slate-800 text-green-400 font-mono italic">
                {">"} Netlab conecta tu operación completa con Odoo y ERP para que tu negocio funcione de verdad.
              </div>

            </div>
          }
        />
      </div>
    </section>
  )
}
