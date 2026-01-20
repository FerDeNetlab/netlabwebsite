"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Code2,
  Rocket,
  Shield,
  Database,
  Cloud,
  Boxes,
  Workflow,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Users,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export function EnterpriseClient() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      <section className="pt-16 pb-12 bg-[#0a0a0a] border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/#sistemas">
            <Button
              variant="ghost"
              className="mb-6 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a sistemas
            </Button>
          </Link>

          <CommandPrompt command="enterprise-development --info" />
          <div className="mt-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Desarrollo de Software Enterprise a Medida
            </h1>
            <p className="text-xl text-slate-400 font-mono">
              Soluciones de software corporativo de primera calidad para grandes empresas
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0c0c0c]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <TerminalFrame title="problema.txt" borderColor="red">
              <div className="p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4 font-mono">Desafíos empresariales complejos</h3>
                <ul className="space-y-3 text-slate-300 font-mono text-sm">
                  <li>→ Software de terceros que no se adapta a tus procesos únicos</li>
                  <li>→ Sistemas legacy que frenan la innovación y crecimiento</li>
                  <li>→ Falta de integración entre aplicaciones críticas del negocio</li>
                  <li>→ Necesidad de escalabilidad para millones de transacciones</li>
                  <li>→ Requisitos de seguridad y compliance corporativo estrictos</li>
                </ul>
              </div>
            </TerminalFrame>

            <TerminalFrame title="solucion.txt" borderColor="green">
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">Software diseñado para tu negocio</h3>
                <ul className="space-y-3 text-slate-300 font-mono text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Desarrollo 100% personalizado adaptado a tus procesos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Arquitectura moderna y escalable con microservicios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Integraciones complejas con sistemas existentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Seguridad enterprise y cumplimiento normativo</span>
                  </li>
                </ul>
              </div>
            </TerminalFrame>
          </div>

          <CommandPrompt command="listar-capacidades" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8">Tecnologías y capacidades enterprise</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Code2,
                title: "Desarrollo Full Stack",
                desc: "Aplicaciones web y móviles con React, Next.js, Node.js, Python, Java y .NET",
              },
              {
                icon: Boxes,
                title: "Arquitectura Microservicios",
                desc: "Sistemas distribuidos escalables con Docker, Kubernetes y service mesh",
              },
              {
                icon: Cloud,
                title: "Soluciones Cloud Native",
                desc: "Despliegue en AWS, Azure, Google Cloud con infraestructura como código",
              },
              {
                icon: Database,
                title: "Big Data & Analytics",
                desc: "Procesamiento masivo de datos, data warehouses y business intelligence",
              },
              {
                icon: Shield,
                title: "Seguridad Avanzada",
                desc: "Autenticación multi-factor, encriptación, auditorías y compliance",
              },
              {
                icon: Workflow,
                title: "Integraciones Complejas",
                desc: "APIs REST, GraphQL, webhooks y conectores con sistemas legacy",
              },
            ].map((feature, index) => (
              <TerminalFrame key={index} title={`feature_${index + 1}.sh`} borderColor="purple">
                <div className="p-4 flex items-start gap-3">
                  <feature.icon className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 font-mono">{feature.title}</h3>
                    <p className="text-sm text-slate-400 font-mono leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </TerminalFrame>
            ))}
          </div>

          <CommandPrompt command="beneficios-enterprise" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8">Por qué elegir desarrollo enterprise con Netlab</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                icon: Rocket,
                title: "Escalabilidad garantizada",
                desc: "Arquitecturas diseñadas para crecer con tu empresa, desde miles hasta millones de usuarios",
              },
              {
                icon: Users,
                title: "Equipo senior especializado",
                desc: "Desarrolladores con más de 10 años de experiencia en proyectos enterprise",
              },
              {
                icon: BarChart3,
                title: "ROI medible",
                desc: "Automatización y optimización que se traduce en ahorros y eficiencia comprobables",
              },
              {
                icon: Zap,
                title: "Time to market rápido",
                desc: "Metodologías ágiles y DevOps para entregas continuas de valor",
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

          <TerminalFrame title="cta-enterprise.sh" borderColor="purple" className="bg-[#050505]">
            <div className="p-8 text-center">
              <Building2 className="w-16 h-16 text-purple-500 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Transformemos tu visión corporativa en realidad
              </h2>
              <p className="text-lg text-slate-400 font-mono mb-8 max-w-2xl mx-auto">
                Agenda una consultoría estratégica sin costo. Analizamos tus retos y diseñamos la solución enterprise
                perfecta.
              </p>
              <a
                href="https://cal.com/ferdenetlab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold rounded transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Agendar consultoría enterprise
              </a>
            </div>
          </TerminalFrame>
        </div>
      </section>
    </main>
  )
}
