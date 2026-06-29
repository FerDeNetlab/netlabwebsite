import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { ESTADOS, URGENCIAS } from '@/lib/types/tickets'
import { sendEmail, isEmailConfigured } from '@/lib/email'

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

        // Estado previo (para detectar la transición a "resuelto" y notificar una sola vez)
        const prev = await sql`
            SELECT t.estado, t.folio, t.titulo, t.solicitante_nombre, t.solicitante_email,
                   p.nombre AS proyecto_nombre, p.public_token
            FROM tickets t
            JOIN ticket_proyectos p ON p.id = t.proyecto_id
            WHERE t.id::text = ${id}
            LIMIT 1
        ` as Record<string, unknown>[]
        if (!prev[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

        const result = await sql`
            UPDATE tickets
            SET
                estado = COALESCE(${estado ?? null}, estado),
                urgencia = COALESCE(${urgencia ?? null}, urgencia),
                categoria = COALESCE(${categoria ?? null}, categoria)
            WHERE id::text = ${id}
            RETURNING *
        ` as Record<string, unknown>[]

        // Aviso al solicitante cuando el ticket se marca como resuelto (best-effort)
        const seResolvio = estado === 'resuelto' && prev[0].estado !== 'resuelto'
        const destinatario = prev[0].solicitante_email as string | null
        if (seResolvio && destinatario && isEmailConfigured()) {
            const folio = prev[0].folio as string
            const titulo = prev[0].titulo as string
            const proyecto = prev[0].proyecto_nombre as string
            const nombre = (prev[0].solicitante_nombre as string | null) || 'Hola'
            const portalUrl = `https://netlab.mx/t/${prev[0].public_token as string}`
            sendEmail({
                to: destinatario,
                subject: `[${folio}] Tu ticket quedó resuelto — ${titulo}`,
                html: `
                    <div style="font-family:monospace;background:#0a0a0a;color:#e5e5e5;padding:24px;border-radius:8px">
                        <h2 style="color:#22c55e;margin:0 0 8px">✓ Ticket resuelto</h2>
                        <p>${nombre}, tu ticket <strong>${folio} — ${titulo}</strong> en <strong>${proyecto}</strong> ya quedó resuelto.</p>
                        <p>Si necesitas reabrirlo o tienes otra duda, responde en el portal:</p>
                        <p><a href="${portalUrl}" style="color:#22c55e">${portalUrl}</a></p>
                        <hr style="border-color:#333">
                        <p style="color:#888;font-size:12px">Netlab · Soporte</p>
                    </div>
                `,
            }).catch((e) => console.error('[tickets-ticket] email resuelto error:', e))
        }

        return NextResponse.json({ ...result[0], _notificado: seResolvio && !!destinatario })
    } catch (error) {
        console.error('[tickets-ticket] PATCH error:', error)
        return NextResponse.json({ error: 'Error al actualizar ticket' }, { status: 500 })
    }
}
