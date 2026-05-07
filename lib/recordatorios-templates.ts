/**
 * Plantillas de recordatorios financieros (email + Telegram).
 * Eventos: 5 días antes, día del vencimiento, 3 y 7 días vencido.
 */

export type RecordatorioEvento = 'pre_5d' | 'vence_hoy' | 'vencida_3d' | 'vencida_7d'

export interface FacturaParaRecordatorio {
    numero_factura: string
    concepto: string | null
    cliente_nombre?: string | null
    monto_pendiente: number
    fecha_vencimiento: string
    dias_atraso: number
    enlace?: string
}

export interface GastoParaRecordatorio {
    concepto: string
    proveedor?: string | null
    monto: number
    fecha_vencimiento: string
    dias_atraso: number
    enlace?: string
}

const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
const fmtFecha = (s: string) => new Date(s.split('T')[0] + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

// ═══ Plantillas para CLIENTES (CxC) ═══

export function emailFacturaCliente(evento: RecordatorioEvento, f: FacturaParaRecordatorio) {
    const titulos: Record<RecordatorioEvento, string> = {
        pre_5d: `Recordatorio: Factura ${f.numero_factura} vence en 5 días`,
        vence_hoy: `Factura ${f.numero_factura} vence hoy`,
        vencida_3d: `Factura ${f.numero_factura} vencida (3 días)`,
        vencida_7d: `Factura ${f.numero_factura} vencida (7 días) — atención urgente`,
    }
    const intros: Record<RecordatorioEvento, string> = {
        pre_5d: `Le recordamos amablemente que su factura vencerá en 5 días.`,
        vence_hoy: `Le informamos que su factura vence el día de hoy.`,
        vencida_3d: `Su factura presenta 3 días de atraso. Le pedimos atender el pago a la brevedad.`,
        vencida_7d: `Su factura presenta 7 días de atraso. Por favor contáctenos para regularizar el saldo.`,
    }
    const subject = titulos[evento]
    const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#222;">
      <h2 style="color:#16a34a;margin:0 0 16px;">Netlab — Cobranza</h2>
      <p>${f.cliente_nombre ? `Estimado(a) ${f.cliente_nombre},` : 'Estimado(a) cliente,'}</p>
      <p>${intros[evento]}</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;background:#f8fafc;border-radius:6px;">
        <tr><td style="padding:8px 12px;color:#64748b;">Factura</td><td style="padding:8px 12px;text-align:right;"><strong>${f.numero_factura}</strong></td></tr>
        <tr><td style="padding:8px 12px;color:#64748b;">Concepto</td><td style="padding:8px 12px;text-align:right;">${f.concepto || '—'}</td></tr>
        <tr><td style="padding:8px 12px;color:#64748b;">Vencimiento</td><td style="padding:8px 12px;text-align:right;">${fmtFecha(f.fecha_vencimiento)}</td></tr>
        <tr><td style="padding:8px 12px;color:#64748b;">Saldo pendiente</td><td style="padding:8px 12px;text-align:right;color:#dc2626;"><strong>${fmt(f.monto_pendiente)}</strong></td></tr>
      </table>
      <p>Si ya realizó el pago, ignore este mensaje. Para cualquier aclaración responda a este correo.</p>
      <p style="color:#64748b;font-size:12px;margin-top:24px;">— Equipo Netlab · finanzas@netlab.mx</p>
    </div>
  `
    return { subject, html }
}

export function telegramFacturaCliente(evento: RecordatorioEvento, f: FacturaParaRecordatorio) {
    const headers: Record<RecordatorioEvento, string> = {
        pre_5d: '⏰ *Recordatorio de pago*',
        vence_hoy: '📅 *Vence hoy*',
        vencida_3d: '⚠️ *Factura vencida (3 días)*',
        vencida_7d: '🚨 *Factura vencida (7 días)*',
    }
    return [
        headers[evento],
        '',
        `*Factura:* ${f.numero_factura}`,
        f.concepto ? `*Concepto:* ${f.concepto}` : '',
        `*Vencimiento:* ${fmtFecha(f.fecha_vencimiento)}`,
        `*Saldo:* ${fmt(f.monto_pendiente)}`,
        '',
        '_Si ya realizó el pago, ignore este mensaje._',
        '— Netlab',
    ].filter(Boolean).join('\n')
}

// ═══ Plantillas para NETLAB (interno) ═══

export function emailFacturaNetlab(evento: RecordatorioEvento, f: FacturaParaRecordatorio) {
    const subject = `[CxC] ${f.numero_factura} · ${
        evento === 'pre_5d' ? 'vence en 5d' :
        evento === 'vence_hoy' ? 'vence hoy' :
        evento === 'vencida_3d' ? 'vencida 3d' :
        'vencida 7d'
    } · ${fmt(f.monto_pendiente)}`
    const html = `
    <div style="font-family:monospace;font-size:13px;">
      <h3>Recordatorio CxC</h3>
      <ul>
        <li><strong>Factura:</strong> ${f.numero_factura}</li>
        <li><strong>Cliente:</strong> ${f.cliente_nombre || '—'}</li>
        <li><strong>Concepto:</strong> ${f.concepto || '—'}</li>
        <li><strong>Vencimiento:</strong> ${fmtFecha(f.fecha_vencimiento)}</li>
        <li><strong>Días de atraso:</strong> ${f.dias_atraso}</li>
        <li><strong>Saldo:</strong> ${fmt(f.monto_pendiente)}</li>
      </ul>
      ${f.enlace ? `<p><a href="${f.enlace}">Abrir factura</a></p>` : ''}
    </div>
  `
    return { subject, html }
}

export function telegramFacturaNetlab(evento: RecordatorioEvento, f: FacturaParaRecordatorio) {
    const tag: Record<RecordatorioEvento, string> = {
        pre_5d: '🟡 CxC vence en 5d',
        vence_hoy: '🟠 CxC vence hoy',
        vencida_3d: '🔴 CxC vencida 3d',
        vencida_7d: '🚨 CxC vencida 7d',
    }
    return [
        `${tag[evento]} · *${fmt(f.monto_pendiente)}*`,
        `\`${f.numero_factura}\` — ${f.cliente_nombre || 's/cliente'}`,
        f.concepto ? `${f.concepto}` : '',
        `Vto: ${fmtFecha(f.fecha_vencimiento)}`,
    ].filter(Boolean).join('\n')
}

// ═══ Plantillas para gastos (CxP, solo Netlab) ═══

export function emailGastoNetlab(evento: RecordatorioEvento, g: GastoParaRecordatorio) {
    const subject = `[CxP] ${g.concepto} · ${
        evento === 'pre_5d' ? 'vence en 5d' :
        evento === 'vence_hoy' ? 'vence hoy' :
        evento === 'vencida_3d' ? 'vencido 3d' :
        'vencido 7d'
    } · ${fmt(g.monto)}`
    const html = `
    <div style="font-family:monospace;font-size:13px;">
      <h3>Recordatorio CxP</h3>
      <ul>
        <li><strong>Concepto:</strong> ${g.concepto}</li>
        <li><strong>Proveedor:</strong> ${g.proveedor || '—'}</li>
        <li><strong>Vencimiento:</strong> ${fmtFecha(g.fecha_vencimiento)}</li>
        <li><strong>Días de atraso:</strong> ${g.dias_atraso}</li>
        <li><strong>Monto:</strong> ${fmt(g.monto)}</li>
      </ul>
    </div>
  `
    return { subject, html }
}

export function telegramGastoNetlab(evento: RecordatorioEvento, g: GastoParaRecordatorio) {
    const tag: Record<RecordatorioEvento, string> = {
        pre_5d: '🟡 CxP vence en 5d',
        vence_hoy: '🟠 CxP vence hoy',
        vencida_3d: '🔴 CxP vencido 3d',
        vencida_7d: '🚨 CxP vencido 7d',
    }
    return [
        `${tag[evento]} · *${fmt(g.monto)}*`,
        `${g.concepto}${g.proveedor ? ` — ${g.proveedor}` : ''}`,
        `Vto: ${fmtFecha(g.fecha_vencimiento)}`,
    ].join('\n')
}
