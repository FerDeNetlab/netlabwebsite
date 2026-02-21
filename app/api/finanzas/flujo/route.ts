import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const today = new Date()

    // Ingresos esperados (facturas pendientes por fecha de vencimiento)
    const ingresosEsperados = await sql`
      SELECT fecha_vencimiento as fecha, SUM(total) as monto, 'ingreso' as tipo
      FROM facturas
      WHERE estado IN ('pendiente', 'parcial') AND fecha_vencimiento >= CURRENT_DATE
        AND fecha_vencimiento <= CURRENT_DATE + INTERVAL '90 days'
      GROUP BY fecha_vencimiento
      ORDER BY fecha_vencimiento
    ` as Record<string, unknown>[]

    // Egresos esperados (gastos pendientes por fecha de vencimiento)
    const egresosEsperados = await sql`
      SELECT fecha_vencimiento as fecha, SUM(monto) as monto, 'egreso' as tipo
      FROM gastos
      WHERE estado = 'pendiente' AND fecha_vencimiento >= CURRENT_DATE
        AND fecha_vencimiento <= CURRENT_DATE + INTERVAL '90 days'
      GROUP BY fecha_vencimiento
      ORDER BY fecha_vencimiento
    ` as Record<string, unknown>[]

    // Ingresos recibidos (últimos 30 días)
    const ingresosRecibidos = await sql`
      SELECT fecha_pago as fecha, SUM(monto) as monto, 'ingreso_real' as tipo
      FROM pagos
      WHERE fecha_pago >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY fecha_pago ORDER BY fecha_pago
    ` as Record<string, unknown>[]

    // Egresos realizados (últimos 30 días)
    const egresosRealizados = await sql`
      SELECT fecha_pago as fecha, SUM(monto) as monto, 'egreso_real' as tipo
      FROM gastos
      WHERE estado = 'pagado' AND fecha_pago >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY fecha_pago ORDER BY fecha_pago
    ` as Record<string, unknown>[]

    // Build 90-day projection
    const movimientos = [
      ...ingresosEsperados.map((r: Record<string, unknown>) => ({ fecha: r.fecha, monto: Number(r.monto), tipo: 'ingreso' })),
      ...egresosEsperados.map((r: Record<string, unknown>) => ({ fecha: r.fecha, monto: -Number(r.monto), tipo: 'egreso' })),
    ].sort((a, b) => new Date(a.fecha as string).getTime() - new Date(b.fecha as string).getTime())

    // Calculate running balance projection
    let saldo = 0
    // Sum actual income - actual expenses from last 30 days as starting point
    const totalIngresosReales = ingresosRecibidos.reduce((s: number, r: Record<string, unknown>) => s + Number(r.monto), 0)
    const totalEgresosReales = egresosRealizados.reduce((s: number, r: Record<string, unknown>) => s + Number(r.monto), 0)
    saldo = totalIngresosReales - totalEgresosReales

    const proyeccion = movimientos.map(m => {
      saldo += m.monto
      return { fecha: m.fecha, monto: m.monto, saldo, tipo: m.tipo }
    })

    // Totals for summary
    const totalPorCobrar = ingresosEsperados.reduce((s: number, r: Record<string, unknown>) => s + Number(r.monto), 0)
    const totalPorPagar = egresosEsperados.reduce((s: number, r: Record<string, unknown>) => s + Number(r.monto), 0)

    return NextResponse.json({
      proyeccion,
      resumen: {
        saldo_actual: totalIngresosReales - totalEgresosReales,
        por_cobrar_90d: totalPorCobrar,
        por_pagar_90d: totalPorPagar,
        saldo_proyectado: (totalIngresosReales - totalEgresosReales) + totalPorCobrar - totalPorPagar,
      },
      historico: {
        ingresos: ingresosRecibidos,
        egresos: egresosRealizados,
      },
    })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al calcular flujo de efectivo' }, { status: 500 })
  }
}
