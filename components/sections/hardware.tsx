import { CommandPrompt } from "../ui/command-prompt"
import { TerminalFrame } from "../ui/terminal-frame"
import { Server, Network, HardDrive, Cpu } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export function HardwareSection() {
  return (
    <section id="hardware" className="py-20 bg-[#0c0c0c] border-y border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <CommandPrompt command="hardware-solutions" />
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center mt-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Infraestructura tecnológica para tu negocio
            </h2>
            <p className="text-lg text-slate-400 font-mono mb-6 leading-relaxed">
              Diseñamos, instalamos y damos mantenimiento a toda tu infraestructura de TI. Servidores, redes,
              almacenamiento y equipos de cómputo empresarial.
            </p>
          </div>
          <div className="flex-shrink-0">
            <TerminalFrame
              title="hardware.sh"
              borderColor="blue"
              className="bg-[#0d0d0d] hover:bg-[#111] transition-colors"
            >
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-10 h-10 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">Soluciones Hardware</h3>
                    <p className="text-sm text-slate-400 font-mono">Infraestructura empresarial completa</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300 font-mono">Redes empresariales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300 font-mono">Almacenamiento y servidores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300 font-mono">Cómputo al por mayor</span>
                  </div>
                </div>
                <Link href="/soluciones-hardware" scroll={true}>
                  <Button className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 font-mono text-sm transition-all">
                    conóceme →
                  </Button>
                </Link>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
