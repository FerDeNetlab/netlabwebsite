"use client"
import { Navbar } from "@/components/navbar"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Button } from "@/components/ui/button"
import { Users, Target, TrendingUp, Bell, Calendar, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function CRMClientPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* Back Button */}
      <div className="border-b border-slate-900 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-4xl py-4">
          <Link href="/#sistemas">
            <Button variant="ghost" className="text-slate-400 hover:text-green-400 font-mono gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a sistemas
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-12 pb-12 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/crm --info" />
          <div className="flex items-center gap-3 mt-6 mb-4">
            <Users className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">CRM para Negocios</h1>
          </div>
          <p className="text-xl text-slate-400 font-mono mb-8">
            Gestiona relaciones con clientes, oportunidades y embudo de ventas en un solo lugar
          </p>
          <Link href="/#contacto">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-mono">Agendar demo gratuita</Button>
          </Link>
        </div>
      </section>

      {/* Problema */}
      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <TerminalFrame title="problema.txt" borderColor="red">
            <h2 className="text-xl font-bold text-red-400 mb-4 font-mono">
              ¿Estás perdiendo clientes por falta de seguimiento?
            </h2>
            <ul className="space-y-2 text-slate-300 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>La información de clientes está en Excel, WhatsApp y post-its</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Se te olvida dar seguimiento a prospectos importantes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No sabes en qué etapa está cada negocio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Cuando un vendedor renuncia, se lleva toda la información</span>
              </li>
            </ul>
          </TerminalFrame>
        </div>
      </section>

      {/* Solución */}
      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/crm --features" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8 font-mono">¿Qué hace el CRM de Netlab?</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <TerminalFrame title="pipeline.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Pipeline visual de oportunidades</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Ve todas tus oportunidades en un tablero: nuevo, calificado, propuesta, negociación, ganado.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="clientes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Base de datos de clientes completa</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Guarda contactos, historial de interacciones, correos y notas. Todo en un solo perfil.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="seguimiento.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Recordatorios automáticos</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    El sistema te avisa cuándo debes dar seguimiento a cada cliente o prospecto.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="reportes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Proyección de ventas</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Suma las oportunidades en tu pipeline y proyecta cuánto vas a cerrar este mes.
                  </p>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <TerminalFrame title="beneficios.txt" borderColor="purple">
            <h2 className="text-xl font-bold text-purple-400 mb-4 font-mono">Resultados que verás en tu negocio</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Cierra más negocios</p>
                  <p className="text-slate-400 text-xs font-mono">Seguimiento puntual aumenta tasa de conversión</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Clientes más contentos</p>
                  <p className="text-slate-400 text-xs font-mono">Respuestas rápidas y personalizadas</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Nunca olvides un seguimiento</p>
                  <p className="text-slate-400 text-xs font-mono">Alertas automáticas para cada contacto</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Predice tus ingresos</p>
                  <p className="text-slate-400 text-xs font-mono">Proyección basada en tu pipeline actual</p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <CommandPrompt command="agendar-demo" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-4 font-mono">¿Quieres ver cómo funciona?</h2>
          <p className="text-slate-400 font-mono mb-8">
            Agenda una demo y te mostramos cómo organizar toda tu información de clientes
          </p>
          <Link href="/#contacto">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-mono">
              Agendar demo gratuita
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
