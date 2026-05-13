import type { Metadata } from "next"
import DABSClient from "./DABSClient"

export const metadata: Metadata = {
  title: "Netlab × Grupo DABS | Propuesta Odoo CE Starter",
  description:
    "Propuesta comercial para Grupo DABS: implementación Odoo Community Edition con diseño de procesos, inventario, compras, ventas y facturación electrónica CFDI 4.0.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Netlab × Grupo DABS | Odoo CE Starter",
    description:
      "Sistema operativo digital para distribuidora de partes diesel. Inventario, compras, ventas y facturación en una sola plataforma.",
    type: "website",
  },
}

export default function DABSPage() {
  return <DABSClient />
}
