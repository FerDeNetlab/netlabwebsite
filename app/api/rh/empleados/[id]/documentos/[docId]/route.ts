import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { del } from '@vercel/blob'

export const runtime = 'nodejs'

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string; docId: string }> }
) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { docId } = await params

    try {
        const docs = await sql`SELECT url FROM rh_empleado_documentos WHERE id = ${docId}` as Array<{ url: string }>
        if (docs.length === 0) {
            return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
        }

        // Borrar de Vercel Blob (best-effort)
        try {
            await del(docs[0].url)
        } catch (err) {
            console.warn('[rh-docs] No se pudo borrar de Blob (continuo):', err)
        }

        await sql`DELETE FROM rh_empleado_documentos WHERE id = ${docId}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'desconocido'
        console.error('[rh-docs] Error deleting:', error)
        return NextResponse.json({ error: `Error al eliminar: ${msg}` }, { status: 500 })
    }
}
