"use client"

import { Navbar } from "@/components/navbar"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Button } from "@/components/ui/button"
import { ShoppingCart, TrendingUp, FileText, Users, BarChart, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function SistemaVentasClient() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

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
          <CommandPrompt command="sistemas/ventas --info" />
          <div className="flex items-center gap-3 mt-6 mb-4">
            <ShoppingCart className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">Sistema de Ventas</h1>
          </div>
          <p className="text-xl text-slate-400 font-mono mb-8">
            Gestiona todo tu proceso comercial desde la cotización hasta el cierre de venta
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
              ¿Tu equipo de ventas está perdiendo oportunidades?
            </h2>
            <ul className="space-y-2 text-slate-300 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Las cotizaciones se pierden en correos y no hay seguimiento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No sabes qué vendedor está cerrando más negocios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Crear una cotización te toma demasiado tiempo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No tienes visibilidad de cuánto vas a facturar este mes</span>
              </li>
            </ul>
          </TerminalFrame>
        </div>
      </section>

      {/* Solución */}
      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/ventas --features" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8 font-mono">
            ¿Qué hace el sistema de ventas de Netlab?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <TerminalFrame title="cotizaciones.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">
                    Cotizaciones profesionales en segundos
                  </h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Genera cotizaciones con tu logo, productos, precios y términos. Envíalas por correo directo desde el
                    sistema.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="seguimiento.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Seguimiento de cada oportunidad</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Ve en qué etapa está cada negocio: prospecto, cotizado, negociación o ganado. Nunca pierdas el hilo.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="ordenes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Conversión automática a orden</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Cuando el cliente acepta, convierte la cotización en orden de venta con un clic.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="reportes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <BarChart className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Reportes de desempeño</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Mide qué vendedor vende más, qué productos se mueven y proyecta tus ventas del mes.
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
                <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Vende más en menos tiempo</p>
                  <p className="text-slate-400 text-xs font-mono">Reduce el tiempo de cotización de 30 min a 3 min</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">No pierdas oportunidades</p>
                  <p className="text-slate-400 text-xs font-mono">Seguimiento automático de cada prospecto</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Toma mejores decisiones</p>
                  <p className="text-slate-400 text-xs font-mono">Datos reales de desempeño de tu equipo</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Equipo alineado</p>
                  <p className="text-slate-400 text-xs font-mono">Todos ven la misma información actualizada</p>
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
          <h2 className="text-3xl font-bold text-white mt-6 mb-4 font-mono">¿Quieres ver el sistema en acción?</h2>
          <p className="text-slate-400 font-mono mb-8">
            Agenda una demo de 30 minutos y te mostramos cómo funciona con datos reales
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
