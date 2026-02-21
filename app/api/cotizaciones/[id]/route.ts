import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    try {
        const cotizacion = await sql`
      SELECT 
        c.*,
        cl.nombre as cliente_nombre,
        cl.empresa as cliente_empresa,
        cl.email as cliente_email,
        cl.telefono as cliente_telefono,
        cl.rfc as cliente_rfc,
        cl.direccion as cliente_direccion
      FROM cotizaciones c
      LEFT JOIN clientes cl ON c.cliente_id = cl.id
      WHERE c.id = ${id}
    ` as Record<string, unknown>[]

        if (cotizacion.length === 0) {
            return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
        }

        // Fetch items
        const items = await sql`
      SELECT 
        ci.*,
        p.nombre as producto_nombre
      FROM cotizacion_items ci
      LEFT JOIN productos p ON ci.producto_id = p.id
      WHERE ci.cotizacion_id = ${id}
      ORDER BY ci.created_at ASC
    `

        return NextResponse.json({
            ...cotizacion[0],
            items,
        })
    } catch (error) {
        console.error('[ERP] Error fetching cotizacion:', error)
        return NextResponse.json({ error: 'Error al obtener cotización' }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    try {
        const body = await request.json()
        const { estado } = body

        const result = await sql`
      UPDATE cotizaciones
      SET estado = COALESCE(${estado}, estado), updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, unknown>[]

        if (result.length === 0) {
            return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error updating cotizacion:', error)
        return NextResponse.json({ error: 'Error al actualizar cotización' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    try {
        // Delete items first
        await sql`DELETE FROM cotizacion_items WHERE cotizacion_id = ${id}`
        await sql`DELETE FROM cotizaciones WHERE id = ${id}`

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[ERP] Error deleting cotizacion:', error)
        return NextResponse.json({ error: 'Error al eliminar cotización' }, { status: 500 })
    }
}
