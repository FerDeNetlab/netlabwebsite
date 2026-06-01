import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const rows = await sql`
    SELECT id, titulo, descripcion, categoria, prioridad, estado, fecha_limite, created_at, updated_at
    FROM director_todos
    ORDER BY
      CASE estado WHEN 'pendiente' THEN 0 WHEN 'en_progreso' THEN 1 ELSE 2 END,
      CASE prioridad WHEN 'alta' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END,
      fecha_limite ASC NULLS LAST,
      created_at DESC
  `
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const titulo = String(body.titulo ?? '').trim().slice(0, 500)
  if (!titulo) return NextResponse.json({ error: 'titulo es obligatorio' }, { status: 400 })

  const categoriasValidas = ['Personal', 'Empresa', 'Reunion', 'Llamada', 'Seguimiento', 'Otro']
  const categoria = categoriasValidas.includes(String(body.categoria ?? '')) ? String(body.categoria) : 'Personal'
  const prioridades = ['alta', 'normal', 'baja']
  const prioridad = prioridades.includes(String(body.prioridad ?? '')) ? String(body.prioridad) : 'normal'
  const descripcion = body.descripcion ? String(body.descripcion).slice(0, 2000) : null
  const fechaLimite = body.fecha_limite ? String(body.fecha_limite) : null

  const rows = (await sql`
    INSERT INTO director_todos (titulo, descripcion, categoria, prioridad, fecha_limite)
    VALUES (${titulo}, ${descripcion}, ${categoria}, ${prioridad}, ${fechaLimite})
    RETURNING id, titulo, descripcion, categoria, prioridad, estado, fecha_limite, created_at, updated_at
  `) as Record<string, unknown>[]

  return NextResponse.json(rows[0], { status: 201 })
}
