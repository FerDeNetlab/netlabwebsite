import { sql } from '@/lib/db'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const API = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : null

export function isTelegramConfigured(): boolean {
    return Boolean(TOKEN)
}

export async function sendTelegramMessage(
    chatId: string | number,
    text: string,
    opts?: { parseMode?: 'Markdown' | 'HTML'; disablePreview?: boolean }
): Promise<{ ok: boolean; error?: string; messageId?: number }> {
    if (!API) return { ok: false, error: 'TELEGRAM_BOT_TOKEN no configurado' }
    try {
        const r = await fetch(`${API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: opts?.parseMode || 'Markdown',
                disable_web_page_preview: opts?.disablePreview ?? true,
            }),
        })
        const data = (await r.json()) as { ok: boolean; result?: { message_id: number }; description?: string }
        if (!data.ok) return { ok: false, error: data.description || 'Error de Telegram' }
        return { ok: true, messageId: data.result?.message_id }
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Error desconocido' }
    }
}

/** Look up Telegram chat IDs registered for a given Netlab user (admin) */
export async function getChatIdsForUser(email: string): Promise<string[]> {
    try {
        const rows = (await sql`
      SELECT chat_id FROM telegram_chats
      WHERE user_email = ${email} AND activo = true
    `) as Record<string, unknown>[]
        return rows.map(r => String(r.chat_id))
    } catch {
        return []
    }
}

/** Look up Telegram chat IDs registered for a specific cliente */
export async function getChatIdsForCliente(clienteId: string): Promise<string[]> {
    try {
        const rows = (await sql`
      SELECT chat_id FROM telegram_chats
      WHERE cliente_id = ${clienteId} AND activo = true
    `) as Record<string, unknown>[]
        return rows.map(r => String(r.chat_id))
    } catch {
        return []
    }
}

/** All active Netlab admin chats (no cliente_id) — for internal notifications */
export async function getNetlabChatIds(): Promise<string[]> {
    try {
        const rows = (await sql`
      SELECT chat_id FROM telegram_chats
      WHERE cliente_id IS NULL AND activo = true
    `) as Record<string, unknown>[]
        return rows.map(r => String(r.chat_id))
    } catch {
        return []
    }
}

/** Broadcast to multiple chats; returns per-chat results */
export async function broadcastTelegram(
    chatIds: string[],
    text: string,
    opts?: Parameters<typeof sendTelegramMessage>[2]
) {
    const results: { chatId: string; ok: boolean; error?: string }[] = []
    for (const id of chatIds) {
        const r = await sendTelegramMessage(id, text, opts)
        results.push({ chatId: id, ok: r.ok, error: r.error })
    }
    return results
}
