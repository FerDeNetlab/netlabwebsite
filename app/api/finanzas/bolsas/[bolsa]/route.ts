import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request, { params }: { params: Promise<{ bolsa: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { bolsa } = await params

    try {
        const { searchParams } = new URL(request.url)
        const now = new Date()
        const mes = Number(searchParams.get('mes') || now.getMonth() + 1)
        const ano = Number(searchParams.get('ano') || now.getFullYear())

        // Ingresos del mes para esta bolsa
        const ingresos = await sql`
      SELECT p.id, p.monto, p.fecha_pago,
             f.id as factura_id, f.numero_factura, f.concepto,
             cl.nombre as cliente_nombre
      FROM pagos p
      JOIN facturas f ON p.factura_id = f.id
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE COALESCE(f.bolsa_destino, 'crecimiento') = ${bolsa}
        AND EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM p.fecha_pago) = ${ano}
      ORDER BY p.fecha_pago DESC
    `

        // Egresos del mes para esta bolsa
        const egresos = await sql`
      SELECT g.id, g.concepto, g.monto, g.estado, g.proveedor,
             g.fecha_pago, g.fecha_vencimiento, g.tipo_gasto, g.dia_mes, g.recurrente
      FROM gastos g
      WHERE COALESCE(g.bolsa_origen, 'operacion_variable') = ${bolsa}
        AND (
          (g.estado = 'pagado'
            AND EXTRACT(MONTH FROM g.fecha_pago) = ${mes}
            AND EXTRACT(YEAR FROM g.fecha_pago) = ${ano})
          OR (g.estado = 'pendiente'
            AND ((g.recurrente = true AND g.dia_mes IS NOT NULL)
              OR (g.recurrente = false
                  AND EXTRACT(MONTH FROM g.fecha_vencimiento) = ${mes}
                  AND EXTRACT(YEAR FROM g.fecha_vencimiento) = ${ano})))
        )
      ORDER BY COALESCE(g.fecha_pago, g.fecha_vencimiento) DESC
    `

        return NextResponse.json({ bolsa, mes, ano, ingresos, egresos })
    } catch (error) {
        console.error('[bolsas/detalle] Error:', error)
        return NextResponse.json({ error: 'Error al cargar detalle' }, { status: 500 })
    }
}
