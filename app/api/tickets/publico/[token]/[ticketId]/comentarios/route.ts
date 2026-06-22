import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ token: string; ticketId: string }> }

// POST PÚBLICO: el cliente responde en el hilo de su ticket
export async function POST(request: Request, { params }: Ctx) {
    const { token, ticketId } = await params
    try {
        // Validar que el ticket pertenece a la ticketera pública del token
        const rows = await sql`
            SELECT t.id, t.solicitante_nombre
            FROM tickets t
            JOIN ticket_proyectos p ON p.id = t.proyecto_id
            WHERE t.id::text = ${ticketId}
              AND p.public_token::text = ${token}
              AND p.is_public = true
            LIMIT 1
        ` as Record<string, unknown>[]
        if (!rows[0]) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })

        const body = await request.json()
        const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : ''
        if (!mensaje) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })

        const autorNombre = typeof body.autor_nombre === 'string' && body.autor_nombre.trim()
            ? body.autor_nombre.trim()
            : (rows[0].solicitante_nombre as string | null) ?? 'Cliente'

        const result = await sql`
            INSERT INTO ticket_comentarios (ticket_id, autor_tipo, autor_nombre, mensaje)
            VALUES (${ticketId}, 'cliente', ${autorNombre}, ${mensaje})
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[tickets-publico-comentario] POST error:', error)
        return NextResponse.json({ error: 'Error al agregar comentario' }, { status: 500 })
    }
}
