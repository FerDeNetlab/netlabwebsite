import { TerminalFrame } from "../ui/terminal-frame"
import { CommandPrompt } from "../ui/command-prompt"
import { Layers, Wrench, GraduationCap } from "lucide-react"

export function ServicesSection() {
  return (
    <section id="servicios" className="py-20 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <CommandPrompt command="ls servicios" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-3">
            Servicios para ordenar, digitalizar y escalar tu negocio
          </h2>
          <p className="text-lg text-slate-400 font-mono">
            Implementamos Odoo, ERP, sistemas para negocios, puntos de venta y automatización comercial para PyMEs.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <TerminalFrame title="implementacion.exe" borderColor="gray" className="h-full bg-[#111]">
            <div className="flex flex-col h-full">
              <div className="mb-4 text-purple-400">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono">Implementación de Odoo y ERP</h3>
              <p className="text-sm text-slate-400 mb-4 font-mono leading-relaxed">
                Montamos Odoo y ERP para que tu negocio tenga ventas, inventarios, compras, facturación y punto de venta
                funcionando en un solo sistema.
              </p>
              <div className="mb-4 space-y-1 text-sm text-slate-500 font-mono">
                <p>• Sistema de ventas + CRM</p>
                <p>• Punto de venta conectado</p>
                <p>• Control de inventarios</p>
                <p>• Facturación y reportes</p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800">
                <code className="text-xs text-green-500">{">"} Sistema para PyME completo</code>
              </div>
            </div>
          </TerminalFrame>


          <TerminalFrame
            title="customization.exe"
            borderColor="purple"
            className="h-full bg-[#15151b] border-purple-500/30"
          >
            <div className="flex flex-col h-full">
              <div className="mb-4 text-purple-400">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono">Odoo a medida y sistemas especiales</h3>
              <p className="text-sm text-slate-400 mb-4 flex-grow font-mono leading-relaxed">
                Adaptamos Odoo a cómo realmente vendes: flujos de aprobación, reportes a medida, automatización
                comercial y mejora de procesos que no vienen de fábrica.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <code className="text-xs text-purple-400">{">"} Sistemas empresariales a tu medida</code>
              </div>
            </div>
          </TerminalFrame>


          <TerminalFrame title="training.exe" borderColor="gray" className="h-full bg-[#111]">
            <div className="flex flex-col h-full">
              <div className="mb-4 text-green-400">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-mono">
                Consultoría de negocio & Escuela de Vendedores
              </h3>
              <p className="text-sm text-slate-400 mb-4 font-mono leading-relaxed">
                Acompañamos a tu equipo con consultoría PyME, diseño de embudo de ventas, proceso comercial y
                crecimiento empresarial.
              </p>
              <div className="mb-4 space-y-1 text-sm text-slate-500 font-mono">
                <p>• Uso del CRM en el día a día</p>
                <p>• Embudo de ventas y proceso</p>
                <p>• Hábitos comerciales medibles</p>
                <p>• Revisión de métricas de equipo</p>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800">
                <code className="text-xs text-green-500">{">"} Consultoría de negocios</code>
              </div>
            </div>
          </TerminalFrame>

        </div>
      </div>
    </section>
  )
}
