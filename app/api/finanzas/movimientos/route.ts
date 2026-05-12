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

    // Último día del mes seleccionado (para el corte de rolling unpaid)
    const lastDay = new Date(anio, mes, 0).toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]

    // --- INGRESOS ---

    // 1. Recurrentes: todas las facturas recurrentes activas generan 1 pendiente por mes
    const facturasRecurrentes = await sql`
      SELECT f.id, f.numero_factura, f.concepto, f.total as monto, f.dia_mes,
        f.fecha_emision, f.fecha_vencimiento,
        f.movimiento_bancario_id, f.cfdi_id AS cfdi_id_factura,
        cl.nombre as cliente_nombre,
        'ingreso' as categoria, 'recurrente' as subtipo
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.recurrente = true AND f.dia_mes IS NOT NULL
      ORDER BY f.dia_mes
    ` as Record<string, unknown>[]

    // 2. Únicas: rolling — aparecen si vencen <= fin del mes Y (no tienen ningún pago ó pagaron este mes)
    const facturasUnicas = await sql`
      SELECT f.id, f.numero_factura, f.concepto, f.total as monto,
        f.fecha_vencimiento, f.fecha_emision,
        f.movimiento_bancario_id, f.cfdi_id AS cfdi_id_factura,
        cl.nombre as cliente_nombre,
        'ingreso' as categoria, 'unico' as subtipo
      FROM facturas f LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE f.recurrente = false
        AND f.fecha_vencimiento <= ${lastDay}::date
        AND (
          NOT EXISTS (SELECT 1 FROM pagos p WHERE p.factura_id = f.id)
          OR EXISTS (
            SELECT 1 FROM pagos p WHERE p.factura_id = f.id
            AND EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
            AND EXTRACT(YEAR FROM p.fecha_pago) = ${anio}
          )
        )
      ORDER BY f.fecha_vencimiento
    ` as Record<string, unknown>[]

    // --- EGRESOS ---

    // 3. Gastos fijos recurrentes
    const gastosFijos = await sql`
      SELECT g.id, g.concepto, g.monto, g.dia_mes, g.subtipo,
        g.fecha_vencimiento, g.proveedor as cliente_nombre,
        g.movimiento_bancario_id,
        cg.nombre as categoria_nombre, cg.color as categoria_color,
        'egreso' as categoria
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE g.recurrente = true AND g.dia_mes IS NOT NULL
      ORDER BY g.dia_mes
    ` as Record<string, unknown>[]

    // 4. Gastos únicos: rolling — aparecen si vencen <= fin del mes Y (pendiente ó pagado este mes)
    const gastosUnicos = await sql`
      SELECT g.id, g.concepto, g.monto, g.fecha_vencimiento, g.subtipo,
        g.fecha_pago as fecha_pago_real,
        g.proveedor as cliente_nombre,
        g.movimiento_bancario_id,
        cg.nombre as categoria_nombre, cg.color as categoria_color,
        'egreso' as categoria, g.estado as estado_db
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE g.recurrente = false
        AND g.fecha_vencimiento <= ${lastDay}::date
        AND (
          g.estado = 'pendiente'
          OR (
            g.estado = 'pagado'
            AND EXTRACT(MONTH FROM g.fecha_pago) = ${mes}
            AND EXTRACT(YEAR FROM g.fecha_pago) = ${anio}
          )
        )
      ORDER BY g.fecha_vencimiento
    ` as Record<string, unknown>[]

    // --- PAGOS REALIZADOS EN ESTE MES ---
    const pagosRealizados = await sql`
      SELECT p.factura_id, p.monto, p.fecha_pago, p.metodo_pago, p.notas
      FROM pagos p
      WHERE EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM p.fecha_pago) = ${anio}
      ORDER BY p.fecha_pago
    ` as Record<string, unknown>[]

    const gastosPagadosMes = await sql`
      SELECT g.id, g.fecha_pago, g.monto
      FROM gastos g
      WHERE g.estado = 'pagado'
        AND EXTRACT(MONTH FROM g.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM g.fecha_pago) = ${anio}
    ` as Record<string, unknown>[]

    // Maps
    const pagosPorFactura: Record<string, { total: number; fecha_pago: string; metodo: string }> = {}
    for (const p of pagosRealizados) {
      const fid = p.factura_id as string
      if (!pagosPorFactura[fid]) pagosPorFactura[fid] = { total: 0, fecha_pago: '', metodo: '' }
      pagosPorFactura[fid].total += Number(p.monto)
      pagosPorFactura[fid].fecha_pago = (p.fecha_pago as string) || ''
      pagosPorFactura[fid].metodo = (p.metodo_pago as string) || ''
    }

    const gastosPagadosSet = new Set(gastosPagadosMes.map(g => g.id as string))

    // Helper: días de atraso respecto a hoy
    const diasAtraso = (fechaVenc: string | null): number => {
      if (!fechaVenc) return 0
      const venc = new Date(String(fechaVenc).split('T')[0] + 'T12:00:00')
      const hoy = new Date(today + 'T12:00:00')
      const diff = Math.floor((hoy.getTime() - venc.getTime()) / 86400000)
      return Math.max(0, diff)
    }

    const movimientos: Record<string, unknown>[] = []

    // Ingresos recurrentes
    for (const f of facturasRecurrentes) {
      const dia = Math.min(Number(f.dia_mes), new Date(anio, mes, 0).getDate())
      const fechaIdeal = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      const pago = pagosPorFactura[f.id as string]
      movimientos.push({
        ...f,
        fecha_ideal: fechaIdeal,
        estado: pago ? 'cobrado' : 'pendiente',
        fecha_pago: pago?.fecha_pago || null,
        metodo_pago: pago?.metodo || null,
        monto_pagado: pago?.total || 0,
        tipo_mov: 'ingreso',
        dias_atraso: pago ? 0 : diasAtraso(fechaIdeal),
      })
    }

    // Ingresos únicos (rolling)
    for (const f of facturasUnicas) {
      const fv = (f.fecha_vencimiento as string)?.split('T')[0] || null
      const pago = pagosPorFactura[f.id as string]
      movimientos.push({
        ...f,
        fecha_ideal: fv,
        estado: pago ? 'cobrado' : 'pendiente',
        fecha_pago: pago?.fecha_pago || null,
        metodo_pago: pago?.metodo || null,
        monto_pagado: pago?.total || 0,
        tipo_mov: 'ingreso',
        dias_atraso: pago ? 0 : diasAtraso(fv),
      })
    }

    // Egresos fijos recurrentes
    for (const g of gastosFijos) {
      const dia = Math.min(Number(g.dia_mes), new Date(anio, mes, 0).getDate())
      const fechaIdeal = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      const pagado = gastosPagadosSet.has(g.id as string)
      movimientos.push({
        ...g,
        fecha_ideal: fechaIdeal,
        estado: pagado ? 'pagado' : 'pendiente',
        tipo_mov: 'egreso',
        dias_atraso: pagado ? 0 : diasAtraso(fechaIdeal),
      })
    }

    // Egresos únicos (rolling)
    for (const g of gastosUnicos) {
      const fv = (g.fecha_vencimiento as string)?.split('T')[0] || null
      const pagado = g.estado_db === 'pagado'
      movimientos.push({
        ...g,
        fecha_ideal: fv,
        estado: pagado ? 'pagado' : 'pendiente',
        tipo_mov: 'egreso',
        dias_atraso: pagado ? 0 : diasAtraso(fv),
      })
    }

    return NextResponse.json({ movimientos, mes, anio })
  } catch (error) {
    console.error('[ERP] Error movimientos:', error)
    return NextResponse.json({ error: 'Error al obtener movimientos' }, { status: 500 })
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
