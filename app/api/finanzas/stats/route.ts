import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    // CxC: facturas pendientes
    const cxc = await sql`
      SELECT COALESCE(SUM(f.total), 0) as total,
        COUNT(*) FILTER (WHERE f.estado IN ('pendiente', 'parcial')) as pendientes,
        COUNT(*) FILTER (WHERE f.estado = 'pagada') as pagadas,
        COUNT(*) FILTER (WHERE f.fecha_vencimiento < CURRENT_DATE AND f.estado IN ('pendiente', 'parcial')) as vencidas
      FROM facturas f
    ` as Record<string, unknown>[]

    const porCobrar = await sql`
      SELECT COALESCE(SUM(f.total), 0) - COALESCE(SUM(p.total_pagado), 0) as saldo
      FROM facturas f
      LEFT JOIN (SELECT factura_id, SUM(monto) as total_pagado FROM pagos GROUP BY factura_id) p ON f.id = p.factura_id
      WHERE f.estado IN ('pendiente', 'parcial')
    ` as Record<string, unknown>[]

    // CxP: gastos pendientes
    const cxp = await sql`
      SELECT COALESCE(SUM(monto), 0) as total,
        COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes,
        COUNT(*) FILTER (WHERE estado = 'pagado') as pagados,
        COUNT(*) FILTER (WHERE fecha_vencimiento < CURRENT_DATE AND estado = 'pendiente') as vencidos
      FROM gastos
    ` as Record<string, unknown>[]

    const porPagar = await sql`
      SELECT COALESCE(SUM(monto), 0) as saldo FROM gastos WHERE estado = 'pendiente'
    ` as Record<string, unknown>[]

    // Ingresos del mes
    const ingresosMes = await sql`
      SELECT COALESCE(SUM(monto), 0) as total FROM pagos
      WHERE DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    ` as Record<string, unknown>[]

    // Egresos del mes
    const egresosMes = await sql`
      SELECT COALESCE(SUM(monto), 0) as total FROM gastos
      WHERE estado = 'pagado' AND DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    ` as Record<string, unknown>[]

    // Top 5 facturas vencidas
    const facturasVencidas = await sql`
      SELECT f.*, cl.nombre as cliente_nombre
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.estado IN ('pendiente', 'parcial') AND f.fecha_vencimiento < CURRENT_DATE
      ORDER BY f.fecha_vencimiento ASC LIMIT 5
    ` as Record<string, unknown>[]

    // Top 5 gastos próximos
    const gastosProximos = await sql`
      SELECT g.*, cg.nombre as categoria_nombre, cg.color as categoria_color
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE g.estado = 'pendiente' AND g.fecha_vencimiento >= CURRENT_DATE
      ORDER BY g.fecha_vencimiento ASC LIMIT 5
    ` as Record<string, unknown>[]

    return NextResponse.json({
      cxc: { ...cxc[0], por_cobrar: Number(porCobrar[0].saldo) },
      cxp: { ...cxp[0], por_pagar: Number(porPagar[0].saldo) },
      ingresos_mes: Number(ingresosMes[0].total),
      egresos_mes: Number(egresosMes[0].total),
      balance_mes: Number(ingresosMes[0].total) - Number(egresosMes[0].total),
      facturas_vencidas: facturasVencidas,
      gastos_proximos: gastosProximos,
    })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al obtener stats financieros' }, { status: 500 })
  }
}
