// app/api/finanzas/conciliacion/upload/route.ts
// POST: recibe un PDF de estado de cuenta BBVA, lo parsea y guarda en DB

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { parseBBVAPDF } from '@/lib/bbva-parser'

export const maxDuration = 60  // Vercel: Claude puede tardar hasta 30s

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const form = await request.formData()
    const file = form.get('pdf') as File | null
    if (!file) return NextResponse.json({ error: 'Falta el archivo PDF' }, { status: 400 })
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Solo se aceptan archivos PDF' }, { status: 400 })
    }
    // Límite 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo excede 10 MB' }, { status: 400 })
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const estado = await parseBBVAPDF(buf)

    if (!estado.numeroCuenta || !estado.periodoInicio || !estado.periodoFin) {
      return NextResponse.json({ error: 'No se pudo leer el estado de cuenta. Verifica que sea un PDF de BBVA Maestra Pyme.' }, { status: 422 })
    }

    // Insertar estado de cuenta (falla si ya existe el mismo periodo + cuenta)
    let estadoId: string
    try {
      const [row] = await sql`
        INSERT INTO estados_cuenta (
          banco, numero_cuenta, periodo_inicio, periodo_fin,
          saldo_inicial, saldo_final, total_cargos, total_abonos, archivo_nombre
        ) VALUES (
          ${estado.banco},
          ${estado.numeroCuenta},
          ${estado.periodoInicio}::date,
          ${estado.periodoFin}::date,
          ${estado.saldoInicial},
          ${estado.saldoFinal},
          ${estado.totalCargos},
          ${estado.totalAbonos},
          ${file.name}
        )
        RETURNING id
      ` as Record<string, string>[]
      estadoId = row.id
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('unique')) {
        return NextResponse.json({ error: `Ya existe un estado de cuenta para ${estado.periodoInicio} - ${estado.periodoFin}` }, { status: 409 })
      }
      throw e
    }

    // Insertar movimientos en batch
    if (estado.movimientos.length > 0) {
      for (const m of estado.movimientos) {
        await sql`
          INSERT INTO movimientos_bancarios (
            estado_cuenta_id, fecha_operacion, fecha_liquidacion,
            codigo, descripcion, referencia,
            cargo, abono, saldo_operacion, saldo_liquidacion
          ) VALUES (
            ${estadoId}::uuid,
            ${m.fechaOperacion}::date,
            ${m.fechaLiquidacion}::date,
            ${m.codigo || null},
            ${m.descripcion},
            ${m.referencia || null},
            ${m.cargo ?? null},
            ${m.abono ?? null},
            ${m.saldoOperacion ?? null},
            ${m.saldoLiquidacion ?? null}
          )
        `
      }
    }

    return NextResponse.json({
      ok: true,
      estadoId,
      numeroCuenta: estado.numeroCuenta,
      periodoInicio: estado.periodoInicio,
      periodoFin: estado.periodoFin,
      movimientosCargados: estado.movimientos.length,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[conciliacion/upload] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
