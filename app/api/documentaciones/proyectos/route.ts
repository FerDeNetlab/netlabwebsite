import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { slugify } from '@/lib/slug'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const rows = await sql`
            SELECT p.*, c.empresa AS cliente_empresa, c.nombre AS cliente_nombre
            FROM doc_proyectos p
            LEFT JOIN public.clientes c ON c.id = p.cliente_id
            ORDER BY p.created_at DESC
        `
        return NextResponse.json(rows)
    } catch (error) {
        console.error('[doc-proyectos] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const { nombre, descripcion, cliente_id, is_public } = body
        if (!nombre || typeof nombre !== 'string') {
            return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
        }

        // Generar slug único
        const baseSlug = slugify(nombre) || 'proyecto'
        let slug = baseSlug
        let suffix = 1
        while (true) {
            const exists = await sql`SELECT 1 FROM doc_proyectos WHERE slug = ${slug} LIMIT 1` as unknown[]
            if (exists.length === 0) break
            suffix += 1
            slug = `${baseSlug}-${suffix}`
        }

        const result = await sql`
            INSERT INTO doc_proyectos (nombre, slug, descripcion, cliente_id, is_public, created_by)
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
        console.error('[doc-proyectos] POST error:', error)
        return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 })
    }
}
