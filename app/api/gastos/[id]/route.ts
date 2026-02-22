import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { concepto, monto, proveedor, categoria_id, fecha_vencimiento, dia_mes, subtipo, recurrente, notas, estado, fecha_pago } = body

        const result = await sql`
      UPDATE gastos SET 
        concepto = COALESCE(${concepto || null}, concepto),
        monto = COALESCE(${monto !== undefined ? monto : null}, monto),
        proveedor = ${proveedor !== undefined ? (proveedor || null) : null},
        categoria_id = COALESCE(${categoria_id || null}, categoria_id),
        fecha_vencimiento = ${fecha_vencimiento !== undefined ? (fecha_vencimiento || null) : null},
        dia_mes = ${dia_mes !== undefined ? (dia_mes || null) : null},
        subtipo = COALESCE(${subtipo || null}, subtipo),
        recurrente = COALESCE(${recurrente !== undefined ? recurrente : null}, recurrente),
        notas = ${notas !== undefined ? (notas || null) : null},
        estado = COALESCE(${estado || null}, estado),
        fecha_pago = COALESCE(${fecha_pago || null}, fecha_pago),
        updated_at = NOW()
      WHERE id = ${id} RETURNING *
    ` as Record<string, unknown>[]

        if (result.length === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al actualizar gasto' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        await sql`DELETE FROM gastos WHERE id = ${id}`
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al eliminar gasto' }, { status: 500 })
    }
}
