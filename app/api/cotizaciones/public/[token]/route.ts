import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const cotizacion = await sql`
      SELECT 
        c.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa, cl.email as cliente_email
      FROM cotizaciones c
      LEFT JOIN clientes cl ON c.cliente_id = cl.id
      WHERE c.public_token = ${token}
    ` as Record<string, unknown>[]
    if (cotizacion.length === 0) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }
    const items = await sql`
      SELECT ci.*, p.nombre as producto_nombre
      FROM cotizacion_items ci
      LEFT JOIN productos p ON ci.producto_id = p.id
      WHERE ci.cotizacion_id = ${cotizacion[0].id}
      ORDER BY ci.created_at ASC
    `
    return NextResponse.json({ ...cotizacion[0], items })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener cotización' }, { status: 500 })
  }
}
