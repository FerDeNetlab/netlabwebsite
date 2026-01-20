import type { Metadata } from "next"
import GomwaterClient from "./GomwaterClient"

export const metadata: Metadata = {
  title: "Netlab × GOMWATER | Modelo de Colaboración",
  description:
    "Modelo de colaboración por proyecto entre Netlab y GOMWATER para optimizar operaciones, gestión de proyectos y control interno en soluciones de tratamiento de agua.",
  keywords:
    "GOMWATER, Netlab, tratamiento de agua, gestión de proyectos, control interno, ERP, consultoría operativa, project management",
  openGraph: {
    title: "Netlab × GOMWATER | Modelo de Colaboración",
    description: "Propuesta de colaboración estratégica para optimizar proyectos a medida y operación de GOMWATER",
    type: "website",
  },
}

export default function GomwaterPage() {
  return <GomwaterClient />
}
