import { MessageCircle, User } from "lucide-react"
import { TerminalFrame } from "../ui/terminal-frame"
import { Button } from "../ui/button"

export function DirectContactSection() {
  return (
    <section className="py-24 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-6xl">
        <TerminalFrame className="bg-[#050505] border-green-900/30">
          <div className="p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="font-mono text-sm text-green-500 mb-4">root@netlab:~/contacto-directo# consultores</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-mono mb-4">
                Habla directamente con nosotros
              </h2>
              <p className="text-slate-400 font-mono text-lg">
                Conecta directamente con nuestros consultores de negocio
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Fer Card */}
              <TerminalFrame className="bg-[#0a0a0a] border-green-900/20">
                <div className="p-8 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-green-900/20 rounded-full flex items-center justify-center border-2 border-green-500/30">
                      <User className="w-16 h-16 text-green-500" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-500 font-mono mb-2">Fer</h3>
                    <p className="text-slate-400 font-mono text-sm">Consultor de Negocio</p>
                    <p className="text-slate-500 font-mono text-xs mt-1">Netlab</p>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-lg py-6"
                  >
                    <a
                      href="https://wa.me/525513180427"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </TerminalFrame>

              {/* JC Card */}
              <TerminalFrame className="bg-[#0a0a0a] border-green-900/20">
                <div className="p-8 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-green-900/20 rounded-full flex items-center justify-center border-2 border-green-500/30">
                      <User className="w-16 h-16 text-green-500" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-500 font-mono mb-2">JC</h3>
                    <p className="text-slate-400 font-mono text-sm">Consultor de Negocio</p>
                    <p className="text-slate-500 font-mono text-xs mt-1">Netlab</p>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-lg py-6"
                  >
                    <a
                      href="https://wa.me/525513180427"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </TerminalFrame>
            </div>

            <div className="text-center mt-8">
              <p className="text-slate-500 font-mono text-sm">{">"} Respuesta en menos de 1 hora en horario laboral</p>
            </div>
          </div>
        </TerminalFrame>
      </div>
    </section>
  )
}
