import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Total clientes activos
    const clientesResult = await sql`
      SELECT COUNT(*) as total FROM public.clientes WHERE activo = true
    `
    
    // Proyectos activos
    const proyectosResult = await sql`
      SELECT COUNT(*) as total FROM public.proyectos WHERE estado = 'activo'
    `
    
    // Cotizaciones pendientes
    const cotizacionesResult = await sql`
      SELECT COUNT(*) as total FROM public.cotizaciones WHERE estado = 'pendiente'
    `
    
    // Tareas abiertas
    const tareasResult = await sql`
      SELECT COUNT(*) as total FROM public.tareas WHERE estado != 'completada'
    `
    
    // Ingresos del mes
    const ingresosResult = await sql`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM public.facturas 
      WHERE estado = 'pagada' 
      AND DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    `
    
    // Horas registradas del mes
    const horasResult = await sql`
      SELECT COALESCE(SUM(horas), 0) as total 
      FROM public.time_entries 
      WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
    `

    return NextResponse.json({
      totalClientes: Number(clientesResult[0].total),
      proyectosActivos: Number(proyectosResult[0].total),
      cotizacionesPendientes: Number(cotizacionesResult[0].total),
      tareasAbiertas: Number(tareasResult[0].total),
      ingresosMes: Number(ingresosResult[0].total),
      horasRegistradas: Number(horasResult[0].total)
    })
  } catch (error) {
    console.error('[v0] Error fetching stats:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
