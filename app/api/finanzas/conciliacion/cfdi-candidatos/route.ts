// GET: dado un gasto o factura, busca CFDIs con monto similar aún sin ligar
// ?monto=X&tipo=recibida|emitida
// recibida = para gastos (CFDIs que recibimos de proveedores)
// emitida  = para facturas/CxC (CFDIs que nosotros emitimos)

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const montoStr = searchParams.get('monto')
  const tipo     = searchParams.get('tipo') // 'recibida' | 'emitida'

  if (!montoStr) return NextResponse.json({ error: 'Falta parámetro monto' }, { status: 400 })

  const monto = parseFloat(montoStr)
  if (isNaN(monto)) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })

  try {
    // Para gastos → CFDIs recibidos (proveedor nos facturó)
    // Para facturas/CxC → CFDIs emitidos (nosotros facturamos al cliente)
    const tipoNetlab = tipo === 'emitida' ? 'emitida' : 'recibida'

    const cfdis = await sql`
      SELECT
        c.id, c.uuid_sat, c.tipo_comprobante,
        c.emisor_rfc, c.emisor_nombre,
        c.receptor_rfc, c.receptor_nombre,
        c.total, c.subtotal, c.moneda,
        c.fecha, c.fecha_timbrado,
        c.xml_url, c.xml_nombre,
        c.tipo_netlab,
        c.gasto_id, c.factura_id
      FROM cfdis c
      WHERE c.tipo_netlab = ${tipoNetlab}
        AND c.gasto_id IS NULL
        AND c.factura_id IS NULL
        AND ABS(c.total - ${monto}) / NULLIF(${monto}, 0) <= 0.15
      ORDER BY ABS(c.total - ${monto}) ASC, c.fecha DESC
      LIMIT 20
    `

    return NextResponse.json({ cfdis })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    console.error('[cfdi-candidatos]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
