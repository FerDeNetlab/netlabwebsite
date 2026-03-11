import CssalesClient from './CssalesClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Propuesta CSsales × Netlab — Transformación Digital',
  description: 'Propuesta comercial exclusiva para CSsales: Odoo ERP + CRM, Sitio Web IT y Sitio Web Juguetes. Oferta válida hasta el 15 de marzo.',
}

export default function CssalesPage() {
  return <CssalesClient />
}
