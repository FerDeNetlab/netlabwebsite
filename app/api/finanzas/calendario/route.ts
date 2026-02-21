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

    // 1. Cobros puntuales (facturas con fecha_vencimiento en este mes)
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

    // 2. Cobros recurrentes (facturas con dia_mes — se repiten cada mes)
    const cobrosRecurrentes = await sql`
      SELECT f.id, f.numero_factura as titulo, f.total as monto,
        f.dia_mes, f.estado,
        cl.nombre as cliente_nombre, 'cobro_recurrente' as tipo, f.tipo as subtipo
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.recurrente = true AND f.dia_mes IS NOT NULL
        AND f.estado IN ('pendiente', 'parcial')
      ORDER BY f.dia_mes
    ` as Record<string, unknown>[]

    // Build date for each recurring cobro in this month
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

    // 4. Gastos fijos recurrentes (con dia_mes)
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

    // 5. Pagos ya realizados este mes
    const pagosRealizados = await sql`
      SELECT p.id, CONCAT('Pago ', f.numero_factura) as titulo, p.monto,
        p.fecha_pago as fecha, 'realizado' as estado,
        cl.nombre as cliente_nombre, 'ingreso' as tipo
      FROM pagos p LEFT JOIN facturas f ON p.factura_id = f.id
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM p.fecha_pago) = ${anio}
      ORDER BY p.fecha_pago
    ` as Record<string, unknown>[]

    return NextResponse.json({
      eventos: [...cobros, ...cobrosRec, ...pagos, ...gastosFijosConFecha, ...pagosRealizados],
      mes, anio,
    })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al obtener calendario' }, { status: 500 })
  }
}
