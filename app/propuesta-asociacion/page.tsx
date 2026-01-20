import type { Metadata } from "next"
import PropuestaAsociacionClient from "./PropuestaAsociacionClient"

export const metadata: Metadata = {
  title: "Propuesta de Asociación - NetLab Nueva Etapa 2026",
  description:
    "Propuesta de asociación estratégica entre NetLab y Edgar Cervantes Araujo para el crecimiento de la empresa en 2026",
  robots: "noindex, nofollow",
}

export default function PropuestaAsociacionPage() {
  return <PropuestaAsociacionClient />
}
