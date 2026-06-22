import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { slugify } from '@/lib/slug'
import { NextResponse } from 'next/server'

// GET: lista todas las ticketeras (con cliente y conteos)
export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const rows = await sql`
            SELECT
                p.*,
                c.empresa AS cliente_empresa,
                c.nombre AS cliente_nombre,
                COUNT(t.id) AS total_tickets,
                COUNT(t.id) FILTER (WHERE t.estado IN ('nuevo', 'en_progreso')) AS abiertos
            FROM ticket_proyectos p
            LEFT JOIN public.clientes c ON c.id = p.cliente_id
            LEFT JOIN tickets t ON t.proyecto_id = p.id
            GROUP BY p.id, c.empresa, c.nombre
            ORDER BY p.created_at DESC
        `
        return NextResponse.json(rows)
    } catch (error) {
        console.error('[tickets-proyectos] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener ticketeras' }, { status: 500 })
    }
}

// POST: crea una ticketera
export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const { nombre, descripcion, cliente_id, is_public } = body
        if (!nombre || typeof nombre !== 'string') {
            return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
        }

        // Slug único
        const baseSlug = slugify(nombre) || 'ticketera'
        let slug = baseSlug
        let suffix = 1
        while (true) {
            const exists = await sql`SELECT 1 FROM ticket_proyectos WHERE slug = ${slug} LIMIT 1` as unknown[]
            if (exists.length === 0) break
            suffix += 1
            slug = `${baseSlug}-${suffix}`
        }

        const result = await sql`
            INSERT INTO ticket_proyectos (nombre, slug, descripcion, cliente_id, is_public, created_by)
            VALUES (
                ${nombre},
                ${slug},
                ${descripcion ?? null},
                ${cliente_id || null},
                ${is_public !== false},
                ${session.user?.id ?? null}
            )
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[tickets-proyectos] POST error:', error)
        return NextResponse.json({ error: 'Error al crear ticketera' }, { status: 500 })
    }
}
