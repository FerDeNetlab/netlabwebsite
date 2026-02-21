import type { Metadata } from "next"
import CRMClientPage from "./crm-client"

export const metadata: Metadata = {
  title: "CRM para PyMEs México | Software Gestión de Clientes Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Sistema CRM para gestionar clientes, prospectos y oportunidades de venta en México. Pipeline visual, seguimiento automático y reportes en Guadalajara, Ciudad de México, Monterrey. Ideal para negocios que quieren organizar su información comercial y aumentar ventas.",
  keywords: [
    "CRM México",
    "CRM para PyMEs",
    "gestión de clientes México",
    "Odoo CRM México",
    "pipeline de ventas",
    "seguimiento de clientes",
    "software CRM Guadalajara",
    "embudo de ventas CRM",
  ],
  openGraph: {
    title: "CRM para PyMEs México | Sistema de Gestión de Clientes | Netlab",
    description:
      "Organiza toda tu información de clientes, da seguimiento puntual a cada oportunidad y cierra más negocios con nuestro CRM integrado.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaCRMPage() {
  return <CRMClientPage />
}
