import type { Metadata } from "next"
import ProdetecsIAClient from "./ProdetecsIAClient"

export const metadata: Metadata = {
  title: "Netlab x Prodetecs | Propuesta IA para Odoo Enterprise",
  description:
    "Propuesta comercial para Prodetecs: capa de analitica inteligente con chatbot IA y dashboards en tiempo real sobre Odoo Enterprise.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Netlab x Prodetecs | Propuesta IA",
    description:
      "Plataforma de analitica en tiempo real para Odoo Enterprise con chatbot IA, dashboards y componentes generativos.",
    type: "website",
  },
}

export default function ProdetecsIAPage() {
  return <ProdetecsIAClient />
}
