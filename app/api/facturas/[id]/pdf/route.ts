import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const factura = await sql`
      SELECT archivo_nombre, archivo_data, archivo_url, archivo_tipo FROM facturas WHERE id = ${id}
    ` as Record<string, unknown>[]

        if (factura.length === 0) {
            return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
        }

        const f = factura[0]

        // Preferir Vercel Blob (nuevo)
        if (f.archivo_url) {
            return NextResponse.redirect(f.archivo_url as string)
        }

        // Fallback legacy: bytea base64
        if (!f.archivo_data) {
            return NextResponse.json({ error: 'PDF no encontrado' }, { status: 404 })
        }

        const pdfBuffer = Buffer.from(f.archivo_data as string, 'base64')
        const filename = (f.archivo_nombre as string) || 'factura.pdf'

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': (f.archivo_tipo as string) || 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al descargar PDF' }, { status: 500 })
    }
}
