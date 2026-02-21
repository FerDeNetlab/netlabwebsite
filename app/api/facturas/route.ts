import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const facturas = await sql`
      SELECT f.*, cl.nombre as cliente_nombre, cl.empresa as cliente_empresa,
        (SELECT COALESCE(SUM(p.monto), 0) FROM pagos p WHERE p.factura_id = f.id) as total_pagado
      FROM facturas f
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      ORDER BY f.created_at DESC
    `
        return NextResponse.json(facturas)
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
        const { cliente_id, cotizacion_id, concepto, subtotal, iva, total, fecha_vencimiento, notas, items } = body

        // Auto-generate numero_factura
        const countResult = await sql`SELECT COUNT(*) as cnt FROM facturas` as Record<string, unknown>[]
        const nextNum = Number(countResult[0].cnt) + 1
        const year = new Date().getFullYear()
        const numero_factura = `NL-${year}-${String(nextNum).padStart(4, '0')}`

        const factura = await sql`
      INSERT INTO facturas (id, cliente_id, numero_factura, concepto, subtotal, iva, total, estado, fecha_emision, fecha_vencimiento, notas, created_at, updated_at)
      VALUES (gen_random_uuid(), ${cliente_id}, ${numero_factura}, ${concepto}, ${subtotal}, ${iva}, ${total}, 'pendiente', CURRENT_DATE, ${fecha_vencimiento || null}, ${notas || null}, NOW(), NOW())
      RETURNING *
    ` as Record<string, unknown>[]

        // If created from cotización, update cotización status
        if (cotizacion_id) {
            await sql`UPDATE cotizaciones SET estado = 'facturada', updated_at = NOW() WHERE id = ${cotizacion_id}`
        }

        return NextResponse.json(factura[0], { status: 201 })
    } catch (error) {
        console.error('[ERP] Error creating factura:', error)
        return NextResponse.json({ error: 'Error al crear factura' }, { status: 500 })
    }
}
