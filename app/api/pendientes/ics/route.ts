import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sendEmail } from '@/lib/email'
import { generateICS } from '@/lib/ics'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const uid = String(body.id ?? crypto.randomUUID())
  const titulo = String(body.titulo ?? 'Pendiente').slice(0, 300)
  const descripcion = body.descripcion ? String(body.descripcion).slice(0, 1000) : ''
  const fechaStr = String(body.fecha ?? '')

  if (!fechaStr) return NextResponse.json({ error: 'Se requiere una fecha' }, { status: 400 })
  const fecha = new Date(fechaStr)
  if (isNaN(fecha.getTime())) return NextResponse.json({ error: 'Fecha invalida' }, { status: 400 })
  if (!fechaStr.includes('T')) fecha.setUTCHours(16, 0, 0, 0)

  const icsContent = generateICS({ uid, titulo, descripcion, fecha })
  const directorEmail = process.env.DIRECTOR_EMAIL ?? 'luis@netlab.mx'
  const safeFilename = titulo.slice(0, 50).replace(/[^a-zA-Z0-9_-]/g, '_') + '.ics'

  const result = await sendEmail({
    to: directorEmail,
    subject: 'Agregar al calendario: ' + titulo,
    html:
      '<div style="font-family:monospace;background:#0a0a0a;color:#f5f5f5;padding:24px;border-radius:12px;">' +
      '<h3 style="color:#4ade80;margin:0 0 8px;">' + titulo + '</h3>' +
      (descripcion ? '<p style="color:#a1a1aa;margin:0 0 16px;">' + descripcion + '</p>' : '') +
      '<p style="color:#71717a;font-size:13px;">Abre el archivo adjunto .ics para agregar el evento a tu Calendario.</p>' +
      '</div>',
    attachments: [
      {
        filename: safeFilename,
        content: icsContent,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      },
    ],
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Error al enviar email' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
