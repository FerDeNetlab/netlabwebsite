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
      SELECT * FROM public.clientes WHERE id = ${id}
    ` as Record<string, unknown>[]

        if (result.length === 0) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error fetching cliente:', error)
        return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 })
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
        const { nombre, empresa, email, telefono, ciudad, estado, direccion, rfc, notas } = body

        const result = await sql`
      UPDATE public.clientes
      SET
        nombre = COALESCE(${nombre}, nombre),
        empresa = COALESCE(${empresa}, empresa),
        email = COALESCE(${email}, email),
        telefono = COALESCE(${telefono}, telefono),
        ciudad = COALESCE(${ciudad}, ciudad),
        estado = COALESCE(${estado}, estado),
        direccion = COALESCE(${direccion}, direccion),
        rfc = COALESCE(${rfc}, rfc),
        notas = COALESCE(${notas}, notas),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, unknown>[]

        if (result.length === 0) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[ERP] Error updating cliente:', error)
        return NextResponse.json({ error: 'Error al actualizar cliente' }, { status: 500 })
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
        // Soft delete - set activo = false
        await sql`
      UPDATE public.clientes SET activo = false, updated_at = NOW() WHERE id = ${id}
    `

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[ERP] Error deleting cliente:', error)
        return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 })
    }
}
