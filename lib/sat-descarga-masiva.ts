// lib/sat-descarga-masiva.ts
//
// Integración con el Web Service de Descarga Masiva de CFDI del SAT (México)
// Documentación oficial: https://www.sat.gob.mx/consultas/42968/consulta-y-recuperacion-de-comprobantes-(nuevo)
//
// Flujo:
//   1. autenticar(certDer, llave) → token (válido 5 min)
//   2. solicitar(token, ...) → idSolicitud (guardado en DB)
//   3. verificar(token, idSolicitud) → { estadoSolicitud, paquetes[] }
//   4. descargarPaquete(token, idPaquete) → Buffer (ZIP)
//   5. unzipXmls(zipBuf) → { nombre: xml }
//
// Seguridad:
//   - El .key y contraseña NUNCA se persisten, solo se usan en memoria durante la solicitud
//   - El token SAT es temporal (5 min), no se guarda en DB

import crypto from 'crypto'
import { unzipSync } from 'fflate'

export type TipoDescarga = 'E' | 'R' // Emitidas | Recibidas

export interface SolicitudResult {
  idSolicitud: string
  codEstatus: string
  mensaje: string
  ok: boolean
}

export interface VerificaResult {
  estadoSolicitud: number  // 1=Aceptada 2=EnProceso 3=Terminada 4=Error 5=Rechazada 6=Vencida
  codEstatus: string
  numeroCFDIs: number
  paquetes: string[]
  mensaje: string
  terminada: boolean
}

// ── Carga de llave privada FIEL ───────────────────────────────────────────────
// El .key del SAT es un PKCS#8 encriptado en formato DER
export function cargarLlave(keyBuf: Buffer, password: string): crypto.KeyObject {
  const intentos: { format: 'der'; type: 'pkcs8' | 'pkcs1' }[] = [
    { format: 'der', type: 'pkcs8' },
    { format: 'der', type: 'pkcs1' },
  ]
  for (const opts of intentos) {
    try {
      return crypto.createPrivateKey({ key: keyBuf, ...opts, passphrase: password })
    } catch { /* siguiente intento */ }
  }
  throw new Error('No se pudo leer el archivo .key — verifica que la contraseña sea correcta y que sea una e.firma (FIEL) válida')
}

// ── Helpers internos ──────────────────────────────────────────────────────────
function isoZ(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString().replace(/\.\d{3}Z$/, '.000Z')
}

function xmlAttr(xml: string, attrName: string): string {
  const m = xml.match(new RegExp(`\\b${attrName}\\s*=\\s*["']([^"']+)["']`, 'i'))
  return m?.[1]?.trim() ?? ''
}

function xmlText(xml: string, tagName: string): string {
  const m = xml.match(new RegExp(`<(?:[\\w]+:)?${tagName}(?:\\s[^>]*)?>([\\s\\S]+?)</`))
  return m?.[1]?.trim() ?? ''
}

async function soapPost(url: string, body: string, soapAction: string): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `"${soapAction}"`,
    },
    body,
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`SAT respondió con HTTP ${res.status}: ${text.slice(0, 400)}`)
  }
  return text
}

// Convierte BearerToken header (usado por solicitar/verificar/descargar)
function bearerHeader(token: string): string {
  return `<o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1"><o:BearerSecurityToken>${token}</o:BearerSecurityToken></o:Security>`
}

function soapEnvelope(header: string, body: string): string {
  return `<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header>${header}</s:Header><s:Body>${body}</s:Body></s:Envelope>`
}

// ── 1. Autenticación ─────────────────────────────────────────────────────────
// Usa WS-Security con XMLDSIG (firma RSA-SHA1 sobre el Timestamp canonicalizado)
export async function autenticar(certDer: Buffer, llave: crypto.KeyObject): Promise<string> {
  const created = isoZ()
  const expires = isoZ(5 * 60 * 1000)
  const tokenId = `uuid-${crypto.randomUUID()}`
  const certB64 = certDer.toString('base64')

  // Exclusive C14N del Timestamp → se hashea con SHA1 → DigestValue
  const canonTimestamp =
    `<u:Timestamp xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" u:Id="_0">` +
    `<u:Created>${created}</u:Created>` +
    `<u:Expires>${expires}</u:Expires>` +
    `</u:Timestamp>`

  const digest = crypto.createHash('sha1').update(canonTimestamp, 'utf8').digest('base64')

  // Exclusive C14N del SignedInfo → se firma con RSA-SHA1 → SignatureValue
  const canonSignedInfo =
    `<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod>` +
    `<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></SignatureMethod>` +
    `<Reference URI="#_0">` +
    `<Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms>` +
    `<DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></DigestMethod>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference>` +
    `</SignedInfo>`

  const signer = crypto.createSign('SHA1')
  signer.update(canonSignedInfo, 'utf8')
  const sigValue = signer.sign(llave, 'base64')

  const soap =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">` +
    `<s:Header>` +
    `<o:Security xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" s:mustUnderstand="1">` +
    `<u:Timestamp u:Id="_0"><u:Created>${created}</u:Created><u:Expires>${expires}</u:Expires></u:Timestamp>` +
    `<o:BinarySecurityToken u:Id="${tokenId}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${certB64}</o:BinarySecurityToken>` +
    `<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">` +
    `<SignedInfo>` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>` +
    `<Reference URI="#_0">` +
    `<Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></Transforms>` +
    `<DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference></SignedInfo>` +
    `<SignatureValue>${sigValue}</SignatureValue>` +
    `<KeyInfo><o:SecurityTokenReference><o:Reference URI="#${tokenId}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/></o:SecurityTokenReference></KeyInfo>` +
    `</Signature>` +
    `</o:Security></s:Header>` +
    `<s:Body><Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/></s:Body>` +
    `</s:Envelope>`

  const resp = await soapPost(
    'https://cfdidescargamasiva.clouda.sat.gob.mx/AuthenticateSvc.svc',
    soap,
    'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica',
  )

  const token = xmlText(resp, 'AutenticaResult')
  if (!token) throw new Error(`El SAT no devolvió token. Verifica tu e.firma. Respuesta: ${resp.slice(0, 300)}`)
  return token
}

// ── 2. Solicitar descarga ────────────────────────────────────────────────────
export async function solicitar(
  token: string,
  rfc: string,
  fechaInicio: string,   // 'YYYY-MM-DDTHH:mm:ss'
  fechaFin: string,
  tipo: TipoDescarga,
): Promise<SolicitudResult> {
  const rfcEmisor   = tipo === 'E' ? rfc : ''
  const rfcReceptor = tipo === 'R' ? rfc : ''

  const soap = soapEnvelope(
    bearerHeader(token),
    `<SolicitaDescarga xmlns="http://DescargaMasivaTerceros.gob.mx">` +
    `<solicitud FechaInicial="${fechaInicio}" FechaFinal="${fechaFin}" ` +
    `RfcEmisor="${rfcEmisor}" RfcReceptor="${rfcReceptor}" RfcSolicitante="${rfc}" ` +
    `TipoSolicitud="CFDI" TipoComprobante=""/>` +
    `</SolicitaDescarga>`,
  )

  const resp = await soapPost(
    'https://cfdidescargamasiva.clouda.sat.gob.mx/SolicitudDescargaSvc.svc',
    soap,
    'http://DescargaMasivaTerceros.gob.mx/ISolicitaDescargaService/SolicitaDescarga',
  )

  const idSolicitud = xmlAttr(resp, 'IdSolicitud')
  const codEstatus  = xmlAttr(resp, 'CodEstatus')
  const mensaje     = xmlAttr(resp, 'Mensaje')

  return { idSolicitud, codEstatus, mensaje, ok: codEstatus === '5000' }
}

// ── 3. Verificar estado ──────────────────────────────────────────────────────
export async function verificar(
  token: string,
  rfc: string,
  idSolicitud: string,
): Promise<VerificaResult> {
  const soap = soapEnvelope(
    bearerHeader(token),
    `<VerificaSolicitudDescarga xmlns="http://DescargaMasivaTerceros.gob.mx">` +
    `<solicitud IdSolicitud="${idSolicitud}" RfcSolicitante="${rfc}"/>` +
    `</VerificaSolicitudDescarga>`,
  )

  const resp = await soapPost(
    'https://cfdidescargamasiva.clouda.sat.gob.mx/VerificaSolicitudDescargaSvc.svc',
    soap,
    'http://DescargaMasivaTerceros.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga',
  )

  // Extraer lista de paquetes (elementos <string> dentro de IdsPaquetes)
  const paquetes: string[] = []
  const rePkg = /<(?:[\w]+:)?string[^>]*>([^<\s][^<]*)<\/(?:[\w]+:)?string>/g
  let m: RegExpExecArray | null
  while ((m = rePkg.exec(resp)) !== null) {
    const v = m[1].trim()
    if (v) paquetes.push(v)
  }

  const estadoSolicitud = Number(xmlAttr(resp, 'EstadoSolicitud'))

  return {
    estadoSolicitud,
    codEstatus:  xmlAttr(resp, 'CodigoEstadoSolicitud') || xmlAttr(resp, 'CodEstatus'),
    numeroCFDIs: Number(xmlAttr(resp, 'NumeroCFDIs')),
    paquetes,
    mensaje:     xmlAttr(resp, 'Mensaje'),
    terminada:   estadoSolicitud === 3,
  }
}

// ── 4. Descargar paquete ─────────────────────────────────────────────────────
export async function descargarPaquete(
  token: string,
  rfc: string,
  idPaquete: string,
): Promise<Buffer> {
  const soap = soapEnvelope(
    bearerHeader(token),
    `<DescargarPaquete xmlns="http://DescargaMasivaTerceros.gob.mx">` +
    `<peticionDescarga IdPaquete="${idPaquete}" RfcSolicitante="${rfc}"/>` +
    `</DescargarPaquete>`,
  )

  const resp = await soapPost(
    'https://cfdidescargamasiva.clouda.sat.gob.mx/DescargarPaqueteSvc.svc',
    soap,
    'http://DescargaMasivaTerceros.gob.mx/IDescargarPaqueteService/DescargarPaquete',
  )

  // El atributo Paquete contiene el ZIP en base64 (puede tener saltos de línea)
  const pkgMatch = resp.match(/\bPaquete\s*=\s*"([A-Za-z0-9+/=\s\r\n]+)"/)
  if (!pkgMatch) {
    throw new Error(`No se encontró el paquete en la respuesta. CodEstatus: ${xmlAttr(resp, 'CodEstatus')}`)
  }
  return Buffer.from(pkgMatch[1].replace(/\s/g, ''), 'base64')
}

// ── 5. Descomprimir ZIP ──────────────────────────────────────────────────────
// Cada paquete del SAT es un ZIP que contiene XMLs (uno por CFDI, hasta 200 por paquete)
export function unzipXmls(zipBuf: Buffer): Record<string, string> {
  const files = unzipSync(new Uint8Array(zipBuf))
  const result: Record<string, string> = {}
  for (const [name, data] of Object.entries(files)) {
    if (name.toLowerCase().endsWith('.xml')) {
      result[name] = Buffer.from(data).toString('utf-8')
    }
  }
  return result
}
