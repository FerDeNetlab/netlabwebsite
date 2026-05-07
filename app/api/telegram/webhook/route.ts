/**
 * Webhook de Telegram. Configurar una sola vez:
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://netlab.mx/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
 *
 * Comandos soportados:
 *   /start        -> Da la bienvenida y muestra el chat_id
 *   /vincular     -> Indica cómo asociar el chat con un usuario Netlab
 *   /chatid       -> Devuelve el chat_id (útil para registro manual)
 */

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { sendTelegramMessage } from '@/lib/telegram'

export const runtime = 'nodejs'

interface TelegramUpdate {
    message?: {
        chat: { id: number; type: string; title?: string; username?: string; first_name?: string }
        from?: { id: number; username?: string; first_name?: string; last_name?: string }
        text?: string
    }
}

export async function POST(request: Request) {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET
    if (expected) {
        const got = request.headers.get('x-telegram-bot-api-secret-token')
        if (got !== expected) return NextResponse.json({ ok: false }, { status: 401 })
    }

    let update: TelegramUpdate
    try {
        update = (await request.json()) as TelegramUpdate
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 })
    }

    const msg = update.message
    if (!msg || !msg.text) return NextResponse.json({ ok: true })

    const chatId = msg.chat.id
    const text = msg.text.trim()
    const username = msg.from?.username || null
    const nombre = [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(' ') || msg.chat.title || null

    if (text === '/start' || text === '/chatid') {
        await sendTelegramMessage(chatId, [
            '👋 *Hola, soy el bot financiero de Netlab.*',
            '',
            `Tu *chat_id* es: \`${chatId}\``,
            '',
            'Para empezar a recibir alertas de cobranza y pagos, pídele a tu administrador',
            'que te registre desde el panel: *Finanzas → Recordatorios → Telegram*.',
            '',
            'Comandos:',
            '· /start — bienvenida',
            '· /chatid — ver mi chat_id',
        ].join('\n'))
    } else if (text === '/vincular') {
        // Auto-vincula como cliente "sin asignar" si no existe
        try {
            await sql`
        INSERT INTO telegram_chats (chat_id, username, nombre, activo)
        VALUES (${String(chatId)}, ${username}, ${nombre}, true)
        ON CONFLICT (chat_id) DO UPDATE SET
          username = EXCLUDED.username,
          nombre = EXCLUDED.nombre,
          activo = true,
          updated_at = NOW()
      `
            await sendTelegramMessage(chatId, '✅ Chat registrado. Un admin de Netlab debe vincularlo a tu usuario o cliente para activar las alertas.')
        } catch (err) {
            await sendTelegramMessage(chatId, '⚠️ No se pudo registrar el chat: ' + (err instanceof Error ? err.message : 'error'))
        }
    } else {
        await sendTelegramMessage(chatId, 'Comando no reconocido. Usa /start o /chatid.')
    }

    return NextResponse.json({ ok: true })
}
