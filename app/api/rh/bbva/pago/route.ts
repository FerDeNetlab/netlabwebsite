import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

// POST /api/rh/bbva/pago
// Body: { empleados: [{ id: string, importe: number }] }
// Genera .txt con el layout exacto del macro BBVA "PAGO DE NÓMINAS.xls"
// Registro (110 chars + CRLF):
//   u1_Cons(9)   consecutivo "000000001"
//   u2_RFC(16)   RFC empleado (spaces si no aplica)
//   u3_Tipo(2)   "99" fijo
//   u4_Cuenta(20) tarjeta/cuenta zero-padded 10 dígitos, right-padded a 20
//   u5_Importe(15) importe*100 centavos, zero-padded
//   u6_Nombre(40) nombre sanitizado (sin acentos, mayúsculas)
//   u7_Banco(3)  "001" fijo
//   u8_Plaza(3)  "001" fijo
//   u9_CRLF(2)   \r\n

function sanitizarNombre(text: string): string {
  return text
    .toUpperCase()
    .replace(/[áàä]/gi, 'A')
    .replace(/[éèë]/gi, 'E')
    .replace(/[íìï]/gi, 'I')
    .replace(/[óòö]/gi, 'O')
    .replace(/[úùü]/gi, 'U')
    .replace(/ñ/gi, 'N')
    .replace(/[().,°'"!#%=?¡¿*{}[\]><;:+&|]/g, ' ')
    .replace(/[^\x20-\x7E]/g, ' ')
    .trim()
}

function fixedStr(val: string, len: number, padChar = ' '): string {
  return val.substring(0, len).padEnd(len, padChar)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await request.json()
    const pagos = body.empleados as { id: string; importe: number }[]

    if (!pagos || pagos.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron empleados' }, { status: 400 })
    }

    const ids = pagos.map(p => p.id)
    const empleados = await sql`
      SELECT id, nombre, numero_tarjeta, rfc
      FROM rh_empleados
      WHERE id = ANY(${ids}::uuid[])
    ` as Record<string, unknown>[]

    const empMap: Record<string, { nombre: string; tarjeta: string; rfc: string }> = {}
    for (const e of empleados) {
      empMap[e.id as string] = {
        nombre: sanitizarNombre((e.nombre as string) || ''),
        tarjeta: ((e.numero_tarjeta as string) || '').replace(/\D/g, ''),
        rfc: ((e.rfc as string) || '').toUpperCase().trim(),
      }
    }

    const fecha = new Date()
    const yyyymmdd = fecha.toISOString().split('T')[0].replace(/-/g, '')

    const lines: string[] = []
    let seq = 1
    for (const pago of pagos) {
      const emp = empMap[pago.id]
      if (!emp) continue
      const centavos = Math.round(Number(pago.importe) * 100)

      // u4_Cuenta: zero-padded to 10 digits, then right-padded to 20
      const cuentaFmt = emp.tarjeta.padStart(10, '0').substring(0, 10).padEnd(20, ' ')

      const record =
        String(seq).padStart(9, '0') +           // u1_Cons (9)
        fixedStr(emp.rfc, 16) +                   // u2_RFC (16)
        '99' +                                     // u3_Tipo (2)
        cuentaFmt +                                // u4_Cuenta (20)
        String(centavos).padStart(15, '0') +       // u5_Importe (15)
        fixedStr(emp.nombre, 40) +                 // u6_Nombre (40)
        '001' +                                    // u7_Banco (3)
        '001' +                                    // u8_Plaza (3)
        '\r\n'                                     // u9_CRLF (2)

      lines.push(record)
      seq++
    }

    const content = lines.join('')
    const filename = `PAGO_NOMINA_BBVA_${yyyymmdd}.txt`

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=ascii',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('[BBVA Pago] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 })
  }
}
