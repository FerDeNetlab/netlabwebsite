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
    const { cliente_id, concepto, subtotal, iva, total, fecha_vencimiento, condiciones_pago, notas, items } = body

    // Auto-generate numero_cotizacion
    const countResult = await sql`
      SELECT COUNT(*) as cnt FROM cotizaciones
    ` as Record<string, unknown>[]
    const nextNum = Number(countResult[0].cnt) + 1
    const numero_cotizacion = `COT-${String(nextNum).padStart(4, '0')}`

    // Crear cotización
    const cotizacion = await sql`
      INSERT INTO cotizaciones (
        id, cliente_id, concepto, subtotal, iva, total, estado,
        fecha_emision, fecha_vencimiento, condiciones_pago, notas,
        numero_cotizacion, created_at, updated_at
      )
      VALUES (
        gen_random_uuid(), ${cliente_id}, ${concepto}, ${subtotal}, ${iva}, ${total}, 'borrador',
        CURRENT_DATE, ${fecha_vencimiento || null}, ${condiciones_pago || null}, ${notas || null},
        ${numero_cotizacion}, NOW(), NOW()
      )
      RETURNING *
    ` as Record<string, unknown>[]

    const cotizacionId = (cotizacion[0] as Record<string, unknown>).id

    // Insertar items
    if (items && items.length > 0) {
      for (const item of items) {
        await sql`
          INSERT INTO cotizacion_items (
            id, cotizacion_id, producto_id, descripcion, cantidad, 
            precio_unitario, descuento, subtotal, created_at
          )
          VALUES (
            gen_random_uuid(), ${cotizacionId}, ${item.producto_id || null}, ${item.descripcion},
            ${item.cantidad}, ${item.precio_unitario}, ${item.descuento || 0},
            ${item.subtotal}, NOW()
          )
        `
      }
    }

    return NextResponse.json(cotizacion[0], { status: 201 })
  } catch (error) {
    console.error('[ERP] Error creating cotizacion:', error)
    return NextResponse.json({ error: 'Error al crear cotización' }, { status: 500 })
  }
}
