// app/api/finanzas/conciliacion/candidatos/route.ts
// GET: busca CFDIs candidatos para conciliar un movimiento bancario
// Filtra por monto similar (±5%) y fecha cercana (±30 días)

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const montoStr = searchParams.get('monto')
  const fecha    = searchParams.get('fecha')     // YYYY-MM-DD
  const tipo     = searchParams.get('tipo')      // 'cargo' | 'abono'

  if (!montoStr || !fecha) {
    return NextResponse.json({ error: 'Faltan parámetros monto y fecha' }, { status: 400 })
  }

  const monto = parseFloat(montoStr)
  if (isNaN(monto)) return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })

  try {
    // Un cargo en el banco = pago a proveedor = CFDI recibida (recibidas)
    // Un abono en el banco = cobro a cliente = CFDI emitida (emitidas)
    const tipoNetlab = tipo === 'cargo' ? 'recibida' : tipo === 'abono' ? 'emitida' : null

    const rows = await sql`
      SELECT
        id, uuid_sat, fecha_emision,
        emisor_rfc, emisor_nombre,
        receptor_rfc, receptor_nombre,
        total, subtotal, tipo_netlab,
        moneda
      FROM cfdis
      WHERE
        ABS(total - ${monto}) / NULLIF(${monto}, 0) <= 0.05
        AND fecha_emision BETWEEN (${fecha}::date - INTERVAL '30 days') AND (${fecha}::date + INTERVAL '30 days')
        ${tipoNetlab ? sql`AND tipo_netlab = ${tipoNetlab}` : sql``}
      ORDER BY ABS(total - ${monto}) ASC, ABS(fecha_emision - ${fecha}::date) ASC
      LIMIT 20
    `
    return NextResponse.json({ candidatos: rows })
  } catch (error) {
    console.error('[conciliacion/candidatos] error:', error)
    return NextResponse.json({ error: 'Error al buscar candidatos' }, { status: 500 })
  }
}
