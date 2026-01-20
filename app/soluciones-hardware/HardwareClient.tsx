"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { Button } from "@/components/ui/button"
import {
  Server,
  Network,
  HardDrive,
  Cpu,
  Cable,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Boxes,
  Monitor,
  Wifi,
  Lock,
} from "lucide-react"
import Link from "next/link"

export function HardwareClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      <section className="pt-16 pb-12 bg-[#0a0a0a] border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/#sistemas">
            <Button variant="ghost" className="mb-6 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a inicio
            </Button>
          </Link>

          <CommandPrompt command="hardware-solutions --info" />
          <div className="mt-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Soluciones de Hardware e Infraestructura TI
            </h1>
            <p className="text-xl text-slate-400 font-mono">
              Todo el equipamiento tecnológico que tu empresa necesita para operar de manera eficiente
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0c0c0c]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <TerminalFrame title="problema.txt" borderColor="red">
              <div className="p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">
                  Problemas con infraestructura obsoleta
                </h3>
                <ul className="space-y-3 text-slate-300 font-mono text-sm">
                  <li>→ Equipos lentos que reducen la productividad del equipo</li>
                  <li>→ Red inestable con caídas constantes de internet</li>
                  <li>→ Falta de respaldos adecuados que ponen en riesgo datos críticos</li>
                  <li>→ Servidores saturados que no soportan el crecimiento</li>
                  <li>→ Cableado desordenado y sin documentación técnica</li>
                </ul>
              </div>
            </TerminalFrame>

            <TerminalFrame title="solucion.txt" borderColor="green">
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">Infraestructura profesional</h3>
                <ul className="space-y-3 text-slate-300 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Equipos modernos optimizados para tu operación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Redes empresariales estables con redundancia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Sistemas de respaldo automático y recuperación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Servidores escalables según tu crecimiento</span>
                  </li>
                </ul>
              </div>
            </TerminalFrame>
          </div>

          <CommandPrompt command="listar-soluciones-hardware" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8">Soluciones de hardware que ofrecemos</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Server,
                title: "Servidores Empresariales",
                desc: "Servidores físicos y virtuales, configuración, migración y soporte 24/7",
              },
              {
                icon: Network,
                title: "Redes y Conectividad",
                desc: "Diseño de red, switches, routers, firewall, WiFi empresarial y VPN",
              },
              {
                icon: Cable,
                title: "Cableado Estructurado",
                desc: "Instalación certificada Cat6/Cat6A, fibra óptica y organización de racks",
              },
              {
                icon: HardDrive,
                title: "Almacenamiento",
                desc: "NAS, SAN, sistemas de respaldo automático y recuperación ante desastres",
              },
              {
                icon: Monitor,
                title: "Equipos de Cómputo",
                desc: "PCs, laptops, monitores y accesorios al por mayor con garantía",
              },
              {
                icon: Shield,
                title: "Seguridad Perimetral",
                desc: "Firewalls, sistemas de detección de intrusos y monitoreo de red",
              },
            ].map((solution, index) => (
              <TerminalFrame key={index} title={`solution_${index + 1}.sh`} borderColor="blue">
                <div className="p-4 flex items-start gap-3">
                  <solution.icon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 font-mono">{solution.title}</h3>
                    <p className="text-sm text-slate-400 font-mono leading-relaxed">{solution.desc}</p>
                  </div>
                </div>
              </TerminalFrame>
            ))}
          </div>

          <CommandPrompt command="beneficios-hardware" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8">Ventajas de nuestra infraestructura</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                icon: Boxes,
                title: "Equipamiento profesional",
                desc: "Trabajamos con marcas líderes: Dell, HP, Cisco, Ubiquiti y Synology para garantizar calidad",
              },
              {
                icon: Wifi,
                title: "Red de alto rendimiento",
                desc: "Diseño de redes optimizadas para máxima velocidad, cobertura y segmentación por departamento",
              },
              {
                icon: Lock,
                title: "Respaldos garantizados",
                desc: "Estrategias de backup 3-2-1: tres copias, dos medios diferentes, una fuera de sitio",
              },
              {
                icon: Cpu,
                title: "Escalabilidad asegurada",
                desc: "Infraestructura diseñada para crecer con tu negocio sin necesidad de rehacer todo",
              },
            ].map((benefit, index) => (
              <TerminalFrame key={index} title={`benefit_${index + 1}.txt`} borderColor="green">
                <div className="p-5 flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded">
                    <benefit.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono">{benefit.title}</h3>
                    <p className="text-slate-400 font-mono text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </TerminalFrame>
            ))}
          </div>

          <TerminalFrame title="cta-hardware.sh" borderColor="blue" className="bg-[#050505]">
            <div className="p-8 text-center">
              <Server className="w-16 h-16 text-blue-500 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Moderniza la infraestructura de tu empresa
              </h2>
              <p className="text-lg text-slate-400 font-mono mb-8 max-w-2xl mx-auto">
                Agenda una visita técnica gratuita. Evaluamos tu infraestructura actual y te proponemos soluciones
                específicas.
              </p>
              <a
                href="https://cal.com/ferdenetlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold rounded transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              >
                Solicitar evaluación de infraestructura
              </a>
            </div>
          </TerminalFrame>
        </div>
      </section>
    </main>
  )
}
