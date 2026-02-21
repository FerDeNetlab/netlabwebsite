import { TerminalFrame } from "../ui/terminal-frame"
import { HeroAnimations } from "./hero-animations"

export function HeroSection() {
  return (
    <section className="relative pt-10 pb-32 md:pt-16 overflow-hidden">
      <div className="container px-4 mx-auto max-w-5xl">
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

            <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Transforma tu PyME con un <span className="text-purple-400">sistema comercial y operativo</span>{" "}
                conectado a <span className="text-purple-400">Odoo</span>.
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                Implementamos Odoo, ERP para negocios, sistemas de ventas, punto de venta y control de inventarios
                para que tu empresa crezca y tenga una operación ordenada.
              </p>

              <HeroAnimations />
            </div>
          </div>
        </TerminalFrame>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
    </section>
  )
}
