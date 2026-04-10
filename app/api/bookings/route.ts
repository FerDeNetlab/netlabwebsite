import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, empresa, usuarios, descripcion, plan } = body

    // Validar campos requeridos
    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Asegurar que las columnas adicionales existen
    try {
      await sql`ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS descripcion TEXT`
      await sql`ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS plan VARCHAR(50)`
    } catch (e) {
      // Ignorar si ya existen
    }

    // Guardar en tabla bookings
    const result = await sql`
      INSERT INTO public.bookings (
        nombre, email, empresa, usuarios_count, descripcion, plan, created_at, updated_at
      )
      VALUES (
        ${nombre}, ${email}, ${empresa || null}, ${parseInt(usuarios) || 1}, ${descripcion || null}, ${plan || null}, NOW(), NOW()
      )
      RETURNING id, nombre, email, empresa, usuarios_count as usuarios, descripcion, plan, created_at
    ` as Record<string, unknown>[]

    console.log('[Bookings API] Booking guardado:', result[0])

    return NextResponse.json({
      success: true,
      booking: result[0],
      message: 'Booking guardado exitosamente'
    })
  } catch (error) {
    console.error('[Bookings API] Error:', error)
    return NextResponse.json(
      { error: 'Error al guardar el booking' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const bookings = await sql`
      SELECT id, nombre, email, empresa, usuarios_count as usuarios, descripcion, created_at
      FROM public.bookings
      ORDER BY created_at DESC
      LIMIT 50
    `
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('[Bookings API] Error fetching:', error)
    return NextResponse.json(
      { error: 'Error al obtener bookings' },
      { status: 500 }
    )
  }
}
