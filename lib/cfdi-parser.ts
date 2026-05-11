// lib/cfdi-parser.ts
// Parser de XML CFDI 3.3 / 4.0 del SAT (México)
// Sin dependencias externas — usa búsqueda de strings y regex sobre el XML texto plano.
// El formato CFDI es muy estándar y bien conocido, lo que hace este enfoque robusto.

export interface CfdiParsed {
  uuid_sat: string          // Folio Fiscal del TimbreFiscalDigital
  tipo_comprobante: string  // I=Ingreso E=Egreso N=Nomina P=Pago T=Traslado
  fecha: string             // Fecha de emisión (ISO 8601)
  fecha_timbrado: string | null
  emisor_rfc: string
  emisor_nombre: string
  receptor_rfc: string
  receptor_nombre: string
  subtotal: number
  total: number
  moneda: string
}

/** Extrae el valor de un atributo XML dentro de un bloque de texto */
function attr(block: string, name: string): string {
  const m = block.match(new RegExp(`\\b${name}="([^"]+)"`, 'i'))
  return m?.[1]?.trim() ?? ''
}

/** Extrae el bloque de atributos de un tag XML por nombre (maneja prefijos cfdi:, tfd:, etc.) */
function tagBlock(xml: string, tagName: string): string {
  const idx = xml.search(new RegExp(`[:<]${tagName}\\b`, 'i'))
  if (idx === -1) return ''
  const end = xml.indexOf('>', idx)
  return end !== -1 ? xml.slice(idx, end) : xml.slice(idx, idx + 1000)
}

export function parseCfdi(xml: string): CfdiParsed {
  // --- Comprobante (atributos principales) ---
  const compBlock = tagBlock(xml, 'Comprobante')
  const tipo_comprobante = attr(compBlock, 'TipoDeComprobante')
  const fecha = attr(compBlock, 'Fecha')
  const total = parseFloat(attr(compBlock, 'Total')) || 0
  const subtotal = parseFloat(attr(compBlock, 'SubTotal')) || 0
  const moneda = attr(compBlock, 'Moneda') || 'MXN'

  // --- Emisor ---
  const emisorBlock = tagBlock(xml, 'Emisor')
  const emisor_rfc = attr(emisorBlock, 'Rfc').toUpperCase()
  const emisor_nombre = attr(emisorBlock, 'Nombre')

  // --- Receptor ---
  const receptorBlock = tagBlock(xml, 'Receptor')
  const receptor_rfc = attr(receptorBlock, 'Rfc').toUpperCase()
  const receptor_nombre = attr(receptorBlock, 'Nombre')

  // --- TimbreFiscalDigital ---
  const timbreBlock = tagBlock(xml, 'TimbreFiscalDigital')
  const uuid_sat = attr(timbreBlock, 'UUID').toUpperCase()
  const fecha_timbrado = attr(timbreBlock, 'FechaTimbrado') || null

  // Validaciones mínimas
  if (!uuid_sat) throw new Error('UUID no encontrado — verifica que sea un CFDI timbrado válido (con TimbreFiscalDigital)')
  if (total <= 0) throw new Error(`Total inválido (${total}) — no se pudo leer el monto del CFDI`)
  if (!emisor_rfc) throw new Error('RFC del Emisor no encontrado en el XML')
  if (!receptor_rfc) throw new Error('RFC del Receptor no encontrado en el XML')

  return {
    uuid_sat,
    tipo_comprobante,
    fecha,
    fecha_timbrado,
    emisor_rfc,
    emisor_nombre,
    receptor_rfc,
    receptor_nombre,
    subtotal,
    total,
    moneda,
  }
}
