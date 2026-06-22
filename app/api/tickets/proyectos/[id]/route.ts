import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// GET: una ticketera con sus tickets (acepta id o slug)
export async function GET(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const proyectoRows = await sql`
            SELECT p.*, c.empresa AS cliente_empresa, c.nombre AS cliente_nombre
            FROM ticket_proyectos p
            LEFT JOIN public.clientes c ON c.id = p.cliente_id
            WHERE p.id::text = ${id} OR p.slug = ${id}
            LIMIT 1
        ` as Record<string, unknown>[]

        if (!proyectoRows[0]) {
            return NextResponse.json({ error: 'Ticketera no encontrada' }, { status: 404 })
        }

        const tickets = await sql`
            SELECT * FROM tickets
            WHERE proyecto_id = ${proyectoRows[0].id as string}
            ORDER BY
                CASE estado WHEN 'nuevo' THEN 0 WHEN 'en_progreso' THEN 1 WHEN 'resuelto' THEN 2 ELSE 3 END,
                CASE urgencia WHEN 'critica' THEN 0 WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
                created_at DESC
        `

        return NextResponse.json({ ...proyectoRows[0], tickets })
    } catch (error) {
        console.error('[tickets-proyecto] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener ticketera' }, { status: 500 })
    }
}

// PATCH: actualiza nombre/descripcion/is_public
export async function PATCH(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { nombre, descripcion, is_public } = body

        const result = await sql`
            UPDATE ticket_proyectos
            SET
                nombre = COALESCE(${nombre ?? null}, nombre),
                descripcion = COALESCE(${descripcion ?? null}, descripcion),
                is_public = COALESCE(${typeof is_public === 'boolean' ? is_public : null}, is_public)
            WHERE id::text = ${id} OR slug = ${id}
            RETURNING *
        ` as Record<string, unknown>[]

        if (!result[0]) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[tickets-proyecto] PATCH error:', error)
        return NextResponse.json({ error: 'Error al actualizar ticketera' }, { status: 500 })
    }
}

// DELETE: elimina la ticketera y todos sus tickets (cascade)
export async function DELETE(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const result = await sql`
            DELETE FROM ticket_proyectos WHERE id::text = ${id} OR slug = ${id}
            RETURNING id
        ` as Record<string, unknown>[]
        if (!result[0]) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[tickets-proyecto] DELETE error:', error)
        return NextResponse.json({ error: 'Error al eliminar ticketera' }, { status: 500 })
    }
}
