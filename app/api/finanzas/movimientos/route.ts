import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

// GET: movimientos bancarios del mes filtrados por tipo (abono=ingresos, cargo=gastos)
export async function GET(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || 'cargo' // 'abono' | 'cargo'
    const mes  = parseInt(searchParams.get('mes')  || String(new Date().getMonth() + 1))
    const anio = parseInt(searchParams.get('anio') || String(new Date().getFullYear()))

    try {
        const rows = tipo === 'abono'
            ? await sql`
                SELECT mb.id, mb.fecha_operacion, mb.descripcion, mb.referencia,
                    mb.abono AS monto, mb.etiqueta, mb.categoria, mb.notas, mb.conciliado,
                    mb.cfdi_id,
                    ec.banco, ec.numero_cuenta,
                    c.uuid_sat, c.emisor_rfc, c.emisor_nombre,
                    c.receptor_rfc, c.receptor_nombre,
                    c.total AS cfdi_total, c.xml_nombre, c.tipo_netlab AS cfdi_tipo
                FROM movimientos_bancarios mb
                JOIN estados_cuenta ec ON ec.id = mb.estado_cuenta_id
                LEFT JOIN cfdis c ON c.id = mb.cfdi_id
                WHERE mb.abono > 0
                    AND EXTRACT(MONTH FROM mb.fecha_operacion) = ${mes}
                    AND EXTRACT(YEAR  FROM mb.fecha_operacion) = ${anio}
                ORDER BY mb.fecha_operacion ASC
            `
            : await sql`
                SELECT mb.id, mb.fecha_operacion, mb.descripcion, mb.referencia,
                    mb.cargo AS monto, mb.etiqueta, mb.categoria, mb.notas, mb.conciliado,
                    mb.cfdi_id,
                    ec.banco, ec.numero_cuenta,
                    c.uuid_sat, c.emisor_rfc, c.emisor_nombre,
                    c.receptor_rfc, c.receptor_nombre,
                    c.total AS cfdi_total, c.xml_nombre, c.tipo_netlab AS cfdi_tipo
                FROM movimientos_bancarios mb
                JOIN estados_cuenta ec ON ec.id = mb.estado_cuenta_id
                LEFT JOIN cfdis c ON c.id = mb.cfdi_id
                WHERE mb.cargo > 0
                    AND EXTRACT(MONTH FROM mb.fecha_operacion) = ${mes}
                    AND EXTRACT(YEAR  FROM mb.fecha_operacion) = ${anio}
                ORDER BY mb.fecha_operacion ASC
            `

        return NextResponse.json({ movimientos: rows })
    } catch (error) {
        console.error('[movimientos] GET error:', error)
        return NextResponse.json({ error: 'Error al obtener movimientos' }, { status: 500 })
    }
}

// PATCH: actualizar etiqueta, categoria, notas y/o cfdi_id de un movimiento bancario
export async function PATCH(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const { id, cfdi_id, etiqueta, categoria, notas } = await request.json()
        if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

        const [row] = await sql`
            UPDATE movimientos_bancarios SET
                cfdi_id   = CASE WHEN ${cfdi_id   !== undefined}::boolean THEN ${cfdi_id   ?? null}::uuid ELSE cfdi_id   END,
                etiqueta  = CASE WHEN ${etiqueta  !== undefined}::boolean THEN ${etiqueta  ?? null}       ELSE etiqueta  END,
                categoria = CASE WHEN ${categoria !== undefined}::boolean THEN ${categoria ?? null}       ELSE categoria END,
                notas     = CASE WHEN ${notas     !== undefined}::boolean THEN ${notas     ?? null}       ELSE notas     END
            WHERE id = ${id}::uuid
            RETURNING *
        ` as Record<string, unknown>[]

        return NextResponse.json(row)
    } catch (error) {
        console.error('[movimientos] PATCH error:', error)
        return NextResponse.json({ error: 'Error al actualizar movimiento' }, { status: 500 })
    }
}

