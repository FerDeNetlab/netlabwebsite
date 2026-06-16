import type { Metadata } from "next"
import PIASAClient from "./PIASAClient"

export const metadata: Metadata = {
  title: "Netlab × PIASA | WMS Industrial — Control de Almacén",
  description: "Propuesta técnica y comercial para el Sistema de Gestión de Almacén (WMS) de PIASA: activos fijos, consumibles y refacciones.",
  robots: "noindex, nofollow",
}

export default function PIASAPage() {
  return <PIASAClient />
}
