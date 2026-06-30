import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { sendEmail, isEmailConfigured } from '@/lib/email'
import { URGENCIAS, URGENCIA_LABEL, type Urgencia } from '@/lib/types/tickets'

type Ctx = { params: Promise<{ token: string }> }

// Resuelve la ticketera pública a partir del token (debe ser is_public = true)
async function getProyectoByToken(token: string) {
    const rows = await sql`
        SELECT id, slug, nombre, descripcion, is_public
        FROM ticket_proyectos
        WHERE public_token::text = ${token} AND is_public = true
        LIMIT 1
    ` as Record<string, unknown>[]
    return rows[0] ?? null
}

// GET PÚBLICO: portal del cliente — info de la ticketera + sus tickets
export async function GET(_req: Request, { params }: Ctx) {
    const { token } = await params
    try {
        const proyecto = await getProyectoByToken(token)
        if (!proyecto) return NextResponse.json({ error: 'Portal no disponible' }, { status: 404 })

        const tickets = await sql`
            SELECT id, folio, titulo, descripcion, urgencia, estado, categoria,
                   solicitante_nombre, imagenes, created_at, updated_at
            FROM tickets
            WHERE proyecto_id = ${proyecto.id as string}
            ORDER BY created_at DESC
        `
        return NextResponse.json({ ...proyecto, tickets })
    } catch (error) {
        console.error('[tickets-publico] GET error:', error)
        return NextResponse.json({ error: 'Error al cargar el portal' }, { status: 500 })
    }
}

// POST PÚBLICO: el cliente crea un ticket
export async function POST(request: Request, { params }: Ctx) {
    const { token } = await params
    try {
        const proyecto = await getProyectoByToken(token)
        if (!proyecto) return NextResponse.json({ error: 'Portal no disponible' }, { status: 404 })

        const body = await request.json()
        const titulo = typeof body.titulo === 'string' ? body.titulo.trim() : ''
        const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim() : ''
        const urgencia: Urgencia = URGENCIAS.includes(body.urgencia) ? body.urgencia : 'media'
        const categoria = typeof body.categoria === 'string' ? body.categoria.trim() || null : null
        const solicitante_nombre = typeof body.solicitante_nombre === 'string' ? body.solicitante_nombre.trim() || null : null
        const solicitante_email = typeof body.solicitante_email === 'string' ? body.solicitante_email.trim() || null : null
        const imagenes: string[] = Array.isArray(body.imagenes)
            ? body.imagenes.filter((u: unknown): u is string => typeof u === 'string').slice(0, 10)
            : []

        if (!titulo || !descripcion) {
            return NextResponse.json({ error: 'Título y descripción son obligatorios' }, { status: 400 })
        }
        if (!solicitante_nombre) {
            return NextResponse.json({ error: 'Tu nombre es obligatorio' }, { status: 400 })
        }
        if (!solicitante_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(solicitante_email)) {
            return NextResponse.json({ error: 'Un correo válido es obligatorio' }, { status: 400 })
        }

        // Folio atómico: incrementa el contador de la ticketera en un solo statement
        const seqRows = await sql`
            UPDATE ticket_proyectos SET ticket_seq = ticket_seq + 1
            WHERE id = ${proyecto.id as string}
            RETURNING ticket_seq
        ` as { ticket_seq: number }[]
        const folio = `TK-${String(seqRows[0].ticket_seq).padStart(4, '0')}`

        const result = await sql`
            INSERT INTO tickets
                (proyecto_id, folio, titulo, descripcion, urgencia, categoria, solicitante_nombre, solicitante_email, imagenes)
            VALUES
                (${proyecto.id as string}, ${folio}, ${titulo}, ${descripcion}, ${urgencia},
                 ${categoria}, ${solicitante_nombre}, ${solicitante_email}, ${JSON.stringify(imagenes)}::jsonb)
            RETURNING *
        ` as Record<string, unknown>[]

        // Notificación por email a Netlab (best-effort, no bloquea)
        const destino = process.env.NETLAB_TICKETS_EMAIL
            || process.env.NETLAB_FINANZAS_EMAIL
            || process.env.DIRECTOR_EMAIL
            || 'soporte@netlab.mx'
        if (destino && isEmailConfigured()) {
            const color = urgencia === 'critica' ? '#ef4444' : urgencia === 'alta' ? '#f59e0b' : '#22c55e'
            sendEmail({
                to: destino,
                replyTo: solicitante_email || undefined,
                subject: `[${folio}] Nuevo ticket — ${proyecto.nombre as string}: ${titulo}`,
                html: `
                    <div style="font-family:monospace;background:#0a0a0a;color:#e5e5e5;padding:24px;border-radius:8px">
                        <h2 style="color:#22c55e;margin:0 0 4px">Nuevo ticket en ${proyecto.nombre as string}</h2>
                        <p style="color:#888;margin:0 0 16px">${folio}</p>
                        <p><strong>Título:</strong> ${titulo}</p>
                        <p><strong>Urgencia:</strong> <span style="color:${color}">${URGENCIA_LABEL[urgencia]}</span></p>
                        ${categoria ? `<p><strong>Categoría:</strong> ${categoria}</p>` : ''}
                        <p><strong>Descripción:</strong><br>${descripcion.replace(/\n/g, '<br>')}</p>
                        ${imagenes.length ? `<p><strong>Capturas (${imagenes.length}):</strong><br>${imagenes.map((u) => `<a href="${u}" style="color:#22c55e">${u}</a>`).join('<br>')}</p>` : ''}
                        <hr style="border-color:#333">
                        <p style="color:#888">De: ${solicitante_nombre || 'Anónimo'} ${solicitante_email ? `(${solicitante_email})` : ''}</p>
                    </div>
                `,
            }).catch((e) => console.error('[tickets-publico] email error:', e))
        }

        // Confirmación al solicitante: "hemos recibido tu ticket" (best-effort)
        if (solicitante_email && isEmailConfigured()) {
            const portalUrl = `https://netlab.mx/t/${token}`
            sendEmail({
                to: solicitante_email,
                subject: `[${folio}] Hemos recibido tu ticket — ${titulo}`,
                html: `
                    <div style="font-family:monospace;background:#0a0a0a;color:#e5e5e5;padding:24px;border-radius:8px">
                        <h2 style="color:#22c55e;margin:0 0 8px">✓ Hemos recibido tu ticket</h2>
                        <p>Hola ${solicitante_nombre}, recibimos tu solicitud y nuestro equipo la revisará pronto.</p>
                        <p style="color:#888;margin:16px 0 4px">Folio</p>
                        <p style="margin:0 0 12px"><strong>${folio}</strong></p>
                        <p style="color:#888;margin:0 0 4px">Asunto</p>
                        <p style="margin:0 0 12px"><strong>${titulo}</strong></p>
                        <p style="color:#888;margin:0 0 4px">Urgencia</p>
                        <p style="margin:0 0 12px">${URGENCIA_LABEL[urgencia]}</p>
                        <p style="color:#888;margin:0 0 4px">Descripción</p>
                        <p style="margin:0 0 16px">${descripcion.replace(/\n/g, '<br>')}</p>
                        <p>Puedes dar seguimiento y responder desde tu portal:</p>
                        <p><a href="${portalUrl}" style="color:#22c55e">${portalUrl}</a></p>
                        <hr style="border-color:#333">
                        <p style="color:#888;font-size:12px">Netlab · Soporte</p>
                    </div>
                `,
            }).catch((e) => console.error('[tickets-publico] email confirmación error:', e))
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[tickets-publico] POST error:', error)
        return NextResponse.json({ error: 'Error al crear el ticket' }, { status: 500 })
    }
}
