import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const factura = await sql`
      SELECT archivo_nombre, archivo_data FROM facturas WHERE id = ${id}
    ` as Record<string, unknown>[]

        if (factura.length === 0 || !factura[0].archivo_data) {
            return NextResponse.json({ error: 'PDF no encontrado' }, { status: 404 })
        }

        const pdfBuffer = Buffer.from(factura[0].archivo_data as string, 'base64')
        const filename = (factura[0].archivo_nombre as string) || 'factura.pdf'

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`,
            },
        })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al descargar PDF' }, { status: 500 })
    }
}
