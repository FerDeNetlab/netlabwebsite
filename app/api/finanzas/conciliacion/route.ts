// app/api/finanzas/conciliacion/route.ts
// GET: lista estados de cuenta + movimientos (con filtros)
// PATCH: conciliar un movimiento (asignar cfdi_id, factura_id, gasto_id, etiqueta, categoria, notas)

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
        c.uuid_sat, c.emisor_rfc, c.receptor_rfc, c.total AS cfdi_total,
        f.numero_factura, f.concepto AS factura_concepto, f.total AS factura_total,
        f.estado AS factura_estado, cl.nombre AS factura_cliente,
        g.concepto AS gasto_concepto, g.monto AS gasto_monto, g.proveedor AS gasto_proveedor
      FROM movimientos_bancarios mb
      JOIN estados_cuenta ec ON ec.id = mb.estado_cuenta_id
      LEFT JOIN cfdis c ON c.id = mb.cfdi_id
      LEFT JOIN facturas f ON f.id = mb.factura_id
      LEFT JOIN clientes cl ON cl.id = f.cliente_id
      LEFT JOIN gastos g ON g.id = mb.gasto_id
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
      factura_id?: string | null
      gasto_id?: string | null
      etiqueta?: string | null
      categoria?: string | null
      notas?: string | null
      conciliado?: boolean
    }
    const { id, cfdi_id, factura_id, gasto_id, etiqueta, categoria, notas, conciliado } = body
    if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

    // Obtener movimiento actual para saber el monto
    const [movActual] = await sql`
      SELECT * FROM movimientos_bancarios WHERE id = ${id}::uuid
    ` as Record<string, unknown>[]
    if (!movActual) return NextResponse.json({ error: 'Movimiento no encontrado' }, { status: 404 })

    const [row] = await sql`
      UPDATE movimientos_bancarios SET
        cfdi_id    = CASE WHEN ${cfdi_id    !== undefined}::boolean THEN ${cfdi_id    ?? null}::uuid ELSE cfdi_id    END,
        factura_id = CASE WHEN ${factura_id !== undefined}::boolean THEN ${factura_id ?? null}::uuid ELSE factura_id END,
        gasto_id   = CASE WHEN ${gasto_id   !== undefined}::boolean THEN ${gasto_id   ?? null}::uuid ELSE gasto_id   END,
        etiqueta   = COALESCE(${etiqueta  ?? null}, etiqueta),
        categoria  = COALESCE(${categoria ?? null}, categoria),
        notas      = COALESCE(${notas     ?? null}, notas),
        conciliado = COALESCE(${conciliado ?? null}::boolean, conciliado)
      WHERE id = ${id}::uuid
      RETURNING *
    ` as Record<string, unknown>[]

    // Si se ligó una factura y hay monto de abono, marcar factura como pagada y registrar movimiento
    if (factura_id && movActual.abono) {
      const montoAbono = Number(movActual.abono)
      const fechaOper  = movActual.fecha_operacion as string

      // Verificar si ya tiene pagos
      const [factura] = await sql`SELECT total, estado FROM facturas WHERE id = ${factura_id}::uuid` as Record<string, unknown>[]
      if (factura && factura.estado !== 'pagada') {
        await sql`
          UPDATE facturas SET
            estado           = 'pagada',
            fecha_pago       = ${fechaOper}::date,
            movimiento_bancario_id = ${id}::uuid,
            updated_at       = NOW()
          WHERE id = ${factura_id}::uuid
        `
        // Registrar pago
        await sql`
          INSERT INTO pagos (factura_id, monto, metodo_pago, referencia, fecha_pago)
          VALUES (
            ${factura_id}::uuid,
            ${montoAbono},
            'transferencia',
            ${'Mov. bancario: ' + (movActual.descripcion as string ?? '')},
            ${fechaOper}::date
          )
          ON CONFLICT DO NOTHING
        `
      }
      // Actualizar FK en factura
      await sql`UPDATE facturas SET movimiento_bancario_id = ${id}::uuid WHERE id = ${factura_id}::uuid`
    }

    // Si se ligó un gasto y hay monto de cargo, marcar gasto como pagado
    if (gasto_id && movActual.cargo) {
      const fechaOper = movActual.fecha_operacion as string
      await sql`
        UPDATE gastos SET
          estado                 = 'pagado',
          fecha_pago             = ${fechaOper}::date,
          movimiento_bancario_id = ${id}::uuid,
          updated_at             = NOW()
        WHERE id = ${gasto_id}::uuid AND estado = 'pendiente'
      `
    }

    return NextResponse.json({ ok: true, movimiento: row })
  } catch (error) {
    console.error('[conciliacion] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
