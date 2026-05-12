// lib/bbva-parser.ts
// Parser de estados de cuenta BBVA via Claude AI
// Flujo: pdf-parse (texto crudo) → Claude claude-haiku-4-5 → JSON estructurado

import Anthropic from '@anthropic-ai/sdk'
// pdf-parse está en serverExternalPackages en next.config.mjs — Vercel no lo bundlea
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse')

export interface MovimientoBBVA {
  fechaOperacion:   string
  fechaLiquidacion: string
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
  periodoInicio:  string
  periodoFin:     string
  saldoInicial:   number
  saldoFinal:     number
  totalCargos:    number
  totalAbonos:    number
  movimientos:    MovimientoBBVA[]
}

const PROMPT = `Eres un extractor de datos bancarios. Analiza el texto de un estado de cuenta BBVA México y devuelve SOLO un JSON puro (sin markdown) con esta estructura exacta:

{
  "banco": "BBVA",
  "numeroCuenta": "número de 10 dígitos",
  "periodoInicio": "YYYY-MM-DD",
  "periodoFin": "YYYY-MM-DD",
  "saldoInicial": 0.00,
  "saldoFinal": 0.00,
  "totalCargos": 0.00,
  "totalAbonos": 0.00,
  "movimientos": [
    {
      "fechaOperacion": "YYYY-MM-DD",
      "fechaLiquidacion": "YYYY-MM-DD",
      "codigo": "código o cadena vacía",
      "descripcion": "descripción del movimiento",
      "referencia": "referencia o cadena vacía",
      "cargo": null,
      "abono": 1234.56,
      "saldoOperacion": null,
      "saldoLiquidacion": null
    }
  ]
}

Reglas:
- Fechas en YYYY-MM-DD. Inferir año del período si no aparece en movimiento.
- cargo y abono son mutuamente excluyentes. Montos positivos sin comas.
- Incluye TODOS los movimientos sin omitir ninguno.
- Devuelve SOLO JSON puro, cero texto adicional.

Texto del estado de cuenta:
`

export async function parseBBVAPDF(pdfBuffer: Buffer): Promise<EstadoCuentaBBVA> {
  const data = await pdfParse(pdfBuffer)
  const textoRaw: string = data.text

  if (!textoRaw || textoRaw.trim().length < 100) {
    throw new Error('No se pudo extraer texto del PDF. Verifica que sea texto vectorial (no escaneado).')
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8192,
    messages: [{ role: 'user', content: PROMPT + textoRaw.slice(0, 50000) }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Claude no devolvió texto')

  let resultado: EstadoCuentaBBVA
  try {
    const jsonStr = content.text
      .replace(/^```(?:json)?\n?/m, '')
      .replace(/\n?```$/m, '')
      .trim()
    resultado = JSON.parse(jsonStr) as EstadoCuentaBBVA
  } catch {
    throw new Error(`JSON inválido de Claude: ${content.text.slice(0, 300)}`)
  }

  if (!resultado.movimientos || !Array.isArray(resultado.movimientos)) {
    throw new Error('Claude no devolvió el array de movimientos')
  }

  return resultado
}
