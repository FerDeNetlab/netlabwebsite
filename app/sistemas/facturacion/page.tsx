import type { Metadata } from "next"
import FacturacionClientPage from "./facturacionClient"

export const metadata: Metadata = {
  title: "Facturación Electrónica CFDI México | Timbrado SAT Guadalajara, CDMX, Monterrey | Netlab",
  description:
    "Sistema de facturación electrónica CFDI integrado con tus ventas en México. Timbrado automático ante el SAT, envío por email y control de cobranza en Guadalajara, Ciudad de México, Monterrey. Cumplimiento fiscal garantizado para tu negocio PyME.",
  keywords: [
    "facturación electrónica",
    "facturación electrónica México",
    "CFDI",
    "CFDI México",
    "timbrado SAT",
    "factura electrónica",
    "factura electrónica Guadalajara",
    "CFDI Monterrey",
    "Odoo facturación",
    "facturación automática",
    "sistema de facturación",
    "facturación México",
    "XML",
    "PDF",
    "timbrado automático",
    "cumplimiento fiscal",
    "SAT",
    "facturar automáticamente",
    "como facturar más rápido",
    "sistema facturación SAT",
    "cuentas por cobrar",
    "cobranza",
    "control de cobranza",
    "facturación PyMEs",
    "Ciudad de México",
    "Querétaro",
    "Puebla",
    "León",
  ],
  openGraph: {
    title: "Sistema de Facturación Electrónica CFDI México | Netlab",
    description:
      "Facturación electrónica automática desde tus ventas. Timbrado ante el SAT, envío por email y control de cobranza en un solo sistema.",
    type: "website",
    locale: "es_MX",
  },
}
// </CHANGE>

export default function SistemaFacturacionPage() {
  return <FacturacionClientPage />
}
