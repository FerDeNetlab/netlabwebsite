"use client"

import { Navbar } from "@/components/navbar"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Button } from "@/components/ui/button"
import { FileText, Zap, Mail, CheckCircle, DollarSign, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function FacturacionClientPage() {
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

      <section className="pt-16 pb-12 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/facturacion --info" />
          <div className="flex items-center gap-3 mt-6 mb-4">
            <FileText className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">Sistema de Facturación</h1>
          </div>
          <p className="text-xl text-slate-400 font-mono mb-8">
            Facturación electrónica integrada directamente con tus ventas y contabilidad
          </p>
          <Link href="/#contacto">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-mono">Agendar demo gratuita</Button>
          </Link>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <TerminalFrame title="problema.txt" borderColor="red">
            <h2 className="text-xl font-bold text-red-400 mb-4 font-mono">¿Facturar te quita mucho tiempo?</h2>
            <ul className="space-y-2 text-slate-300 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Tienes que capturar datos manualmente en otro sistema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Los clientes esperan días para recibir su factura</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No sabes qué facturas están pendientes de cobro</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Tienes facturas en un lugar y ventas en otro</span>
              </li>
            </ul>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/facturacion --features" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8 font-mono">
            ¿Qué hace el sistema de facturación de Netlab?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <TerminalFrame title="automatica.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Facturación automática desde ventas</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Al cerrar una venta, genera la factura automáticamente. Sin captura doble.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="timbrado.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Timbrado en tiempo real</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Conectado con el SAT. Timbra y envía facturas válidas al instante.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="envio.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Envío automático por correo</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    PDF y XML se envían automáticamente al email del cliente.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="cobranza.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Control de cobranza</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Ve qué facturas están pagadas, pendientes o vencidas. Reportes completos.
                  </p>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <TerminalFrame title="beneficios.txt" borderColor="purple">
            <h2 className="text-xl font-bold text-purple-400 mb-4 font-mono">Resultados que verás en tu negocio</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Ahorra horas al mes</p>
                  <p className="text-slate-400 text-xs font-mono">Sin captura manual ni procesos duplicados</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">100% cumplimiento fiscal</p>
                  <p className="text-slate-400 text-xs font-mono">Facturas válidas ante el SAT</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Clientes más satisfechos</p>
                  <p className="text-slate-400 text-xs font-mono">Reciben su factura al instante</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Mejora tu flujo de efectivo</p>
                  <p className="text-slate-400 text-xs font-mono">Control claro de cuentas por cobrar</p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <CommandPrompt command="agendar-demo" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-4 font-mono">¿Quieres simplificar tu facturación?</h2>
          <p className="text-slate-400 font-mono mb-8">
            Agenda una demo y te mostramos cómo automatizar todo el proceso
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
