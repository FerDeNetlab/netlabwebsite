import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    // 5 queries consolidadas — reemplaza las 15+ queries anteriores

    // 1. Ingresos y egresos confirmados del mes (con movimiento bancario)
    const [ingresosEgresos] = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN tipo_netlab = 'emitida' AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) AS ingresos_cfdi_mes,
        COALESCE(SUM(CASE WHEN tipo_netlab = 'recibida' AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE) THEN total ELSE 0 END), 0) AS egresos_cfdi_mes
      FROM cfdis
    ` as Record<string, unknown>[]

    // 2. Ingresos cobrados vía pagos manuales del mes
    const [pagosDelMes] = await sql`
      SELECT COALESCE(SUM(monto), 0) AS total
      FROM pagos
      WHERE DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    ` as Record<string, unknown>[]

    // 3. Cuentas por cobrar (facturas pendientes)
    const [cxcRow] = await sql`
      SELECT
        COUNT(*) FILTER (WHERE estado IN ('pendiente', 'vencida', 'parcial')) AS pendientes,
        COALESCE(SUM(total) FILTER (WHERE estado IN ('pendiente', 'vencida', 'parcial')), 0) AS por_cobrar
      FROM facturas
    ` as Record<string, unknown>[]

    // 4. Cuentas por pagar (gastos pendientes)
    const [cxpRow] = await sql`
      SELECT
        COUNT(*) FILTER (WHERE estado = 'pendiente') AS pendientes,
        COALESCE(SUM(monto) FILTER (WHERE estado = 'pendiente'), 0) AS por_pagar
      FROM gastos
      WHERE fecha_baja IS NULL OR fecha_baja > CURRENT_DATE
    ` as Record<string, unknown>[]

    // 5. Alertas simples: facturas vencidas, gastos vencidos, balance negativo
    const alertasRows = await sql`
      SELECT 'factura_vencida' AS tipo, f.numero_factura AS referencia,
        cl.nombre AS nombre, f.total AS monto,
        f.fecha_vencimiento::text AS fecha,
        f.id AS link_id
      FROM facturas f
      LEFT JOIN clientes cl ON cl.id = f.cliente_id
      WHERE f.estado IN ('pendiente', 'parcial', 'vencida')
        AND f.recurrente = false
        AND f.fecha_vencimiento < CURRENT_DATE
      ORDER BY f.fecha_vencimiento ASC
      LIMIT 5
    ` as Record<string, unknown>[]

    const ingresosMes = Number(pagosDelMes.total) + Number(ingresosEgresos.ingresos_cfdi_mes)
    const egresosMes = Number(ingresosEgresos.egresos_cfdi_mes)
    const balanceMes = ingresosMes - egresosMes

    const alertas = [
      ...alertasRows.map((r) => ({
        tipo: r.tipo as string,
        severity: 'danger' as const,
        titulo: `Factura vencida: ${r.referencia}`,
        detalle: `${r.nombre || 'Sin cliente'} — $${Number(r.monto).toLocaleString('es-MX')}`,
        link: `/admin/finanzas/facturas/${r.link_id}`,
      })),
      ...(balanceMes < 0 ? [{
        tipo: 'balance_negativo',
        severity: 'danger' as const,
        titulo: 'Balance del mes negativo',
        detalle: `Egresos superan ingresos por $${Math.abs(balanceMes).toLocaleString('es-MX')}`,
        link: '/admin/finanzas/facturas',
      }] : []),
    ]

    return NextResponse.json({
      cxc: {
        pendientes: Number(cxcRow.pendientes),
        por_cobrar: Number(cxcRow.por_cobrar),
      },
      cxp: {
        pendientes: Number(cxpRow.pendientes),
        por_pagar: Number(cxpRow.por_pagar),
      },
      ingresos_mes: ingresosMes,
      egresos_mes: egresosMes,
      balance_mes: balanceMes,
      alertas,
    })
  } catch (error) {
    console.error('[ERP] Error stats:', error)
    return NextResponse.json({ error: 'Error al obtener stats financieros' }, { status: 500 })
  }
}
