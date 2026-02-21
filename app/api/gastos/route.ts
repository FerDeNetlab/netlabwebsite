import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const gastos = await sql`
      SELECT g.*, cg.nombre as categoria_nombre, cg.color as categoria_color, cg.icono as categoria_icono
      FROM gastos g
      LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      ORDER BY g.created_at DESC
    `

        const categorias = await sql`
      SELECT * FROM categorias_gasto WHERE activo = true ORDER BY nombre
    `

        return NextResponse.json({ gastos, categorias })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al obtener gastos' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const { categoria_id, concepto, monto, fecha_vencimiento, proveedor, recurrente, dia_mes, subtipo, notas } = body

        const gasto = await sql`
      INSERT INTO gastos (id, categoria_id, concepto, monto, fecha_vencimiento, proveedor, recurrente, dia_mes, subtipo, estado, notas, created_at, updated_at)
      VALUES (gen_random_uuid(), ${categoria_id || null}, ${concepto}, ${monto}, ${fecha_vencimiento || null}, ${proveedor || null}, ${recurrente || false}, ${dia_mes || null}, ${subtipo || 'general'}, 'pendiente', ${notas || null}, NOW(), NOW())
      RETURNING *
    ` as Record<string, unknown>[]

        return NextResponse.json(gasto[0], { status: 201 })
    } catch (error) {
        console.error('[ERP] Error creating gasto:', error)
        return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 })
    }
}
