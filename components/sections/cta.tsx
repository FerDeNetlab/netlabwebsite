import { ArrowRight, Terminal } from "lucide-react"
import { TerminalFrame } from "../ui/terminal-frame"

export function CtaSection() {
  return (
    <section id="contacto" className="py-24 bg-[#0c0c0c] border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <TerminalFrame className="bg-[#050505] border-green-900/30">
          <div className="text-center py-12 px-4 space-y-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/10 rounded-full">
                <Terminal className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="font-mono text-sm text-green-500 mb-2">root@netlab:~/final-step# agendar-diagnostico</div>

            <h2 className="text-3xl md:text-4xl font-bold text-white font-mono max-w-2xl mx-auto">
              Hablemos de tu sistema para negocio y tu crecimiento
            </h2>

            <p className="text-lg text-slate-400 font-mono max-w-xl mx-auto">
              Agenda un diagnóstico gratis para implementar Odoo, ERP, punto de venta, control de inventarios o
              cualquier sistema para tu PyME.
            </p>


            <div className="pt-4">
              <a
                href="https://cal.com/ferdenetlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] rounded-sm"
              >
                <span className="mr-2">Optimizar mi negocio ahora</span>
                <ArrowRight className="w-5 h-5" />
              </a>


              <p className="mt-6 text-xs text-slate-600 font-mono">
                {">"} Te contactaremos en menos de 24 horas hábiles.
              </p>
            </div>
          </div>
        </TerminalFrame>
      </div>
    </section>
  )
}
