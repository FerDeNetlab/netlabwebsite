import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const cotizaciones = await sql`
      SELECT 
        c.*,
        cl.nombre as cliente_nombre,
        cl.empresa as cliente_empresa,
        (SELECT COUNT(*) FROM cotizacion_items WHERE cotizacion_id = c.id) as items_count
      FROM cotizaciones c
      LEFT JOIN clientes cl ON c.cliente_id = cl.id
      ORDER BY c.created_at DESC
    `

    return NextResponse.json(cotizaciones)
  } catch (error) {
    console.error('[Auth] Error fetching cotizaciones:', error)
    return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { cliente_id, proyecto_id, total, items, notas, vigencia } = body

    // Crear cotización
    const cotizacion = await sql`
      INSERT INTO cotizaciones (cliente_id, proyecto_id, total, estado, notas, vigencia)
      VALUES (${cliente_id}, ${proyecto_id || null}, ${total}, 'pendiente', ${notas || ''}, ${vigencia})
      RETURNING *
    `

    const cotizacionId = cotizacion[0].id

    // Insertar items
    if (items && items.length > 0) {
      for (const item of items) {
        await sql`
          INSERT INTO cotizacion_items (
            cotizacion_id, producto_id, descripcion, cantidad, 
            precio_unitario, descuento, subtotal
          )
          VALUES (
            ${cotizacionId}, ${item.producto_id || null}, ${item.descripcion},
            ${item.cantidad}, ${item.precio_unitario}, ${item.descuento || 0},
            ${item.subtotal}
          )
        `
      }
    }

    return NextResponse.json(cotizacion[0], { status: 201 })
  } catch (error) {
    console.error('[Auth] Error creating cotizacion:', error)
    return NextResponse.json({ error: 'Error al crear cotización' }, { status: 500 })
  }
}
