import { sql } from '@/lib/db'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4MB (límite de body serverless ~4.5MB)
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

type Ctx = { params: Promise<{ token: string }> }

// POST PÚBLICO: el cliente sube una captura. Validado por token + is_public.
export async function POST(request: Request, { params }: Ctx) {
    const { token } = await params

    // Verificar que el token corresponde a una ticketera pública activa
    const proyecto = await sql`
        SELECT id FROM ticket_proyectos
        WHERE public_token::text = ${token} AND is_public = true
        LIMIT 1
    ` as Record<string, unknown>[]
    if (!proyecto[0]) {
        return NextResponse.json({ error: 'Portal no disponible' }, { status: 404 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json({ error: 'Almacenamiento no configurado' }, { status: 500 })
    }

    let file: File | null = null
    try {
        const formData = await request.formData()
        const f = formData.get('file')
        if (f instanceof File) file = f
    } catch {
        return NextResponse.json(
            { error: 'No se pudo leer el archivo (¿excede ~4.5 MB?)' },
            { status: 413 }
        )
    }

    if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
            { error: `Tipo no permitido (${file.type || 'sin tipo'}). Usa PNG, JPG, WEBP o GIF.` },
            { status: 400 }
        )
    }
    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
            { error: `Imagen muy grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo 4 MB.` },
            { status: 413 }
        )
    }

    try {
        const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
        const safeName = `tickets/${proyecto[0].id as string}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
        const blob = await put(safeName, file, {
            access: 'public',
            contentType: file.type,
            addRandomSuffix: false,
        })
        return NextResponse.json({ url: blob.url })
    } catch (error) {
        console.error('[tickets-upload] put() error:', error)
        return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 })
    }
}
