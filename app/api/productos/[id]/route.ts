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
        const result = await sql`
      SELECT * FROM public.productos WHERE id = ${id}
    ` as Record<string, unknown>[]

        if (result.length === 0) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error fetching producto:', error)
        return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 })
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
        const { nombre, descripcion, precio_unitario, categoria, unidad } = body

        const result = await sql`
      UPDATE public.productos
      SET
        nombre = COALESCE(${nombre}, nombre),
        descripcion = COALESCE(${descripcion}, descripcion),
        precio_unitario = COALESCE(${precio_unitario}, precio_unitario),
        categoria = COALESCE(${categoria}, categoria),
        unidad = COALESCE(${unidad}, unidad),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, unknown>[]

        if (result.length === 0) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error updating producto:', error)
        return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
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
        await sql`
      UPDATE public.productos SET activo = false, updated_at = NOW() WHERE id = ${id}
    `

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[ERP] Error deleting producto:', error)
        return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
    }
}
