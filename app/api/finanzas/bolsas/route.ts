import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { BOLSAS_SAF, BOLSA_LABEL, BOLSA_DESCRIPCION, BOLSA_COLOR } from '@/lib/finanzas-bolsas'

/**
 * GET /api/finanzas/bolsas
 * Devuelve para cada bolsa SAF:
 *   - ingresos_asignados: SUM(pagos) cuya factura tiene bolsa_destino = X
 *   - egresos_consumidos: SUM(gastos pagados) con bolsa_origen = X
 *   - egresos_pendientes: SUM(gastos pendientes) con bolsa_origen = X
 *   - saldo_disponible: ingresos_asignados - egresos_consumidos
 *
 * Por defecto, opera sobre el mes/año actual. ?mes=&ano= para override.
 */
export async function GET(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const now = new Date()
        const mes = Number(searchParams.get('mes') || now.getMonth() + 1)
        const ano = Number(searchParams.get('ano') || now.getFullYear())

        // Ingresos asignados por bolsa (vía pagos del período + bolsa_destino de la factura)
        const ingresosResult = await sql`
      SELECT COALESCE(f.bolsa_destino, 'crecimiento') as bolsa,
             COALESCE(SUM(p.monto), 0) as monto
      FROM pagos p
      JOIN facturas f ON p.factura_id = f.id
      WHERE EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM p.fecha_pago) = ${ano}
      GROUP BY COALESCE(f.bolsa_destino, 'crecimiento')
    ` as Record<string, unknown>[]

        // Egresos consumidos (pagados) por bolsa
        const egresosPagadosResult = await sql`
      SELECT COALESCE(bolsa_origen, 'operacion_variable') as bolsa,
             COALESCE(SUM(monto), 0) as monto,
             COUNT(*) as n
      FROM gastos
      WHERE estado = 'pagado'
        AND EXTRACT(MONTH FROM fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM fecha_pago) = ${ano}
      GROUP BY COALESCE(bolsa_origen, 'operacion_variable')
    ` as Record<string, unknown>[]

        // Egresos pendientes por bolsa (compromisos del mes)
        const egresosPendientesResult = await sql`
      SELECT COALESCE(bolsa_origen, 'operacion_variable') as bolsa,
             COALESCE(SUM(monto), 0) as monto,
             COUNT(*) as n
      FROM gastos
      WHERE estado = 'pendiente'
        AND (
          (recurrente = true AND dia_mes IS NOT NULL)
          OR (recurrente = false
              AND EXTRACT(MONTH FROM fecha_vencimiento) = ${mes}
              AND EXTRACT(YEAR FROM fecha_vencimiento) = ${ano})
        )
      GROUP BY COALESCE(bolsa_origen, 'operacion_variable')
    ` as Record<string, unknown>[]

        const ingresosMap = new Map(ingresosResult.map((r) => [String(r.bolsa), Number(r.monto)]))
        const egresosPagadosMap = new Map(egresosPagadosResult.map((r) => [String(r.bolsa), { monto: Number(r.monto), n: Number(r.n) }]))
        const egresosPendientesMap = new Map(egresosPendientesResult.map((r) => [String(r.bolsa), { monto: Number(r.monto), n: Number(r.n) }]))

        const bolsas = BOLSAS_SAF.map((b) => {
            const ingresos = ingresosMap.get(b) || 0
            const consumido = egresosPagadosMap.get(b) || { monto: 0, n: 0 }
            const pendiente = egresosPendientesMap.get(b) || { monto: 0, n: 0 }
            const disponible = ingresos - consumido.monto
            const utilizacionPct = ingresos > 0 ? (consumido.monto / ingresos) * 100 : 0
            return {
                bolsa: b,
                nombre: BOLSA_LABEL[b],
                descripcion: BOLSA_DESCRIPCION[b],
                color: BOLSA_COLOR[b],
                ingresos_asignados: ingresos,
                egresos_consumidos: consumido.monto,
                egresos_consumidos_count: consumido.n,
                egresos_pendientes: pendiente.monto,
                egresos_pendientes_count: pendiente.n,
                saldo_disponible: disponible,
                utilizacion_porcentaje: utilizacionPct,
                proyeccion_neto: disponible - pendiente.monto,
            }
        })

        const totales = {
            ingresos_totales: bolsas.reduce((s, b) => s + b.ingresos_asignados, 0),
            egresos_totales: bolsas.reduce((s, b) => s + b.egresos_consumidos, 0),
            saldo_total: bolsas.reduce((s, b) => s + b.saldo_disponible, 0),
        }

        return NextResponse.json({ mes, ano, bolsas, totales })
    } catch (error) {
        console.error('[bolsas] Error:', error)
        return NextResponse.json({ error: 'Error al cargar bolsas' }, { status: 500 })
    }
}
