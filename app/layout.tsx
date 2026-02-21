import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AuthSessionProvider } from "@/components/session-provider"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.netlab.mx"),
  title: "Netlab | Implementación Odoo, ERP para Negocios y Sistemas para PyMEs en México",
  description:
    "Implementación Odoo, ERP para negocios, sistemas de ventas, punto de venta, control de inventarios y automatización comercial. Consultoría para PyMEs en Guadalajara y México. Software para negocios que funciona.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "https://www.netlab.mx",
  },
  keywords: [
    "implementación odoo México",
    "ERP para PyMEs",
    "sistema de ventas México",
    "control de inventarios",
    "punto de venta POS",
    "CRM para negocios",
    "Odoo Guadalajara",
    "software empresarial México",
    "automatización comercial",
    "consultoría PyME",
    "sistema de facturación",
    "digitalización de negocios",
  ],
  authors: [{ name: "Netlab Consulting" }],
  openGraph: {
    title: "Netlab | Implementación Odoo y ERP para PyMEs en México",
    description:
      "Sistemas para negocios: Implementación Odoo, ERP, punto de venta, control de inventarios. Consultoría para PyMEs en Guadalajara.",
    type: "website",
    locale: "es_MX",
    siteName: "Netlab",
    url: "https://www.netlab.mx",
    images: [
      {
        url: "/logo-netlab.png",
        width: 1200,
        height: 630,
        alt: "Netlab - Implementación Odoo y ERP para PyMEs en México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Netlab | Sistemas para Negocios y Consultoría ERP",
    description: "Implementación Odoo, ERP para PyMEs y automatización comercial en México",
    images: ["/logo-netlab.png"],
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
  generator: "Netlab",
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
    telephone: "+52-55-1318-0427",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calz Independencia Sur 1045",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      postalCode: "44460",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.netlab.mx/#website",
    url: "https://www.netlab.mx",
    name: "Netlab",
    description: "Implementación Odoo, ERP y sistemas para negocios en México",
    publisher: {
      "@type": "Organization",
      name: "Netlab Consulting",
    },
    inLanguage: "es-MX",
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.netlab.mx",
    name: "Netlab Consulting",
    description:
      "Implementación de Odoo ERP, sistemas de ventas, control de inventarios y software para PyMEs en México",
    url: "https://www.netlab.mx",
    telephone: "+52-55-1318-0427",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calz Independencia Sur 1045",
      addressLocality: "Guadalajara",
      addressRegion: "Jalisco",
      postalCode: "44460",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.65863826430465,
      longitude: -103.35042883099904,
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
      ratingValue: "5.0",
      reviewCount: "1",
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
        name: "¿Cuánto cuesta implementar Odoo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El costo de implementación Odoo varía según módulos y personalización. Para PyMEs, una implementación básica (ventas, inventarios, facturación) va desde $50,000 MXN. Agenda un diagnóstico gratuito para una cotización exacta.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dan capacitación a mi equipo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutamente. La consultoría de negocios incluye entrenamiento a usuarios y administradores. Parte fundamental de la implementación Odoo es que tu equipo adopte el sistema en el día a día.",
        },
      },
      {
        "@type": "Question",
        name: "¿Tienen oficinas en Guadalajara y otras ciudades?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nuestra oficina principal está en Guadalajara, pero atendemos empresas en toda la República Mexicana incluyendo Ciudad de México, Monterrey, Querétaro, Puebla y más ciudades. Ofrecemos reuniones presenciales y remotas.",
        },
      },
      {
        "@type": "Question",
        name: "¿El sistema funciona en la nube o local?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrecemos ambas opciones: Odoo en la nube (acceso desde cualquier lugar) o instalación local (en tus servidores). Para PyMEs recomendamos la nube por seguridad, actualizaciones automáticas y menor costo de infraestructura.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué industrias atienden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tenemos experiencia en Retail, Manufactura, Farmacéutica, Alimentos y Bebidas, Logística, Construcción, Automotriz y más. Cada implementación se adapta a los procesos específicos de tu industria y cumplimiento regulatorio.",
        },
      },
    ],
  }

  return (
    <html lang="es" dir="ltr" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono bg-[#0c0c0c] text-slate-300 antialiased min-h-screen selection:bg-[#22c55e] selection:text-black`}
      >
        {/* Skip to content - Accessibility */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Saltar al contenido principal
        </a>
        <AuthSessionProvider>
          <div id="main-content">
            {children}
          </div>
        </AuthSessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
