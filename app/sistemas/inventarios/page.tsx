import type { Metadata } from "next"
import InventariosClientWrapper from "./client-wrapper"

export const metadata: Metadata = {
  title: "Control de Inventarios México | Software Almacén Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Sistema de inventarios en tiempo real con alertas de stock mínimo, control de almacenes múltiples y trazabilidad completa en México. Optimiza tu capital de trabajo y nunca te quedes sin mercancía en Guadalajara, Ciudad de México, Monterrey. Software para inventarios PyMEs.",
  keywords: [
    "control de inventarios México",
    "software inventarios PyMEs",
    "Odoo inventarios México",
    "sistema de inventarios Guadalajara",
    "control de almacén",
    "inventario tiempo real",
    "trazabilidad inventarios",
    "alertas de stock mínimo",
  ],
  openGraph: {
    title: "Sistema de Control de Inventarios México | Netlab",
    description:
      "Control total de tu inventario en tiempo real: alertas automáticas, múltiples almacenes y reportes de rotación para tomar mejores decisiones.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaInventariosPage() {
  return <InventariosClientWrapper />
}
