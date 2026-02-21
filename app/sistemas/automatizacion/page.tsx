import type { Metadata } from "next"
import SistemaAutomatizacionClient from "./SistemaAutomatizacionClient"

export const metadata: Metadata = {
  title: "Automatización de Procesos México | Workflows Empresariales Guadalajara, CDMX | Netlab",
  description:
    "Automatiza procesos repetitivos en tu empresa en México. Correos de seguimiento, alertas inteligentes, asignación de tareas y reportes programados en Guadalajara, CDMX, Monterrey. Ahorra horas cada semana y elimina errores por olvido en tu negocio PyME.",
  keywords: [
    "automatización de procesos México",
    "workflow automation PyMEs",
    "automatización Odoo México",
    "automatización empresarial Guadalajara",
    "flujos de trabajo automáticos",
    "correos automáticos seguimiento",
    "reportes automáticos empresa",
    "eliminar trabajo manual PyME",
  ],
  openGraph: {
    title: "Automatización de Procesos Empresariales México | Netlab",
    description:
      "Automatiza procesos repetitivos: correos, alertas, tareas y reportes. Ahorra tiempo y elimina errores por olvido.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaAutomatizacionPage() {
  return <SistemaAutomatizacionClient />
}
