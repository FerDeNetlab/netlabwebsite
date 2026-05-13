import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const empleados = await sql`
      SELECT
        id, nombre, curp, rfc, nss, telefono, email, puesto, departamento,
        fecha_ingreso, fecha_nacimiento, salario_mensual, tipo_contrato,
        estado_civil, direccion, contacto_emergencia_nombre,
        contacto_emergencia_telefono, contacto_emergencia_relacion,
        banco, numero_tarjeta, foto_url, notas, activo, fecha_baja, motivo_baja,
        created_at, updated_at
      FROM rh_empleados
      ORDER BY activo DESC, nombre ASC
    `
        return NextResponse.json(empleados)
    } catch (error) {
        console.error('[rh] Error fetching empleados:', error)
        return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const body = await request.json()
        const {
            nombre, curp, rfc, nss, telefono, email, puesto, departamento,
            fecha_ingreso, fecha_nacimiento, salario_mensual, tipo_contrato,
            estado_civil, direccion, contacto_emergencia_nombre,
            contacto_emergencia_telefono, contacto_emergencia_relacion,
            banco, numero_tarjeta, notas,
        } = body

        if (!nombre || typeof nombre !== 'string') {
            return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
        }

        const result = await sql`
      INSERT INTO rh_empleados (
        nombre, curp, rfc, nss, telefono, email, puesto, departamento,
        fecha_ingreso, fecha_nacimiento, salario_mensual, tipo_contrato,
        estado_civil, direccion, contacto_emergencia_nombre,
        contacto_emergencia_telefono, contacto_emergencia_relacion,
        banco, numero_tarjeta, notas
      ) VALUES (
        ${nombre}, ${curp || null}, ${rfc || null}, ${nss || null},
        ${telefono || null}, ${email || null}, ${puesto || null}, ${departamento || null},
        ${fecha_ingreso || null}, ${fecha_nacimiento || null},
        ${salario_mensual || null}, ${tipo_contrato || null},
        ${estado_civil || null}, ${direccion || null},
        ${contacto_emergencia_nombre || null}, ${contacto_emergencia_telefono || null},
        ${contacto_emergencia_relacion || null},
        ${banco || null}, ${numero_tarjeta || null}, ${notas || null}
      )
      RETURNING *
    ` as Record<string, unknown>[]

        return NextResponse.json(result[0])
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'desconocido'
        console.error('[rh] Error creating empleado:', error)
        return NextResponse.json({ error: `Error al crear empleado: ${msg}` }, { status: 500 })
    }
}
