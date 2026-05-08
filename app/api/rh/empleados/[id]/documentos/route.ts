import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4MB
const ALLOWED_TYPES = new Set([
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
])

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const docs = await sql`
      SELECT id, nombre, tipo, url, size_bytes, mime_type, uploaded_at
      FROM rh_empleado_documentos
      WHERE empleado_id = ${id}
      ORDER BY uploaded_at DESC
    `
        return NextResponse.json(docs)
    } catch (error) {
        console.error('[rh-docs] Error fetching:', error)
        return NextResponse.json({ error: 'Error al obtener documentos' }, { status: 500 })
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
            { error: 'BLOB_READ_WRITE_TOKEN no configurado en el servidor' },
            { status: 500 }
        )
    }

    const { id } = await params

    let file: File | null = null
    let nombre = ''
    let tipo = 'otro'
    try {
        const formData = await request.formData()
        const f = formData.get('file')
        if (f instanceof File) file = f
        nombre = (formData.get('nombre') as string) || ''
        tipo = (formData.get('tipo') as string) || 'otro'
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'formData() falló'
        return NextResponse.json(
            { error: `No se pudo leer el archivo (posiblemente excede ~4.5 MB): ${msg}` },
            { status: 413 }
        )
    }

    if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })

    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
            { error: `Tipo no permitido (${file.type || 'sin tipo'}). Usa PDF, PNG, JPG o WEBP.` },
            { status: 400 }
        )
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
            { error: `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo 4 MB.` },
            { status: 413 }
        )
    }

    try {
        const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
        const safeName = `rh/${id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

        const blob = await put(safeName, file, {
            access: 'public',
            contentType: file.type,
            addRandomSuffix: false,
        })

        const finalNombre = nombre || file.name
        const result = await sql`
      INSERT INTO rh_empleado_documentos (empleado_id, nombre, tipo, url, size_bytes, mime_type)
      VALUES (${id}, ${finalNombre}, ${tipo}, ${blob.url}, ${file.size}, ${file.type})
      RETURNING *
    ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'desconocido'
        console.error('[rh-docs] Error uploading:', error)
        return NextResponse.json({ error: `Error al subir: ${msg}` }, { status: 500 })
    }
}
