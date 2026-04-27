import type { Metadata } from "next"
import IsumaClient from "./IsumaClient"

export const metadata: Metadata = {
  title: "Netlab x ISUMA | Propuesta Growth Odoo Community",
  description:
    "Propuesta comercial para ISUMA (Sunny): implementacion de Odoo Community con paquete Growth de Netlab Consulting.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Netlab x ISUMA | Propuesta Growth",
    description:
      "Sistema operativo central para importacion, inventario, ventas, CRM, facturacion y cobranza en ISUMA.",
    type: "website",
  },
}

export default function IsumaPage() {
  return <IsumaClient />
}
