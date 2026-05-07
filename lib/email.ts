import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const from = process.env.SMTP_FROM || (user ? `Netlab Finanzas <${user}>` : 'Netlab Finanzas <no-reply@netlab.mx>')

let transporterCache: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
    if (!host || !user || !pass) return null
    if (transporterCache) return transporterCache
    transporterCache = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    })
    return transporterCache
}

export interface EmailMessage {
    to: string | string[]
    subject: string
    html: string
    text?: string
    replyTo?: string
}

export async function sendEmail(msg: EmailMessage): Promise<{ ok: boolean; error?: string; id?: string }> {
    const transporter = getTransporter()
    if (!transporter) {
        return { ok: false, error: 'SMTP no configurado (faltan SMTP_HOST/SMTP_USER/SMTP_PASS)' }
    }
    try {
        const info = await transporter.sendMail({
            from,
            to: Array.isArray(msg.to) ? msg.to.join(',') : msg.to,
            subject: msg.subject,
            html: msg.html,
            text: msg.text || msg.html.replace(/<[^>]+>/g, ''),
            replyTo: msg.replyTo,
        })
        return { ok: true, id: info.messageId }
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        return { ok: false, error: message }
    }
}

export function isEmailConfigured(): boolean {
    return Boolean(host && user && pass)
}
