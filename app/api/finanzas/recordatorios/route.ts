import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    try {
        const { searchParams } = new URL(request.url)
        const limit = Math.min(500, Number(searchParams.get('limit') || 200))
        const rows = (await sql`
      SELECT r.*, f.numero_factura, g.concepto as gasto_concepto
      FROM recordatorios_enviados r
      LEFT JOIN facturas f ON r.factura_id = f.id
      LEFT JOIN gastos g ON r.gasto_id = g.id
      ORDER BY r.enviado_at DESC
      LIMIT ${limit}
    `) as Record<string, unknown>[]
        return NextResponse.json({ recordatorios: rows })
    } catch (error) {
        console.error('[recordatorios] GET error:', error)
        return NextResponse.json({ error: 'Error al consultar recordatorios' }, { status: 500 })
    }
}
