import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { ESTADOS, URGENCIAS } from '@/lib/types/tickets'

type Ctx = { params: Promise<{ id: string }> }

// GET: un ticket con su hilo de comentarios
export async function GET(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const ticketRows = await sql`SELECT * FROM tickets WHERE id::text = ${id} LIMIT 1` as Record<string, unknown>[]
        if (!ticketRows[0]) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })

        const comentarios = await sql`
            SELECT * FROM ticket_comentarios WHERE ticket_id::text = ${id} ORDER BY created_at ASC
        `
        return NextResponse.json({ ...ticketRows[0], comentarios })
    } catch (error) {
        console.error('[tickets-ticket] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener ticket' }, { status: 500 })
    }
}

// PATCH: actualiza estado / urgencia / categoria
export async function PATCH(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { estado, urgencia, categoria } = body

        if (estado && !ESTADOS.includes(estado)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
        }
        if (urgencia && !URGENCIAS.includes(urgencia)) {
            return NextResponse.json({ error: 'Urgencia inválida' }, { status: 400 })
        }

        const result = await sql`
            UPDATE tickets
            SET
                estado = COALESCE(${estado ?? null}, estado),
                urgencia = COALESCE(${urgencia ?? null}, urgencia),
                categoria = COALESCE(${categoria ?? null}, categoria)
            WHERE id::text = ${id}
            RETURNING *
        ` as Record<string, unknown>[]

        if (!result[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[tickets-ticket] PATCH error:', error)
        return NextResponse.json({ error: 'Error al actualizar ticket' }, { status: 500 })
    }
}
