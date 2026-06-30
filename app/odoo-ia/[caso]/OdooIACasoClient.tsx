"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { casosIA, type CasoIA } from "@/lib/seo-data"

const SISTEMA_LABEL: Record<string, string> = {
  ventas: "Sistema de Ventas",
  inventarios: "Control de Inventarios",
  crm: "CRM",
  erp: "ERP con Odoo",
}

export default function OdooIACasoClient({ caso }: { caso: CasoIA }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const otros = casosIA.filter((c) => c.slug !== caso.slug).slice(0, 4)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-5xl mx-auto">
            <Breadcrumbs
              items={[{ label: "Netlab IA", href: "/#netlab-ia" }, { label: caso.nombre }]}
            />
            <Link
              href="/#netlab-ia"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Netlab IA
            </Link>

            <TerminalFrame title={`netlab@ia:~/${caso.slug}`}>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-primary uppercase tracking-widest">
                    Netlab IA · Análisis de datos en Odoo
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{caso.titulo}</h1>
                <p className="text-xl text-muted-foreground mb-6 text-pretty">{caso.descripcion}</p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/agendar">Agendar una demo</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://wa.me/525513180427" target="_blank" rel="noopener noreferrer">
                      Hablar por WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Problema / Solución */}
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <TerminalFrame title="El problema" borderColor="red">
              <div className="p-6 flex gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <p className="text-muted-foreground">{caso.problema}</p>
              </div>
            </TerminalFrame>
            <TerminalFrame title="La solución con IA" borderColor="green">
              <div className="p-6 flex gap-3">
                <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground">{caso.solucion}</p>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <TerminalFrame title={`¿Qué ganas con ${caso.nombre.toLowerCase()}?`}>
              <div className="p-8 grid md:grid-cols-2 gap-4">
                {[
                  "Decisiones basadas en datos reales de tu Odoo, no en corazonadas",
                  "Resultados en lenguaje claro, sin necesidad de un analista",
                  "Implementación sobre tu Odoo actual, sin migrar de sistema",
                  "Acompañamiento y soporte de consultores Netlab en español",
                ].map((b, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Enlaces internos con keywords */}
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <TerminalFrame title="Otros casos de IA para Odoo">
              <div className="p-8">
                <p className="text-muted-foreground mb-6">
                  Explora más formas de aplicar{" "}
                  <Link href="/#netlab-ia" className="text-primary hover:underline">
                    inteligencia artificial en Odoo
                  </Link>{" "}
                  o conoce nuestro{" "}
                  <Link
                    href={`/sistemas/${caso.sistema}`}
                    className="text-primary hover:underline"
                  >
                    {SISTEMA_LABEL[caso.sistema] ?? "sistema en Odoo"}
                  </Link>
                  :
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {otros.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/odoo-ia/${c.slug}`}
                      className="group flex items-center justify-between gap-3 p-4 rounded-lg border border-slate-800 bg-slate-900/30 hover:border-primary/40 transition-all"
                    >
                      <span className="font-mono text-sm text-slate-200 group-hover:text-primary transition-colors">
                        {c.nombre}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <TerminalFrame>
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para que la IA trabaje con los datos de tu Odoo?</h2>
                <p className="text-muted-foreground mb-6 text-balance">
                  Agenda una demo y te mostramos {caso.nombre.toLowerCase()} con tus propios datos.
                </p>
                <Button size="lg" asChild>
                  <Link href="/agendar">Agendar demo gratuita</Link>
                </Button>
              </div>
            </TerminalFrame>
          </div>
        </section>
      </main>
    </>
  )
}
