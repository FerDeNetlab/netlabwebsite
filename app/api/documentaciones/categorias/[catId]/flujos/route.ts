import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { slugify } from '@/lib/slug'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ catId: string }> }

export async function POST(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { catId } = await params

    try {
        const body = await request.json()
        const { nombre, descripcion, proposito, accion_principal } = body
        if (!nombre || typeof nombre !== 'string') {
            return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 })
        }

        const baseSlug = slugify(nombre) || 'flujo'
        let slug = baseSlug
        let suffix = 1
        while (true) {
            const exists = await sql`
                SELECT 1 FROM doc_flujos WHERE categoria_id = ${catId} AND slug = ${slug} LIMIT 1
            ` as unknown[]
            if (exists.length === 0) break
            suffix += 1
            slug = `${baseSlug}-${suffix}`
        }

        const ordenRow = await sql`
            SELECT COALESCE(MAX(orden), -1) + 1 AS next_orden
            FROM doc_flujos WHERE categoria_id = ${catId}
        ` as { next_orden: number }[]

        const result = await sql`
            INSERT INTO doc_flujos (categoria_id, nombre, slug, descripcion, proposito, accion_principal, orden)
            VALUES (
                ${catId},
                ${nombre},
                ${slug},
                ${descripcion ?? null},
                ${proposito ?? null},
                ${accion_principal ?? null},
                ${ordenRow[0]?.next_orden ?? 0}
            )
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-flujos] POST error:', error)
        return NextResponse.json({ error: 'Error al crear flujo' }, { status: 500 })
    }
}
