import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const aportes = await sql`
      SELECT * FROM aportes_capital ORDER BY fecha DESC
    ` as Record<string, unknown>[]

        // Summary per socio
        const porSocio: Record<string, { total: number; aportes: number }> = {}
        for (const a of aportes) {
            const s = (a.socio as string) || 'Desconocido'
            if (!porSocio[s]) porSocio[s] = { total: 0, aportes: 0 }
            porSocio[s].total += Number(a.monto)
            porSocio[s].aportes++
        }

        const socios = Object.entries(porSocio).map(([nombre, data]) => ({
            nombre, total: data.total, aportes: data.aportes,
        })).sort((a, b) => b.total - a.total)

        return NextResponse.json({
            aportes,
            socios,
            total_global: aportes.reduce((s, a) => s + Number(a.monto), 0),
        })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al obtener aportes' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const { socio, monto, concepto, fecha, notas } = body
        const fechaAporte = fecha || new Date().toISOString().split('T')[0]

        const result = await sql`
      INSERT INTO aportes_capital (socio, monto, concepto, fecha, notas)
      VALUES (${socio}, ${monto}, ${concepto || null}, ${fechaAporte}, ${notas || null})
      RETURNING *
    ` as Record<string, unknown>[]

        return NextResponse.json(result[0], { status: 201 })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al registrar aporte' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
        await sql`DELETE FROM aportes_capital WHERE id = ${id}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al eliminar aporte' }, { status: 500 })
    }
}
