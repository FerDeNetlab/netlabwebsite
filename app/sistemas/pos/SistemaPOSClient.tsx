"use client"
import { CommandPrompt } from "@/components/ui/command-prompt"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Button } from "@/components/ui/button"
import { Store, CreditCard, Package, Zap, BarChart, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"

export default function SistemaPOSClient() {
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
          <CommandPrompt command="sistemas/pos --info" />
          <div className="flex items-center gap-3 mt-6 mb-4">
            <Store className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">Punto de Venta (POS)</h1>
          </div>
          <p className="text-xl text-slate-400 font-mono mb-8">
            Sistema POS conectado con inventarios, facturación y reportes en tiempo real
          </p>
          <Link href="/#contacto">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-mono">Agendar demo gratuita</Button>
          </Link>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <TerminalFrame title="problema.txt" borderColor="red">
            <h2 className="text-xl font-bold text-red-400 mb-4 font-mono">¿Tu punto de venta te está frenando?</h2>
            <ul className="space-y-2 text-slate-300 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Las ventas no se reflejan en tiempo real en el inventario</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Cobrar y facturar son procesos separados y lentos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No sabes qué productos se venden más ni cuándo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Al cierre de caja hay diferencias que no puedes explicar</span>
              </li>
            </ul>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-16 border-b border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <CommandPrompt command="sistemas/pos --features" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-8 font-mono">¿Qué hace el POS de Netlab?</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <TerminalFrame title="ventas-rapidas.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Ventas ultra rápidas</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Interfaz diseñada para vender rápido. Búsqueda de productos, carrito y pago en segundos.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="inventario.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">
                    Actualización automática de inventario
                  </h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Cada venta descuenta automáticamente del inventario. Siempre sabes qué tienes disponible.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="pagos.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Múltiples métodos de pago</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Acepta efectivo, tarjeta, transferencia o pagos mixtos. Todo registrado correctamente.
                  </p>
                </div>
              </div>
            </TerminalFrame>

            <TerminalFrame title="reportes.sh" borderColor="green">
              <div className="flex items-start gap-3">
                <BarChart className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="text-white font-bold mb-2 font-mono text-sm">Reportes de ventas en tiempo real</h3>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    Ve tus ventas del día, productos más vendidos y cierre de caja al instante.
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
                <Zap className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Cobra más rápido</p>
                  <p className="text-slate-400 text-xs font-mono">Reduce tiempo de cobro y atiende más clientes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Control de inventario preciso</p>
                  <p className="text-slate-400 text-xs font-mono">Nunca vendas lo que no tienes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Cierres de caja sin errores</p>
                  <p className="text-slate-400 text-xs font-mono">Todo cuadra automáticamente</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <p className="text-white font-bold font-mono text-sm mb-1">Decisiones basadas en datos</p>
                  <p className="text-slate-400 text-xs font-mono">Identifica productos exitosos y lentos</p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <CommandPrompt command="agendar-demo" />
          <h2 className="text-3xl font-bold text-white mt-6 mb-4 font-mono">¿Quieres modernizar tu punto de venta?</h2>
          <p className="text-slate-400 font-mono mb-8">
            Agenda una demo y te mostramos cómo funciona en tu tipo de negocio
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
