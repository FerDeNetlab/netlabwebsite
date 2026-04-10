import { Terminal } from "lucide-react"
import { TerminalFrame } from "../ui/terminal-frame"
import { BookingForm } from "@/components/booking-form"

export function CtaSection() {
  return (
    <section id="contacto" className="py-12 bg-[#0c0c0c] border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-2xl">
        <TerminalFrame className="bg-[#050505] border-green-900/30">
          <div className="py-8 px-4 space-y-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Terminal className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="font-mono text-xs md:text-sm text-green-500 mb-2">
              root@netlab:~/agendar# diagnostic.py
            </div>

            <div className="space-y-3 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-mono">
                Agendar diagnóstico gratis
              </h2>
              <p className="text-sm text-slate-400 font-mono">
                Cuéntanos sobre tu empresa y te contactaremos para una consulta sin compromiso.
              </p>
            </div>

            {/* Booking Form */}
            <BookingForm />

            <div className="pt-2 text-xs text-slate-600 font-mono text-center border-t border-slate-800">
              Tus datos se guardan de forma segura y no serán compartidos.
            </div>
          </div>
        </TerminalFrame>
      </div>
    </section>
  )
}
