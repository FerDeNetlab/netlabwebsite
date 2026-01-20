import type { Metadata } from "next"
import SistemaEcommerceClient from "./SistemaEcommerceClient"

export const metadata: Metadata = {
  title: "Integración Ecommerce con ERP México | Sincroniza Tienda Online Guadalajara, CDMX | Netlab",
  description:
    "Integra tu tienda online con inventarios, ventas y facturación en México. Sincronización automática de stock, pedidos y productos entre tu ecommerce y sistema ERP en Guadalajara, CDMX, Monterrey. Evita vender lo que no tienes y ahorra horas de trabajo manual.",
  keywords: [
    "integración ecommerce",
    "integración ecommerce México",
    "sincronizar tienda online",
    "conectar ecommerce con ERP",
    "integración tienda web México",
    "sincronización inventarios online",
    "pedidos automáticos ecommerce",
    "integrar Shopify con ERP México",
    "integrar WooCommerce México",
    "conectar tienda online con inventario",
    "stock en tiempo real tienda web",
    "automatizar pedidos web",
    "facturación automática ecommerce",
    "unificar inventario físico y online",
    "como conectar mi tienda online",
    "sincronizar productos web",
    "evitar sobreventa ecommerce",
    "integración multichannel México",
    "Odoo ecommerce México",
    "ventas online y físicas",
    "Guadalajara",
    "Ciudad de México",
    "Monterrey",
  ],
  openGraph: {
    title: "Integración Ecommerce con ERP México | Netlab",
    description:
      "Conecta tu tienda online con inventarios, ventas y facturación automática. Stock en tiempo real y pedidos sincronizados.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaEcommercePage() {
  return <SistemaEcommerceClient />
}
