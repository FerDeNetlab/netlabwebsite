import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

const root = '/Users/luisefe/Documents/netlab_dev/netlabwebsite'

function write(rel, content) {
  const full = join(root, rel)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf8')
  console.log('ok', rel)
}

// ── lib/ics.ts ────────────────────────────────────────────────────────────────
write('lib/ics.ts', `/** Genera un string iCalendar (RFC 5545) para un evento */
export function generateICS(opts: {
  uid: string
  titulo: string
  descripcion?: string
  fecha: Date
  duracionHoras?: number
}): string {
  const { uid, titulo, descripcion = '', fecha, duracionHoras = 1 } = opts

  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) =>
    String(d.getUTCFullYear()) +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'

  const end = new Date(fecha.getTime() + duracionHoras * 3600000)
  const now = fmt(new Date())
  const start = fmt(fecha)
  const finish = fmt(end)

  const esc = (s: string) =>
    s.replace(/\\\\/g, '\\\\\\\\').replace(/;/g, '\\\\;').replace(/,/g, '\\\\,').replace(/\\n/g, '\\\\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Netlab//PendientesDirector//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    'UID:' + uid + '@netlab.mx',
    'DTSTAMP:' + now,
    'DTSTART:' + start,
    'DTEND:' + finish,
    'SUMMARY:' + esc(titulo),
    'DESCRIPTION:' + esc(descripcion),
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\\r\\n')
}
`)

// ── app/api/pendientes/externos/route.ts ─────────────────────────────────────
write('app/api/pendientes/externos/route.ts', `import { NextResponse } from 'next/server'
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

  const rows = (await sql\`
    INSERT INTO pendientes_externos (nombre, empresa, asunto, descripcion, fecha_deseada)
    VALUES (\${nombre}, \${empresa}, \${asunto}, \${descripcion}, \${fechaDeseada})
    RETURNING id, created_at
  \`) as { id: string; created_at: string }[]

  const chatId = process.env.TELEGRAM_DIRECTOR_CHAT_ID ?? '8335831704'
  const empresaStr = empresa ? ' (' + empresa + ')' : ''
  const fechaStr = fechaDeseada ? '\\nFecha: ' + fechaDeseada : ''
  const descStr = descripcion ? '\\n' + descripcion.slice(0, 200) : ''
  await sendTelegramMessage(
    chatId,
    '*Nuevo pendiente* de ' + nombre + empresaStr + '\\n*' + asunto + '*' + descStr + fechaStr,
    { parseMode: 'Markdown' }
  ).catch(() => {})

  return NextResponse.json(rows[0], { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const rows = await sql\`
    SELECT id, nombre, empresa, asunto, descripcion, fecha_deseada, estado, notas_director, created_at
    FROM pendientes_externos
    ORDER BY
      CASE estado WHEN 'nuevo' THEN 0 WHEN 'visto' THEN 1 WHEN 'agendado' THEN 2 ELSE 3 END,
      created_at DESC
  \`
  return NextResponse.json(rows)
}
`)

// ── app/api/pendientes/externos/[id]/route.ts ─────────────────────────────────
write('app/api/pendientes/externos/[id]/route.ts', `import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const estadosValidos = ['nuevo', 'visto', 'agendado', 'completado']
  const estado =
    body.estado !== undefined && estadosValidos.includes(String(body.estado))
      ? String(body.estado)
      : null
  const notas =
    body.notas_director !== undefined
      ? String(body.notas_director).slice(0, 2000)
      : null

  const rows = (await sql\`
    UPDATE pendientes_externos
    SET
      estado         = COALESCE(\${estado}, estado),
      notas_director = COALESCE(\${notas}, notas_director),
      updated_at     = NOW()
    WHERE id = \${id}
    RETURNING id, estado, notas_director, updated_at
  \`) as Record<string, unknown>[]

  if (!rows.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(rows[0])
}
`)

// ── app/api/pendientes/todos/route.ts ─────────────────────────────────────────
write('app/api/pendientes/todos/route.ts', `import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const rows = await sql\`
    SELECT id, titulo, descripcion, categoria, prioridad, estado, fecha_limite, created_at, updated_at
    FROM director_todos
    ORDER BY
      CASE estado WHEN 'pendiente' THEN 0 WHEN 'en_progreso' THEN 1 ELSE 2 END,
      CASE prioridad WHEN 'alta' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END,
      fecha_limite ASC NULLS LAST,
      created_at DESC
  \`
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const titulo = String(body.titulo ?? '').trim().slice(0, 500)
  if (!titulo) return NextResponse.json({ error: 'titulo es obligatorio' }, { status: 400 })

  const categoriasValidas = ['Personal', 'Empresa', 'Reunion', 'Llamada', 'Seguimiento', 'Otro']
  const categoria = categoriasValidas.includes(String(body.categoria ?? '')) ? String(body.categoria) : 'Personal'
  const prioridades = ['alta', 'normal', 'baja']
  const prioridad = prioridades.includes(String(body.prioridad ?? '')) ? String(body.prioridad) : 'normal'
  const descripcion = body.descripcion ? String(body.descripcion).slice(0, 2000) : null
  const fechaLimite = body.fecha_limite ? String(body.fecha_limite) : null

  const rows = (await sql\`
    INSERT INTO director_todos (titulo, descripcion, categoria, prioridad, fecha_limite)
    VALUES (\${titulo}, \${descripcion}, \${categoria}, \${prioridad}, \${fechaLimite})
    RETURNING id, titulo, descripcion, categoria, prioridad, estado, fecha_limite, created_at, updated_at
  \`) as Record<string, unknown>[]

  return NextResponse.json(rows[0], { status: 201 })
}
`)

// ── app/api/pendientes/todos/[id]/route.ts ────────────────────────────────────
write('app/api/pendientes/todos/[id]/route.ts', `import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const estadosValidos = ['pendiente', 'en_progreso', 'completado']
  const estado =
    body.estado !== undefined && estadosValidos.includes(String(body.estado))
      ? String(body.estado)
      : null
  const prioridadesValidas = ['alta', 'normal', 'baja']
  const prioridad =
    body.prioridad !== undefined && prioridadesValidas.includes(String(body.prioridad))
      ? String(body.prioridad)
      : null
  const categoriasValidas = ['Personal', 'Empresa', 'Reunion', 'Llamada', 'Seguimiento', 'Otro']
  const categoria =
    body.categoria !== undefined && categoriasValidas.includes(String(body.categoria))
      ? String(body.categoria)
      : null
  const titulo = body.titulo !== undefined ? String(body.titulo).slice(0, 500) : null
  const descripcion = body.descripcion !== undefined ? String(body.descripcion).slice(0, 2000) : null
  const fechaLimite = body.fecha_limite !== undefined ? (body.fecha_limite ? String(body.fecha_limite) : null) : undefined

  const rows = (await sql\`
    UPDATE director_todos
    SET
      estado      = COALESCE(\${estado}, estado),
      prioridad   = COALESCE(\${prioridad}, prioridad),
      categoria   = COALESCE(\${categoria}, categoria),
      titulo      = COALESCE(\${titulo}, titulo),
      descripcion = COALESCE(\${descripcion}, descripcion),
      fecha_limite = \${fechaLimite !== undefined ? fechaLimite : null},
      updated_at  = NOW()
    WHERE id = \${id}
    RETURNING id, titulo, descripcion, categoria, prioridad, estado, fecha_limite, updated_at
  \`) as Record<string, unknown>[]

  if (!rows.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  await sql\`DELETE FROM director_todos WHERE id = \${id}\`
  return NextResponse.json({ ok: true })
}
`)

// ── app/api/pendientes/ics/route.ts ──────────────────────────────────────────
write('app/api/pendientes/ics/route.ts', `import { NextResponse } from 'next/server'
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
`)

console.log('Todos los archivos recreados.')
