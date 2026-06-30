import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { casosIA } from "@/lib/seo-data"
import OdooIACasoClient from "./OdooIACasoClient"

type Props = { params: Promise<{ caso: string }> }

const baseUrl = "https://www.netlab.mx"

export async function generateStaticParams() {
  return casosIA.map((c) => ({ caso: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { caso: slug } = await params
  const caso = casosIA.find((c) => c.slug === slug)
  if (!caso) return { title: "Página no encontrada | Netlab" }

  const title = `${caso.titulo} | Netlab`
  const description = `${caso.descripcion} ${caso.solucion}`.slice(0, 300)

  return {
    title,
    description,
    keywords: [
      caso.keyword,
      `${caso.keyword} Odoo`,
      `${caso.keyword} México`,
      "inteligencia artificial Odoo",
      "IA para Odoo",
      "análisis de datos Odoo",
      "Netlab IA",
      `${caso.nombre} México`,
    ],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "es_MX",
      url: `${baseUrl}/odoo-ia/${slug}`,
    },
    alternates: { canonical: `${baseUrl}/odoo-ia/${slug}` },
  }
}

export default async function OdooIACasoPage({ params }: Props) {
  const { caso: slug } = await params
  const caso = casosIA.find((c) => c.slug === slug)
  if (!caso) notFound()

  const pageUrl = `${baseUrl}/odoo-ia/${slug}`

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: caso.titulo,
    serviceType: caso.nombre,
    description: caso.solucion,
    provider: { "@type": "Organization", name: "Netlab Consulting", url: baseUrl },
    areaServed: { "@type": "Country", name: "México" },
    url: pageUrl,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Netlab", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Netlab IA", item: `${baseUrl}/#netlab-ia` },
      { "@type": "ListItem", position: 3, name: caso.nombre, item: pageUrl },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cómo funciona el ${caso.nombre.toLowerCase()} en Odoo?`,
        acceptedAnswer: { "@type": "Answer", text: caso.solucion },
      },
      {
        "@type": "Question",
        name: `¿Qué problema resuelve?`,
        acceptedAnswer: { "@type": "Answer", text: caso.problema },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <OdooIACasoClient caso={caso} />
    </>
  )
}
