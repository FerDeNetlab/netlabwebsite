import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { slugify } from '@/lib/slug'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id: proyectoId } = await params

    try {
        const body = await request.json()
        const { nombre, modulo_odoo, icono, color } = body
        if (!nombre || typeof nombre !== 'string') {
            return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
        }

        const baseSlug = slugify(nombre) || 'categoria'
        let slug = baseSlug
        let suffix = 1
        while (true) {
            const exists = await sql`
                SELECT 1 FROM doc_categorias WHERE proyecto_id = ${proyectoId} AND slug = ${slug} LIMIT 1
            ` as unknown[]
            if (exists.length === 0) break
            suffix += 1
            slug = `${baseSlug}-${suffix}`
        }

        const ordenRow = await sql`
            SELECT COALESCE(MAX(orden), -1) + 1 AS next_orden
            FROM doc_categorias WHERE proyecto_id = ${proyectoId}
        ` as { next_orden: number }[]

        const result = await sql`
            INSERT INTO doc_categorias (proyecto_id, nombre, slug, modulo_odoo, icono, color, orden)
            VALUES (
                ${proyectoId},
                ${nombre},
                ${slug},
                ${modulo_odoo ?? null},
                ${icono ?? 'Folder'},
                ${color ?? 'green'},
                ${ordenRow[0]?.next_orden ?? 0}
            )
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-categorias] POST error:', error)
        return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
    }
}
