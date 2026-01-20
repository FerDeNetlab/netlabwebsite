import type { Metadata } from "next"
import TierraFertilClient from "./TierraFertilClient"

export const metadata: Metadata = {
  title: "Netlab × Tierra Fértil | Sistema Base Operativo Nivel 1",
  description:
    "Propuesta de implementación del Sistema Base Operativo Nivel 1 para Tierra Fértil. Digitaliza y ordena tu operación diaria sin complejidad innecesaria.",
  keywords:
    "Tierra Fértil, Netlab, sistema operativo, control de inventarios, registro de ventas, compras, central de abastos, software para negocios",
  openGraph: {
    title: "Netlab × Tierra Fértil | Sistema Base Operativo Nivel 1",
    description: "Propuesta para ordenar, registrar y dar visibilidad a la operación diaria de Tierra Fértil",
    type: "website",
  },
}

export default function TierraFertilPage() {
  return <TierraFertilClient />
}
