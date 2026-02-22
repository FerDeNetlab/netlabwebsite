import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const mes = Number(searchParams.get('mes') || new Date().getMonth() + 1)
    const anio = Number(searchParams.get('anio') || new Date().getFullYear())
    const vista = searchParams.get('vista') || 'ideales'

    if (vista === 'efectuados') {
      // === PAGOS EFECTUADOS: what actually happened ===

      // Cobros reales (pagos recibidos en este mes)
      const cobrosReales = await sql`
        SELECT p.id, CONCAT('Pago ', f.numero_factura) as titulo, p.monto,
          p.fecha_pago as fecha, 'realizado' as estado,
          cl.nombre as cliente_nombre, 'ingreso' as tipo,
          f.fecha_vencimiento, f.dia_mes, f.recurrente, f.fecha_emision, f.fecha_envio
        FROM pagos p LEFT JOIN facturas f ON p.factura_id = f.id
        LEFT JOIN clientes cl ON f.cliente_id = cl.id
        WHERE EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
          AND EXTRACT(YEAR FROM p.fecha_pago) = ${anio}
        ORDER BY p.fecha_pago
      ` as Record<string, unknown>[]

      // Calculate desfase for each cobro
      const cobrosConDesfase = cobrosReales.map((c: Record<string, unknown>) => {
        let diasDesfase: number | null = null
        let fechaIdeal: string | null = null
        if (c.recurrente && c.dia_mes) {
          // For recurring: ideal date is dia_mes of the payment month
          const fp = new Date(c.fecha as string)
          const lastDay = new Date(fp.getFullYear(), fp.getMonth() + 1, 0).getDate()
          const idealDay = Math.min(Number(c.dia_mes), lastDay)
          fechaIdeal = `${fp.getFullYear()}-${String(fp.getMonth() + 1).padStart(2, '0')}-${String(idealDay).padStart(2, '0')}`
          diasDesfase = Math.round((fp.getTime() - new Date(fechaIdeal).getTime()) / (1000 * 60 * 60 * 24))
        } else if (c.fecha_vencimiento) {
          const fv = new Date(c.fecha_vencimiento as string)
          const fp = new Date(c.fecha as string)
          fechaIdeal = (c.fecha_vencimiento as string).split('T')[0]
          diasDesfase = Math.round((fp.getTime() - fv.getTime()) / (1000 * 60 * 60 * 24))
        }

        // Timeline days
        let diasEmisionEnvio: number | null = null
        let diasEnvioPago: number | null = null
        let diasEmisionPago: number | null = null
        const fp = new Date(c.fecha as string)
        if (c.fecha_emision) {
          const fe = new Date(c.fecha_emision as string)
          diasEmisionPago = Math.round((fp.getTime() - fe.getTime()) / (1000 * 60 * 60 * 24))
          if (c.fecha_envio) {
            const fenv = new Date(c.fecha_envio as string)
            diasEmisionEnvio = Math.round((fenv.getTime() - fe.getTime()) / (1000 * 60 * 60 * 24))
            diasEnvioPago = Math.round((fp.getTime() - fenv.getTime()) / (1000 * 60 * 60 * 24))
          }
        }

        return {
          ...c,
          dias_desfase: diasDesfase,
          fecha_ideal: fechaIdeal,
          dias_emision_envio: diasEmisionEnvio,
          dias_envio_pago: diasEnvioPago,
          dias_emision_pago: diasEmisionPago,
        }
      })

      // Gastos pagados en este mes
      const gastosPagados = await sql`
        SELECT g.id, g.concepto as titulo, g.monto,
          g.fecha_pago as fecha, 'pagado' as estado,
          g.proveedor as cliente_nombre, 'egreso' as tipo, g.subtipo,
          cg.color as categoria_color
        FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
        WHERE g.estado = 'pagado'
          AND EXTRACT(MONTH FROM g.fecha_pago) = ${mes}
          AND EXTRACT(YEAR FROM g.fecha_pago) = ${anio}
        ORDER BY g.fecha_pago
      ` as Record<string, unknown>[]

      // KPIs for this month
      const desfases = cobrosConDesfase.filter(c => c.dias_desfase !== null)
      const promedioDesfase = desfases.length > 0
        ? Math.round(desfases.reduce((sum, c) => sum + (c.dias_desfase || 0), 0) / desfases.length)
        : 0
      const aTiempo = desfases.filter(c => (c.dias_desfase || 0) <= 0).length
      const pctATiempo = desfases.length > 0 ? Math.round((aTiempo / desfases.length) * 100) : 100

      return NextResponse.json({
        eventos: [...cobrosConDesfase, ...gastosPagados],
        kpis: {
          promedio_desfase: promedioDesfase,
          pct_a_tiempo: pctATiempo,
          total_cobros: cobrosReales.length,
          total_ingresos: cobrosReales.reduce((s: number, c: Record<string, unknown>) => s + Number(c.monto), 0),
          total_egresos: gastosPagados.reduce((s: number, c: Record<string, unknown>) => s + Number(c.monto), 0),
        },
        mes, anio, vista,
      })

    } else {
      // === PAGOS IDEALES: what should happen ===

      // 1. Cobros puntuales
      const cobros = await sql`
        SELECT f.id, f.numero_factura as titulo, f.total as monto,
          f.fecha_vencimiento as fecha, f.estado,
          cl.nombre as cliente_nombre, 'cobro' as tipo, f.tipo as subtipo
        FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
        WHERE f.recurrente = false
          AND EXTRACT(MONTH FROM f.fecha_vencimiento) = ${mes}
          AND EXTRACT(YEAR FROM f.fecha_vencimiento) = ${anio}
        ORDER BY f.fecha_vencimiento
      ` as Record<string, unknown>[]

      // 2. Cobros recurrentes
      const cobrosRecurrentes = await sql`
        SELECT f.id, f.numero_factura as titulo, f.total as monto,
          f.dia_mes, f.estado,
          cl.nombre as cliente_nombre, 'cobro_recurrente' as tipo, f.tipo as subtipo
        FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
        WHERE f.recurrente = true AND f.dia_mes IS NOT NULL
          AND f.estado IN ('pendiente', 'parcial')
        ORDER BY f.dia_mes
      ` as Record<string, unknown>[]

      const cobrosRec = cobrosRecurrentes.map((r: Record<string, unknown>) => {
        const dia = Math.min(Number(r.dia_mes), new Date(anio, mes, 0).getDate())
        return { ...r, fecha: `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}` }
      })

      // 3. Gastos puntuales
      const pagos = await sql`
        SELECT g.id, g.concepto as titulo, g.monto,
          g.fecha_vencimiento as fecha, g.estado,
          g.proveedor as cliente_nombre, 'pago' as tipo, g.subtipo,
          cg.color as categoria_color
        FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
        WHERE g.recurrente = false
          AND EXTRACT(MONTH FROM g.fecha_vencimiento) = ${mes}
          AND EXTRACT(YEAR FROM g.fecha_vencimiento) = ${anio}
        ORDER BY g.fecha_vencimiento
      ` as Record<string, unknown>[]

      // 4. Gastos fijos recurrentes
      const gastosFijos = await sql`
        SELECT g.id, g.concepto as titulo, g.monto,
          g.dia_mes, g.estado,
          g.proveedor as cliente_nombre, 'pago_fijo' as tipo, g.subtipo,
          cg.color as categoria_color
        FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
        WHERE g.recurrente = true AND g.dia_mes IS NOT NULL
          AND g.estado = 'pendiente'
        ORDER BY g.dia_mes
      ` as Record<string, unknown>[]

      const gastosFijosConFecha = gastosFijos.map((r: Record<string, unknown>) => {
        const dia = Math.min(Number(r.dia_mes), new Date(anio, mes, 0).getDate())
        return { ...r, fecha: `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}` }
      })

      return NextResponse.json({
        eventos: [...cobros, ...cobrosRec, ...pagos, ...gastosFijosConFecha],
        mes, anio, vista,
      })
    }
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al obtener calendario' }, { status: 500 })
  }
}
