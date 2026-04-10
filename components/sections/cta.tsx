import Link from "next/link"
import { Terminal, ArrowRight } from "lucide-react"
import { TerminalFrame } from "../ui/terminal-frame"

export function CtaSection() {
  return (
    <section id="contacto" className="py-12 bg-[#0c0c0c] border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-2xl">
        <TerminalFrame className="bg-[#050505] border-green-900/30">
          <div className="py-8 px-4 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Terminal className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="font-mono text-xs md:text-sm text-green-500">
              root@netlab:~/agendar# diagnostic.py
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-mono">
                Agendar diagnóstico gratis
              </h2>
              <p className="text-sm text-slate-400 font-mono">
                Cuéntanos sobre tu empresa y agendamos una llamada sin compromiso.
              </p>
            </div>

            <Link
              href="/agendar"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 font-mono font-bold text-black bg-green-500 hover:bg-green-400 transition-all rounded-sm"
            >
              Agendar mi diagnóstico gratis
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-slate-600 font-mono">
              Sin compromiso · Tarda menos de 2 minutos
            </p>
          </div>
        </TerminalFrame>
      </div>
    </section>
  )
}
