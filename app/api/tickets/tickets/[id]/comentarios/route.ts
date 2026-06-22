import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// POST: Netlab responde en el hilo del ticket
export async function POST(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : ''
        if (!mensaje) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })

        const ticket = await sql`SELECT id FROM tickets WHERE id::text = ${id} LIMIT 1` as unknown[]
        if (ticket.length === 0) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })

        const result = await sql`
            INSERT INTO ticket_comentarios (ticket_id, autor_tipo, autor_nombre, mensaje)
            VALUES (${id}, 'netlab', ${session.user?.name ?? 'Netlab'}, ${mensaje})
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[tickets-comentario] POST error:', error)
        return NextResponse.json({ error: 'Error al agregar comentario' }, { status: 500 })
    }
}
