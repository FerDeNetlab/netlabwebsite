import type { Metadata } from "next"
import SistemaAdministrativoClient from "./SistemaAdministrativoClient"

export const metadata: Metadata = {
  title: "Sistema Administrativo México | Software Compras, Contabilidad, RRHH Guadalajara, CDMX | Netlab",
  description:
    "Sistema administrativo completo para PyMEs en México. Automatiza compras, contabilidad, recursos humanos y control financiero en Guadalajara, Ciudad de México, Monterrey. Libera tiempo de tu equipo administrativo y mantén las finanzas al día.",
  keywords: [
    "sistema administrativo México",
    "software administrativo PyMEs",
    "Odoo compras contabilidad México",
    "sistema de compras Guadalajara",
    "contabilidad automatizada PyME",
    "software RRHH México",
    "control financiero empresas",
    "automatizar área administrativa",
  ],
  openGraph: {
    title: "Sistema Administrativo para Empresas México | Netlab",
    description:
      "Automatiza compras, contabilidad, recursos humanos y control financiero. Sistema administrativo completo para PyMEs.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaAdministrativoPage() {
  return <SistemaAdministrativoClient />
}
