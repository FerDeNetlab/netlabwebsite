import type { Metadata } from "next"
import TierraFertilClient from "./TierraFertilClient"

export const metadata: Metadata = {
  title: "Netlab × Tierra Fértil | Sistema Base Operativo Nivel 1",
  description:
    "Propuesta de implementación del Sistema Base Operativo Nivel 1 para Tierra Fértil. Digitaliza y ordena tu operación diaria sin complejidad innecesaria.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Netlab × Tierra Fértil | Sistema Base Operativo Nivel 1",
    description: "Propuesta para ordenar, registrar y dar visibilidad a la operación diaria de Tierra Fértil",
    type: "website",
  },
}

export default function TierraFertilPage() {
  return <TierraFertilClient />
}
