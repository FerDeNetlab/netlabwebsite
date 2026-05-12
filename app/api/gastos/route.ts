import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { enriquecerGasto } from '@/lib/finanzas-status'
import { bolsaDeGasto } from '@/lib/finanzas-bolsas'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const gastos = await sql`
      SELECT g.*, cg.nombre as categoria_nombre, cg.color as categoria_color, cg.icono as categoria_icono,
        mb.id AS movimiento_bancario_id, mb.fecha_operacion AS fecha_pago_banco, mb.descripcion AS banco_descripcion
      FROM gastos g
      LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      LEFT JOIN movimientos_bancarios mb ON mb.gasto_id = g.id
      ORDER BY g.created_at DESC
    ` as Record<string, unknown>[]

        const categorias = await sql`
      SELECT * FROM categorias_gasto WHERE activo = true ORDER BY nombre
    `

        const enriched = gastos.map((g) =>
            enriquecerGasto(g as Parameters<typeof enriquecerGasto>[0])
        )

        return NextResponse.json({ gastos: enriched, categorias })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al obtener gastos' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const {
            categoria_id, concepto, monto, fecha_vencimiento, proveedor,
            recurrente, dia_mes, subtipo, notas,
            tipo_gasto, bolsa_origen,
            archivo_url, archivo_nombre, archivo_tipo,
        } = body

        // Defaults SAF: tipo_gasto + bolsa_origen
        const tipoGastoVal: 'estructural' | 'variable' | 'estrategico' =
            tipo_gasto === 'estructural' || tipo_gasto === 'variable' || tipo_gasto === 'estrategico'
                ? tipo_gasto
                : (recurrente || subtipo === 'sueldo' ? 'estructural' : 'variable')

        const bolsaOrigenVal = bolsa_origen || bolsaDeGasto(tipoGastoVal)

        const gasto = await sql`
      INSERT INTO gastos (
        id, categoria_id, concepto, monto, fecha_vencimiento, proveedor,
        recurrente, dia_mes, subtipo, estado, notas,
        tipo_gasto, bolsa_origen,
        archivo_url, archivo_nombre, archivo_tipo,
        created_at, updated_at
      )
      VALUES (
        gen_random_uuid(), ${categoria_id || null}, ${concepto}, ${monto},
        ${fecha_vencimiento || null}, ${proveedor || null},
        ${recurrente || false}, ${dia_mes || null}, ${subtipo || 'general'},
        'pendiente', ${notas || null},
        ${tipoGastoVal}, ${bolsaOrigenVal},
        ${archivo_url || null}, ${archivo_nombre || null}, ${archivo_tipo || null},
        NOW(), NOW()
      )
      RETURNING *
    ` as Record<string, unknown>[]

        return NextResponse.json(gasto[0], { status: 201 })
    } catch (error) {
        console.error('[ERP] Error creating gasto:', error)
        return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 })
    }
}
