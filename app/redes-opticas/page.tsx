import type { Metadata } from "next"
import RedesOpticasClient from "./RedesOpticasClient"

export const metadata: Metadata = {
  title: "Netlab × Redes Ópticas | Propuesta ERP a Medida — Frabe",
  description:
    "Propuesta comercial para Redes Ópticas: ERP a medida Frabe para control de órdenes de servicio, almacenes, herramientas, flotillas y operación en campo. Next.js + Supabase + PostgreSQL.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Netlab × Redes Ópticas | ERP a Medida — Frabe",
    description:
      "Sistema operativo digital para empresas de instalaciones IT con operación en campo",
    type: "website",
  },
}

export default function RedesOpticasPage() {
  return <RedesOpticasClient />
}
