import type { Metadata } from "next"
import FacturacionClientPage from "./facturacionClient"

export const metadata: Metadata = {
  title: "Facturación Electrónica CFDI México | Timbrado SAT Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Sistema de facturación electrónica CFDI integrado con tus ventas en México. Timbrado automático ante el SAT, envío por email y control de cobranza en Guadalajara, Ciudad de México, Monterrey. Cumplimiento fiscal garantizado para tu negocio PyME.",
  keywords: [
    "facturación electrónica México",
    "CFDI timbrado SAT",
    "Odoo facturación México",
    "sistema de facturación PyMEs",
    "facturación automática",
    "cumplimiento fiscal México",
    "control de cobranza",
    "factura electrónica Guadalajara",
  ],
  openGraph: {
    title: "Sistema de Facturación Electrónica CFDI México | Netlab",
    description:
      "Facturación electrónica automática desde tus ventas. Timbrado ante el SAT, envío por email y control de cobranza en un solo sistema.",
    type: "website",
    locale: "es_MX",
  },
}

export default function SistemaFacturacionPage() {
  return <FacturacionClientPage />
}
