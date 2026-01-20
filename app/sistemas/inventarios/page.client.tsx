"use client"
import { Navbar } from "@/components/navbar"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Button } from "@/components/ui/button"
import { Package, TrendingUp, AlertCircle, BarChart, Truck, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function SistemaInventariosPageClient() {
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

      <section className="pt-12 pb-12 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/inventarios --info" />
          <div className="flex items-center gap-3 mt-6 mb-4">
            <Package className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">Control de Inventarios</h1>
          </div>
          <p className="text-xl text-slate-400 font-mono mb-8">
            Gestión de almacenes, entradas, salidas y trazabilidad en tiempo real
          </p>
          <Link href="/#contacto">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-mono">Agendar demo gratuita</Button>
          </Link>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <TerminalFrame title="problema.txt" borderColor="red">
            <h2 className="text-xl font-bold text-red-400 mb-4 font-mono">¿Tu inventario es un caos?</h2>
            <ul className="space-y-2 text-slate-300 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No sabes exactamente cuánto producto tienes disponible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Te enteras de faltantes cuando ya es tarde</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Tienes capital muerto en productos que no se mueven</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Hacer inventario físico te toma días completos</span>
              </li>
            </ul>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/inventarios --features" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8 font-mono">
            ¿Qué hace el sistema de inventarios de Netlab?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <TerminalFrame title="tiempo-real.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Actualización en tiempo real</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Cada entrada, salida o venta actualiza automáticamente tu inventario. Siempre sabes qué tienes.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="alertas.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Alertas de stock mínimo</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    El sistema te avisa cuando un producto está por agotarse. Nunca te quedas sin mercancía.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="almacenes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Múltiples almacenes o sucursales</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Controla el inventario de cada ubicación por separado. Transfiere entre almacenes fácilmente.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="reportes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <BarChart className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Reportes de rotación</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Identifica productos que se mueven rápido vs los que se quedan estancados.
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
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Nunca te quedes sin stock</p>
                  <p className="text-slate-400 text-xs font-mono">Alertas automáticas para reordenar</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Reduce capital inmovilizado</p>
                  <p className="text-slate-400 text-xs font-mono">Compra solo lo que realmente se vende</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Inventarios físicos en minutos</p>
                  <p className="text-slate-400 text-xs font-mono">Con app móvil o scanner de códigos</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Toma mejores decisiones de compra</p>
                  <p className="text-slate-400 text-xs font-mono">Datos reales de rotación y demanda</p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <CommandPrompt command="agendar-demo" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-4 font-mono">
            ¿Quieres control total de tu inventario?
          </h2>
          <p className="text-slate-400 font-mono mb-8">
            Agenda una demo y te mostramos cómo funciona para tu tipo de negocio
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
