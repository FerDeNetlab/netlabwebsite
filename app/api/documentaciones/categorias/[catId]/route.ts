import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ catId: string }> }

export async function PUT(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { catId } = await params

    try {
        const body = await request.json()
        const { nombre, modulo_odoo, icono, color } = body

        const result = await sql`
            UPDATE doc_categorias SET
                nombre = COALESCE(${nombre ?? null}, nombre),
                modulo_odoo = ${modulo_odoo ?? null},
                icono = COALESCE(${icono ?? null}, icono),
                color = COALESCE(${color ?? null}, color)
            WHERE id = ${catId}
            RETURNING *
        ` as Record<string, unknown>[]
        if (!result[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-categoria] PUT error:', error)
        return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { catId } = await params

    try {
        await sql`DELETE FROM doc_categorias WHERE id = ${catId}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[doc-categoria] DELETE error:', error)
        return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 })
    }
}
