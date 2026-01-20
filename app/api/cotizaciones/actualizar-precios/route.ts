import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST() {
  try {
    // Actualizar precios en cotizacion_items basado en productos con SKU
    const result = await sql`
      UPDATE cotizacion_items ci
      SET 
        precio_unitario = p.precio_unitario,
        subtotal = ci.cantidad * p.precio_unitario * (1 - COALESCE(ci.descuento, 0) / 100)
      FROM productos p
      WHERE ci.descripcion LIKE '%' || p.sku || '%'
        AND p.sku IS NOT NULL
        AND p.ultima_actualizacion_precio > (NOW() - INTERVAL '7 days')
    `

    // Recalcular totales de cotizaciones afectadas
    await sql`
      UPDATE cotizaciones c
      SET 
        subtotal = COALESCE(items_total.total, 0),
        iva = COALESCE(items_total.total, 0) * 0.16,
        total = COALESCE(items_total.total, 0) * 1.16,
        updated_at = NOW()
      FROM (
        SELECT 
          cotizacion_id,
          SUM(subtotal) as total
        FROM cotizacion_items
        GROUP BY cotizacion_id
      ) items_total
      WHERE c.id = items_total.cotizacion_id
        AND c.estado = 'borrador'
    `

    return NextResponse.json({
      success: true,
      mensaje: 'Precios actualizados en cotizaciones en borrador'
    })

  } catch (error) {
    console.error('[v0] Error actualizando precios:', error)
    return NextResponse.json(
      { error: 'Error al actualizar precios' },
      { status: 500 }
    )
  }
}
