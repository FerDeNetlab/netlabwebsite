/** Genera un string iCalendar (RFC 5545) para un evento */
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
    s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

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
  return lines.join('\r\n')
}
