import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const productos = await sql`
      SELECT * FROM productos
      WHERE activo = true
      ORDER BY categoria, nombre
    `

    return NextResponse.json(productos)
  } catch (error) {
    console.error('[v0] Error fetching productos:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { nombre, descripcion, precio_unitario, categoria, unidad } = body

    const result = await sql`
      INSERT INTO productos (nombre, descripcion, precio_unitario, categoria, unidad)
      VALUES (${nombre}, ${descripcion}, ${precio_unitario}, ${categoria}, ${unidad})
      RETURNING *
    ` as Record<string, unknown>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating producto:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
