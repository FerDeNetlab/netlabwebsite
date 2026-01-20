import type { Metadata } from "next"
import SistemaAutomatizacionClient from "./SistemaAutomatizacionClient"

export const metadata: Metadata = {
  title: "Automatización de Procesos México | Workflows Empresariales Guadalajara, CDMX | Netlab",
  description:
    "Automatiza procesos repetitivos en tu empresa en México. Correos de seguimiento, alertas inteligentes, asignación de tareas y reportes programados en Guadalajara, CDMX, Monterrey. Ahorra horas cada semana y elimina errores por olvido en tu negocio PyME.",
  keywords: [
    "automatización de procesos",
    "automatización de procesos México",
    "automatizar tareas repetitivas",
    "flujos de trabajo automáticos",
    "workflow automation México",
    "automatización empresarial",
    "automatización empresarial Guadalajara",
    "correos automáticos seguimiento",
    "alertas inteligentes negocio",
    "automatizar seguimiento clientes",
    "reportes automáticos",
    "notificaciones automáticas",
    "eliminar trabajo manual",
    "ahorro de tiempo empresas",
    "procesos automáticos PyME",
    "como automatizar mi negocio",
    "reducir errores humanos",
    "tareas automáticas empresa",
    "automatización Odoo México",
    "workflows empresariales",
    "procesos de negocio automáticos",
    "Ciudad de México",
    "Monterrey",
    "Querétaro",
  ],
  openGraph: {
    title: "Automatización de Procesos Empresariales México | Netlab",
    description:
      "Automatiza procesos repetitivos: correos, alertas, tareas y reportes. Ahorra tiempo y elimina errores por olvido.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaAutomatizacionPage() {
  return <SistemaAutomatizacionClient />
}
