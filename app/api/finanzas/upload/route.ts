import { auth } from '@/auth'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB para PDFs/comprobantes
const ALLOWED_TYPES = new Set([
    'application/pdf',
    'application/xml',
    'text/xml',
    'image/png',
    'image/jpeg',
    'image/webp',
])

export async function POST(request: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
            { error: 'BLOB_READ_WRITE_TOKEN no configurado' },
            { status: 500 }
        )
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file')
        const carpeta = (formData.get('carpeta') as string) || 'finanzas'

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: 'Tipo no permitido. Usa PDF, XML, PNG, JPG o WEBP.' },
                { status: 400 }
            )
        }

        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json(
                { error: 'Archivo demasiado grande. Máximo 10MB.' },
                { status: 400 }
            )
        }

        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
        const safeFolder = carpeta.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'finanzas'
        const safeName = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

        const blob = await put(safeName, file, {
            access: 'public',
            contentType: file.type,
        })

        return NextResponse.json({
            url: blob.url,
            nombre: file.name,
            tipo: file.type,
            tamaño: file.size,
        })
    } catch (error) {
        console.error('[finanzas-upload] Error:', error)
        return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
    }
}
