import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientes = await sql`
      SELECT * FROM public.clientes 
      WHERE activo = true 
      ORDER BY created_at DESC
    `
    return NextResponse.json(clientes)
  } catch (error) {
    console.error('[v0] Error fetching clientes:', error)
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] Error creating cliente:', error)
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })
  }
}
