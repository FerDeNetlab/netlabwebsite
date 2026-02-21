import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const clientes = await sql`
      SELECT * FROM public.clientes 
      WHERE activo = true 
      ORDER BY created_at DESC
    `
    return NextResponse.json(clientes)
  } catch (error) {
    console.error('[Auth] Error fetching clientes:', error)
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nombre, empresa, email, telefono, ciudad, estado, direccion, rfc, notas } = body

    const result = await sql`
      INSERT INTO public.clientes (
        id, nombre, empresa, email, telefono, ciudad, estado, direccion, rfc, notas, activo, created_at, updated_at
      )
      VALUES (
        gen_random_uuid(), ${nombre}, ${empresa}, ${email}, ${telefono}, ${ciudad}, ${estado}, ${direccion}, ${rfc}, ${notas}, true, NOW(), NOW()
      )
      RETURNING *
    ` as Record<string, unknown>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[Auth] Error creating cliente:', error)
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })
  }
}
