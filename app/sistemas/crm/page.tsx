import type { Metadata } from "next"
import CRMClientPage from "./crm-client"

export const metadata: Metadata = {
  title: "CRM para PyMEs México | Software Gestión de Clientes Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Sistema CRM para gestionar clientes, prospectos y oportunidades de venta en México. Pipeline visual, seguimiento automático y reportes en Guadalajara, Ciudad de México, Monterrey. Ideal para negocios que quieren organizar su información comercial y aumentar ventas.",
  keywords: [
    "CRM",
    "CRM México",
    "CRM Guadalajara",
    "CRM Ciudad de México",
    "CRM Monterrey",
    "CRM Querétaro",
    "gestión de clientes",
    "software para gestionar clientes",
    "seguimiento de clientes",
    "base de datos de clientes",
    "organizar clientes",
    "pipeline de ventas",
    "embudo de ventas",
    "oportunidades de venta",
    "software CRM",
    "CRM para PyMEs",
    "CRM pequeñas empresas",
    "Odoo CRM",
    "Odoo CRM México",
    "relación con clientes",
    "prospectos",
    "seguimiento comercial",
    "historial de clientes",
    "como organizar clientes",
    "software relación clientes",
    "PyMEs",
    "software para negocios",
  ],
  openGraph: {
    title: "CRM para PyMEs México | Sistema de Gestión de Clientes | Netlab",
    description:
      "Organiza toda tu información de clientes, da seguimiento puntual a cada oportunidad y cierra más negocios con nuestro CRM integrado.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaCRMPage() {
  return <CRMClientPage />
}
