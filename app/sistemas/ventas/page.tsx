import type { Metadata } from "next"
import SistemaVentasClient from "./SistemaVentasClient"

export const metadata: Metadata = {
  title: "Sistema de Ventas Odoo México | Software Comercial Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Software de ventas para PyMEs en México. Genera cotizaciones profesionales, gestiona órdenes de venta y aumenta el desempeño de tu equipo comercial en Guadalajara, Ciudad de México, Monterrey. Sistema integrado con inventarios y CRM.",
  keywords: [
    "sistema de ventas",
    "software de ventas",
    "software de ventas México",
    "sistema de ventas Guadalajara",
    "software comercial CDMX",
    "sistema de ventas Monterrey",
    "cotizaciones automáticas",
    "órdenes de venta",
    "Odoo ventas",
    "Odoo ventas México",
    "aumentar ventas",
    "como vender más",
    "gestión comercial",
    "equipo de ventas",
    "pipeline de ventas",
    "reportes de ventas",
    "CRM ventas",
    "cotizador online",
    "cotizador automático",
    "sistema comercial",
    "vender más",
    "mejorar ventas",
    "software para vender",
    "sistema para vendedores",
    "México",
    "Guadalajara",
    "Ciudad de México",
    "Monterrey",
    "Querétaro",
    "PyMEs",
    "software empresarial",
  ],
  openGraph: {
    title: "Sistema de Ventas Odoo para PyMEs México | Netlab",
    description:
      "Genera cotizaciones en segundos, da seguimiento a cada oportunidad y cierra más negocios con nuestro sistema de ventas integrado.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaVentasPage() {
  return <SistemaVentasClient />
}
