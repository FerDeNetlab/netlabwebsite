"use client"

import type { Servicio, Ciudad, Industria } from "@/lib/seo-data"

interface SEOPageSchemaProps {
    tipo: "servicio" | "industria"
    item: Servicio | Industria
    ciudad: Ciudad
}

export function SEOPageSchema({ tipo, item, ciudad }: SEOPageSchemaProps) {
    const baseUrl = "https://www.netlab.mx"
    const pageUrl = `${baseUrl}/${tipo === "servicio" ? "servicios" : "industrias"}/${item.slug}/${ciudad.slug}`

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Netlab",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": tipo === "servicio" ? "Servicios" : "Industrias",
                "item": `${baseUrl}/${tipo === "servicio" ? "#sistemas" : "#sistemas"}` // Adjusting based on current structure
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": item.nombre,
                "item": pageUrl
            }
        ]
    }

    const localizedServiceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${item.nombre} en ${ciudad.nombre}`,
        "description": `${item.descripcion} en ${ciudad.nombre}, ${ciudad.estado}.`,
        "provider": {
            "@type": "Organization",
            "name": "Netlab Consulting",
            "url": baseUrl
        },
        "areaServed": {
            "@type": "City",
            "name": ciudad.nombre,
            "addressRegion": ciudad.estado,
            "addressCountry": "MX"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": item.nombre,
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": item.nombre
                    }
                }
            ]
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedServiceSchema) }}
            />
        </>
    )
}
