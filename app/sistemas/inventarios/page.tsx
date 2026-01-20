import type { Metadata } from "next"
import InventariosClientWrapper from "./client-wrapper"

export const metadata: Metadata = {
  title: "Control de Inventarios México | Software Almacén Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Sistema de inventarios en tiempo real con alertas de stock mínimo, control de almacenes múltiples y trazabilidad completa en México. Optimiza tu capital de trabajo y nunca te quedes sin mercancía en Guadalajara, Ciudad de México, Monterrey. Software para inventarios PyMEs.",
  keywords: [
    "control de inventarios",
    "control de inventarios México",
    "software inventarios Guadalajara",
    "sistema inventarios Monterrey",
    "gestión de inventarios",
    "sistema de inventarios",
    "control de almacén",
    "software almacén",
    "stock",
    "control de stock",
    "Odoo inventarios",
    "trazabilidad",
    "alertas de stock",
    "inventario tiempo real",
    "múltiples almacenes",
    "rotación de inventarios",
    "gestión de almacén",
    "inventario perpetuo",
    "como controlar inventarios",
    "software para inventarios",
    "sistema control stock",
    "inventarios para PyMEs",
    "no quedarse sin mercancía",
    "optimizar inventarios",
    "reducir capital en inventarios",
    "Ciudad de México",
    "Querétaro",
    "Puebla",
    "León",
  ],
  openGraph: {
    title: "Sistema de Control de Inventarios México | Netlab",
    description:
      "Control total de tu inventario en tiempo real: alertas automáticas, múltiples almacenes y reportes de rotación para tomar mejores decisiones.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaInventariosPage() {
  return <InventariosClientWrapper />
}
