import type { Metadata } from "next"
import SistemaPOSClient from "./SistemaPOSClient"

export const metadata: Metadata = {
  title: "Punto de Venta POS México | Software para Retail y Restaurantes Guadalajara, CDMX | Netlab",
  description:
    "Sistema punto de venta POS para retail, restaurantes, farmacias y comercios en México. Cobro rápido, control de caja, reportes de ventas e integración con inventarios en Guadalajara, Ciudad de México, Monterrey. Software POS confiable para PyMEs.",
  keywords: [
    "punto de venta México",
    "POS para PyMEs",
    "Odoo POS México",
    "punto de venta restaurantes",
    "POS para retail",
    "software punto de venta Guadalajara",
    "sistema POS integrado inventarios",
    "control de caja",
  ],
  openGraph: {
    title: "Sistema Punto de Venta POS México | Netlab",
    description:
      "Cobra rápido, controla tu caja y ten reportes en tiempo real. Sistema POS integrado con inventarios para retail y restaurantes.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaPOSPage() {
  return <SistemaPOSClient />
}
