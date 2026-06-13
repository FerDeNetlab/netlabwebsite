import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'
import { put } from '@vercel/blob'
import { parseCfdi } from '@/lib/cfdi-parser'

const RFC_EMPRESA = 'HAR250221IT3'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado') // 'sin_asignar' | 'asignado' | null = todos
    const tipo = searchParams.get('tipo')     // 'emitida' | 'recibida' | null = todos
    const mesRaw = searchParams.get('mes')
    const anioRaw = searchParams.get('anio')
    const mesNum  = mesRaw  ? parseInt(mesRaw,  10) : null
    const anioNum = anioRaw ? parseInt(anioRaw, 10) : null
    const conMes  = mesNum !== null && anioNum !== null && !isNaN(mesNum) && !isNaN(anioNum)

    const SELECT = `
      SELECT c.id, c.uuid_sat, c.tipo_netlab, c.tipo_comprobante, c.fecha, c.fecha_timbrado,
             c.emisor_rfc, c.emisor_nombre, c.receptor_rfc, c.receptor_nombre,
             c.subtotal, c.total, c.moneda, c.estado, c.xml_nombre, c.xml_url,
             c.factura_id, c.gasto_id, c.created_at,
             f.numero_factura, f.concepto AS factura_concepto,
             g.concepto AS gasto_concepto, g.proveedor AS gasto_proveedor
      FROM cfdis c
      LEFT JOIN facturas f ON c.factura_id = f.id
      LEFT JOIN gastos   g ON c.gasto_id   = g.id
    `

    let rows
    if (tipo && conMes) {
      rows = await sql`${sql.unsafe(SELECT)}
        WHERE c.tipo_netlab = ${tipo}
          AND EXTRACT(MONTH FROM c.fecha) = ${mesNum!}
          AND EXTRACT(YEAR  FROM c.fecha) = ${anioNum!}
        ORDER BY c.fecha DESC NULLS LAST, c.created_at DESC`
    } else if (tipo && estado) {
      rows = await sql`${sql.unsafe(SELECT)}
        WHERE c.tipo_netlab = ${tipo} AND c.estado = ${estado}
        ORDER BY c.fecha DESC NULLS LAST, c.created_at DESC`
    } else if (tipo) {
      rows = await sql`${sql.unsafe(SELECT)}
        WHERE c.tipo_netlab = ${tipo}
        ORDER BY c.fecha DESC NULLS LAST, c.created_at DESC`
    } else if (estado) {
      rows = await sql`${sql.unsafe(SELECT)}
        WHERE c.estado = ${estado}
        ORDER BY c.fecha DESC NULLS LAST, c.created_at DESC`
    } else {
      rows = await sql`${sql.unsafe(SELECT)}
        ORDER BY c.fecha DESC NULLS LAST, c.created_at DESC`
    }

    return NextResponse.json({ cfdis: rows })
  } catch (error) {
    console.error('[CFDI] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener CFDIs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
    if (!file.name.toLowerCase().endsWith('.xml')) {
      return NextResponse.json({ error: 'Solo se aceptan archivos .xml' }, { status: 400 })
    }
    if (file.size > 512 * 1024) {
      return NextResponse.json({ error: 'El archivo es demasiado grande (máx 512 KB)' }, { status: 400 })
    }

    const text = await file.text()

    // Parse CFDI
    let parsed
    try {
      parsed = parseCfdi(text)
    } catch (e) {
      return NextResponse.json({
        error: e instanceof Error ? e.message : 'XML inválido o no es un CFDI'
      }, { status: 422 })
    }

    // Check duplicate UUID before uploading to Blob
    const existing = await sql`
      SELECT id FROM cfdis WHERE uuid_sat = ${parsed.uuid_sat}::uuid
    ` as Record<string, unknown>[]
    if (existing.length > 0) {
      return NextResponse.json({
        error: 'Este CFDI ya fue cargado anteriormente',
        uuid_sat: parsed.uuid_sat,
        duplicate: true,
      }, { status: 409 })
    }

    // Auto-classify based on RFC
    const tipo_netlab =
      parsed.emisor_rfc === RFC_EMPRESA ? 'emitida' :
      parsed.receptor_rfc === RFC_EMPRESA ? 'recibida' : 'otra'

    // Upload XML to Vercel Blob
    const blobKey = `cfdi/${parsed.uuid_sat}.xml`
    const blob = await put(blobKey, file, { access: 'public', addRandomSuffix: false })

    // Insert into DB
    const [row] = await sql`
      INSERT INTO cfdis (
        uuid_sat, tipo_comprobante, fecha, fecha_timbrado,
        emisor_rfc, emisor_nombre, receptor_rfc, receptor_nombre,
        subtotal, total, moneda, tipo_netlab,
        xml_url, xml_nombre, estado
      ) VALUES (
        ${parsed.uuid_sat}::uuid,
        ${parsed.tipo_comprobante},
        ${parsed.fecha ? parsed.fecha + '' : null}::timestamp,
        ${parsed.fecha_timbrado ? parsed.fecha_timbrado + '' : null}::timestamp,
        ${parsed.emisor_rfc},
        ${parsed.emisor_nombre || null},
        ${parsed.receptor_rfc},
        ${parsed.receptor_nombre || null},
        ${parsed.subtotal},
        ${parsed.total},
        ${parsed.moneda},
        ${tipo_netlab},
        ${blob.url},
        ${file.name},
        'sin_asignar'
      )
      RETURNING *
    ` as Record<string, unknown>[]

    return NextResponse.json({ ok: true, cfdi: row }, { status: 201 })
  } catch (error) {
    console.error('[CFDI] POST error:', error)
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'UUID duplicado — este CFDI ya fue cargado' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al procesar el XML' }, { status: 500 })
  }
}
