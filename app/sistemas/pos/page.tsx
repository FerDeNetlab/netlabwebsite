import type { Metadata } from "next"
import SistemaPOSClient from "./SistemaPOSClient"

export const metadata: Metadata = {
  title: "Punto de Venta POS México | Software para Retail y Restaurantes Guadalajara, CDMX | Netlab",
  description:
    "Sistema punto de venta POS para retail, restaurantes, farmacias y comercios en México. Cobro rápido, control de caja, reportes de ventas e integración con inventarios en Guadalajara, Ciudad de México, Monterrey. Software POS confiable para PyMEs.",
  keywords: [
    "punto de venta",
    "POS",
    "POS México",
    "punto de venta Guadalajara",
    "POS Monterrey",
    "software punto de venta",
    "sistema POS",
    "POS para retail",
    "punto de venta restaurantes",
    "POS farmacias",
    "punto de venta tiendas",
    "software para cobrar",
    "control de caja",
    "terminal punto de venta",
    "Odoo POS",
    "POS integrado inventarios",
    "punto de venta rápido",
    "software caja registradora",
    "POS para PyMEs",
    "punto de venta negocios",
    "como cobrar más rápido",
    "sistema para cobrar ventas",
    "POS cloud",
    "punto de venta en línea",
    "Ciudad de México",
    "Querétaro",
    "Puebla",
  ],
  openGraph: {
    title: "Sistema Punto de Venta POS México | Netlab",
    description:
      "Cobra rápido, controla tu caja y ten reportes en tiempo real. Sistema POS integrado con inventarios para retail y restaurantes.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaPOSPage() {
  return <SistemaPOSClient />
}
