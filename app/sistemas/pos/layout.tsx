import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Punto de Venta (POS) | Sistema de Caja Integrado | Netlab México",
  description:
    "Punto de venta moderno conectado con inventarios y facturación. Cobra rápido, actualiza stock automáticamente y genera reportes en tiempo real. Ideal para tiendas, restaurantes y negocios retail.",
  keywords: [
    "punto de venta",
    "POS",
    "sistema POS",
    "caja registradora",
    "cobrar rápido",
    "terminal punto de venta",
    "Odoo POS",
    "punto de venta México",
    "sistema de cobro",
    "ventas mostrador",
    "retail",
    "tienda",
    "restaurante",
    "facturación punto de venta",
    "inventario tiempo real",
    "México",
    "Guadalajara",
    "PyMEs",
  ],
  openGraph: {
    title: "Sistema Punto de Venta (POS) | Netlab",
    description:
      "Moderniza tu punto de venta con sistema integrado: cobro rápido, control de inventario automático y reportes en tiempo real.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaPOSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
