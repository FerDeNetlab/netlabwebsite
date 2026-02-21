import type { Metadata } from "next"
import AuraClient from "./AuraClient"

export const metadata: Metadata = {
  title: "Netlab × Aura Market | Orquestador de Marketplaces",
  description: "Propuesta técnica y comercial para la centralización y automatización de marketplaces de Aura Market.",
  robots: "noindex, nofollow",
}

export default function AuraPage() {
  return <AuraClient />
}
