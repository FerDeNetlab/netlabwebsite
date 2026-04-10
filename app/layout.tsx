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
  title: "Netlab | Implementación Odoo Community en México | Sin licencias, de por vida",
  description:
    "Implementación Odoo Community Edition en México desde $40,000 MXN. ERP sin costo de licencia: ventas, CRM, inventarios, POS y facturación electrónica para PyMEs. Consultores certificados en Odoo. Guadalajara y todo México.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "https://www.netlab.mx",
  },
  keywords: [
    "implementación odoo México",
    "odoo community edition México",
    "odoo CE México",
    "implementar odoo sin licencias",
    "odoo community vs enterprise",
    "consultor odoo México",
    "consultor odoo Guadalajara",
    "odoo para PyMEs",
    "ERP para PyMEs México",
    "ERP open source México",
    "sistema de ventas México",
    "control de inventarios odoo",
    "punto de venta POS odoo",
    "CRM para negocios odoo",
    "facturación electrónica odoo",
    "software empresarial México",
    "automatización comercial",
    "odoo guadalajara",
    "implementar odoo desde 40000 pesos",
    "erp sin costo de licencia",
  ],
  authors: [{ name: "Netlab Consulting" }],
  openGraph: {
    title: "Netlab | Implementación Odoo Community en México | Sin licencias de por vida",
    description:
      "Implementamos Odoo Community Edition para PyMEs desde $40,000 MXN. ERP sin licencias: ventas, CRM, inventarios, POS y facturación. Consultores certificados en Odoo, Guadalajara.",
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
    title: "Netlab | Odoo Community para PyMEs en México | Sin licencias",
    description: "Implementamos Odoo CE desde $40,000 MXN. Sin licencias anuales, de por vida. Consultores certificados en Odoo.",
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
        name: "¿Qué es Odoo Community Edition?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Odoo Community Edition es la versión gratuita y de código abierto del ERP Odoo. Incluye módulos de ventas, CRM, inventarios, punto de venta, contabilidad y facturación electrónica. A diferencia de Odoo Enterprise, no tiene costo de licencia anual, lo que representa un ahorro de más de $420,000 MXN en 5 años para 10 usuarios.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta implementar Odoo Community en México?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La implementación de Odoo Community Edition en México parte desde $40,000 MXN para 10 usuarios (plan Starter). El plan Growth para 25 usuarios cuesta $90,000 MXN. Estos precios incluyen instalación, configuración, capacitación del equipo y soporte post-lanzamiento. No hay costo de licencia anual.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la diferencia entre Odoo Community y Odoo Enterprise?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Odoo Community Edition es gratuito y de código abierto; Odoo Enterprise cuesta aproximadamente $7,000 MXN por usuario al año. Para 10 usuarios durante 5 años, Enterprise suma más de $420,000 MXN solo en licencias. Community incluye las funciones esenciales para la mayoría de las PyMEs: ventas, CRM, inventarios, POS, facturación CFDI y contabilidad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Odoo Community Edition sirve para PyMEs mexicanas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Odoo Community Edition está completamente adaptado para México: incluye facturación electrónica CFDI 4.0, soporte para regímenes fiscales del SAT, manejo de IVA y IEPS, y múltiples monedas. Es ideal para PyMEs con 5 a 100 usuarios en sectores como retail, manufactura, alimentos, logística y servicios.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo tarda implementar Odoo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Una implementación básica de Odoo Community (ventas, inventarios, facturación) tarda entre 4 y 8 semanas. El proceso incluye análisis de procesos, configuración del sistema, migración de datos, capacitación del equipo y acompañamiento en el lanzamiento. Implementaciones más complejas con manufactura o integraciones pueden tomar 3 meses.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué ERP recomiendan para PyMEs en México?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recomendamos Odoo Community Edition para PyMEs en México. Es el ERP más completo sin costo de licencia: integra ventas, CRM, inventarios, punto de venta, facturación electrónica CFDI y contabilidad en un solo sistema. Es escalable, de código abierto y tiene una comunidad global activa.",
        },
      },
      {
        "@type": "Question",
        name: "¿Odoo Community Edition es gratis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, la licencia de Odoo Community Edition es $0. Es software de código abierto bajo licencia LGPL. Solo se paga la implementación (instalación, configuración y capacitación) y opcionalmente el hosting. No existe costo de licencia anual ni por usuario.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dan capacitación a mi equipo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, toda implementación incluye capacitación presencial o remota para usuarios y administradores. Enseñamos a tu equipo a usar Odoo en sus procesos diarios: cotizaciones, pedidos, inventario, facturación. También entregamos manuales personalizados adaptados a tu operación.",
        },
      },
      {
        "@type": "Question",
        name: "¿El sistema funciona en la nube o se instala en mis servidores?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrecemos ambas opciones. Odoo Community en la nube (VPS o servidor dedicado) parte desde $500 MXN/mes y permite acceso desde cualquier dispositivo. También instalamos en tus servidores locales si tienes infraestructura propia. Para PyMEs recomendamos la nube por menor costo y mantenimiento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué industrias atienden?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Implementamos Odoo Community en Retail, Manufactura, Alimentos y Bebidas, Farmacéutica, Logística y Distribución, Construcción, Automotriz y Servicios profesionales. Cada implementación se adapta a los procesos y regulaciones de la industria.",
        },
      },
      {
        "@type": "Question",
        name: "¿Tienen soporte después de la implementación?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El plan Starter incluye 30 días de soporte post-lanzamiento; el plan Growth incluye 60 días. Después ofrecemos planes de mantenimiento mensual que incluyen soporte técnico, actualizaciones de módulos y consultoría continua según las necesidades de tu empresa.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde están ubicados? ¿Atienden fuera de Guadalajara?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nuestra oficina principal está en Guadalajara, Jalisco. Atendemos empresas en toda la República Mexicana: Ciudad de México, Monterrey, Querétaro, Puebla, León, Tijuana, Mérida, Aguascalientes y más. Las implementaciones se realizan de forma remota o presencial según el proyecto.",
        },
      },
    ],
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo implementar Odoo Community Edition en tu empresa",
    description: "Proceso de implementación de Odoo Community en PyMEs mexicanas en 5 pasos",
    totalTime: "P8W",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "MXN",
      value: "40000",
    },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Diagnóstico de procesos",
        text: "Analizamos tus procesos actuales: ventas, inventario, facturación y operaciones. Identificamos qué módulos de Odoo CE necesitas y diseñamos el plan de implementación.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Instalación y configuración",
        text: "Instalamos Odoo Community Edition en tu servidor o en la nube. Configuramos empresas, usuarios, impuestos, CFDI y los módulos seleccionados según tu industria.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Migración de datos",
        text: "Importamos tus datos existentes: catálogo de productos, clientes, proveedores, inventario inicial y saldos contables desde tu sistema actual.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Capacitación del equipo",
        text: "Entrenamos a tus usuarios y administradores en el uso de Odoo. Materiales personalizados adaptados a tus procesos.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Lanzamiento y soporte",
        text: "Salida en vivo con acompañamiento. Soporte técnico post-lanzamiento para resolver dudas y ajustes finales.",
      },
    ],
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Odoo Community Edition",
    alternateName: "Odoo CE",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Linux, Windows",
    description: "ERP open source gratuito para PyMEs. Incluye ventas, CRM, inventarios, POS y facturación electrónica CFDI. Implementado por Netlab en México.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MXN",
      description: "Licencia gratuita. Costo de implementación desde $40,000 MXN.",
      seller: {
        "@type": "Organization",
        name: "Netlab Consulting",
        url: "https://www.netlab.mx",
      },
    },
    url: "https://www.odoo.com/page/community",
  }

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.netlab.mx/#webpage",
    url: "https://www.netlab.mx",
    name: "Netlab | Implementación Odoo Community en México",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "#faq"],
    },
  }

  return (
    <html lang="es" dir="ltr" className="dark">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TW4NG9HK');`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      </head>
      <body
        className={`${jetbrainsMono.variable} font-mono bg-[#0c0c0c] text-slate-300 antialiased min-h-screen selection:bg-[#22c55e] selection:text-black`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TW4NG9HK"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
