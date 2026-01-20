import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const oportunidades = await sql`
      SELECT 
        o.id,
        o.nombre,
        o.etapa,
        o.valor,
        o.fecha_cierre_estimada,
        o.probabilidad,
        o.descripcion,
        o.created_at,
        o.updated_at,
        c.id as cliente_id,
        c.nombre as cliente_nombre,
        c.email as cliente_email,
        c.telefono as cliente_telefono,
        c.empresa as cliente_empresa
      FROM oportunidades o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(oportunidades)
  } catch (error) {
    console.error('[v0] Error fetching oportunidades:', error)
    return NextResponse.json({ error: 'Error al obtener oportunidades' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, cliente_id, valor, fecha_cierre_estimada, probabilidad, etapa, descripcion } = body

    const result = await sql`
      INSERT INTO oportunidades (
        nombre, 
        cliente_id, 
        valor, 
        fecha_cierre_estimada, 
        probabilidad, 
        etapa, 
        descripcion,
        created_at,
        updated_at
      )
      VALUES (
        ${nombre}, 
        ${cliente_id}, 
        ${valor}, 
        ${fecha_cierre_estimada}, 
        ${probabilidad || 50}, 
        ${etapa || 'prospecto'}, 
        ${descripcion},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('[v0] Error creating oportunidad:', error)
    return NextResponse.json({ error: 'Error al crear oportunidad' }, { status: 500 })
  }
}
