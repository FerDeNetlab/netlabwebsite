import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ pasoId: string }> }

export async function PUT(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { pasoId } = await params

    try {
        const body = await request.json()
        const { titulo, accion, descripcion, imagen_url, orden } = body

        const result = await sql`
            UPDATE doc_pasos SET
                titulo = ${titulo ?? null},
                accion = ${accion ?? null},
                descripcion = ${descripcion ?? null},
                imagen_url = COALESCE(${imagen_url ?? null}, imagen_url),
                orden = COALESCE(${typeof orden === 'number' ? orden : null}, orden)
            WHERE id = ${pasoId}
            RETURNING *
        ` as Record<string, unknown>[]
        if (!result[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-paso] PUT error:', error)
        return NextResponse.json({ error: 'Error al actualizar paso' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { pasoId } = await params

    try {
        await sql`DELETE FROM doc_pasos WHERE id = ${pasoId}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[doc-paso] DELETE error:', error)
        return NextResponse.json({ error: 'Error al eliminar paso' }, { status: 500 })
    }
}
