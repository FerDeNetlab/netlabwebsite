/**
 * Cron diario de recordatorios financieros (9:00 AM CDMX = 15:00 UTC)
 *
 * Ejecuta:
 *   - CxC: facturas con dias_atraso ∈ {-5, 0, 3, 7} y recordatorios_activos=true
 *     → email al cliente + email a Netlab + Telegram a Netlab
 *   - CxP: gastos con dias_atraso ∈ {-5, 0, 3, 7} y recordatorios_activos=true
 *     → email a Netlab + Telegram a Netlab
 *
 * Dedupe: no envía dos veces el mismo evento + canal + destinatario el mismo día.
 *
 * Configuración: vercel.json declara el cron. Vercel agrega header
 *   Authorization: Bearer ${CRON_SECRET}
 * que validamos para que sólo Vercel pueda invocarlo.
 */

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { sendEmail, isEmailConfigured } from '@/lib/email'
import { broadcastTelegram, getNetlabChatIds, isTelegramConfigured } from '@/lib/telegram'
import {
    emailFacturaCliente, telegramFacturaCliente,
    emailFacturaNetlab, telegramFacturaNetlab,
    emailGastoNetlab, telegramGastoNetlab,
    type RecordatorioEvento,
} from '@/lib/recordatorios-templates'

export const runtime = 'nodejs'
export const maxDuration = 60

const NETLAB_FINANZAS_EMAIL = process.env.NETLAB_FINANZAS_EMAIL || 'finanzas@netlab.mx'

function eventoFromAtraso(diasAtraso: number): RecordatorioEvento | null {
    if (diasAtraso === -5) return 'pre_5d'
    if (diasAtraso === 0) return 'vence_hoy'
    if (diasAtraso === 3) return 'vencida_3d'
    if (diasAtraso === 7) return 'vencida_7d'
    return null
}

async function yaSeEnvio(opts: {
    facturaId?: string; gastoId?: string; tipoEvento: string; canal: string; destinatario: string
}): Promise<boolean> {
    const rows = (await sql`
    SELECT 1 FROM recordatorios_enviados
    WHERE tipo_evento = ${opts.tipoEvento}
      AND canal = ${opts.canal}
      AND destinatario = ${opts.destinatario}
      AND ${opts.facturaId ? sql`factura_id = ${opts.facturaId}` : sql`gasto_id = ${opts.gastoId}`}
      AND enviado_at >= CURRENT_DATE
    LIMIT 1
  `) as Record<string, unknown>[]
    return rows.length > 0
}

async function logRecordatorio(opts: {
    facturaId?: string; gastoId?: string; tipoEvento: string; canal: string; destinatario: string;
    ok: boolean; error?: string
}) {
    try {
        await sql`
      INSERT INTO recordatorios_enviados (factura_id, gasto_id, tipo_evento, canal, destinatario, ok, error)
      VALUES (${opts.facturaId || null}, ${opts.gastoId || null}, ${opts.tipoEvento}, ${opts.canal}, ${opts.destinatario}, ${opts.ok}, ${opts.error || null})
    `
    } catch (err) {
        console.error('[cron-recordatorios] no se pudo loggear:', err)
    }
}

export async function GET(request: Request) {
    // Auth: Vercel Cron envía Authorization: Bearer <CRON_SECRET>
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const stats = {
        facturas_revisadas: 0,
        gastos_revisados: 0,
        emails_enviados: 0,
        telegrams_enviados: 0,
        errores: [] as string[],
        skipped_duplicates: 0,
        configurados: { email: isEmailConfigured(), telegram: isTelegramConfigured() },
    }

    const netlabChatIds = await getNetlabChatIds()

    // ═══ CxC: Facturas ═══
    try {
        const facturas = (await sql`
      SELECT f.id, f.numero_factura, f.concepto, f.fecha_vencimiento, f.total,
             COALESCE(p.pagado, 0) as pagado,
             COALESCE(f.recordatorios_activos, true) as recordatorios_activos,
             cl.nombre as cliente_nombre, cl.email as cliente_email, cl.id as cliente_id
      FROM facturas f
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      LEFT JOIN (SELECT factura_id, SUM(monto) as pagado FROM pagos GROUP BY factura_id) p ON f.id = p.factura_id
      WHERE f.estado IN ('pendiente', 'parcial', 'vencida')
        AND f.recurrente = false
        AND f.fecha_vencimiento IS NOT NULL
        AND f.fecha_vencimiento BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE + INTERVAL '5 days'
        AND COALESCE(f.recordatorios_activos, true) = true
        AND COALESCE(p.pagado, 0) < f.total
    `) as Record<string, unknown>[]

        for (const f of facturas) {
            stats.facturas_revisadas++
            const venc = new Date(String(f.fecha_vencimiento).split('T')[0] + 'T12:00:00')
            const hoy = new Date()
            hoy.setHours(12, 0, 0, 0)
            const diasAtraso = Math.round((hoy.getTime() - venc.getTime()) / 86400000)
            const evento = eventoFromAtraso(diasAtraso)
            if (!evento) continue

            const montoPendiente = Number(f.total) - Number(f.pagado)
            const factura = {
                numero_factura: String(f.numero_factura),
                concepto: f.concepto as string | null,
                cliente_nombre: f.cliente_nombre as string | null,
                monto_pendiente: montoPendiente,
                fecha_vencimiento: String(f.fecha_vencimiento),
                dias_atraso: diasAtraso,
            }

            // Email cliente
            if (f.cliente_email && isEmailConfigured()) {
                const dest = String(f.cliente_email)
                if (!await yaSeEnvio({ facturaId: String(f.id), tipoEvento: evento, canal: 'email', destinatario: dest })) {
                    const { subject, html } = emailFacturaCliente(evento, factura)
                    const r = await sendEmail({ to: dest, subject, html, replyTo: NETLAB_FINANZAS_EMAIL })
                    await logRecordatorio({ facturaId: String(f.id), tipoEvento: evento, canal: 'email', destinatario: dest, ok: r.ok, error: r.error })
                    if (r.ok) stats.emails_enviados++
                    else stats.errores.push(`Email cliente ${dest}: ${r.error}`)
                } else stats.skipped_duplicates++
            }

            // Email Netlab
            if (isEmailConfigured()) {
                const dest = NETLAB_FINANZAS_EMAIL
                if (!await yaSeEnvio({ facturaId: String(f.id), tipoEvento: evento, canal: 'email', destinatario: dest })) {
                    const { subject, html } = emailFacturaNetlab(evento, factura)
                    const r = await sendEmail({ to: dest, subject, html })
                    await logRecordatorio({ facturaId: String(f.id), tipoEvento: evento, canal: 'email', destinatario: dest, ok: r.ok, error: r.error })
                    if (r.ok) stats.emails_enviados++
                    else stats.errores.push(`Email Netlab ${dest}: ${r.error}`)
                } else stats.skipped_duplicates++
            }

            // Telegram Netlab (broadcast)
            if (isTelegramConfigured() && netlabChatIds.length > 0) {
                const text = telegramFacturaNetlab(evento, factura)
                for (const chatId of netlabChatIds) {
                    if (!await yaSeEnvio({ facturaId: String(f.id), tipoEvento: evento, canal: 'telegram', destinatario: chatId })) {
                        const [r] = await broadcastTelegram([chatId], text)
                        await logRecordatorio({ facturaId: String(f.id), tipoEvento: evento, canal: 'telegram', destinatario: chatId, ok: r.ok, error: r.error })
                        if (r.ok) stats.telegrams_enviados++
                        else stats.errores.push(`Telegram Netlab ${chatId}: ${r.error}`)
                    } else stats.skipped_duplicates++
                }
            }

            // Telegram cliente (si tiene chat registrado)
            if (isTelegramConfigured() && f.cliente_id) {
                const clienteChats = (await sql`
          SELECT chat_id FROM telegram_chats WHERE cliente_id = ${String(f.cliente_id)} AND activo = true
        `) as Record<string, unknown>[]
                if (clienteChats.length > 0) {
                    const text = telegramFacturaCliente(evento, factura)
                    for (const c of clienteChats) {
                        const chatId = String(c.chat_id)
                        if (!await yaSeEnvio({ facturaId: String(f.id), tipoEvento: evento, canal: 'telegram', destinatario: chatId })) {
                            const [r] = await broadcastTelegram([chatId], text)
                            await logRecordatorio({ facturaId: String(f.id), tipoEvento: evento, canal: 'telegram', destinatario: chatId, ok: r.ok, error: r.error })
                            if (r.ok) stats.telegrams_enviados++
                            else stats.errores.push(`Telegram cliente ${chatId}: ${r.error}`)
                        } else stats.skipped_duplicates++
                    }
                }
            }
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        stats.errores.push(`CxC fatal: ${msg}`)
    }

    // ═══ CxP: Gastos ═══
    try {
        const gastos = (await sql`
      SELECT g.id, g.concepto, g.proveedor, g.monto, g.fecha_vencimiento,
             COALESCE(g.recordatorios_activos, true) as recordatorios_activos
      FROM gastos g
      WHERE g.estado = 'pendiente'
        AND g.recurrente = false
        AND g.fecha_vencimiento IS NOT NULL
        AND g.fecha_vencimiento BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE + INTERVAL '5 days'
        AND COALESCE(g.recordatorios_activos, true) = true
    `) as Record<string, unknown>[]

        for (const g of gastos) {
            stats.gastos_revisados++
            const venc = new Date(String(g.fecha_vencimiento).split('T')[0] + 'T12:00:00')
            const hoy = new Date()
            hoy.setHours(12, 0, 0, 0)
            const diasAtraso = Math.round((hoy.getTime() - venc.getTime()) / 86400000)
            const evento = eventoFromAtraso(diasAtraso)
            if (!evento) continue

            const gasto = {
                concepto: String(g.concepto),
                proveedor: g.proveedor as string | null,
                monto: Number(g.monto),
                fecha_vencimiento: String(g.fecha_vencimiento),
                dias_atraso: diasAtraso,
            }

            // Email Netlab
            if (isEmailConfigured()) {
                const dest = NETLAB_FINANZAS_EMAIL
                if (!await yaSeEnvio({ gastoId: String(g.id), tipoEvento: evento, canal: 'email', destinatario: dest })) {
                    const { subject, html } = emailGastoNetlab(evento, gasto)
                    const r = await sendEmail({ to: dest, subject, html })
                    await logRecordatorio({ gastoId: String(g.id), tipoEvento: evento, canal: 'email', destinatario: dest, ok: r.ok, error: r.error })
                    if (r.ok) stats.emails_enviados++
                    else stats.errores.push(`Email gasto ${dest}: ${r.error}`)
                } else stats.skipped_duplicates++
            }

            // Telegram Netlab
            if (isTelegramConfigured() && netlabChatIds.length > 0) {
                const text = telegramGastoNetlab(evento, gasto)
                for (const chatId of netlabChatIds) {
                    if (!await yaSeEnvio({ gastoId: String(g.id), tipoEvento: evento, canal: 'telegram', destinatario: chatId })) {
                        const [r] = await broadcastTelegram([chatId], text)
                        await logRecordatorio({ gastoId: String(g.id), tipoEvento: evento, canal: 'telegram', destinatario: chatId, ok: r.ok, error: r.error })
                        if (r.ok) stats.telegrams_enviados++
                        else stats.errores.push(`Telegram gasto ${chatId}: ${r.error}`)
                    } else stats.skipped_duplicates++
                }
            }
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        stats.errores.push(`CxP fatal: ${msg}`)
    }

    return NextResponse.json({ ok: true, ts: new Date().toISOString(), ...stats })
}
