import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { enriquecerFactura } from '@/lib/finanzas-status'
import { bolsaDeIngreso } from '@/lib/finanzas-bolsas'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const facturas = await sql`
      SELECT f.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa,
        (SELECT COALESCE(SUM(p.monto), 0) FROM pagos p WHERE p.factura_id = f.id) as total_pagado,
        mb.id AS movimiento_bancario_id, mb.fecha_operacion AS fecha_pago_banco, mb.descripcion AS banco_descripcion,
        cfdi.id AS cfdi_id
      FROM facturas f
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      LEFT JOIN movimientos_bancarios mb ON mb.factura_id = f.id
      LEFT JOIN cfdis cfdi ON cfdi.factura_id = f.id
      ORDER BY f.created_at DESC
    ` as Record<string, unknown>[]

        const enriched = facturas.map((f) =>
            enriquecerFactura(f as Parameters<typeof enriquecerFactura>[0])
        )

        return NextResponse.json(enriched)
    } catch (error) {
        console.error('[ERP] Error fetching facturas:', error)
        return NextResponse.json({ error: 'Error al obtener facturas' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const {
            cliente_id, numero_factura, concepto, subtotal, iva, total,
            fecha_vencimiento, notas,
            archivo_nombre, archivo_url, archivo_tipo,
            tipo, recurrente, dia_mes,
            tipo_ingreso,
        } = body
        const tipoVal = tipo || 'unico'
        const tipoIngresoVal: 'fijo' | 'run_rate' | 'variable' =
            tipo_ingreso === 'fijo' || tipo_ingreso === 'run_rate' || tipo_ingreso === 'variable'
                ? tipo_ingreso
                : (recurrente ? 'fijo' : 'variable')
        const bolsaDestino = bolsaDeIngreso(tipoIngresoVal)

        // Auto-generate numero_factura if not provided
        let numFactura = numero_factura
        if (!numFactura) {
            const countResult = await sql`SELECT COUNT(*) as cnt FROM facturas` as Record<string, unknown>[]
            const nextNum = Number(countResult[0].cnt) + 1
            const year = new Date().getFullYear()
            const prefix = tipoVal === 'recurrente' ? 'RC' : 'NL'
            numFactura = `${prefix}-${year}-${String(nextNum).padStart(4, '0')}`
        }

        const factura = await sql`
      INSERT INTO facturas (
        id, cliente_id, numero_factura, concepto, subtotal, iva, total,
        estado, fecha_emision, fecha_vencimiento, notas,
        archivo_nombre, archivo_url, archivo_tipo,
        tipo, recurrente, dia_mes,
        tipo_ingreso, bolsa_destino,
        created_at, updated_at
      )
      VALUES (
        gen_random_uuid(), ${cliente_id || null}, ${numFactura}, ${concepto},
        ${subtotal}, ${iva || 0}, ${total},
        'pendiente', CURRENT_DATE, ${fecha_vencimiento || null}, ${notas || null},
        ${archivo_nombre || null}, ${archivo_url || null}, ${archivo_tipo || null},
        ${tipoVal}, ${recurrente || false}, ${dia_mes || null},
        ${tipoIngresoVal}, ${bolsaDestino},
        NOW(), NOW()
      )
      RETURNING *
    ` as Record<string, unknown>[]

        return NextResponse.json(factura[0], { status: 201 })
    } catch (error) {
        console.error('[ERP] Error creating factura:', error)
        return NextResponse.json({ error: 'Error al crear factura' }, { status: 500 })
    }
}
