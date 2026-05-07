import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

/**
 * Flujo de caja proyectado a 4 semanas (vista detallada SAF).
 * Distinto del /flujo (mensual a 6 meses).
 */
export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const today = new Date()
        const hoy = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        // Facturas pendientes con fecha esperada de cobro (próximos 35 días)
        const facturas = await sql`
      SELECT f.id, f.total, f.concepto, f.recurrente, f.dia_mes, f.fecha_vencimiento,
             cl.nombre as cliente
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      LEFT JOIN (SELECT factura_id, SUM(monto) as pagado FROM pagos GROUP BY factura_id) p ON f.id = p.factura_id
      WHERE f.estado != 'cancelada' AND COALESCE(p.pagado, 0) < f.total
    ` as Record<string, unknown>[]

        const gastos = await sql`
      SELECT g.id, g.monto, g.concepto, g.recurrente, g.dia_mes, g.fecha_vencimiento,
             g.proveedor, g.tipo_gasto, g.bolsa_origen
      FROM gastos g WHERE g.estado = 'pendiente'
    ` as Record<string, unknown>[]

        // Saldo actual = pagos cobrados - gastos pagados últimos 30 días
        const saldoRows = await sql`
      SELECT
        COALESCE((SELECT SUM(monto) FROM pagos WHERE fecha_pago >= CURRENT_DATE - INTERVAL '30 days'), 0)
        - COALESCE((SELECT SUM(monto) FROM gastos WHERE estado = 'pagado' AND fecha_pago >= CURRENT_DATE - INTERVAL '30 days'), 0)
        AS saldo
    ` as Record<string, unknown>[]
        const saldoActual = Number(saldoRows[0]?.saldo || 0)

        // Calcular fecha esperada por cada item
        const fechaEsperada = (item: Record<string, unknown>): Date | null => {
            if (item.recurrente && item.dia_mes) {
                const ultimoDia = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
                const dia = Math.min(Number(item.dia_mes), ultimoDia)
                const f = new Date(today.getFullYear(), today.getMonth(), dia)
                // Si ya pasó este mes, usa el siguiente
                if (f < hoy) {
                    const ud2 = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate()
                    const d2 = Math.min(Number(item.dia_mes), ud2)
                    return new Date(today.getFullYear(), today.getMonth() + 1, d2)
                }
                return f
            }
            if (item.fecha_vencimiento) {
                const f = new Date(item.fecha_vencimiento as string)
                f.setHours(0, 0, 0, 0)
                return f
            }
            return null
        }

        // 4 semanas (28 días) desde hoy
        const semanas = [0, 1, 2, 3].map((i) => {
            const inicio = new Date(hoy)
            inicio.setDate(hoy.getDate() + i * 7)
            const fin = new Date(inicio)
            fin.setDate(inicio.getDate() + 6)
            return {
                semana: i + 1,
                inicio: inicio.toISOString().split('T')[0],
                fin: fin.toISOString().split('T')[0],
                inicioDate: inicio,
                finDate: fin,
                ingresos: 0,
                egresos: 0,
                items_ingreso: [] as Array<{ id: string; monto: number; concepto: string; cliente?: string; fecha: string }>,
                items_egreso: [] as Array<{ id: string; monto: number; concepto: string; proveedor?: string; fecha: string; bolsa_origen?: string }>,
            }
        })

        for (const f of facturas) {
            const fecha = fechaEsperada(f)
            if (!fecha) continue
            const sem = semanas.find((s) => fecha >= s.inicioDate && fecha <= s.finDate)
            if (sem) {
                sem.ingresos += Number(f.total)
                sem.items_ingreso.push({
                    id: String(f.id),
                    monto: Number(f.total),
                    concepto: String(f.concepto || ''),
                    cliente: (f.cliente as string) || undefined,
                    fecha: fecha.toISOString().split('T')[0],
                })
            }
        }

        for (const g of gastos) {
            const fecha = fechaEsperada(g)
            if (!fecha) continue
            const sem = semanas.find((s) => fecha >= s.inicioDate && fecha <= s.finDate)
            if (sem) {
                sem.egresos += Number(g.monto)
                sem.items_egreso.push({
                    id: String(g.id),
                    monto: Number(g.monto),
                    concepto: String(g.concepto || ''),
                    proveedor: (g.proveedor as string) || undefined,
                    fecha: fecha.toISOString().split('T')[0],
                    bolsa_origen: (g.bolsa_origen as string) || undefined,
                })
            }
        }

        // Balance acumulado
        let balance = saldoActual
        const semanasOut = semanas.map((s) => {
            balance += s.ingresos - s.egresos
            return {
                semana: s.semana,
                inicio: s.inicio,
                fin: s.fin,
                ingresos: s.ingresos,
                egresos: s.egresos,
                neto: s.ingresos - s.egresos,
                balance_acumulado: balance,
                items_ingreso: s.items_ingreso.sort((a, b) => a.fecha.localeCompare(b.fecha)),
                items_egreso: s.items_egreso.sort((a, b) => a.fecha.localeCompare(b.fecha)),
            }
        })

        return NextResponse.json({
            saldo_actual: saldoActual,
            semanas: semanasOut,
        })
    } catch (error) {
        console.error('[finanzas/flujo/semanal] Error:', error)
        return NextResponse.json({ error: 'Error al calcular flujo semanal' }, { status: 500 })
    }
}
