import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const result = await sql`
            UPDATE doc_proyectos
            SET public_token = gen_random_uuid()
            WHERE id::text = ${id} OR slug = ${id}
            RETURNING public_token
        ` as Record<string, unknown>[]
        if (!result[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-proyecto] regenerar-token error:', error)
        return NextResponse.json({ error: 'Error al regenerar token' }, { status: 500 })
    }
}
