import type { Metadata } from "next"
import SistemaAdministrativoClient from "./SistemaAdministrativoClient"

export const metadata: Metadata = {
  title: "Sistema Administrativo México | Software Compras, Contabilidad, RRHH Guadalajara, CDMX | Netlab",
  description:
    "Sistema administrativo completo para PyMEs en México. Automatiza compras, contabilidad, recursos humanos y control financiero en Guadalajara, Ciudad de México, Monterrey. Libera tiempo de tu equipo administrativo y mantén las finanzas al día.",
  keywords: [
    "sistema administrativo empresas",
    "sistema administrativo México",
    "software administrativo Guadalajara",
    "software administrativo PyMEs",
    "sistema de compras",
    "contabilidad automatizada",
    "software contable México",
    "sistema de recursos humanos",
    "RRHH México",
    "control financiero empresas",
    "sistema de nómina",
    "nómina México",
    "gestión de compras",
    "automatizar área administrativa",
    "software contable PyME",
    "cuentas por pagar y cobrar",
    "conciliación bancaria",
    "flujo de efectivo",
    "expedientes de empleados",
    "control de asistencia",
    "como automatizar compras",
    "simplificar contabilidad",
    "sistema para administración",
    "Odoo compras México",
    "Odoo contabilidad",
    "Ciudad de México",
    "Monterrey",
    "Querétaro",
  ],
  openGraph: {
    title: "Sistema Administrativo para Empresas México | Netlab",
    description:
      "Automatiza compras, contabilidad, recursos humanos y control financiero. Sistema administrativo completo para PyMEs.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaAdministrativoPage() {
  return <SistemaAdministrativoClient />
}
