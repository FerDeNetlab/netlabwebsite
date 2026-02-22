import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        // All payments with factura info for the last 12 months
        const pagos = await sql`
      SELECT p.monto, p.fecha_pago,
        f.numero_factura, f.fecha_emision, f.fecha_envio, f.fecha_vencimiento,
        f.dia_mes, f.recurrente, f.total as factura_total,
        cl.id as cliente_id, cl.nombre as cliente_nombre
      FROM pagos p
      LEFT JOIN facturas f ON p.factura_id = f.id
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE p.fecha_pago >= CURRENT_DATE - INTERVAL '12 months'
      ORDER BY p.fecha_pago DESC
    ` as Record<string, unknown>[]

        // Build per-client stats
        const clienteMap: Record<string, { nombre: string; pagos: number; total: number; diasDesfase: number[]; diasEmisionPago: number[]; diasEnvioPago: number[] }> = {}

        let totalDesfases: number[] = []
        let totalEmisionPago: number[] = []
        let totalEnvioPago: number[] = []

        for (const p of pagos) {
            const clienteId = (p.cliente_id as string) || 'sin_cliente'
            const clienteNombre = (p.cliente_nombre as string) || 'Sin cliente'

            if (!clienteMap[clienteId]) {
                clienteMap[clienteId] = { nombre: clienteNombre, pagos: 0, total: 0, diasDesfase: [], diasEmisionPago: [], diasEnvioPago: [] }
            }
            const c = clienteMap[clienteId]
            c.pagos++
            c.total += Number(p.monto)

            const fp = new Date(p.fecha_pago as string)

            // Desfase vs ideal date
            if (p.recurrente && p.dia_mes) {
                const lastDay = new Date(fp.getFullYear(), fp.getMonth() + 1, 0).getDate()
                const idealDay = Math.min(Number(p.dia_mes), lastDay)
                const idealDate = new Date(fp.getFullYear(), fp.getMonth(), idealDay)
                const desfase = Math.round((fp.getTime() - idealDate.getTime()) / (1000 * 60 * 60 * 24))
                c.diasDesfase.push(desfase)
                totalDesfases.push(desfase)
            } else if (p.fecha_vencimiento) {
                const fv = new Date(p.fecha_vencimiento as string)
                const desfase = Math.round((fp.getTime() - fv.getTime()) / (1000 * 60 * 60 * 24))
                c.diasDesfase.push(desfase)
                totalDesfases.push(desfase)
            }

            // Emision → pago
            if (p.fecha_emision) {
                const fe = new Date(p.fecha_emision as string)
                const dias = Math.round((fp.getTime() - fe.getTime()) / (1000 * 60 * 60 * 24))
                c.diasEmisionPago.push(dias)
                totalEmisionPago.push(dias)
            }

            // Envio → pago
            if (p.fecha_envio) {
                const fenv = new Date(p.fecha_envio as string)
                const dias = Math.round((fp.getTime() - fenv.getTime()) / (1000 * 60 * 60 * 24))
                c.diasEnvioPago.push(dias)
                totalEnvioPago.push(dias)
            }
        }

        const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0

        // Per-client summary sorted by worst desfase
        const clientes = Object.entries(clienteMap).map(([id, c]) => ({
            id,
            nombre: c.nombre,
            pagos: c.pagos,
            total: c.total,
            promedio_desfase: avg(c.diasDesfase),
            promedio_emision_pago: avg(c.diasEmisionPago),
            promedio_envio_pago: avg(c.diasEnvioPago),
            pct_a_tiempo: c.diasDesfase.length > 0
                ? Math.round((c.diasDesfase.filter(d => d <= 0).length / c.diasDesfase.length) * 100)
                : 100,
        })).sort((a, b) => b.promedio_desfase - a.promedio_desfase)

        return NextResponse.json({
            global: {
                total_pagos: pagos.length,
                promedio_desfase: avg(totalDesfases),
                promedio_emision_pago: avg(totalEmisionPago),
                promedio_envio_pago: avg(totalEnvioPago),
                pct_a_tiempo: totalDesfases.length > 0
                    ? Math.round((totalDesfases.filter(d => d <= 0).length / totalDesfases.length) * 100)
                    : 100,
            },
            clientes,
        })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al calcular cobranza' }, { status: 500 })
    }
}
