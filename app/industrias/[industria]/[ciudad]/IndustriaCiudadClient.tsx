"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, MapPin, Building2, Zap, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Industria, Ciudad } from "@/lib/seo-data"
import Navbar from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"

interface Props {
  industria: Industria
  ciudad: Ciudad
}

export default function IndustriaCiudadClient({ industria, ciudad }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const solucionesPorIndustria: Record<string, string[]> = {
    retail: ["POS y Punto de Venta", "Control de Inventarios", "E-commerce Integrado", "CRM para Retail"],
    manufactura: ["MRP y Planificación", "Control de Producción", "Gestión de Calidad", "Trazabilidad de Lotes"],
    farmaceutica: [
      "Cumplimiento Regulatorio",
      "Control de Lotes y Caducidades",
      "Trazabilidad Completa",
      "Reportes COFEPRIS",
    ],
    alimentos: [
      "Gestión de Perecederos",
      "Control de Temperatura",
      "Certificaciones Sanitarias",
      "Trazabilidad de Ingredientes",
    ],
    automotriz: ["Control de Refacciones", "Gestión de Servicios", "CRM Automotriz", "Facturación Electrónica"],
    logistica: ["Gestión de Almacenes", "Rutas de Entrega", "Tracking en Tiempo Real", "Gestión de Flota"],
    construccion: ["Control de Proyectos", "Gestión de Materiales", "Costos por Obra", "Facturación por Avance"],
    tecnologia: ["Gestión de Proyectos", "Time Tracking", "Facturación Recurrente", "CRM para SaaS"],
    salud: ["Historia Clínica", "Agenda de Citas", "Facturación Médica", "Inventario de Medicamentos"],
    educacion: ["Gestión Escolar", "Control de Alumnos", "Facturación de Colegiaturas", "Reportes Académicos"],
  }

  const soluciones = solucionesPorIndustria[industria.slug] || [
    "Software de Ventas",
    "Control de Inventarios",
    "Facturación Electrónica",
    "CRM Empresarial",
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/#tipos-de-negocio"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a industrias
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
                  Software para {industria.nombre} en {ciudad.nombre}
                </h1>

                <p className="text-xl text-muted-foreground mb-6 text-pretty">
                  {industria.descripcion} especializadas para empresas de {industria.nombre} en {ciudad.nombre},{" "}
                  {ciudad.estado}. Implementación con Odoo adaptada a las necesidades de tu industria.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <a href="https://cal.com/netlab" target="_blank" rel="noopener noreferrer">
                      Agendar Consultoría Gratuita
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/#sistemas">Ver Todos los Sistemas</Link>
                  </Button>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Soluciones para la Industria */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame title={`Soluciones para ${industria.nombre}`}>
              <div className="p-8 grid md:grid-cols-2 gap-6">
                {soluciones.map((solucion, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                    <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">{solucion}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Beneficios Específicos */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame title={`Ventajas para tu empresa de ${industria.nombre}`}>
              <div className="p-8 grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <Shield className="w-12 h-12 text-primary" />
                  <h3 className="font-semibold text-lg">Cumplimiento Regulatorio</h3>
                  <p className="text-muted-foreground">
                    Sistemas que cumplen con todas las normativas mexicanas de tu industria
                  </p>
                </div>

                <div className="flex flex-col items-center text-center gap-3">
                  <TrendingUp className="w-12 h-12 text-primary" />
                  <h3 className="font-semibold text-lg">Aumenta tu Productividad</h3>
                  <p className="text-muted-foreground">Automatización de procesos específicos de {industria.nombre}</p>
                </div>

                <div className="flex flex-col items-center text-center gap-3">
                  <Building2 className="w-12 h-12 text-primary" />
                  <h3 className="font-semibold text-lg">Experiencia en {industria.nombre}</h3>
                  <p className="text-muted-foreground">Equipo especializado con casos de éxito en tu industria</p>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </section>

        {/* Por qué elegir Netlab */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame title={`¿Por qué Netlab en ${ciudad.nombre}?`}>
              <div className="p-8 grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Atención Presencial",
                    description: `Equipo disponible en ${ciudad.nombre} para reuniones y seguimiento personalizado`,
                  },
                  {
                    title: "Implementación Especializada",
                    description: `Experiencia comprobada en empresas de ${industria.nombre}`,
                  },
                  {
                    title: "Soporte Continuo",
                    description: "Acompañamiento durante toda la operación, capacitación y actualizaciones",
                  },
                  {
                    title: "Casos de Éxito",
                    description: `Referencias verificables de clientes de ${industria.nombre} en México`,
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

        {/* CTA Final */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <TerminalFrame>
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Transforma tu empresa de {industria.nombre} en {ciudad.nombre}
                </h2>
                <p className="text-muted-foreground mb-6 text-balance">
                  Agenda una consultoría gratuita y descubre cómo nuestras soluciones especializadas pueden optimizar tu
                  negocio.
                </p>
                <Button size="lg" asChild>
                  <a href="https://cal.com/netlab" target="_blank" rel="noopener noreferrer">
                    Hablar con un Especialista
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
