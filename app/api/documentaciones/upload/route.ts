import { auth } from '@/auth'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4MB (Vercel serverless body limit ~4.5MB)
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

export async function POST(request: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
            { error: 'BLOB_READ_WRITE_TOKEN no configurado en el servidor' },
            { status: 500 }
        )
    }

    let file: File | null = null
    try {
        const formData = await request.formData()
        const f = formData.get('file')
        if (f instanceof File) file = f
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'formData() falló'
        console.error('[doc-upload] formData error:', err)
        return NextResponse.json(
            { error: `No se pudo leer el archivo (posiblemente excede el límite de ~4.5 MB del servidor): ${msg}` },
            { status: 413 }
        )
    }

    if (!file) {
        return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
            { error: `Tipo de archivo no permitido (${file.type || 'sin tipo'}). Usa PNG, JPG, WEBP o GIF.` },
            { status: 400 }
        )
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
            { error: `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo 4 MB. Comprime la imagen y vuelve a intentar.` },
            { status: 413 }
        )
    }

    try {
        const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
        const safeName = `documentaciones/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

        const blob = await put(safeName, file, {
            access: 'public',
            contentType: file.type,
            addRandomSuffix: false,
        })

        return NextResponse.json({ url: blob.url, size: file.size, type: file.type })
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'desconocido'
        console.error('[doc-upload] put() error:', error)
        return NextResponse.json(
            { error: `Error al subir a Vercel Blob: ${msg}` },
            { status: 500 }
        )
    }
}
