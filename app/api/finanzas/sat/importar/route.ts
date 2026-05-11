import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import {
  cargarLlave, autenticar, verificar, descargarPaquete, unzipXmls,
} from '@/lib/sat-descarga-masiva'
import { parseCfdi } from '@/lib/cfdi-parser'
import { put } from '@vercel/blob'

const RFC = 'HAR250221IT3'

// POST: authenticate + verify + download + import all ready packages
// Body: { cerB64, keyB64, password, dbId }
// dbId = id de la sat_solicitudes row en nuestra DB
export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await request.json() as {
      cerB64: string
      keyB64: string
      password: string
      dbId: string
    }

    const { cerB64, keyB64, password, dbId } = body
    if (!cerB64 || !keyB64 || !password || !dbId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Load solicitud from DB
    const [solicitudRow] = await sql`
      SELECT * FROM sat_solicitudes WHERE id = ${dbId}::uuid
    ` as Record<string, unknown>[]
    if (!solicitudRow) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })

    const idSolicitudSat = solicitudRow.id_solicitud_sat as string
    if (!idSolicitudSat) {
      return NextResponse.json({ error: 'Esta solicitud no tiene ID del SAT asociado' }, { status: 400 })
    }

    // Load key
    const certDer = Buffer.from(cerB64, 'base64')
    const keyDer  = Buffer.from(keyB64, 'base64')
    let llave
    try {
      llave = cargarLlave(keyDer, password)
    } catch (e) {
      return NextResponse.json({
        error: e instanceof Error ? e.message : 'Error al leer la llave'
      }, { status: 422 })
    }

    // Authenticate
    let token: string
    try {
      token = await autenticar(certDer, llave)
    } catch (e) {
      return NextResponse.json({
        error: e instanceof Error ? e.message : 'Error de autenticación con el SAT'
      }, { status: 502 })
    }

    // Verify status
    const verif = await verificar(token, RFC, idSolicitudSat)

    // Update DB state
    await sql`
      UPDATE sat_solicitudes SET
        estado_sat          = ${verif.estadoSolicitud},
        num_cfdis           = ${verif.numeroCFDIs},
        paquetes_total      = ${verif.paquetes.length},
        mensaje             = ${verif.mensaje || null},
        updated_at          = NOW()
      WHERE id = ${dbId}::uuid
    `

    const ESTADO_LABEL: Record<number, string> = {
      1: 'Aceptada', 2: 'En proceso', 3: 'Terminada',
      4: 'Error', 5: 'Rechazada (cuota excedida)', 6: 'Vencida',
    }

    if (!verif.terminada) {
      return NextResponse.json({
        ok: false,
        estado: verif.estadoSolicitud,
        estadoLabel: ESTADO_LABEL[verif.estadoSolicitud] ?? `Estado ${verif.estadoSolicitud}`,
        numeroCFDIs: verif.numeroCFDIs,
        mensaje: verif.mensaje,
      })
    }

    // Download + import each package
    let importados = 0
    let duplicados = 0
    let errores = 0

    for (const idPaquete of verif.paquetes) {
      try {
        const zipBuf = await descargarPaquete(token, RFC, idPaquete)
        const xmls   = unzipXmls(zipBuf)

        for (const [nombre, contenido] of Object.entries(xmls)) {
          try {
            const parsed = parseCfdi(contenido)

            // Skip duplicates
            const exists = await sql`
              SELECT id FROM cfdis WHERE uuid_sat = ${parsed.uuid_sat}::uuid
            ` as Record<string, unknown>[]
            if (exists.length > 0) { duplicados++; continue }

            const tipo_netlab =
              parsed.emisor_rfc === RFC ? 'emitida' :
              parsed.receptor_rfc === RFC ? 'recibida' : 'otra'

            // Upload XML to Blob
            const blob = await put(`cfdi/${parsed.uuid_sat}.xml`, contenido, {
              access: 'public',
              addRandomSuffix: false,
              contentType: 'application/xml',
            })

            await sql`
              INSERT INTO cfdis (
                uuid_sat, tipo_comprobante, fecha, fecha_timbrado,
                emisor_rfc, emisor_nombre, receptor_rfc, receptor_nombre,
                subtotal, total, moneda, tipo_netlab,
                xml_url, xml_nombre, estado
              ) VALUES (
                ${parsed.uuid_sat}::uuid,
                ${parsed.tipo_comprobante},
                ${parsed.fecha ? parsed.fecha : null}::timestamp,
                ${parsed.fecha_timbrado ? parsed.fecha_timbrado : null}::timestamp,
                ${parsed.emisor_rfc},
                ${parsed.emisor_nombre || null},
                ${parsed.receptor_rfc},
                ${parsed.receptor_nombre || null},
                ${parsed.subtotal},
                ${parsed.total},
                ${parsed.moneda},
                ${tipo_netlab},
                ${blob.url},
                ${nombre},
                'sin_asignar'
              )
            `
            importados++
          } catch (e) {
            console.error(`[SAT] Error al importar ${nombre}:`, e)
            errores++
          }
        }
      } catch (e) {
        console.error(`[SAT] Error al descargar paquete ${idPaquete}:`, e)
        errores++
      }
    }

    // Update imported count in DB
    await sql`
      UPDATE sat_solicitudes SET
        paquetes_importados = ${verif.paquetes.length},
        updated_at = NOW()
      WHERE id = ${dbId}::uuid
    `

    return NextResponse.json({
      ok: true,
      importados,
      duplicados,
      errores,
      paquetes: verif.paquetes.length,
      numeroCFDIs: verif.numeroCFDIs,
    })
  } catch (error) {
    console.error('[SAT] POST /importar error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
