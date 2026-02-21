import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const { id } = await params

    try {
        const body = await request.json()
        const { monto, metodo_pago, referencia, notas } = body

        // Get factura total
        const factura = await sql`SELECT total FROM facturas WHERE id = ${id}` as Record<string, unknown>[]
        if (factura.length === 0) return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })

        // Get total already paid
        const pagosResult = await sql`SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE factura_id = ${id}` as Record<string, unknown>[]
        const totalPagado = Number(pagosResult[0].total) + Number(monto)
        const facturaTotal = Number(factura[0].total)

        // Create pago
        const pago = await sql`
      INSERT INTO pagos (id, factura_id, monto, metodo_pago, referencia, fecha_pago, notas, created_at)
      VALUES (gen_random_uuid(), ${id}, ${monto}, ${metodo_pago || null}, ${referencia || null}, CURRENT_DATE, ${notas || null}, NOW())
      RETURNING *
    ` as Record<string, unknown>[]

        // Auto-update factura estado
        if (totalPagado >= facturaTotal) {
            await sql`UPDATE facturas SET estado = 'pagada', fecha_pago = CURRENT_DATE, metodo_pago = ${metodo_pago || null}, updated_at = NOW() WHERE id = ${id}`
        } else {
            await sql`UPDATE facturas SET estado = 'parcial', updated_at = NOW() WHERE id = ${id}`
        }

        return NextResponse.json(pago[0], { status: 201 })
    } catch (error) {
        console.error('[ERP] Error registering pago:', error)
        return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 })
    }
}
