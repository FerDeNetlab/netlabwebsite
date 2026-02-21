import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { etapa, nombre, valor, fecha_cierre_estimada, probabilidad, descripcion, cliente_id } = body

    const result = await sql`
      UPDATE oportunidades
      SET 
        etapa = COALESCE(${etapa}, etapa),
        nombre = COALESCE(${nombre}, nombre),
        valor = COALESCE(${valor}, valor),
        fecha_cierre_estimada = COALESCE(${fecha_cierre_estimada}, fecha_cierre_estimada),
        probabilidad = COALESCE(${probabilidad}, probabilidad),
        descripcion = COALESCE(${descripcion}, descripcion),
        cliente_id = COALESCE(${cliente_id}, cliente_id),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, unknown>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] Error updating oportunidad:', error)
    return NextResponse.json({ error: 'Error al actualizar oportunidad' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    await sql`
      DELETE FROM oportunidades
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting oportunidad:', error)
    return NextResponse.json({ error: 'Error al eliminar oportunidad' }, { status: 500 })
  }
}
