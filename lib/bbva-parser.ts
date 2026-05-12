// lib/bbva-parser.ts
// Parser de estados de cuenta BBVA Maestra Pyme (PDF texto vectorial)
// Formato real (via pdfjs-dist):
//   - Fecha OPER: item separado en x≈10, texto "DD/MMM"
//   - Fecha LIQ + COD + DESC: item en x≈53, texto "DD/MMM COD DESCRIPCIÓN..."
//   - Montos en columnas fijas: CARGOS x≈362, ABONOS x≈423, SALDO_OP x≈475, SALDO_LIQ x≈539
//   - Referencia/continuación: item en x≈86

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

export interface MovimientoBBVA {
  fechaOperacion:   string   // 'YYYY-MM-DD'
  fechaLiquidacion: string   // 'YYYY-MM-DD'
  codigo:           string
  descripcion:      string
  referencia:       string
  cargo:            number | null
  abono:            number | null
  saldoOperacion:   number | null
  saldoLiquidacion: number | null
}

export interface EstadoCuentaBBVA {
  banco:          string
  numeroCuenta:   string
  periodoInicio:  string  // 'YYYY-MM-DD'
  periodoFin:     string  // 'YYYY-MM-DD'
  saldoInicial:   number
  saldoFinal:     number
  totalCargos:    number
  totalAbonos:    number
  movimientos:    MovimientoBBVA[]
}

const MESES: Record<string, string> = {
  ENE: '01', FEB: '02', MAR: '03', ABR: '04',
  MAY: '05', JUN: '06', JUL: '07', AGO: '08',
  SEP: '09', OCT: '10', NOV: '11', DIC: '12',
}

function parseFecha(ddMMM: string, anio: number): string {
  const [dd, mmm] = ddMMM.split('/')
  const mm = MESES[mmm?.toUpperCase()] ?? '01'
  return `${anio}-${mm}-${dd.padStart(2, '0')}`
}

function parseMonto(s: string): number | null {
  if (!s?.trim()) return null
  const n = parseFloat(s.replace(/,/g, ''))
  return isNaN(n) ? null : n
}

interface PdfItem {
  text: string
  x:    number
  y:    number
  page: number
}

interface LineGroup {
  y:     number
  page:  number
  items: PdfItem[]
}

async function extractItems(pdfBuffer: Buffer): Promise<PdfItem[]> {
  const data = new Uint8Array(pdfBuffer)
  const pdf  = await (pdfjsLib as typeof pdfjsLib).getDocument({ data, useSystemFonts: true }).promise
  const out: PdfItem[] = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page    = await pdf.getPage(p)
    const content = await page.getTextContent()
    const h       = page.getViewport({ scale: 1 }).height

    for (const item of content.items as { str: string; transform: number[] }[]) {
      const text = item.str?.trim()
      if (!text) continue
      out.push({
        text,
        x: Math.round(item.transform[4]),
        y: Math.round(h - item.transform[5]),  // flip: origin top-left
        page: p,
      })
    }
  }
  return out
}

function groupLines(items: PdfItem[]): LineGroup[] {
  const lines: LineGroup[] = []
  for (const item of items) {
    const line = lines.find(l => l.page === item.page && Math.abs(l.y - item.y) <= 3)
    if (line) {
      line.items.push(item)
    } else {
      lines.push({ y: item.y, page: item.page, items: [item] })
    }
  }
  for (const l of lines) l.items.sort((a, b) => a.x - b.x)
  lines.sort((a, b) => a.page !== b.page ? a.page - b.page : a.y - b.y)
  return lines
}

// Columnas de montos (coordenadas X del PDF)
// Inspeccionando items reales: CARGOS≈362-380, ABONOS≈419-430, SALDO_OP≈475-510, SALDO_LIQ≈539+
function xToColumna(x: number): 'cargo' | 'abono' | 'saldoOp' | 'saldoLiq' | null {
  if (x >= 340 && x <= 410) return 'cargo'
  if (x >= 411 && x <= 470) return 'abono'
  if (x >= 471 && x <= 535) return 'saldoOp'
  if (x >= 536)              return 'saldoLiq'
  return null
}

const RE_FECHA = /^\d{2}\/[A-Z]{3}$/

export async function parseBBVAPDF(pdfBuffer: Buffer): Promise<EstadoCuentaBBVA> {
  const items = await extractItems(pdfBuffer)
  const lines = groupLines(items)

  // ── Metadatos ─────────────────────────────────────────────────────────────
  let numeroCuenta  = ''
  let periodoInicio = ''
  let periodoFin    = ''
  let anio          = new Date().getFullYear()
  let saldoInicial  = 0
  let saldoFinal    = 0
  let totalCargos   = 0
  let totalAbonos   = 0

  for (const line of lines) {
    const plain = line.items.map(i => i.text).join(' ')

    const mCuenta = plain.match(/No\.\s*(?:de\s+)?Cuenta\s+(\d{7,20})/)
    if (mCuenta) numeroCuenta = mCuenta[1]

    const mPer = plain.match(/DEL\s+(\d{2}\/\d{2}\/\d{4})\s+AL\s+(\d{2}\/\d{2}\/\d{4})/)
    if (mPer) {
      const p = (s: string) => { const [d, m, y] = s.split('/'); anio = +y; return `${y}-${m}-${d}` }
      periodoInicio = p(mPer[1])
      periodoFin    = p(mPer[2])
    }

    // Saldo inicial del periodo (del resumen de Comportamiento)
    const mSI = plain.match(/Saldo\s+de\s+Liquidaci[oó]n\s+Inicial\s+([\d,]+\.\d{2})/)
    if (mSI) saldoInicial = parseMonto(mSI[1]) ?? 0

    const mSF = plain.match(/Saldo\s+Final\s*\(\+\)\s+([\d,]+\.\d{2})/)
    if (mSF) saldoFinal = parseMonto(mSF[1]) ?? 0

    const mTC = plain.match(/TOTAL\s+IMPORTE\s+CARGOS\s+([\d,]+\.\d{2})/)
    if (mTC) totalCargos = parseMonto(mTC[1]) ?? 0

    const mTA = plain.match(/TOTAL\s+IMPORTE\s+ABONOS\s+([\d,]+\.\d{2})/)
    if (mTA) totalAbonos = parseMonto(mTA[1]) ?? 0
  }

  // ── Movimientos ───────────────────────────────────────────────────────────
  const movimientos: MovimientoBBVA[] = []
  let inDetalle = false

  interface TxBuf {
    fechaOper: string
    fechaLiq:  string
    codigo:    string
    desc:      string
    refLines:  string[]
    cargo:     number | null
    abono:     number | null
    saldoOp:   number | null
    saldoLiq:  number | null
  }
  let cur: TxBuf | null = null

  const flush = () => {
    if (!cur) return
    movimientos.push({
      fechaOperacion:   parseFecha(cur.fechaOper, anio),
      fechaLiquidacion: parseFecha(cur.fechaLiq,  anio),
      codigo:           cur.codigo,
      descripcion:      cur.desc.trim(),
      referencia:       cur.refLines.join(' | ').trim(),
      cargo:            cur.cargo,
      abono:            cur.abono,
      saldoOperacion:   cur.saldoOp,
      saldoLiquidacion: cur.saldoLiq,
    })
    cur = null
  }

  for (const line of lines) {
    const plain = line.items.map(i => i.text).join(' ')

    if (/Detalle\s+de\s+Movimientos/i.test(plain)) { inDetalle = true; continue }
    if (!inDetalle) continue
    if (/Total\s+de\s+Movimientos/i.test(plain))    { flush(); inDetalle = false; continue }

    // Ignorar cabeceras y pie de página
    if (/OPER\s+LIQ|COD\.\s+DESCRIP|BBVA\s+MEXICO|Estimado\s+Cliente|PAGINA\s+\d/i.test(plain)) continue
    if (/FECHA.*SALDO|CARGOS.*ABONOS/i.test(plain)) continue

    const firstItem = line.items[0]
    if (!firstItem) continue

    // Línea de transacción: primer item en x≈10 con texto DD/MMM
    if (firstItem.x <= 20 && RE_FECHA.test(firstItem.text)) {
      flush()

      // El segundo item contiene "DD/MMM COD DESCRIPCION..."
      const secondItem = line.items.find(i => i.x > 40 && i.x < 90)
      const secondText = secondItem?.text ?? ''
      const mSecond   = secondText.match(/^(\d{2}\/[A-Z]{3})\s+([A-Z0-9]{2,3})\s+(.*)/)

      const fechaLiq = mSecond?.[1] ?? firstItem.text
      const codigo   = mSecond?.[2] ?? ''
      const desc     = mSecond?.[3] ?? secondText

      // Extraer montos de los items en sus columnas
      let cargo: number | null   = null
      let abono: number | null   = null
      let saldoOp: number | null = null
      let saldoLiq: number | null = null

      for (const item of line.items) {
        if (!/^[\d,]+\.\d{2}$/.test(item.text)) continue
        const col = xToColumna(item.x)
        const val = parseMonto(item.text)
        if (col === 'cargo')   cargo   = val
        if (col === 'abono')   abono   = val
        if (col === 'saldoOp') saldoOp = val
        if (col === 'saldoLiq') saldoLiq = val
      }

      cur = { fechaOper: firstItem.text, fechaLiq, codigo, desc, refLines: [], cargo, abono, saldoOp, saldoLiq }

    } else if (cur && firstItem.x >= 70 && firstItem.x <= 110) {
      // Línea de continuación (referencia/RFC/nombre) — x≈86
      const refText = line.items.map(i => i.text).join(' ').trim()
      if (refText) cur.refLines.push(refText)

      // A veces los saldos finales aparecen en la línea de continuación
      for (const item of line.items) {
        if (!/^[\d,]+\.\d{2}$/.test(item.text)) continue
        const col = xToColumna(item.x)
        const val = parseMonto(item.text)
        if (col === 'cargo'   && cur.cargo   === null) cur.cargo   = val
        if (col === 'abono'   && cur.abono   === null) cur.abono   = val
        if (col === 'saldoOp' && cur.saldoOp === null) cur.saldoOp = val
        if (col === 'saldoLiq' && cur.saldoLiq === null) cur.saldoLiq = val
      }
    }
  }
  flush()

  return { banco: 'BBVA', numeroCuenta, periodoInicio, periodoFin, saldoInicial, saldoFinal, totalCargos, totalAbonos, movimientos }
}

