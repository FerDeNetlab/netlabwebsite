import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

// POST /api/rh/bbva/alta
// Body: { ids: string[] } — IDs de empleados a incluir en el archivo
// Genera archivo .txt con el layout de alta de empleados para BBVA
// Formato por registro (110 chars) — extraído del macro "ALTA DE EMPLEADOS BBVA.xlsm":
//   [02 (2)] [CURP (18)] [EMAIL (50, space-padded)] [TELEFONO (10)] [SUCURSAL (4, zero-padded)] [TARJETA (16)] [spaces (10)]
export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  let ids: string[] = []
  try {
    const body = await req.json()
    ids = Array.isArray(body.ids) ? body.ids : []
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Selecciona al menos un empleado' }, { status: 400 })
  }

  try {
    const todos = await sql`
      SELECT id, nombre, curp, email, telefono, numero_tarjeta, sucursal_bbva
      FROM rh_empleados
      WHERE activo = true
        AND curp IS NOT NULL AND curp != ''
        AND email IS NOT NULL AND email != ''
        AND telefono IS NOT NULL AND telefono != ''
        AND numero_tarjeta IS NOT NULL AND numero_tarjeta != ''
        AND sucursal_bbva IS NOT NULL AND sucursal_bbva != ''
      ORDER BY nombre ASC
    ` as Record<string, unknown>[]

    // Filtrar solo los IDs seleccionados
    const empleados = todos.filter(e => ids.includes(e.id as string))

    if (empleados.length === 0) {
      return NextResponse.json({
        error: 'Ninguno de los empleados seleccionados tiene todos los datos completos (CURP, email, teléfono, tarjeta y sucursal BBVA)',
      }, { status: 400 })
    }

    const pad = (str: string, len: number) => str.substring(0, len).padEnd(len, ' ')

    const lines = empleados.map(e => {
      const tipo = '02'
      const curp = pad((e.curp as string).toUpperCase(), 18)
      const email = pad((e.email as string).toUpperCase(), 50)
      const telefono = ((e.telefono as string).replace(/\D/g, '')).substring(0, 10).padStart(10, '0')
      const sucursal = (e.sucursal_bbva as string).replace(/\D/g, '').padStart(4, '0').substring(0, 4)
      const tarjeta = pad((e.numero_tarjeta as string).replace(/\s/g, ''), 16)
      const trailing = '          ' // 10 spaces
      return `${tipo}${curp}${email}${telefono}${sucursal}${tarjeta}${trailing}`
    })

    const content = lines.join('\r\n')

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="ALTA_NOMINA_BBVA_${new Date().toISOString().split('T')[0]}.txt"`,
      },
    })
  } catch (error) {
    console.error('[BBVA Alta] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
  }
}
