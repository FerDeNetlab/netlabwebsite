import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Total clientes activos
    const clientesResult = await sql`
      SELECT COUNT(*) as total FROM public.clientes WHERE activo = true
    ` as Record<string, unknown>[]

    // Cotizaciones pendientes (borrador o enviada)
    let cotizacionesPendientes = 0
    try {
      const cotizacionesResult = await sql`
        SELECT COUNT(*) as total FROM public.cotizaciones WHERE estado IN ('pendiente', 'borrador', 'enviada')
      ` as Record<string, unknown>[]
      cotizacionesPendientes = Number(cotizacionesResult[0].total)
    } catch {
      // tabla puede no existir aún
    }

    // Oportunidades CRM abiertas
    let oportunidadesAbiertas = 0
    try {
      const oportunidadesResult = await sql`
        SELECT COUNT(*) as total FROM public.oportunidades WHERE etapa NOT IN ('ganado', 'perdido')
      ` as Record<string, unknown>[]
      oportunidadesAbiertas = Number(oportunidadesResult[0].total)
    } catch {
      // tabla puede no existir aún
    }

    return NextResponse.json({
      totalClientes: Number(clientesResult[0].total),
      proyectosActivos: 0,
      cotizacionesPendientes,
      oportunidadesAbiertas,
    })
  } catch (error) {
    console.error('[ERP] Error fetching stats:', error)
    return NextResponse.json({
      totalClientes: 0,
      proyectosActivos: 0,
      cotizacionesPendientes: 0,
      oportunidadesAbiertas: 0,
    })
  }
}
