import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { id } = await params

    try {
        const empleados = await sql`SELECT * FROM rh_empleados WHERE id = ${id}` as Record<string, unknown>[]
        if (empleados.length === 0) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 })
        }
        const documentos = await sql`
      SELECT id, nombre, tipo, url, size_bytes, mime_type, uploaded_at
      FROM rh_empleado_documentos
      WHERE empleado_id = ${id}
      ORDER BY uploaded_at DESC
    `
        return NextResponse.json({ ...empleados[0], documentos })
    } catch (error) {
        console.error('[rh] Error fetching empleado:', error)
        return NextResponse.json({ error: 'Error al obtener empleado' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { id } = await params

    try {
        const body = await request.json()
        const {
            nombre, curp, rfc, nss, telefono, email, puesto, departamento,
            fecha_ingreso, fecha_nacimiento, salario_mensual, tipo_contrato,
            estado_civil, direccion, contacto_emergencia_nombre,
            contacto_emergencia_telefono, contacto_emergencia_relacion,
            banco, numero_tarjeta, sucursal_bbva, notas, activo, fecha_baja, motivo_baja,
        } = body

        const result = await sql`
      UPDATE rh_empleados SET
        nombre = COALESCE(${nombre}, nombre),
        curp = ${curp ?? null},
        rfc = ${rfc ?? null},
        nss = ${nss ?? null},
        telefono = ${telefono ?? null},
        email = ${email ?? null},
        puesto = ${puesto ?? null},
        departamento = ${departamento ?? null},
        fecha_ingreso = ${fecha_ingreso ?? null},
        fecha_nacimiento = ${fecha_nacimiento ?? null},
        salario_mensual = ${salario_mensual ?? null},
        tipo_contrato = ${tipo_contrato ?? null},
        estado_civil = ${estado_civil ?? null},
        direccion = ${direccion ?? null},
        contacto_emergencia_nombre = ${contacto_emergencia_nombre ?? null},
        contacto_emergencia_telefono = ${contacto_emergencia_telefono ?? null},
        contacto_emergencia_relacion = ${contacto_emergencia_relacion ?? null},
        banco = ${banco ?? null},
        numero_tarjeta = ${numero_tarjeta ?? null},
        sucursal_bbva = ${sucursal_bbva ?? null},
        notas = ${notas ?? null},
        activo = COALESCE(${activo}, activo),
        fecha_baja = ${fecha_baja ?? null},
        motivo_baja = ${motivo_baja ?? null}
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, unknown>[]

        if (result.length === 0) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 })
        }
        return NextResponse.json(result[0])
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'desconocido'
        console.error('[rh] Error updating empleado:', error)
        return NextResponse.json({ error: `Error al actualizar: ${msg}` }, { status: 500 })
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { id } = await params

    try {
        await sql`DELETE FROM rh_empleados WHERE id = ${id}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[rh] Error deleting empleado:', error)
        return NextResponse.json({ error: 'Error al eliminar empleado' }, { status: 500 })
    }
}
