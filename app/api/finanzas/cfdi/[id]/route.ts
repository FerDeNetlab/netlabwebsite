import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { del } from '@vercel/blob'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { factura_id, gasto_id } = body as { factura_id?: string | null; gasto_id?: string | null }

    const hasAssignment = !!(factura_id || gasto_id)
    const estado = hasAssignment ? 'asignado' : 'sin_asignar'

    await sql`
      UPDATE cfdis SET
        factura_id = ${factura_id || null},
        gasto_id   = ${gasto_id   || null},
        estado     = ${estado}
      WHERE id = ${id}::uuid
    `

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[CFDI] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar CFDI' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { id } = await params

    // Get xml_url before deleting
    const [row] = await sql`SELECT xml_url FROM cfdis WHERE id = ${id}::uuid`
    if (!row) return NextResponse.json({ error: 'CFDI no encontrado' }, { status: 404 })

    // Delete from DB
    await sql`DELETE FROM cfdis WHERE id = ${id}::uuid`

    // Best-effort delete from Vercel Blob
    if (row.xml_url) {
      await del(row.xml_url as string).catch(() => null)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[CFDI] DELETE error:', error)
    return NextResponse.json({ error: 'Error al eliminar CFDI' }, { status: 500 })
  }
}
