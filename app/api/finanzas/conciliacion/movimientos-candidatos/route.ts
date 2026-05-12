// app/api/finanzas/conciliacion/movimientos-candidatos/route.ts
// GET: dado un gasto o factura, busca movimientos bancarios con monto similar
// ?monto=X&fecha=Y&tipo=cargo|abono
// tipo cargo = gasto (salida), abono = cobro (entrada)

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const montoStr = searchParams.get('monto')
  const fecha    = searchParams.get('fecha')  // YYYY-MM-DD de referencia
  const tipo     = searchParams.get('tipo')   // 'cargo' | 'abono'

  if (!montoStr || !fecha) {
    return NextResponse.json({ error: 'Faltan parámetros monto y fecha' }, { status: 400 })
  }

  const monto = parseFloat(montoStr)
  if (isNaN(monto)) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })

  try {
    // No se puede usar columna dinámica en tagged template SQL
    // Se separan las dos queries explícitamente
    const movimientos = tipo === 'abono'
      ? await sql`
          SELECT mb.id, mb.fecha_operacion, mb.descripcion, mb.referencia,
                 mb.cargo, mb.abono, ec.numero_cuenta, ec.banco
          FROM movimientos_bancarios mb
          JOIN estados_cuenta ec ON ec.id = mb.estado_cuenta_id
          WHERE mb.abono IS NOT NULL AND mb.abono > 0
            AND ABS(mb.abono - ${monto}) / NULLIF(${monto}, 0) <= 0.15
            AND mb.fecha_operacion BETWEEN (${fecha}::date - INTERVAL '60 days') AND (${fecha}::date + INTERVAL '60 days')
            AND mb.gasto_id IS NULL AND mb.factura_id IS NULL
          ORDER BY ABS(mb.abono - ${monto}) ASC, mb.fecha_operacion DESC
          LIMIT 20
        `
      : await sql`
          SELECT mb.id, mb.fecha_operacion, mb.descripcion, mb.referencia,
                 mb.cargo, mb.abono, ec.numero_cuenta, ec.banco
          FROM movimientos_bancarios mb
          JOIN estados_cuenta ec ON ec.id = mb.estado_cuenta_id
          WHERE mb.cargo IS NOT NULL AND mb.cargo > 0
            AND ABS(mb.cargo - ${monto}) / NULLIF(${monto}, 0) <= 0.15
            AND mb.fecha_operacion BETWEEN (${fecha}::date - INTERVAL '60 days') AND (${fecha}::date + INTERVAL '60 days')
            AND mb.gasto_id IS NULL AND mb.factura_id IS NULL
          ORDER BY ABS(mb.cargo - ${monto}) ASC, mb.fecha_operacion DESC
          LIMIT 20
        `

    return NextResponse.json({ movimientos })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    console.error('[movimientos-candidatos]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
