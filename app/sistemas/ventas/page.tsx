import type { Metadata } from "next"
import SistemaVentasClient from "./SistemaVentasClient"

export const metadata: Metadata = {
  title: "Sistema de Ventas Odoo México | Software Comercial Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Software de ventas para PyMEs en México. Genera cotizaciones profesionales, gestiona órdenes de venta y aumenta el desempeño de tu equipo comercial en Guadalajara, Ciudad de México, Monterrey. Sistema integrado con inventarios y CRM.",
  keywords: [
    "sistema de ventas",
    "software de ventas México",
    "Odoo ventas México",
    "sistema de ventas Guadalajara",
    "cotizaciones automáticas",
    "gestión comercial PyMEs",
    "pipeline de ventas CRM",
    "software comercial CDMX",
  ],
  openGraph: {
    title: "Sistema de Ventas Odoo para PyMEs México | Netlab",
    description:
      "Genera cotizaciones en segundos, da seguimiento a cada oportunidad y cierra más negocios con nuestro sistema de ventas integrado.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaVentasPage() {
  return <SistemaVentasClient />
}
