// app/api/finanzas/conciliacion/route.ts
// GET: lista estados de cuenta + movimientos (con filtros)
// PATCH: conciliar un movimiento (asignar cfdi_id, etiqueta, categoria, notas)

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const view           = searchParams.get('view') ?? 'estados'   // 'estados' | 'movimientos'
  const estadoId       = searchParams.get('estadoId')
  const soloConciliado = searchParams.get('conciliado')           // 'true' | 'false' | null

  try {
    if (view === 'estados') {
      const rows = await sql`
        SELECT
          ec.*,
          COUNT(mb.id)                                          AS total_movimientos,
          COUNT(mb.id) FILTER (WHERE mb.conciliado = TRUE)      AS conciliados,
          COUNT(mb.id) FILTER (WHERE mb.conciliado = FALSE)     AS pendientes
        FROM estados_cuenta ec
        LEFT JOIN movimientos_bancarios mb ON mb.estado_cuenta_id = ec.id
        GROUP BY ec.id
        ORDER BY ec.periodo_inicio DESC
      `
      return NextResponse.json({ estados: rows })
    }

    // view === 'movimientos'
    const conciliadoFilter = soloConciliado === 'true'
      ? sql`AND mb.conciliado = TRUE`
      : soloConciliado === 'false'
        ? sql`AND mb.conciliado = FALSE`
        : sql``

    const estadoFilter = estadoId
      ? sql`AND mb.estado_cuenta_id = ${estadoId}::uuid`
      : sql``

    const rows = await sql`
      SELECT
        mb.*,
        ec.periodo_inicio, ec.periodo_fin, ec.numero_cuenta,
        c.uuid_sat, c.emisor_rfc, c.receptor_rfc, c.total AS cfdi_total
      FROM movimientos_bancarios mb
      JOIN estados_cuenta ec ON ec.id = mb.estado_cuenta_id
      LEFT JOIN cfdis c ON c.id = mb.cfdi_id
      WHERE TRUE
        ${estadoFilter}
        ${conciliadoFilter}
      ORDER BY mb.fecha_operacion DESC, mb.id
      LIMIT 500
    `
    return NextResponse.json({ movimientos: rows })
  } catch (error) {
    console.error('[conciliacion] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await request.json() as {
      id: string
      cfdi_id?: string | null
      etiqueta?: string | null
      categoria?: string | null
      notas?: string | null
      conciliado?: boolean
    }
    const { id, cfdi_id, etiqueta, categoria, notas, conciliado } = body
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    const [row] = await sql`
      UPDATE movimientos_bancarios SET
        cfdi_id    = COALESCE(${cfdi_id ?? null}::uuid,   cfdi_id),
        etiqueta   = COALESCE(${etiqueta  ?? null},        etiqueta),
        categoria  = COALESCE(${categoria ?? null},        categoria),
        notas      = COALESCE(${notas     ?? null},        notas),
        conciliado = COALESCE(${conciliado ?? null},       conciliado)
      WHERE id = ${id}::uuid
      RETURNING *
    ` as Record<string, unknown>[]

    return NextResponse.json({ ok: true, movimiento: row })
  } catch (error) {
    console.error('[conciliacion] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
