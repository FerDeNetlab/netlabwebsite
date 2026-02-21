import { ciudades } from "./seo-data"

/**
 * Centralized footer data. Source of truth for all footer links and content.
 * Uses cities from seo-data.ts to avoid duplication.
 */

export const footerSystems = [
    { name: "Sistema de Ventas", href: "/sistemas/ventas" },
    { name: "CRM para Negocios", href: "/sistemas/crm" },
    { name: "Control de Inventarios", href: "/sistemas/inventarios" },
    { name: "Punto de Venta POS", href: "/sistemas/pos" },
    { name: "Sistema ERP", href: "/sistemas/erp" },
    { name: "E-commerce", href: "/sistemas/ecommerce" },
] as const

export const footerServices = [
    { name: "Implementación Odoo", href: "/#servicios" },
    { name: "Desarrollo Enterprise", href: "/desarrollo-enterprise" },
    { name: "Soluciones Hardware", href: "/soluciones-hardware" },
    { name: "Automatización", href: "/sistemas/automatizacion" },
] as const

// First 9 cities from seo-data to show in the footer
export const footerCities = ciudades.slice(0, 9).map(c => c.nombre)
