import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ token: string }> }

// Endpoint PÚBLICO — no requiere auth. Devuelve el árbol completo de un
// proyecto si su token es válido y is_public = true.
export async function GET(_req: Request, { params }: Ctx) {
    const { token } = await params

    try {
        const proyectoRows = await sql`
            SELECT id, slug, nombre, descripcion, is_public, public_token, created_at, updated_at
            FROM doc_proyectos
            WHERE public_token::text = ${token} AND is_public = true
            LIMIT 1
        ` as Record<string, unknown>[]

        if (!proyectoRows[0]) {
            return NextResponse.json({ error: 'Documentación no disponible' }, { status: 404 })
        }
        const proyectoId = proyectoRows[0].id as string

        type Row = Record<string, unknown> & { id: string; categoria_id?: string; flujo_id?: string }

        const categorias = await sql`
            SELECT id, nombre, slug, modulo_odoo, icono, color, orden
            FROM doc_categorias WHERE proyecto_id = ${proyectoId}
            ORDER BY orden ASC, created_at ASC
        ` as Row[]

        const flujos = await sql`
            SELECT f.id, f.categoria_id, f.nombre, f.slug, f.descripcion, f.proposito, f.accion_principal, f.orden
            FROM doc_flujos f
            JOIN doc_categorias c ON c.id = f.categoria_id
            WHERE c.proyecto_id = ${proyectoId}
            ORDER BY f.orden ASC, f.created_at ASC
        ` as Row[]

        const pasos = await sql`
            SELECT p.id, p.flujo_id, p.orden, p.imagen_url, p.titulo, p.accion, p.descripcion
            FROM doc_pasos p
            JOIN doc_flujos f ON f.id = p.flujo_id
            JOIN doc_categorias c ON c.id = f.categoria_id
            WHERE c.proyecto_id = ${proyectoId}
            ORDER BY p.orden ASC, p.created_at ASC
        ` as Row[]

        const flujosConPasos = flujos.map((f) => ({
            ...f,
            pasos: pasos.filter((p) => p.flujo_id === f.id),
        }))
        const categoriasConFlujos = categorias.map((c) => ({
            ...c,
            flujos: flujosConPasos.filter((f) => f.categoria_id === c.id),
        }))

        return NextResponse.json({ ...proyectoRows[0], categorias: categoriasConFlujos })
    } catch (error) {
        console.error('[doc-publico] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener documentación' }, { status: 500 })
    }
}
