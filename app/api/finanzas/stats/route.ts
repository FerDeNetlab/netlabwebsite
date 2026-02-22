import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const now = new Date()
    const mes = now.getMonth() + 1
    const anio = now.getFullYear()
    const hoy = now.toISOString().split('T')[0]
    const diasEnMes = new Date(anio, mes, 0).getDate()

    // ═══ INGRESOS DEL MES (pagos cobrados) ═══
    const ingresosMes = await sql`
      SELECT COALESCE(SUM(monto), 0) as total FROM pagos
      WHERE DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    ` as Record<string, unknown>[]

    // ═══ EGRESOS DEL MES (gastos pagados) ═══
    const egresosMes = await sql`
      SELECT COALESCE(SUM(monto), 0) as total FROM gastos
      WHERE estado = 'pagado' AND DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    ` as Record<string, unknown>[]

    // ═══ CxC: por cobrar (total recurrente mensual + únicos pendientes) ═══
    const recurrentes = await sql`SELECT COALESCE(SUM(total), 0) as total FROM facturas WHERE recurrente = true` as Record<string, unknown>[]
    const unicosPendientes = await sql`
      SELECT COALESCE(SUM(f.total), 0) as total
      FROM facturas f LEFT JOIN (SELECT factura_id, SUM(monto) as pagado FROM pagos GROUP BY factura_id) p ON f.id = p.factura_id
      WHERE f.recurrente = false AND COALESCE(p.pagado, 0) < f.total
    ` as Record<string, unknown>[]

    // ═══ CxP: por pagar (gastos pendientes) ═══
    const porPagar = await sql`SELECT COALESCE(SUM(monto), 0) as total, COUNT(*) as pendientes FROM gastos WHERE estado = 'pendiente'` as Record<string, unknown>[]

    // ═══ ALERTAS ═══
    const alertas: { tipo: string; severity: 'danger' | 'warning' | 'info'; titulo: string; detalle: string; link?: string }[] = []

    // 1. COBROS RETRASADOS — Recurrentes con dia_mes ya pasado y sin pago este mes
    const facturasRecurrentes = await sql`
      SELECT f.id, f.numero_factura, f.concepto, f.total, f.dia_mes, cl.nombre as cliente
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.recurrente = true AND f.dia_mes IS NOT NULL
    ` as Record<string, unknown>[]

    const pagosMes = await sql`
      SELECT factura_id FROM pagos
      WHERE EXTRACT(MONTH FROM fecha_pago) = ${mes} AND EXTRACT(YEAR FROM fecha_pago) = ${anio}
    ` as Record<string, unknown>[]
    const pagosMesSet = new Set(pagosMes.map(p => p.factura_id as string))

    const diaHoy = now.getDate()
    for (const f of facturasRecurrentes) {
      const diaMes = Math.min(Number(f.dia_mes), diasEnMes)
      if (diaHoy > diaMes && !pagosMesSet.has(f.id as string)) {
        const diasRetraso = diaHoy - diaMes
        alertas.push({
          tipo: 'cobro_retrasado',
          severity: diasRetraso > 10 ? 'danger' : 'warning',
          titulo: `Cobro retrasado: ${f.numero_factura}`,
          detalle: `${f.cliente || f.concepto} — $${Number(f.total).toLocaleString('es-MX')} (${diasRetraso} días de retraso)`,
          link: '/admin/finanzas/movimientos',
        })
      }
    }

    // 2. COBROS PRÓXIMOS — Recurrentes con dia_mes en los próximos 5 días
    for (const f of facturasRecurrentes) {
      const diaMes = Math.min(Number(f.dia_mes), diasEnMes)
      const diasPara = diaMes - diaHoy
      if (diasPara >= 0 && diasPara <= 5 && !pagosMesSet.has(f.id as string)) {
        alertas.push({
          tipo: 'cobro_proximo',
          severity: 'info',
          titulo: `Cobro próximo: ${f.numero_factura}`,
          detalle: `${f.cliente || f.concepto} — $${Number(f.total).toLocaleString('es-MX')} (${diasPara === 0 ? 'hoy' : `en ${diasPara} día${diasPara > 1 ? 's' : ''}`})`,
          link: '/admin/finanzas/movimientos',
        })
      }
    }

    // 3. GASTOS RETRASADOS — Recurrentes con dia_mes ya pasado y no pagados
    const gastosRecurrentes = await sql`
      SELECT g.id, g.concepto, g.monto, g.dia_mes, g.proveedor
      FROM gastos g WHERE g.recurrente = true AND g.dia_mes IS NOT NULL AND g.estado = 'pendiente'
    ` as Record<string, unknown>[]

    for (const g of gastosRecurrentes) {
      const diaMes = Math.min(Number(g.dia_mes), diasEnMes)
      if (diaHoy > diaMes) {
        const diasRetraso = diaHoy - diaMes
        alertas.push({
          tipo: 'gasto_retrasado',
          severity: diasRetraso > 10 ? 'danger' : 'warning',
          titulo: `Pago retrasado: ${g.concepto}`,
          detalle: `${g.proveedor || ''} — $${Number(g.monto).toLocaleString('es-MX')} (${diasRetraso} días de retraso)`,
          link: '/admin/finanzas/movimientos',
        })
      }
    }

    // 4. GASTOS PRÓXIMOS — Recurrentes/únicos que vencen en los próximos 5 días
    const gastosProximos = await sql`
      SELECT g.concepto, g.monto, g.dia_mes, g.fecha_vencimiento, g.recurrente, g.proveedor,
        cg.nombre as categoria_nombre, cg.color as categoria_color
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE g.estado = 'pendiente'
    ` as Record<string, unknown>[]

    for (const g of gastosProximos) {
      let diaMes: number | null = null
      if (g.recurrente && g.dia_mes) {
        diaMes = Math.min(Number(g.dia_mes), diasEnMes)
      } else if (g.fecha_vencimiento) {
        const fv = new Date(g.fecha_vencimiento as string)
        if (fv.getMonth() + 1 === mes && fv.getFullYear() === anio) diaMes = fv.getDate()
      }
      if (diaMes !== null) {
        const diasPara = diaMes - diaHoy
        if (diasPara >= 0 && diasPara <= 5 && !gastosRecurrentes.find(gr => gr.concepto === g.concepto)) {
          alertas.push({
            tipo: 'gasto_proximo',
            severity: 'info',
            titulo: `Pago próximo: ${g.concepto}`,
            detalle: `${g.proveedor || g.categoria_nombre || ''} — $${Number(g.monto).toLocaleString('es-MX')} (${diasPara === 0 ? 'hoy' : `en ${diasPara} día${diasPara > 1 ? 's' : ''}`})`,
            link: '/admin/finanzas/movimientos',
          })
        }
      }
    }

    // 5. FACTURAS ÚNICAS VENCIDAS — fecha_vencimiento pasada y sin pago completo
    const facturasVencidas = await sql`
      SELECT f.id, f.numero_factura, f.concepto, f.total, f.fecha_vencimiento, cl.nombre as cliente
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      LEFT JOIN (SELECT factura_id, SUM(monto) as pagado FROM pagos GROUP BY factura_id) p ON f.id = p.factura_id
      WHERE f.recurrente = false AND f.fecha_vencimiento < ${hoy} AND COALESCE(p.pagado, 0) < f.total
      ORDER BY f.fecha_vencimiento ASC LIMIT 5
    ` as Record<string, unknown>[]

    for (const f of facturasVencidas) {
      const diasRetraso = Math.round((now.getTime() - new Date(f.fecha_vencimiento as string).getTime()) / (1000 * 60 * 60 * 24))
      alertas.push({
        tipo: 'factura_vencida',
        severity: 'danger',
        titulo: `Factura vencida: ${f.numero_factura}`,
        detalle: `${f.cliente || f.concepto} — $${Number(f.total).toLocaleString('es-MX')} (${diasRetraso} días vencida)`,
        link: `/admin/finanzas/facturas/${f.id}`,
      })
    }

    // 6. BALANCE NEGATIVO
    const ingresos = Number(ingresosMes[0].total)
    const egresos = Number(egresosMes[0].total)
    if (egresos > ingresos && ingresos > 0) {
      alertas.push({
        tipo: 'balance_negativo',
        severity: 'danger',
        titulo: 'Balance del mes negativo',
        detalle: `Egresos ($${egresos.toLocaleString('es-MX')}) superan ingresos ($${ingresos.toLocaleString('es-MX')}) por $${(egresos - ingresos).toLocaleString('es-MX')}`,
        link: '/admin/finanzas/reportes',
      })
    }

    // Sort: danger first, then warning, then info
    const severityOrder = { danger: 0, warning: 1, info: 2 }
    alertas.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    return NextResponse.json({
      cxc: { por_cobrar: Number(recurrentes[0].total) + Number(unicosPendientes[0].total), pendientes: facturasRecurrentes.length },
      cxp: { por_pagar: Number(porPagar[0].total), pendientes: Number(porPagar[0].pendientes) },
      ingresos_mes: ingresos,
      egresos_mes: egresos,
      balance_mes: ingresos - egresos,
      alertas,
    })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al obtener stats financieros' }, { status: 500 })
  }
}
