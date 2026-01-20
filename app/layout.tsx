import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthSessionProvider } from "@/components/session-provider"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Netlab | Implementación Odoo, ERP para Negocios y Sistemas para PyMEs en México",
  description:
    "Implementación Odoo, ERP para negocios, sistemas de ventas, punto de venta, control de inventarios y automatización comercial. Consultoría para PyMEs en Guadalajara y México. Software para negocios que funciona.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "odoo",
    "odoo méxico",
    "odoo guadalajara",
    "consultores odoo",
    "implementación odoo",
    "erp para negocios",
    "sistemas para negocios",
    "software para negocios",
    "sistema administrativo",
    "sistemas empresariales",
    "punto de venta para negocios",
    "pos para negocios",
    "sistema de ventas",
    "crm para negocios",
    "control de inventarios",
    "inventarios en tiempo real",
    "sistema para pyme",
    "erp para pyme",
    "soluciones para pymes",
    "software para pymes",
    "sistema de facturación",
    "sistema de ventas y facturación",
    "automatización comercial",
    "embudo de ventas",
    "proceso comercial",
    "mejora de procesos",
    "digitalización de negocios",
    "crecimiento empresarial",
    "optimización de operaciones",
    "consultoría de negocios",
    "consultoría erp",
    "consultoría pyme",
    "consultoría en sistemas",
    "como vender mas",
    "como vender mas en internet",
    "como mejorar los procesos de mi empresa",
    "como ser mas eficiente en mi negocio",
    "como capacitar vendedores",
  ],
  authors: [{ name: "Netlab Consulting" }],
  openGraph: {
    title: "Netlab | Implementación Odoo y ERP para PyMEs en México",
    description:
      "Sistemas para negocios: Implementación Odoo, ERP, punto de venta, control de inventarios. Consultoría para PyMEs en Guadalajara.",
    type: "website",
    locale: "es_MX",
    siteName: "Netlab",
  },
  twitter: {
    card: "summary_large_image",
    title: "Netlab | Sistemas para Negocios y Consultoría ERP",
    description: "Implementación Odoo, ERP para PyMEs y automatización comercial en México",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Netlab Consulting",
    description: "Implementación Odoo, ERP y sistemas para negocios en México",
    url: "https://www.netlab.mx",
    logo: "https://www.netlab.mx/logo-netlab.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    areaServed: [
      { "@type": "City", name: "Guadalajara" },
      { "@type": "City", name: "Ciudad de México" },
      { "@type": "City", name: "Monterrey" },
      { "@type": "City", name: "Querétaro" },
      { "@type": "City", name: "Puebla" },
      { "@type": "City", name: "León" },
      { "@type": "City", name: "Tijuana" },
      { "@type": "City", name: "Mérida" },
      { "@type": "City", name: "Aguascalientes" },
      { "@type": "City", name: "Cancún" },
      { "@type": "Country", name: "México" },
    ],
    sameAs: ["https://www.linkedin.com/company/netlab-mx"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Ventas",
      availableLanguage: ["Spanish", "English"],
    },
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.netlab.mx",
    name: "Netlab Consulting",
    description:
      "Implementación de Odoo ERP, sistemas de ventas, control de inventarios y software para PyMEs en México",
    url: "https://www.netlab.mx",
    telephone: "+52-33-1234-5678",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Patria 1201",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      postalCode: "44610",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.7339,
      longitude: -103.4104,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47",
    },
  }

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Service",
          "@id": "https://www.netlab.mx/sistemas/ventas",
          name: "Sistema de Ventas y CRM",
          description: "Software de ventas, cotizaciones y gestión de clientes para empresas en México",
          provider: {
            "@type": "Organization",
            name: "Netlab Consulting",
          },
          areaServed: "MX",
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: "https://www.netlab.mx/sistemas/ventas",
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          "@id": "https://www.netlab.mx/sistemas/inventarios",
          name: "Control de Inventarios",
          description: "Sistema de control de inventarios en tiempo real para PyMEs",
          provider: {
            "@type": "Organization",
            name: "Netlab Consulting",
          },
          areaServed: "MX",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Service",
          "@id": "https://www.netlab.mx/sistemas/pos",
          name: "Punto de Venta POS",
          description: "Sistema punto de venta para retail, restaurantes y comercios",
          provider: {
            "@type": "Organization",
            name: "Netlab Consulting",
          },
          areaServed: "MX",
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Service",
          "@id": "https://www.netlab.mx/sistemas/erp",
          name: "ERP para PyMEs",
          description: "Sistema ERP completo con Odoo para pequeñas y medianas empresas",
          provider: {
            "@type": "Organization",
            name: "Netlab Consulting",
          },
          areaServed: "MX",
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Service",
          "@id": "https://www.netlab.mx/sistemas/facturacion",
          name: "Facturación Electrónica",
          description: "Sistema de facturación electrónica CFDI 4.0 integrado",
          provider: {
            "@type": "Organization",
            name: "Netlab Consulting",
          },
          areaServed: "MX",
        },
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué ERP para negocios recomiendan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recomendamos Odoo como ERP para PyMEs porque es completo, flexible y escalable. Incluye sistema de ventas, CRM, control de inventarios, punto de venta, facturación y más módulos en un solo sistema para negocio.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo funciona un punto de venta para negocios?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un punto de venta (POS) conectado a tu sistema administrativo te permite vender, facturar y actualizar inventarios en tiempo real. Con Odoo, tu POS se integra automáticamente con control de inventarios y sistema de facturación.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo toma implementar Odoo en mi empresa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La implementación de Odoo para una PyME toma entre 2 a 6 semanas dependiendo del número de módulos y complejidad. Incluye migración de datos, capacitación y soporte inicial.",
        },
      },
      {
        "@type": "Question",
        name: "¿Ofrecen soporte y capacitación?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, incluimos capacitación completa para tu equipo y soporte continuo. La consultoría PyME incluye entrenamiento presencial o remoto y acompañamiento durante la adopción del sistema.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo probar el sistema antes de comprar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, ofrecemos demos interactivas de nuestros sistemas y una sesión de diagnóstico gratuita donde evaluamos tus necesidades y te mostramos cómo funcionaría el sistema en tu negocio.",
        },
      },
    ],
  }

  return (
    <html lang="es" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono bg-[#0c0c0c] text-slate-300 antialiased min-h-screen selection:bg-[#22c55e] selection:text-black`}
      >
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
