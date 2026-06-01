import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const estadosValidos = ['pendiente', 'en_progreso', 'completado']
  const estado =
    body.estado !== undefined && estadosValidos.includes(String(body.estado))
      ? String(body.estado)
      : null
  const prioridadesValidas = ['alta', 'normal', 'baja']
  const prioridad =
    body.prioridad !== undefined && prioridadesValidas.includes(String(body.prioridad))
      ? String(body.prioridad)
      : null
  const categoriasValidas = ['Personal', 'Empresa', 'Reunion', 'Llamada', 'Seguimiento', 'Otro']
  const categoria =
    body.categoria !== undefined && categoriasValidas.includes(String(body.categoria))
      ? String(body.categoria)
      : null
  const titulo = body.titulo !== undefined ? String(body.titulo).slice(0, 500) : null
  const descripcion = body.descripcion !== undefined ? String(body.descripcion).slice(0, 2000) : null
  const fechaLimite = body.fecha_limite !== undefined ? (body.fecha_limite ? String(body.fecha_limite) : null) : undefined

  const rows = (await sql`
    UPDATE director_todos
    SET
      estado      = COALESCE(${estado}, estado),
      prioridad   = COALESCE(${prioridad}, prioridad),
      categoria   = COALESCE(${categoria}, categoria),
      titulo      = COALESCE(${titulo}, titulo),
      descripcion = COALESCE(${descripcion}, descripcion),
      fecha_limite = ${fechaLimite !== undefined ? fechaLimite : null},
      updated_at  = NOW()
    WHERE id = ${id}
    RETURNING id, titulo, descripcion, categoria, prioridad, estado, fecha_limite, updated_at
  `) as Record<string, unknown>[]

  if (!rows.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  await sql`DELETE FROM director_todos WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
