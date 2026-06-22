import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ token: string; ticketId: string }> }

// GET PÚBLICO: detalle de un ticket + comentarios (validando que pertenezca a la ticketera del token)
export async function GET(_req: Request, { params }: Ctx) {
    const { token, ticketId } = await params
    try {
        const rows = await sql`
            SELECT t.*
            FROM tickets t
            JOIN ticket_proyectos p ON p.id = t.proyecto_id
            WHERE t.id::text = ${ticketId}
              AND p.public_token::text = ${token}
              AND p.is_public = true
            LIMIT 1
        ` as Record<string, unknown>[]

        if (!rows[0]) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })

        const comentarios = await sql`
            SELECT id, ticket_id, autor_tipo, autor_nombre, mensaje, created_at
            FROM ticket_comentarios
            WHERE ticket_id::text = ${ticketId}
            ORDER BY created_at ASC
        `
        return NextResponse.json({ ...rows[0], comentarios })
    } catch (error) {
        console.error('[tickets-publico-detalle] GET error:', error)
        return NextResponse.json({ error: 'Error al cargar el ticket' }, { status: 500 })
    }
}
