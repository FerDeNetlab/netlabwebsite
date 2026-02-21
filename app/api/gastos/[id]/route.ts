import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { estado, fecha_pago, metodo_pago, referencia } = body

        const result = await sql`
      UPDATE gastos SET 
        estado = COALESCE(${estado}, estado),
        fecha_pago = COALESCE(${fecha_pago || null}, fecha_pago),
        metodo_pago = COALESCE(${metodo_pago || null}, metodo_pago),
        referencia = COALESCE(${referencia || null}, referencia),
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
