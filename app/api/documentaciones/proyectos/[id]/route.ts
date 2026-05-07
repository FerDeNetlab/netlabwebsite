import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        // Permitir buscar por id o slug
        const rows = await sql`
            SELECT p.*, c.empresa AS cliente_empresa, c.nombre AS cliente_nombre
            FROM doc_proyectos p
            LEFT JOIN public.clientes c ON c.id = p.cliente_id
            WHERE p.id::text = ${id} OR p.slug = ${id}
            LIMIT 1
        ` as Record<string, unknown>[]
        if (!rows[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

        const proyectoId = rows[0].id as string

        type Row = Record<string, unknown> & { id: string; categoria_id?: string; flujo_id?: string }

        const categorias = await sql`
            SELECT * FROM doc_categorias WHERE proyecto_id = ${proyectoId}
            ORDER BY orden ASC, created_at ASC
        ` as Row[]

        const flujos = await sql`
            SELECT f.* FROM doc_flujos f
            JOIN doc_categorias c ON c.id = f.categoria_id
            WHERE c.proyecto_id = ${proyectoId}
            ORDER BY f.orden ASC, f.created_at ASC
        ` as Row[]

        const pasos = await sql`
            SELECT p.* FROM doc_pasos p
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

        return NextResponse.json({ ...rows[0], categorias: categoriasConFlujos })
    } catch (error) {
        console.error('[doc-proyecto] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener proyecto' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { nombre, descripcion, cliente_id, is_public } = body

        const result = await sql`
            UPDATE doc_proyectos SET
                nombre = COALESCE(${nombre ?? null}, nombre),
                descripcion = COALESCE(${descripcion ?? null}, descripcion),
                cliente_id = ${cliente_id || null},
                is_public = COALESCE(${typeof is_public === 'boolean' ? is_public : null}, is_public)
            WHERE id::text = ${id} OR slug = ${id}
            RETURNING *
        ` as Record<string, unknown>[]

        if (!result[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-proyecto] PUT error:', error)
        return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        await sql`DELETE FROM doc_proyectos WHERE id::text = ${id} OR slug = ${id}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[doc-proyecto] DELETE error:', error)
        return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 })
    }
}
