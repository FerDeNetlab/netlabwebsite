import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { servicios, ciudades } from "@/lib/seo-data"
import ServicioCiudadClient from "./ServicioCiudadClient"
import { SEOPageSchema } from "@/components/seo-page-schema"

type Props = {
  params: Promise<{
    servicio: string
    ciudad: string
  }>
}

export async function generateStaticParams() {
  const params = []
  for (const servicio of servicios) {
    for (const ciudad of ciudades) {
      params.push({
        servicio: servicio.slug,
        ciudad: ciudad.slug,
      })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { servicio: servicioSlug, ciudad: ciudadSlug } = await params

  const servicio = servicios.find((s) => s.slug === servicioSlug)
  const ciudad = ciudades.find((c) => c.slug === ciudadSlug)

  if (!servicio || !ciudad) {
    return {
      title: "Página no encontrada | Netlab",
    }
  }

  const title = `${servicio.nombre} en ${ciudad.nombre} | Netlab`
  const description = `${servicio.descripcion} para empresas en ${ciudad.nombre}, ${ciudad.estado}. Implementación, soporte y capacitación de ${servicio.nombre} con Odoo.`

  return {
    title,
    description,
    keywords: [
      `${servicio.nombre} ${ciudad.nombre}`,
      `${servicio.slug.replace("software-", "").replace("sistema-", "")} ${ciudad.nombre}`,
      `odoo ${ciudad.nombre}`,
      `software empresarial ${ciudad.nombre}`,
      `ERP ${ciudad.nombre}`,
      `implementación odoo ${ciudad.nombre}`,
      `${servicio.nombre} México`,
      `software para empresas ${ciudad.nombre}`,
      `consultoría ${ciudad.nombre}`,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_MX",
      url: `https://www.netlab.mx/servicios/${servicioSlug}/${ciudadSlug}`,
    },
    alternates: {
      canonical: `https://www.netlab.mx/servicios/${servicioSlug}/${ciudadSlug}`,
    },
  }
}

export default async function ServicioCiudadPage({ params }: Props) {
  const { servicio: servicioSlug, ciudad: ciudadSlug } = await params

  const servicio = servicios.find((s) => s.slug === servicioSlug)
  const ciudad = ciudades.find((c) => c.slug === ciudadSlug)

  if (!servicio || !ciudad) {
    notFound()
  }

  return (
    <>
      <SEOPageSchema tipo="servicio" item={servicio} ciudad={ciudad} />
      <ServicioCiudadClient servicio={servicio} ciudad={ciudad} />
    </>
  )
}
