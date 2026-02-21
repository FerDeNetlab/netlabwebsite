import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const meses = Number(searchParams.get('meses') || 6)

    const today = new Date()

    // 1. Recurring income (facturas recurrentes con dia_mes)
    const ingresosRecurrentes = await sql`
      SELECT f.total as monto, f.dia_mes, f.concepto,
        cl.nombre as cliente_nombre
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.recurrente = true AND f.dia_mes IS NOT NULL
        AND f.estado IN ('pendiente', 'parcial')
    ` as Record<string, unknown>[]

    // 2. Recurring expenses (gastos fijos con dia_mes)
    const gastosFijos = await sql`
      SELECT g.monto, g.dia_mes, g.concepto, g.subtipo
      FROM gastos g
      WHERE g.recurrente = true AND g.dia_mes IS NOT NULL
        AND g.estado = 'pendiente'
    ` as Record<string, unknown>[]

    // 3. One-time invoices pending (with fecha_vencimiento)
    const ingresosPuntuales = await sql`
      SELECT f.total as monto, f.fecha_vencimiento as fecha, f.concepto,
        cl.nombre as cliente_nombre
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.recurrente = false AND f.estado IN ('pendiente', 'parcial')
        AND f.fecha_vencimiento IS NOT NULL
      ORDER BY f.fecha_vencimiento
    ` as Record<string, unknown>[]

    // 4. One-time expenses pending
    const gastosPuntuales = await sql`
      SELECT g.monto, g.fecha_vencimiento as fecha, g.concepto
      FROM gastos g
      WHERE g.recurrente = false AND g.estado = 'pendiente'
        AND g.fecha_vencimiento IS NOT NULL
      ORDER BY g.fecha_vencimiento
    ` as Record<string, unknown>[]

    // 5. Historical: income last 30 days
    const ingresosRecibidos = await sql`
      SELECT COALESCE(SUM(monto), 0) as total FROM pagos
      WHERE fecha_pago >= CURRENT_DATE - INTERVAL '30 days'
    ` as Record<string, unknown>[]

    // 6. Historical: expenses last 30 days
    const egresosRealizados = await sql`
      SELECT COALESCE(SUM(monto), 0) as total FROM gastos
      WHERE estado = 'pagado' AND fecha_pago >= CURRENT_DATE - INTERVAL '30 days'
    ` as Record<string, unknown>[]

    const saldoActual = Number(ingresosRecibidos[0]?.total || 0) - Number(egresosRealizados[0]?.total || 0)

    // Build monthly projections
    const proyeccionMensual = []
    let saldoAcumulado = saldoActual

    for (let i = 0; i < meses; i++) {
      const fecha = new Date(today.getFullYear(), today.getMonth() + i, 1)
      const mes = fecha.getMonth() + 1
      const anio = fecha.getFullYear()
      const mesLabel = fecha.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })

      // Recurring income for this month
      const ingresoRecMes = ingresosRecurrentes.reduce(
        (sum: number, r: Record<string, unknown>) => sum + Number(r.monto), 0
      )

      // Recurring expenses for this month
      const egresoRecMes = gastosFijos.reduce(
        (sum: number, r: Record<string, unknown>) => sum + Number(r.monto), 0
      )

      // Sueldos subtotal (for breakdown)
      const sueldosMes = gastosFijos
        .filter((r: Record<string, unknown>) => r.subtipo === 'sueldo')
        .reduce((sum: number, r: Record<string, unknown>) => sum + Number(r.monto), 0)

      // One-time income for this month
      const ingresoPuntMes = ingresosPuntuales
        .filter((r: Record<string, unknown>) => {
          const f = new Date(r.fecha as string)
          return f.getMonth() + 1 === mes && f.getFullYear() === anio
        })
        .reduce((sum: number, r: Record<string, unknown>) => sum + Number(r.monto), 0)

      // One-time expenses for this month
      const egresoPuntMes = gastosPuntuales
        .filter((r: Record<string, unknown>) => {
          const f = new Date(r.fecha as string)
          return f.getMonth() + 1 === mes && f.getFullYear() === anio
        })
        .reduce((sum: number, r: Record<string, unknown>) => sum + Number(r.monto), 0)

      const totalIngresos = ingresoRecMes + ingresoPuntMes
      const totalEgresos = egresoRecMes + egresoPuntMes
      const neto = totalIngresos - totalEgresos
      saldoAcumulado += neto

      proyeccionMensual.push({
        mes: mesLabel,
        mesNum: mes,
        anio,
        ingresos: {
          recurrente: ingresoRecMes,
          puntual: ingresoPuntMes,
          total: totalIngresos,
        },
        egresos: {
          recurrente: egresoRecMes - sueldosMes,
          sueldos: sueldosMes,
          puntual: egresoPuntMes,
          total: totalEgresos,
        },
        neto,
        saldoAcumulado,
      })
    }

    // Summary
    const totalIngresosProyectado = proyeccionMensual.reduce((s, m) => s + m.ingresos.total, 0)
    const totalEgresosProyectado = proyeccionMensual.reduce((s, m) => s + m.egresos.total, 0)

    return NextResponse.json({
      proyeccion: proyeccionMensual,
      resumen: {
        saldo_actual: saldoActual,
        ingresos_proyectados: totalIngresosProyectado,
        egresos_proyectados: totalEgresosProyectado,
        saldo_proyectado: saldoActual + totalIngresosProyectado - totalEgresosProyectado,
        meta_mensual: totalEgresosProyectado > 0 ? totalEgresosProyectado / meses : 0,
      },
      detalle: {
        ingresos_recurrentes: ingresosRecurrentes.length,
        gastos_fijos: gastosFijos.length,
        ingresos_puntuales: ingresosPuntuales.length,
        gastos_puntuales: gastosPuntuales.length,
      }
    })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al calcular flujo de efectivo' }, { status: 500 })
  }
}
