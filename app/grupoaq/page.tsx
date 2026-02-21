import type { Metadata } from "next"
import AQClient from "./AQClient"

export const metadata: Metadata = {
  title: "Netlab × Grupo AQ | Sistema de Inventarios en Campo",
  description: "Propuesta técnica y comercial para el desarrollo del Sistema Operativo de Inventarios en Campo de Grupo AQ.",
  robots: "noindex, nofollow",
}

export default function GrupoAQPage() {
  return <AQClient />
}
