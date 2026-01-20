import { CommandPrompt } from "../ui/command-prompt"
import { TerminalFrame } from "../ui/terminal-frame"
import { Building2, Code2, Rocket } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export function EnterpriseSection() {
  return (
    <section id="enterprise" className="py-20 bg-[#0a0a0a] border-y border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <CommandPrompt command="enterprise-development" />
        <div className="flex flex-col md:flex-row gap-8 items-center mt-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Eres una gran empresa que necesita desarrollo de primera calidad?
            </h2>
            <p className="text-lg text-slate-400 font-mono mb-6 leading-relaxed">
              Desarrollamos software empresarial a la medida con tecnología de punta. Sistemas escalables, seguros y
              diseñados específicamente para las necesidades de grandes corporativos.
            </p>
          </div>
          <div className="flex-shrink-0">
            <TerminalFrame
              title="enterprise.sh"
              borderColor="purple"
              className="bg-[#0d0d0d] hover:bg-[#111] transition-colors"
            >
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-10 h-10 text-purple-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">Desarrollo Enterprise</h3>
                    <p className="text-sm text-slate-400 font-mono">Soluciones corporativas de nivel mundial</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300 font-mono">Software a medida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300 font-mono">Arquitectura escalable</span>
                  </div>
                </div>
                <Link href="/desarrollo-enterprise" scroll={true}>
                  <Button className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 font-mono text-sm transition-all">
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
