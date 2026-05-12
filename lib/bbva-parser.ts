// lib/bbva-parser.ts
// Parser de estados de cuenta BBVA via Claude AI
// Flujo: PDF buffer → Claude (PDF nativo vía base64) → JSON estructurado
// No usa pdf-parse — Claude lee el PDF directamente

import Anthropic from '@anthropic-ai/sdk'

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

const PROMPT = `Eres un extractor de datos bancarios. Analiza este estado de cuenta BBVA México y devuelve SOLO un JSON puro (sin markdown, sin explicaciones) con esta estructura exacta:

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
- Fechas en YYYY-MM-DD. Inferir año del período si no aparece en el movimiento.
- cargo y abono son mutuamente excluyentes. Montos positivos sin comas ni símbolos.
- Incluye TODOS los movimientos sin omitir ninguno.
- Devuelve SOLO JSON puro, sin nada más.`

export async function parseBBVAPDF(pdfBuffer: Buffer): Promise<EstadoCuentaBBVA> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 16000,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: pdfBuffer.toString('base64'),
          },
        },
        {
          type: 'text',
          text: PROMPT,
        },
      ],
    }],
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
    throw new Error(`JSON inválido de Claude: ${content.text.slice(0, 500)}`)
  }

  if (!resultado.movimientos || !Array.isArray(resultado.movimientos)) {
    throw new Error('Claude no devolvió el array de movimientos')
  }

  return resultado
}


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
