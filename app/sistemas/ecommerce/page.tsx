import type { Metadata } from "next"
import SistemaEcommerceClient from "./SistemaEcommerceClient"

export const metadata: Metadata = {
  title: "Integración Ecommerce con ERP México | Sincroniza Tienda Online Guadalajara, CDMX | Netlab",
  description:
    "Integra tu tienda online con inventarios, ventas y facturación en México. Sincronización automática de stock, pedidos y productos entre tu ecommerce y sistema ERP en Guadalajara, CDMX, Monterrey. Evita vender lo que no tienes y ahorra horas de trabajo manual.",
  keywords: [
    "integración ecommerce ERP México",
    "sincronizar tienda online inventarios",
    "Odoo ecommerce México",
    "conectar ecommerce con ERP",
    "stock tiempo real tienda web",
    "automatizar pedidos ecommerce",
    "integración multichannel México",
    "unificar inventario físico online",
  ],
  openGraph: {
    title: "Integración Ecommerce con ERP México | Netlab",
    description:
      "Conecta tu tienda online con inventarios, ventas y facturación automática. Stock en tiempo real y pedidos sincronizados.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaEcommercePage() {
  return <SistemaEcommerceClient />
}
