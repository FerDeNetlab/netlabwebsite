import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ flujoId: string }> }

export async function GET(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { flujoId } = await params

    try {
        const flujoRows = await sql`
            SELECT f.*, c.proyecto_id, c.nombre AS categoria_nombre, c.slug AS categoria_slug, c.color AS categoria_color
            FROM doc_flujos f
            JOIN doc_categorias c ON c.id = f.categoria_id
            WHERE f.id = ${flujoId}
            LIMIT 1
        ` as Record<string, unknown>[]
        if (!flujoRows[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

        const pasos = await sql`
            SELECT * FROM doc_pasos WHERE flujo_id = ${flujoId}
            ORDER BY orden ASC, created_at ASC
        ` as Record<string, unknown>[]

        return NextResponse.json({ ...flujoRows[0], pasos })
    } catch (error) {
        console.error('[doc-flujo] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener flujo' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { flujoId } = await params

    try {
        const body = await request.json()
        const { nombre, descripcion, proposito, accion_principal } = body

        const result = await sql`
            UPDATE doc_flujos SET
                nombre = COALESCE(${nombre ?? null}, nombre),
                descripcion = ${descripcion ?? null},
                proposito = ${proposito ?? null},
                accion_principal = ${accion_principal ?? null}
            WHERE id = ${flujoId}
            RETURNING *
        ` as Record<string, unknown>[]
        if (!result[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-flujo] PUT error:', error)
        return NextResponse.json({ error: 'Error al actualizar flujo' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { flujoId } = await params

    try {
        await sql`DELETE FROM doc_flujos WHERE id = ${flujoId}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[doc-flujo] DELETE error:', error)
        return NextResponse.json({ error: 'Error al eliminar flujo' }, { status: 500 })
    }
}
