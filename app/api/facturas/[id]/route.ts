import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const factura = await sql`
      SELECT f.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa,
        cl.email as cliente_email, cl.telefono as cliente_telefono,
        cl.rfc as cliente_rfc, cl.direccion as cliente_direccion
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.id = ${id}
    ` as Record<string, unknown>[]

        if (factura.length === 0) return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })

        const pagos = await sql`
      SELECT * FROM pagos WHERE factura_id = ${id} ORDER BY fecha_pago DESC
    ` as Record<string, unknown>[]

        const totalPagado = pagos.reduce((sum: number, p: Record<string, unknown>) => sum + Number(p.monto), 0)

        return NextResponse.json({ ...factura[0], pagos, total_pagado: totalPagado })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al obtener factura' }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { estado } = body

        const result = await sql`
      UPDATE facturas SET estado = COALESCE(${estado}, estado), updated_at = NOW()
      WHERE id = ${id} RETURNING *
    ` as Record<string, unknown>[]

        if (result.length === 0) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al actualizar factura' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        await sql`DELETE FROM pagos WHERE factura_id = ${id}`
        await sql`DELETE FROM facturas WHERE id = ${id}`
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al eliminar factura' }, { status: 500 })
    }
}
