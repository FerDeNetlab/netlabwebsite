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

// SAT WS namespaces
const NS_DES  = 'http://DescargaMasivaTerceros.sat.gob.mx'
const NS_SOAP = 'http://schemas.xmlsoap.org/soap/envelope/'
const NS_WSU  = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'
const NS_WSSE = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'
const NS_DS   = 'http://www.w3.org/2000/09/xmldsig#'

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
  respRaw: string  // raw XML del SAT para diagnóstico
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

// ── Validación de par cert/llave ──────────────────────────────────────────────
// Verifica que el .cer y .key sean del mismo par de claves FIEL
export function validarCertLlave(certDer: Buffer, llave: crypto.KeyObject): void {
  try {
    const x509 = new crypto.X509Certificate(certDer)
    // Exportar clave pública del cert y de la llave privada, comparar DER
    const certPubDer = (x509.publicKey as crypto.KeyObject).export({ type: 'spki', format: 'der' }) as Buffer
    const llavePubDer = crypto.createPublicKey(llave).export({ type: 'spki', format: 'der' }) as Buffer
    if (!certPubDer.equals(llavePubDer)) {
      throw new Error('mismatch')
    }
  } catch (e) {
    if (e instanceof Error && e.message === 'mismatch') {
      throw new Error('El certificado (.cer) no corresponde a la llave privada (.key) — verifica que sean del mismo par de claves')
    }
    // Error de otro tipo (formato de cert inusual) — no bloqueamos
  }
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

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Canonical (inclusive C14N) form of a <des:solicitud> element BEFORE signature.
// In-scope namespaces are xmlns:des and xmlns:s (matching the Python templates).
// Attributes are sorted alphabetically per C14N spec.
function canonBodyElement(localName: string, attrs: Record<string, string>): string {
  const attrStr = Object.entries(attrs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}="${escXml(v)}"`)
    .join(' ')
  return (
    `<des:${localName}` +
    ` xmlns:des="${NS_DES}"` +
    ` xmlns:s="${NS_SOAP}"` +
    (attrStr ? ` ${attrStr}` : '') +
    `></des:${localName}>`
  )
}

// XMLDSIG signature (regular C14N + enveloped-signature) to embed inside <des:solicitud>.
// Uses X509Data KeyInfo (not SecurityTokenReference — matches Python/PHP body signing).
function firmarSolicitud(certDer: Buffer, llave: crypto.KeyObject, canonElement: string): string {
  const x509 = new crypto.X509Certificate(certDer)
  const certB64 = certDer.toString('base64')

  // Issuer name: Python does reversed(components).join(',')
  // Node.js cert.issuer = "CN=...\nOU=...\nO=...\nC=MX"
  const issuerName = x509.issuer
    .split('\n')
    .filter(l => l.trim())
    .reverse()
    .join(',')

  // Serial number as decimal integer (Python returns int, XML expects decimal)
  const serialNumber = BigInt('0x' + x509.serialNumber).toString(10)

  // DigestValue = SHA1 of inclusive C14N of the element (before signature)
  const digest = crypto.createHash('sha1').update(canonElement, 'utf8').digest('base64')

  // Inclusive C14N of SignedInfo as a standalone element (matching Python's _tobytes(signed_info.to_xml(), exclusive=False))
  // Only xmlns="http://www.w3.org/2000/09/xmldsig#" is in scope — no ancestor namespaces.
  const canonSI =
    `<SignedInfo xmlns="${NS_DS}">` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"></CanonicalizationMethod>` +
    `<SignatureMethod Algorithm="${NS_DS}rsa-sha1"></SignatureMethod>` +
    `<Reference URI="">` +
    `<Transforms><Transform Algorithm="${NS_DS}enveloped-signature"></Transform></Transforms>` +
    `<DigestMethod Algorithm="${NS_DS}sha1"></DigestMethod>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference>` +
    `</SignedInfo>`

  const signer = crypto.createSign('SHA1')
  signer.update(canonSI, 'utf8')
  const sigValue = signer.sign(llave, 'base64')

  return (
    `<Signature xmlns="${NS_DS}">` +
    `<SignedInfo>` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>` +
    `<SignatureMethod Algorithm="${NS_DS}rsa-sha1"/>` +
    `<Reference URI="">` +
    `<Transforms><Transform Algorithm="${NS_DS}enveloped-signature"/></Transforms>` +
    `<DigestMethod Algorithm="${NS_DS}sha1"/>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference>` +
    `</SignedInfo>` +
    `<SignatureValue>${sigValue}</SignatureValue>` +
    `<KeyInfo>` +
    `<X509Data>` +
    `<X509IssuerSerial>` +
    `<X509IssuerName>${escXml(issuerName)}</X509IssuerName>` +
    `<X509SerialNumber>${serialNumber}</X509SerialNumber>` +
    `</X509IssuerSerial>` +
    `<X509Certificate>${certB64}</X509Certificate>` +
    `</X509Data>` +
    `</KeyInfo>` +
    `</Signature>`
  )
}

async function soapPost(
  url: string,
  body: string,
  soapAction: string,
  token?: string,
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': soapAction,
  }
  if (token) {
    headers['Authorization'] = `WRAP access_token="${token}"`
  }
  const res = await fetch(url, { method: 'POST', headers, body })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`SAT respondió con HTTP ${res.status}: ${text.slice(0, 400)}`)
  }
  return text
}

// Envelope con header vacío (solicitar/verificar/descargar usan HTTP Authorization)
function soapEnvelope(body: string): string {
  return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header/><s:Body>${body}</s:Body></s:Envelope>`
}

// ── 1. Autenticación ─────────────────────────────────────────────────────────
// Usa WS-Security con XMLDSIG (firma RSA-SHA1 sobre el Timestamp canonicalizado)
export async function autenticar(certDer: Buffer, llave: crypto.KeyObject): Promise<string> {
  const created = isoZ()
  const expires = isoZ(5 * 60 * 1000)
  // El SAT requiere un ID fijo "BinarySecurityToken" (no UUID) — matches Python template
  const BST_ID  = 'BinarySecurityToken'
  const certB64 = certDer.toString('base64')

  // Exclusive C14N del Timestamp → se hashea con SHA1 → DigestValue
  const canonTimestamp =
    `<u:Timestamp xmlns:u="${NS_WSU}" u:Id="_0">` +
    `<u:Created>${created}</u:Created>` +
    `<u:Expires>${expires}</u:Expires>` +
    `</u:Timestamp>`

  const digest = crypto.createHash('sha1').update(canonTimestamp, 'utf8').digest('base64')

  // Exclusive C14N del SignedInfo → se firma con RSA-SHA1 → SignatureValue
  const canonSignedInfo =
    `<SignedInfo xmlns="${NS_DS}">` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod>` +
    `<SignatureMethod Algorithm="${NS_DS}rsa-sha1"></SignatureMethod>` +
    `<Reference URI="#_0">` +
    `<Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></Transform></Transforms>` +
    `<DigestMethod Algorithm="${NS_DS}sha1"></DigestMethod>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference>` +
    `</SignedInfo>`

  const signer = crypto.createSign('SHA1')
  signer.update(canonSignedInfo, 'utf8')
  const sigValue = signer.sign(llave, 'base64')

  // Namespaces en root Envelope (igual que template autentica.xml de Python)
  const soap =
    `<s:Envelope xmlns:s="${NS_SOAP}" xmlns:o="${NS_WSSE}" xmlns:u="${NS_WSU}">` +
    `<s:Header>` +
    `<o:Security s:mustUnderstand="1">` +
    `<u:Timestamp u:Id="_0"><u:Created>${created}</u:Created><u:Expires>${expires}</u:Expires></u:Timestamp>` +
    `<o:BinarySecurityToken u:Id="${BST_ID}" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${certB64}</o:BinarySecurityToken>` +
    `<Signature xmlns="${NS_DS}">` +
    `<SignedInfo>` +
    `<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>` +
    `<SignatureMethod Algorithm="${NS_DS}rsa-sha1"/>` +
    `<Reference URI="#_0">` +
    `<Transforms><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></Transforms>` +
    `<DigestMethod Algorithm="${NS_DS}sha1"/>` +
    `<DigestValue>${digest}</DigestValue>` +
    `</Reference></SignedInfo>` +
    `<SignatureValue>${sigValue}</SignatureValue>` +
    `<KeyInfo><o:SecurityTokenReference><o:Reference ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3" URI="#${BST_ID}"/></o:SecurityTokenReference></KeyInfo>` +
    `</Signature>` +
    `</o:Security></s:Header>` +
    `<s:Body><Autentica xmlns="http://DescargaMasivaTerceros.gob.mx"/></s:Body>` +
    `</s:Envelope>`

  const resp = await soapPost(
    'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/Autenticacion/Autenticacion.svc',
    soap,
    'http://DescargaMasivaTerceros.gob.mx/IAutenticacion/Autentica',
  )

  const token = xmlText(resp, 'AutenticaResult')
  // Un token válido del SAT es una cadena larga alfanumérica (>50 chars)
  // Si el SAT rechazó, AutenticaResult contiene texto como "Sello Mal Formado"
  if (!token || token.length < 50) {
    throw new Error(
      `El SAT rechazó la autenticación: "${token || 'sin respuesta'}". ` +
      `Verifica que tu e.firma (FIEL) sea válida y vigente.`
    )
  }
  return token
}

// ── 2. Solicitar descarga ────────────────────────────────────────────────────
export async function solicitar(
  token: string,
  certDer: Buffer,
  llave: crypto.KeyObject,
  rfc: string,
  fechaInicio: string,   // 'YYYY-MM-DDTHH:mm:ss'
  fechaFin: string,
  tipo: TipoDescarga,
): Promise<SolicitudResult> {
  const nodeName = tipo === 'E' ? 'SolicitaDescargaEmitidos' : 'SolicitaDescargaRecibidos'

  // Atributos exactos — omitir RFC vacío igual que Python (None → no se incluye en el XML)
  // EstadoComprobante="Vigente" es necesario para TipoSolicitud=CFDI; si se omite
  // el SAT incluye canceladas y devuelve error "No se permite la descarga de xml cancelados"
  const solicitudAttrs: Record<string, string> = {
    EstadoComprobante: 'Vigente',
    FechaFinal:        fechaFin,
    FechaInicial:      fechaInicio,
    RfcSolicitante:    rfc,
    TipoSolicitud:     'CFDI',
  }
  if (tipo === 'E') solicitudAttrs['RfcEmisor']   = rfc
  if (tipo === 'R') solicitudAttrs['RfcReceptor'] = rfc

  // C14N del solicitud (sin firma) — mismo conjunto de atributos que irá en el SOAP
  const canonSolicitud = canonBodyElement('solicitud', solicitudAttrs)
  const firma = firmarSolicitud(certDer, llave, canonSolicitud)

  // Construir atributos en el SOAP en el mismo orden canónico (alfabético)
  const attrStr = Object.entries(solicitudAttrs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}="${escXml(v)}"`)
    .join(' ')

  const soap = soapEnvelope(
    `<des:${nodeName} xmlns:des="${NS_DES}">` +
    `<des:solicitud ${attrStr}>` +
    firma +
    `</des:solicitud>` +
    `</des:${nodeName}>`,
  )

  const soapAction = tipo === 'E'
    ? `http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescargaEmitidos`
    : `http://DescargaMasivaTerceros.sat.gob.mx/ISolicitaDescargaService/SolicitaDescargaRecibidos`
  const resp = await soapPost(
    'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/SolicitaDescargaService.svc',
    soap,
    soapAction,
    token,
  )

  const idSolicitud = xmlAttr(resp, 'IdSolicitud')
  const codEstatus  = xmlAttr(resp, 'CodEstatus')
  const mensaje     = xmlAttr(resp, 'Mensaje')

  return { idSolicitud, codEstatus, mensaje, ok: codEstatus === '5000' }
}

// ── 3. Verificar estado ──────────────────────────────────────────────────────
export async function verificar(
  token: string,
  certDer: Buffer,
  llave: crypto.KeyObject,
  rfc: string,
  idSolicitud: string,
): Promise<VerificaResult> {
  const canonSolicitud = canonBodyElement('solicitud', {
    IdSolicitud:    idSolicitud,
    RfcSolicitante: rfc,
  })
  const firma = firmarSolicitud(certDer, llave, canonSolicitud)

  const soap = soapEnvelope(
    `<des:VerificaSolicitudDescarga xmlns:des="${NS_DES}">` +
    `<des:solicitud IdSolicitud="${idSolicitud}" RfcSolicitante="${rfc}">` +
    firma +
    `</des:solicitud>` +
    `</des:VerificaSolicitudDescarga>`,
  )

  const resp = await soapPost(
    'https://cfdidescargamasivasolicitud.clouda.sat.gob.mx/VerificaSolicitudDescargaService.svc',
    soap,
    'http://DescargaMasivaTerceros.sat.gob.mx/IVerificaSolicitudDescargaService/VerificaSolicitudDescarga',
    token,
  )

  // Extraer lista de paquetes (elementos <string> dentro de IdsPaquetes)
  const paquetes: string[] = []
  const rePkg = /<(?:[\w]+:)?string[^>]*>([\s\S]*?)<\/(?:[\w]+:)?string>/g
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
    respRaw:     resp,
  }
}

// ── 4. Descargar paquete ─────────────────────────────────────────────────────
export async function descargarPaquete(
  token: string,
  certDer: Buffer,
  llave: crypto.KeyObject,
  rfc: string,
  idPaquete: string,
): Promise<Buffer> {
  const canonDescarga = canonBodyElement('peticionDescarga', {
    IdPaquete:      idPaquete,
    RfcSolicitante: rfc,
  })
  const firma = firmarSolicitud(certDer, llave, canonDescarga)

  const soap = soapEnvelope(
    `<des:PeticionDescargaMasivaTercerosEntrada xmlns:des="${NS_DES}">` +
    `<des:peticionDescarga IdPaquete="${idPaquete}" RfcSolicitante="${rfc}">` +
    firma +
    `</des:peticionDescarga>` +
    `</des:PeticionDescargaMasivaTercerosEntrada>`,
  )

  const resp = await soapPost(
    'https://cfdidescargamasiva.clouda.sat.gob.mx/DescargaMasivaService.svc',
    soap,
    'http://DescargaMasivaTerceros.sat.gob.mx/IDescargaMasivaTercerosService/Descargar',
    token,
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
