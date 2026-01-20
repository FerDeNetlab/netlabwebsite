import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { industrias, ciudades } from "@/lib/seo-data"
import IndustriaCiudadClient from "./IndustriaCiudadClient"

type Props = {
  params: Promise<{
    industria: string
    ciudad: string
  }>
}

export async function generateStaticParams() {
  const params = []
  for (const industria of industrias) {
    for (const ciudad of ciudades) {
      params.push({
        industria: industria.slug,
        ciudad: ciudad.slug,
      })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industria: industriaSlug, ciudad: ciudadSlug } = await params

  const industria = industrias.find((i) => i.slug === industriaSlug)
  const ciudad = ciudades.find((c) => c.slug === ciudadSlug)

  if (!industria || !ciudad) {
    return {
      title: "Página no encontrada | Netlab",
    }
  }

  const title = `Software para ${industria.nombre} en ${ciudad.nombre} | Netlab`
  const description = `${industria.descripcion} en ${ciudad.nombre}, ${ciudad.estado}. Sistemas especializados con Odoo para empresas de ${industria.nombre}.`

  return {
    title,
    description,
    keywords: [
      `software ${industria.nombre} ${ciudad.nombre}`,
      `ERP ${industria.nombre} ${ciudad.nombre}`,
      `sistema ${industria.nombre} ${ciudad.nombre}`,
      `odoo ${industria.nombre} ${ciudad.nombre}`,
      `software empresarial ${industria.nombre}`,
      `automatización ${industria.nombre} ${ciudad.nombre}`,
      `gestión ${industria.nombre} ${ciudad.nombre}`,
      `tecnología ${industria.nombre} México`,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_MX",
      url: `https://www.netlab.mx/industrias/${industriaSlug}/${ciudadSlug}`,
    },
  }
}

export default async function IndustriaCiudadPage({ params }: Props) {
  const { industria: industriaSlug, ciudad: ciudadSlug } = await params

  const industria = industrias.find((i) => i.slug === industriaSlug)
  const ciudad = ciudades.find((c) => c.slug === ciudadSlug)

  if (!industria || !ciudad) {
    notFound()
  }

  return <IndustriaCiudadClient industria={industria} ciudad={ciudad} />
}
