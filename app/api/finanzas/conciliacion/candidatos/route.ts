// app/api/finanzas/conciliacion/candidatos/route.ts
// GET: busca CFDIs, facturas y gastos candidatos para conciliar un movimiento bancario
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
    // Un cargo en el banco = pago a proveedor = CFDI recibida / gasto
    // Un abono en el banco = cobro a cliente  = CFDI emitida  / factura
    const tipoNetlab = tipo === 'cargo' ? 'recibida' : tipo === 'abono' ? 'emitida' : null

    // Candidatos CFDI
    const cfdis = await sql`
      SELECT
        id, uuid_sat, fecha AS fecha_emision,
        emisor_rfc, emisor_nombre,
        receptor_rfc, receptor_nombre,
        total, tipo_netlab, moneda
      FROM cfdis
      WHERE
        ABS(total - ${monto}) / NULLIF(${monto}, 0) <= 0.05
        AND fecha BETWEEN (${fecha}::date - INTERVAL '30 days') AND (${fecha}::date + INTERVAL '30 days')
        ${tipoNetlab ? sql`AND tipo_netlab = ${tipoNetlab}` : sql``}
      ORDER BY ABS(total - ${monto}) ASC
      LIMIT 15
    `

    // Candidatos Facturas (abonos = ingresos)
    const facturas = tipo !== 'cargo' ? await sql`
      SELECT
        f.id, f.numero_factura, f.concepto, f.total,
        f.fecha_vencimiento AS fecha_referencia,
        f.estado, cl.nombre AS cliente_nombre,
        'factura' AS tipo_candidato
      FROM facturas f
      LEFT JOIN clientes cl ON cl.id = f.cliente_id
      WHERE f.estado IN ('pendiente', 'vencida', 'parcial')
        AND f.movimiento_bancario_id IS NULL
        AND ABS(f.total - ${monto}) / NULLIF(${monto}, 0) <= 0.10
        AND f.fecha_vencimiento BETWEEN (${fecha}::date - INTERVAL '45 days') AND (${fecha}::date + INTERVAL '45 days')
      ORDER BY ABS(f.total - ${monto}) ASC
      LIMIT 10
    ` : []

    // Candidatos Gastos (cargos = egresos)
    const gastos = tipo !== 'abono' ? await sql`
      SELECT
        g.id, g.concepto, g.monto AS total,
        g.fecha_vencimiento AS fecha_referencia,
        g.proveedor AS cliente_nombre,
        g.estado,
        'gasto' AS tipo_candidato
      FROM gastos g
      WHERE g.estado = 'pendiente'
        AND g.movimiento_bancario_id IS NULL
        AND ABS(g.monto - ${monto}) / NULLIF(${monto}, 0) <= 0.10
        AND g.fecha_vencimiento BETWEEN (${fecha}::date - INTERVAL '45 days') AND (${fecha}::date + INTERVAL '45 days')
      ORDER BY ABS(g.monto - ${monto}) ASC
      LIMIT 10
    ` : []

    return NextResponse.json({ candidatos: cfdis, facturas, gastos })
  } catch (error) {
    console.error('[conciliacion/candidatos] error:', error)
    return NextResponse.json({ error: 'Error al buscar candidatos' }, { status: 500 })
  }
}
