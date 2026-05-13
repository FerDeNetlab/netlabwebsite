import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

// GET /api/rh/nominas?quincena=2026-05-1
export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const quincena = searchParams.get('quincena')
  if (!quincena || !/^\d{4}-\d{2}-[12]$/.test(quincena)) {
    return NextResponse.json({ error: 'quincena inválida' }, { status: 400 })
  }

  const rows = await sql`
    SELECT * FROM rh_nominas WHERE quincena = ${quincena}
  ` as Record<string, unknown>[]

  return NextResponse.json(rows[0] || null)
}

// POST /api/rh/nominas  →  upsert
// Body: { quincena, total, empleados: [{ id, nombre, tarjeta, rfc, importe }] }
export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { quincena, total, empleados } = body

  if (!quincena || !/^\d{4}-\d{2}-[12]$/.test(quincena)) {
    return NextResponse.json({ error: 'quincena inválida' }, { status: 400 })
  }
  if (!Array.isArray(empleados) || empleados.length === 0) {
    return NextResponse.json({ error: 'Se requieren empleados' }, { status: 400 })
  }

  const rows = await sql`
    INSERT INTO rh_nominas (quincena, total, empleados)
    VALUES (${quincena}, ${Number(total)}, ${JSON.stringify(empleados)})
    ON CONFLICT (quincena) DO UPDATE SET
      total      = EXCLUDED.total,
      empleados  = EXCLUDED.empleados,
      updated_at = NOW()
    RETURNING *
  ` as Record<string, unknown>[]

  return NextResponse.json(rows[0])
}
