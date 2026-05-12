import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { cargarLlave, validarCertLlave, autenticar, solicitar, TipoDescarga } from '@/lib/sat-descarga-masiva'

const RFC = 'HAR250221IT3'

// GET: list stored solicitudes
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const rows = await sql`
      SELECT * FROM sat_solicitudes ORDER BY created_at DESC LIMIT 50
    ` as Record<string, unknown>[]
    return NextResponse.json({ solicitudes: rows })
  } catch (error) {
    console.error('[SAT] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 })
  }
}

// POST: authenticate + request download
// Body: { cerB64, keyB64, password, fechaInicio, fechaFin, tipo: 'E'|'R'|'A' }
// tipo 'A' = ambas (hace 2 solicitudes: una E y una R)
export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await request.json() as {
      cerB64: string
      keyB64: string
      password: string
      fechaInicio: string // YYYY-MM-DD
      fechaFin: string    // YYYY-MM-DD
      tipo: 'E' | 'R' | 'A'
    }

    const { cerB64, keyB64, password, fechaInicio, fechaFin, tipo } = body
    if (!cerB64 || !keyB64 || !password || !fechaInicio || !fechaFin || !tipo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const certDer = Buffer.from(cerB64, 'base64')
    const keyDer  = Buffer.from(keyB64, 'base64')

    // Load private key (throws with user-friendly message if password wrong)
    let llave
    try {
      llave = cargarLlave(keyDer, password)
      validarCertLlave(certDer, llave)
    } catch (e) {
      return NextResponse.json({
        error: e instanceof Error ? e.message : 'Error al leer la llave'
      }, { status: 422 })
    }

    // Authenticate → token (valid 5 min)
    let token: string
    try {
      token = await autenticar(certDer, llave)
    } catch (e) {
      return NextResponse.json({
        error: e instanceof Error ? e.message : 'Error de autenticación con el SAT'
      }, { status: 502 })
    }

    // SAT date format: YYYY-MM-DDTHH:mm:ss
    const inicio = `${fechaInicio}T00:00:00`
    const fin    = `${fechaFin}T23:59:59`

    const tiposASolicitar: TipoDescarga[] = tipo === 'A' ? ['E', 'R'] : [tipo as TipoDescarga]
    const resultados = []

    for (const t of tiposASolicitar) {
      try {
        const res = await solicitar(token, certDer, llave, RFC, inicio, fin, t)

        // Store in DB
        const [row] = await sql`
          INSERT INTO sat_solicitudes (
            id_solicitud_sat, tipo, fecha_inicio, fecha_fin,
            estado_sat, mensaje
          ) VALUES (
            ${res.idSolicitud || null},
            ${t},
            ${fechaInicio}::date,
            ${fechaFin}::date,
            ${res.ok ? 1 : 4},
            ${res.mensaje || null}
          )
          RETURNING id
        ` as Record<string, unknown>[]

        resultados.push({
          dbId: row?.id,
          tipo: t,
          idSolicitud: res.idSolicitud,
          codEstatus: res.codEstatus,
          mensaje: res.mensaje,
          ok: res.ok,
        })
      } catch (e) {
        resultados.push({
          tipo: t,
          ok: false,
          error: e instanceof Error ? e.message : 'Error al solicitar',
        })
      }
    }

    return NextResponse.json({ ok: true, resultados })
  } catch (error) {
    console.error('[SAT] POST /solicitar error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
