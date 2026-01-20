import type { MetadataRoute } from "next"
import { servicios, ciudades, industrias } from "@/lib/seo-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.netlab.mx"
  const currentDate = new Date()

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Sistemas
    {
      url: `${baseUrl}/sistemas/ventas`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/crm`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/pos`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/inventarios`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/facturacion`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/erp`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/administrativo`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/ecommerce`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sistemas/automatizacion`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Servicios especializados
    {
      url: `${baseUrl}/desarrollo-enterprise`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/soluciones-hardware`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  for (const servicio of servicios) {
    for (const ciudad of ciudades) {
      routes.push({
        url: `${baseUrl}/servicios/${servicio.slug}/${ciudad.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }
  }

  for (const industria of industrias) {
    for (const ciudad of ciudades) {
      routes.push({
        url: `${baseUrl}/industrias/${industria.slug}/${ciudad.slug}`,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }
  }

  return routes
}
