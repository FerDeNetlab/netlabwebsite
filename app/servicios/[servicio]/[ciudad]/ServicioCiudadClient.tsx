"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Servicio, Ciudad } from "@/lib/seo-data"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface Props {
  servicio: Servicio
  ciudad: Ciudad
}

export default function ServicioCiudadClient({ servicio, ciudad }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs
              items={[
                { label: "Servicios", href: "/#sistemas" },
                { label: servicio.nombre },
                { label: ciudad.nombre }
              ]}
            />

            <Link
              href="/#sistemas"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a sistemas
            </Link>

            <TerminalFrame>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span className="text-muted-foreground">
                    {ciudad.nombre}, {ciudad.estado}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                  {servicio.nombre} en {ciudad.nombre}
                </h1>

                <p className="text-xl text-muted-foreground mb-6 text-pretty">
                  {servicio.descripcion} para empresas en {ciudad.nombre}, {ciudad.estado}. Implementación profesional
                  con Odoo, soporte continuo y capacitación especializada.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <a href="https://cal.com/netlab" target="_blank" rel="noopener noreferrer">
                      Agendar Demo Gratuita
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href={`/sistemas/${servicio.slug.replace("software-", "").replace("sistema-", "")}`}>
                      Ver Detalles del Sistema
                    </Link>
                  </Button>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Beneficios Locales */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame title={`¿Por qué elegir Netlab en ${ciudad.nombre}?`}>
              <div className="p-8 grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Atención Local",
                    description: `Equipo disponible para visitas presenciales en ${ciudad.nombre} y zona metropolitana`,
                  },
                  {
                    title: "Implementación Rápida",
                    description: "Sistema funcionando en menos de 30 días con migración de datos incluida",
                  },
                  {
                    title: "Soporte en Español",
                    description: "Atención personalizada en tu zona horaria, habla con expertos locales",
                  },
                  {
                    title: "Capacitación Incluida",
                    description: "Entrenamiento completo para tu equipo, presencial o remoto",
                  },
                ].map((beneficio, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{beneficio.title}</h3>
                      <p className="text-muted-foreground">{beneficio.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Industrias */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame title={`Empresas que confían en nosotros en ${ciudad.nombre}`}>
              <div className="p-8">
                <p className="text-muted-foreground mb-6">
                  Hemos implementado {servicio.nombre} para empresas de diversos giros en {ciudad.nombre}:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    "Retail y Comercio",
                    "Manufactura",
                    "Farmacéutica",
                    "Alimentos y Bebidas",
                    "Logística",
                    "Construcción",
                  ].map((industria, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span>{industria}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame>
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para optimizar tu negocio en {ciudad.nombre}?</h2>
                <p className="text-muted-foreground mb-6 text-balance">
                  Agenda una consultoría gratuita y descubre cómo {servicio.nombre} puede transformar tu empresa en{" "}
                  {ciudad.nombre}.
                </p>
                <Button size="lg" asChild>
                  <a href="https://cal.com/netlab" target="_blank" rel="noopener noreferrer">
                    Agendar Consultoría Gratuita
                  </a>
                </Button>
              </div>
            </TerminalFrame>
          </div>
        </section>
      </main>
    </>
  )
}
