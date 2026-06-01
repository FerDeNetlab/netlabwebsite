import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { sendTelegramMessage } from '@/lib/telegram'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const nombre = String(body.nombre ?? '').trim().slice(0, 200)
  const empresa = String(body.empresa ?? '').trim().slice(0, 200) || null
  const asunto = String(body.asunto ?? '').trim().slice(0, 500)
  const descripcion = String(body.descripcion ?? '').trim().slice(0, 2000) || null
  const fechaDeseada = body.fecha_deseada ? String(body.fecha_deseada) : null

  if (!nombre || !asunto) {
    return NextResponse.json({ error: 'nombre y asunto son obligatorios' }, { status: 400 })
  }

  const rows = (await sql`
    INSERT INTO pendientes_externos (nombre, empresa, asunto, descripcion, fecha_deseada)
    VALUES (${nombre}, ${empresa}, ${asunto}, ${descripcion}, ${fechaDeseada})
    RETURNING id, created_at
  `) as { id: string; created_at: string }[]

  const chatId = process.env.TELEGRAM_DIRECTOR_CHAT_ID ?? '8335831704'
  const empresaStr = empresa ? ' (' + empresa + ')' : ''
  const fechaStr = fechaDeseada ? '\nFecha: ' + fechaDeseada : ''
  const descStr = descripcion ? '\n' + descripcion.slice(0, 200) : ''
  await sendTelegramMessage(
    chatId,
    '*Nuevo pendiente* de ' + nombre + empresaStr + '\n*' + asunto + '*' + descStr + fechaStr,
    { parseMode: 'Markdown' }
  ).catch(() => {})

  return NextResponse.json(rows[0], { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const rows = await sql`
    SELECT id, nombre, empresa, asunto, descripcion, fecha_deseada, estado, notas_director, created_at
    FROM pendientes_externos
    ORDER BY
      CASE estado WHEN 'nuevo' THEN 0 WHEN 'visto' THEN 1 WHEN 'agendado' THEN 2 ELSE 3 END,
      created_at DESC
  `
  return NextResponse.json(rows)
}
