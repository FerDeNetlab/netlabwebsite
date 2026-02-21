import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') || new Date().getMonth() + 1
    const anio = searchParams.get('anio') || new Date().getFullYear()

    // Cobros del mes (facturas con fecha_vencimiento en este mes)
    const cobros = await sql`
      SELECT f.id, f.numero_factura as titulo, f.total as monto, 
        f.fecha_vencimiento as fecha, f.estado,
        cl.nombre as cliente_nombre, 'cobro' as tipo
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE EXTRACT(MONTH FROM f.fecha_vencimiento) = ${mes}
        AND EXTRACT(YEAR FROM f.fecha_vencimiento) = ${anio}
      ORDER BY f.fecha_vencimiento
    ` as Record<string, unknown>[]

    // Pagos del mes (gastos con fecha_vencimiento en este mes)
    const pagos = await sql`
      SELECT g.id, g.concepto as titulo, g.monto,
        g.fecha_vencimiento as fecha, g.estado,
        g.proveedor as cliente_nombre, 'pago' as tipo,
        cg.color as categoria_color
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE EXTRACT(MONTH FROM g.fecha_vencimiento) = ${mes}
        AND EXTRACT(YEAR FROM g.fecha_vencimiento) = ${anio}
      ORDER BY g.fecha_vencimiento
    ` as Record<string, unknown>[]

    // Pagos registrados en este mes
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
      eventos: [...cobros, ...pagos, ...pagosRealizados],
      mes: Number(mes),
      anio: Number(anio),
    })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al obtener calendario' }, { status: 500 })
  }
}
