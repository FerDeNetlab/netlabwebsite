import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const mes = Number(searchParams.get('mes') || new Date().getMonth() + 1)
    const anio = Number(searchParams.get('anio') || new Date().getFullYear())

    const today = new Date().toISOString().split('T')[0]

    const diasAtraso = (fechaVenc: string | null): number => {
      if (!fechaVenc) return 0
      const venc = new Date(String(fechaVenc).split('T')[0] + 'T12:00:00')
      const hoy = new Date(today + 'T12:00:00')
      return Math.max(0, Math.floor((hoy.getTime() - venc.getTime()) / 86400000))
    }

    // ── INGRESOS: facturas del mes (recurrentes siempre, únicas por fecha) ──
    const facturas = await sql`
      SELECT f.id, f.numero_factura, f.concepto, f.total AS monto,
        f.dia_mes, f.recurrente, f.fecha_vencimiento, f.fecha_emision,
        f.estado, f.movimiento_bancario_id,
        cl.nombre AS cliente_nombre,
        cfdi_f.id AS cfdi_id, cfdi_f.uuid_sat AS cfdi_uuid,
        mb.fecha_operacion AS fecha_pago_banco
      FROM facturas f
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      LEFT JOIN cfdis cfdi_f ON cfdi_f.factura_id = f.id
      LEFT JOIN movimientos_bancarios mb ON mb.id = f.movimiento_bancario_id
      WHERE f.recurrente = true
        OR (
          EXTRACT(MONTH FROM COALESCE(f.fecha_vencimiento, f.created_at)) = ${mes}
          AND EXTRACT(YEAR  FROM COALESCE(f.fecha_vencimiento, f.created_at)) = ${anio}
        )
      ORDER BY f.recurrente DESC, COALESCE(f.fecha_vencimiento, f.created_at) ASC
    ` as Record<string, unknown>[]

    // Pagos realizados este mes
    const pagosRealizados = await sql`
      SELECT p.factura_id, p.monto, p.fecha_pago, p.metodo_pago
      FROM pagos p
      WHERE EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM p.fecha_pago) = ${anio}
    ` as Record<string, unknown>[]
    const pagosPorFactura: Record<string, { total: number; fecha_pago: string; metodo: string }> = {}
    for (const p of pagosRealizados) {
      const fid = p.factura_id as string
      if (!pagosPorFactura[fid]) pagosPorFactura[fid] = { total: 0, fecha_pago: '', metodo: '' }
      pagosPorFactura[fid].total += Number(p.monto)
      pagosPorFactura[fid].fecha_pago = (p.fecha_pago as string) || ''
      pagosPorFactura[fid].metodo = (p.metodo_pago as string) || ''
    }

    // ── EGRESOS: gastos del mes (recurrentes sin fecha_baja, únicos por fecha) ──
    const gastos = await sql`
      SELECT g.id, g.concepto, g.monto, g.estado, g.proveedor,
        g.recurrente, g.dia_mes, g.fecha_vencimiento, g.fecha_pago,
        g.subtipo, g.movimiento_bancario_id, g.fecha_baja,
        cg.nombre AS categoria_nombre, cg.color AS categoria_color,
        cfdi_g.id AS cfdi_id, cfdi_g.uuid_sat AS cfdi_uuid,
        mb.fecha_operacion AS fecha_pago_banco
      FROM gastos g
      LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      LEFT JOIN cfdis cfdi_g ON cfdi_g.gasto_id = g.id
      LEFT JOIN movimientos_bancarios mb ON mb.id = g.movimiento_bancario_id
      WHERE (
        g.recurrente = true
        AND (g.fecha_baja IS NULL OR (EXTRACT(YEAR FROM g.fecha_baja) * 12 + EXTRACT(MONTH FROM g.fecha_baja)) >= (${anio} * 12 + ${mes}))
      ) OR (
        g.recurrente = false
        AND EXTRACT(MONTH FROM COALESCE(g.fecha_vencimiento, g.created_at)) = ${mes}
        AND EXTRACT(YEAR  FROM COALESCE(g.fecha_vencimiento, g.created_at)) = ${anio}
      )
      ORDER BY g.recurrente DESC, COALESCE(g.fecha_vencimiento, g.created_at) ASC
    ` as Record<string, unknown>[]

    const movimientos: Record<string, unknown>[] = []

    // Construir ingresos
    for (const f of facturas) {
      const pago = pagosPorFactura[f.id as string]
      let fechaIdeal = (f.fecha_vencimiento as string)?.split('T')[0] || null
      if (f.recurrente && f.dia_mes) {
        const dia = Math.min(Number(f.dia_mes), new Date(anio, mes, 0).getDate())
        fechaIdeal = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      }
      movimientos.push({
        ...f,
        fecha_ideal: fechaIdeal,
        tipo_mov: 'ingreso',
        subtipo: f.recurrente ? 'recurrente' : 'unico',
        estado: pago ? 'cobrado' : ((f.estado as string) === 'pagada' ? 'cobrado' : 'pendiente'),
        fecha_pago: pago?.fecha_pago || null,
        metodo_pago: pago?.metodo || null,
        monto_pagado: pago?.total || 0,
        has_cfdi: !!(f.cfdi_id),
        has_banco: !!(f.movimiento_bancario_id),
        dias_atraso: pago ? 0 : diasAtraso(fechaIdeal),
      })
    }

    // Construir egresos
    for (const g of gastos) {
      let fechaIdeal = (g.fecha_vencimiento as string)?.split('T')[0] || null
      if (g.recurrente && g.dia_mes) {
        const dia = Math.min(Number(g.dia_mes), new Date(anio, mes, 0).getDate())
        fechaIdeal = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      }
      const pagado = (g.estado as string) === 'pagado'
      movimientos.push({
        ...g,
        fecha_ideal: fechaIdeal,
        tipo_mov: 'egreso',
        subtipo: g.recurrente ? 'recurrente' : 'unico',
        estado: pagado ? 'pagado' : 'pendiente',
        has_cfdi: !!(g.cfdi_id),
        has_banco: !!(g.movimiento_bancario_id),
        dias_atraso: pagado ? 0 : diasAtraso(fechaIdeal),
      })
    }

    return NextResponse.json({ movimientos, mes, anio, _debug: { facturas_count: facturas.length, gastos_count: gastos.length } })
  } catch (error) {
    console.error('[ERP] Error movimientos:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error', stack: error instanceof Error ? error.stack?.split('\n').slice(0,3).join(' | ') : '' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await request.json()
    const { tipo, id, monto, fecha_pago, metodo_pago, notas } = body
    const fechaPago = fecha_pago || new Date().toISOString().split('T')[0]

    if (tipo === 'ingreso') {
      // Register payment for a factura
      await sql`
        INSERT INTO pagos (id, factura_id, monto, metodo_pago, fecha_pago, notas, created_at)
        VALUES (gen_random_uuid(), ${id}, ${monto}, ${metodo_pago || null}, ${fechaPago}, ${notas || null}, NOW())
      `
      return NextResponse.json({ ok: true }, { status: 201 })
    } else if (tipo === 'egreso') {
      // Mark gasto as paid
      await sql`
        UPDATE gastos SET estado = 'pagado', fecha_pago = ${fechaPago}, updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al registrar movimiento' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const id = searchParams.get('id')
    const mes = searchParams.get('mes')
    const anio = searchParams.get('anio')

    if (!tipo || !id) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })

    if (tipo === 'ingreso') {
      // Delete pagos for this factura in this month
      if (mes && anio) {
        await sql`
                    DELETE FROM pagos WHERE factura_id = ${id}
                    AND EXTRACT(MONTH FROM fecha_pago) = ${Number(mes)}
                    AND EXTRACT(YEAR FROM fecha_pago) = ${Number(anio)}
                `
      } else {
        await sql`DELETE FROM pagos WHERE factura_id = ${id}`
      }
      return NextResponse.json({ ok: true })
    } else if (tipo === 'egreso') {
      // Reset gasto to pendiente
      await sql`UPDATE gastos SET estado = 'pendiente', fecha_pago = NULL, updated_at = NOW() WHERE id = ${id}`
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  } catch (error) {
    console.error('[ERP] Error:', error)
    return NextResponse.json({ error: 'Error al cancelar movimiento' }, { status: 500 })
  }
}
