import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ flujoId: string }> }

export async function POST(request: Request, { params }: Ctx) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { flujoId } = await params

    try {
        const body = await request.json()
        const { imagen_url, titulo, accion, descripcion } = body
        if (!imagen_url || typeof imagen_url !== 'string') {
            return NextResponse.json({ error: 'imagen_url requerida' }, { status: 400 })
        }

        const ordenRow = await sql`
            SELECT COALESCE(MAX(orden), -1) + 1 AS next_orden
            FROM doc_pasos WHERE flujo_id = ${flujoId}
        ` as { next_orden: number }[]

        const result = await sql`
            INSERT INTO doc_pasos (flujo_id, imagen_url, titulo, accion, descripcion, orden)
            VALUES (
                ${flujoId},
                ${imagen_url},
                ${titulo ?? null},
                ${accion ?? null},
                ${descripcion ?? null},
                ${ordenRow[0]?.next_orden ?? 0}
            )
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('[doc-pasos] POST error:', error)
        return NextResponse.json({ error: 'Error al crear paso' }, { status: 500 })
    }
}
