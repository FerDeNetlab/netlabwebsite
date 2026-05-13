import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import * as XLSX from 'xlsx'

// POST /api/rh/bbva/pago
// Body: { empleados: [{ id: string, importe: number }] }
// Genera archivo .xls con el layout de pago de nóminas para BBVA
// Formato:
//   Fila 1 (idx 0): vacía
//   Fila 2 (idx 1): [, , "Numero de Registro==>>" , count]
//   Fila 3 (idx 2): [, , "Neto a Pagar=======>>", total]
//   Fila 4 (idx 3): vacía
//   Fila 5 (idx 4): ["CUENTA / TDP", "IMPORTE", "NOMBRE"]
//   Fila 6+ (idx 5+): [tarjeta, importe, nombre]
export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await request.json()
    const pagos = body.empleados as { id: string; importe: number }[]

    if (!pagos || pagos.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron empleados' }, { status: 400 })
    }

    // Fetch employee data
    const ids = pagos.map(p => p.id)
    const empleados = await sql`
      SELECT id, nombre, numero_tarjeta
      FROM rh_empleados
      WHERE id = ANY(${ids}::uuid[])
    ` as Record<string, unknown>[]

    const empMap: Record<string, { nombre: string; tarjeta: string }> = {}
    for (const e of empleados) {
      empMap[e.id as string] = {
        nombre: (e.nombre as string).toUpperCase(),
        tarjeta: (e.numero_tarjeta as string) || '',
      }
    }

    const total = pagos.reduce((s, p) => s + Number(p.importe), 0)
    const count = pagos.length

    // Build worksheet data
    const wsData: unknown[][] = [
      ['', '', '', '', '', '', '', ''],
      ['', '', 'Numero de Registro=>>', count, '', '', '', ''],
      ['', '', 'Neto a Pagar=======>>', total, '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['CUENTA / TDP', 'IMPORTE', 'NOMBRE', '', '', '', '', ''],
    ]

    for (const pago of pagos) {
      const emp = empMap[pago.id]
      if (!emp) continue
      wsData.push([emp.tarjeta, pago.importe, emp.nombre, '', '', '', '', ''])
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Column widths
    ws['!cols'] = [
      { wch: 20 }, // CUENTA
      { wch: 12 }, // IMPORTE
      { wch: 40 }, // NOMBRE
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'NOMINA')

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xls' })

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename="PAGO_NOMINA_BBVA_${new Date().toISOString().split('T')[0]}.xls"`,
      },
    })
  } catch (error) {
    console.error('[BBVA Pago] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
  }
}
