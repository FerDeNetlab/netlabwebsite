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

  const estadosValidos = ['nuevo', 'visto', 'agendado', 'completado']
  const estado =
    body.estado !== undefined && estadosValidos.includes(String(body.estado))
      ? String(body.estado)
      : null
  const notas =
    body.notas_director !== undefined
      ? String(body.notas_director).slice(0, 2000)
      : null

  const rows = (await sql`
    UPDATE pendientes_externos
    SET
      estado         = COALESCE(${estado}, estado),
      notas_director = COALESCE(${notas}, notas_director),
      updated_at     = NOW()
    WHERE id = ${id}
    RETURNING id, estado, notas_director, updated_at
  `) as Record<string, unknown>[]

  if (!rows.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(rows[0])
}
