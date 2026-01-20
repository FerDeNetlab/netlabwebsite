import type { Metadata } from "next"
import SistemaERPClient from "./SistemaERPClient"

export const metadata: Metadata = {
  title: "Sistema ERP para PyMEs México | Netlab - Integra Todas las Áreas de tu Negocio",
  description:
    "ERP completo para PyMEs en Guadalajara y México. Integra ventas, inventarios, compras, contabilidad y CRM en un solo sistema. Elimina trabajo duplicado y obtén visibilidad completa de tu negocio en tiempo real.",
  keywords: [
    "ERP para PyMEs",
    "sistema ERP México",
    "ERP Guadalajara",
    "ERP pequeñas empresas",
    "sistema integrado de gestión",
    "software ERP PyME",
    "ERP económico México",
    "sistema administrativo empresarial",
    "ERP para negocios",
    "integrar sistemas empresariales",
    "unificar sistemas de negocio",
    "ERP todo en uno",
    "sistema de gestión empresarial",
    "ERP cloud México",
    "ERP Odoo México",
    "como unificar mis sistemas",
    "eliminar trabajo duplicado empresa",
    "visibilidad completa del negocio",
    "ERP ventas inventarios contabilidad",
  ],
  openGraph: {
    title: "Sistema ERP para PyMEs México | Netlab",
    description:
      "Integra ventas, inventarios, compras, contabilidad y CRM en un solo sistema. Elimina trabajo duplicado y obtén control total de tu negocio.",
    type: "website",
  },
}

export default function SistemaERPPage() {
  return <SistemaERPClient />
}
