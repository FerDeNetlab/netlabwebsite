import { Suspense } from "react"
import { Metadata } from "next"
import { AgendarClient } from "./AgendarClient"

export const metadata: Metadata = {
  title: "Agendar diagnóstico gratis | Netlab Odoo Community",
  description: "Cuéntanos sobre tu empresa y agendamos una consulta sin compromiso para implementar Odoo Community Edition.",
  robots: "noindex",
}

export default function AgendarPage() {
  return (
    <Suspense>
      <AgendarClient />
    </Suspense>
  )
}
