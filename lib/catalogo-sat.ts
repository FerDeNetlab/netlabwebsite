/**
 * Catálogo de Cuentas SAT — Nivel 3 (completo)
 * Basado en el Catálogo de Cuentas del SAT para CFDI 4.0
 * Referencia: Anexo 24 de la Resolución Miscelánea Fiscal
 */

export interface CuentaSAT {
  codigo: string       // Número de cuenta (ej. "601")
  nombre: string       // Nombre de la cuenta
  naturaleza: 'D' | 'A'  // D=Deudora, A=Acreedora
  nivel: 1 | 2 | 3    // Nivel jerárquico
  clase: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' // Clase principal
  tipo: 'activo' | 'pasivo' | 'capital' | 'ingreso' | 'costo' | 'gasto' | 'resultado'
}

export const CATALOGO_SAT: CuentaSAT[] = [
  // ─── CLASE 1: ACTIVO ───────────────────────────────────────────────────────
  { codigo: '1',    nombre: 'Activo',                          naturaleza: 'D', nivel: 1, clase: '1', tipo: 'activo' },
  { codigo: '100',  nombre: 'Activo circulante',               naturaleza: 'D', nivel: 2, clase: '1', tipo: 'activo' },
  { codigo: '101',  nombre: 'Caja',                            naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '102',  nombre: 'Bancos',                          naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '103',  nombre: 'Inversiones temporales',          naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '104',  nombre: 'Clientes',                        naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '105',  nombre: 'Documentos por cobrar',           naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '106',  nombre: 'Deudores diversos',               naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '107',  nombre: 'IVA acreditable',                 naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '108',  nombre: 'IVA acreditable por pagar',       naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '109',  nombre: 'Anticipo a proveedores',          naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '110',  nombre: 'Inventarios',                     naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '111',  nombre: 'Pagos anticipados',               naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '115',  nombre: 'Activo no circulante',            naturaleza: 'D', nivel: 2, clase: '1', tipo: 'activo' },
  { codigo: '116',  nombre: 'Terrenos',                        naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '117',  nombre: 'Edificios',                       naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '118',  nombre: 'Depreciación acumulada edificios',naturaleza: 'A', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '119',  nombre: 'Mobiliario y equipo',             naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '120',  nombre: 'Depreciación acumulada mob. y eq.',naturaleza: 'A', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '121',  nombre: 'Equipo de transporte',            naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '122',  nombre: 'Depreciación acumulada transp.',  naturaleza: 'A', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '123',  nombre: 'Equipo de cómputo',               naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '124',  nombre: 'Depreciación acumulada cómputo',  naturaleza: 'A', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '125',  nombre: 'Maquinaria y equipo',             naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '126',  nombre: 'Depreciación acumulada maquinaria',naturaleza: 'A', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '127',  nombre: 'Activos intangibles',             naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '128',  nombre: 'Amortización acumulada intangibles',naturaleza: 'A', nivel: 3, clase: '1', tipo: 'activo' },
  { codigo: '129',  nombre: 'Otros activos',                   naturaleza: 'D', nivel: 3, clase: '1', tipo: 'activo' },

  // ─── CLASE 2: PASIVO ───────────────────────────────────────────────────────
  { codigo: '2',    nombre: 'Pasivo',                          naturaleza: 'A', nivel: 1, clase: '2', tipo: 'pasivo' },
  { codigo: '200',  nombre: 'Pasivo circulante',               naturaleza: 'A', nivel: 2, clase: '2', tipo: 'pasivo' },
  { codigo: '201',  nombre: 'Proveedores',                     naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '202',  nombre: 'Documentos por pagar',            naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '203',  nombre: 'Acreedores diversos',             naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '204',  nombre: 'Anticipo de clientes',            naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '205',  nombre: 'IVA trasladado',                  naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '206',  nombre: 'ISR por pagar',                   naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '207',  nombre: 'IMSS por pagar',                  naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '208',  nombre: 'INFONAVIT por pagar',             naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '209',  nombre: 'Impuestos retenidos por pagar',   naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '210',  nombre: 'Sueldos por pagar',               naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '211',  nombre: 'PTU por pagar',                   naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '215',  nombre: 'Pasivo no circulante',            naturaleza: 'A', nivel: 2, clase: '2', tipo: 'pasivo' },
  { codigo: '216',  nombre: 'Préstamos bancarios L/P',         naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '217',  nombre: 'Obligaciones por arrendamiento',  naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },
  { codigo: '218',  nombre: 'Otros pasivos L/P',               naturaleza: 'A', nivel: 3, clase: '2', tipo: 'pasivo' },

  // ─── CLASE 3: CAPITAL ──────────────────────────────────────────────────────
  { codigo: '3',    nombre: 'Capital contable',                naturaleza: 'A', nivel: 1, clase: '3', tipo: 'capital' },
  { codigo: '300',  nombre: 'Capital social',                  naturaleza: 'A', nivel: 2, clase: '3', tipo: 'capital' },
  { codigo: '301',  nombre: 'Capital social fijo',             naturaleza: 'A', nivel: 3, clase: '3', tipo: 'capital' },
  { codigo: '302',  nombre: 'Capital social variable',         naturaleza: 'A', nivel: 3, clase: '3', tipo: 'capital' },
  { codigo: '303',  nombre: 'Reserva legal',                   naturaleza: 'A', nivel: 3, clase: '3', tipo: 'capital' },
  { codigo: '304',  nombre: 'Utilidades retenidas',            naturaleza: 'A', nivel: 3, clase: '3', tipo: 'capital' },
  { codigo: '305',  nombre: 'Pérdidas acumuladas',             naturaleza: 'D', nivel: 3, clase: '3', tipo: 'capital' },
  { codigo: '306',  nombre: 'Resultado del ejercicio',         naturaleza: 'A', nivel: 3, clase: '3', tipo: 'capital' },
  { codigo: '307',  nombre: 'Aportaciones para futuros aumentos',naturaleza: 'A', nivel: 3, clase: '3', tipo: 'capital' },

  // ─── CLASE 4: INGRESOS ─────────────────────────────────────────────────────
  { codigo: '4',    nombre: 'Ingresos',                        naturaleza: 'A', nivel: 1, clase: '4', tipo: 'ingreso' },
  { codigo: '400',  nombre: 'Ingresos por actividades ordinarias',naturaleza: 'A', nivel: 2, clase: '4', tipo: 'ingreso' },
  { codigo: '401',  nombre: 'Ventas de mercancía',             naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '402',  nombre: 'Prestación de servicios',         naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '403',  nombre: 'Ingresos por honorarios',         naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '404',  nombre: 'Ingresos por arrendamiento',      naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '405',  nombre: 'Ingresos por comisiones',         naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '406',  nombre: 'Ingresos por licencias y regalías',naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '407',  nombre: 'Ingresos por mantenimiento',      naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '408',  nombre: 'Ingresos por suscripciones',      naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '409',  nombre: 'Ingresos por contratos de servicio',naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '410',  nombre: 'Devoluciones sobre ventas',       naturaleza: 'D', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '411',  nombre: 'Descuentos sobre ventas',         naturaleza: 'D', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '415',  nombre: 'Otros ingresos',                  naturaleza: 'A', nivel: 2, clase: '4', tipo: 'ingreso' },
  { codigo: '416',  nombre: 'Intereses ganados',               naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '417',  nombre: 'Utilidad en venta de activos',    naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '418',  nombre: 'Ingresos por fluctuación cambiaria',naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },
  { codigo: '419',  nombre: 'Otros ingresos no ordinarios',    naturaleza: 'A', nivel: 3, clase: '4', tipo: 'ingreso' },

  // ─── CLASE 5: COSTO DE VENTAS ──────────────────────────────────────────────
  { codigo: '5',    nombre: 'Costo de ventas',                 naturaleza: 'D', nivel: 1, clase: '5', tipo: 'costo' },
  { codigo: '500',  nombre: 'Costo de ventas',                 naturaleza: 'D', nivel: 2, clase: '5', tipo: 'costo' },
  { codigo: '501',  nombre: 'Costo de mercancía vendida',      naturaleza: 'D', nivel: 3, clase: '5', tipo: 'costo' },
  { codigo: '502',  nombre: 'Costo de servicios prestados',    naturaleza: 'D', nivel: 3, clase: '5', tipo: 'costo' },
  { codigo: '503',  nombre: 'Materiales y suministros',        naturaleza: 'D', nivel: 3, clase: '5', tipo: 'costo' },
  { codigo: '504',  nombre: 'Costo de subcontratistas',        naturaleza: 'D', nivel: 3, clase: '5', tipo: 'costo' },
  { codigo: '505',  nombre: 'Devoluciones sobre compras',      naturaleza: 'A', nivel: 3, clase: '5', tipo: 'costo' },
  { codigo: '506',  nombre: 'Descuentos sobre compras',        naturaleza: 'A', nivel: 3, clase: '5', tipo: 'costo' },

  // ─── CLASE 6: GASTOS ───────────────────────────────────────────────────────
  { codigo: '6',    nombre: 'Gastos',                          naturaleza: 'D', nivel: 1, clase: '6', tipo: 'gasto' },
  // 60x — Gastos de operación
  { codigo: '600',  nombre: 'Gastos de operación',             naturaleza: 'D', nivel: 2, clase: '6', tipo: 'gasto' },
  { codigo: '601',  nombre: 'Sueldos y salarios',              naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '602',  nombre: 'Gratificaciones y aguinaldo',     naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '603',  nombre: 'IMSS cuota patronal',             naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '604',  nombre: 'INFONAVIT cuota patronal',        naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '605',  nombre: 'Vacaciones y prima vacacional',   naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '606',  nombre: 'Fondo de ahorro',                 naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '607',  nombre: 'Honorarios a personas físicas',   naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '608',  nombre: 'Arrendamiento de inmuebles',      naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '609',  nombre: 'Arrendamiento de equipo',         naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '610',  nombre: 'Servicios de agua',               naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '611',  nombre: 'Servicios de energía eléctrica',  naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '612',  nombre: 'Servicios de telecomunicaciones', naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '613',  nombre: 'Servicios de internet',           naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '614',  nombre: 'Papelería y útiles de oficina',   naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '615',  nombre: 'Combustibles y lubricantes',      naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '616',  nombre: 'Mantenimiento y conservación',    naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '617',  nombre: 'Seguros y fianzas',               naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '618',  nombre: 'Depreciación de activos',         naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '619',  nombre: 'Amortización de intangibles',     naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '620',  nombre: 'Capacitación y desarrollo',       naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '621',  nombre: 'Gastos de viaje y representación',naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '622',  nombre: 'Publicidad y mercadotecnia',      naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '623',  nombre: 'Comisiones a vendedores',         naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '624',  nombre: 'Fletes y transportes',            naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '625',  nombre: 'Cuotas y suscripciones',          naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '626',  nombre: 'Software y licencias',            naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '627',  nombre: 'Servicios en la nube (SaaS)',      naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '628',  nombre: 'Gastos de limpieza',              naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '629',  nombre: 'Donativos',                       naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  // 63x — Gastos financieros
  { codigo: '630',  nombre: 'Gastos financieros',              naturaleza: 'D', nivel: 2, clase: '6', tipo: 'gasto' },
  { codigo: '631',  nombre: 'Intereses pagados',               naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '632',  nombre: 'Comisiones bancarias',            naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '633',  nombre: 'Pérdida cambiaria',               naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '634',  nombre: 'Intereses por arrendamiento',     naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  // 64x — Impuestos y contribuciones
  { codigo: '640',  nombre: 'Impuestos y contribuciones',      naturaleza: 'D', nivel: 2, clase: '6', tipo: 'gasto' },
  { codigo: '641',  nombre: 'ISR del ejercicio',               naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '642',  nombre: 'ISR diferido',                    naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '643',  nombre: 'Impuesto sobre nóminas',          naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '644',  nombre: 'Derechos y permisos',             naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '645',  nombre: 'Predial',                         naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  // 65x — Otros gastos
  { codigo: '650',  nombre: 'Otros gastos',                    naturaleza: 'D', nivel: 2, clase: '6', tipo: 'gasto' },
  { codigo: '651',  nombre: 'Pérdida en venta de activos',     naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '652',  nombre: 'Cuentas incobrables',             naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '653',  nombre: 'Gastos no deducibles',            naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },
  { codigo: '654',  nombre: 'Multas y recargos',               naturaleza: 'D', nivel: 3, clase: '6', tipo: 'gasto' },

  // ─── CLASE 7: RESULTADOS ───────────────────────────────────────────────────
  { codigo: '7',    nombre: 'Cuentas de resultado',            naturaleza: 'A', nivel: 1, clase: '7', tipo: 'resultado' },
  { codigo: '700',  nombre: 'Resumen de resultados',           naturaleza: 'A', nivel: 2, clase: '7', tipo: 'resultado' },
  { codigo: '701',  nombre: 'Utilidad del ejercicio',          naturaleza: 'A', nivel: 3, clase: '7', tipo: 'resultado' },
  { codigo: '702',  nombre: 'Pérdida del ejercicio',           naturaleza: 'D', nivel: 3, clase: '7', tipo: 'resultado' },
  { codigo: '703',  nombre: 'CUFIN',                           naturaleza: 'A', nivel: 3, clase: '7', tipo: 'resultado' },
  { codigo: '704',  nombre: 'CUCA',                            naturaleza: 'A', nivel: 3, clase: '7', tipo: 'resultado' },

  // ─── CLASE 8: CUENTAS DE ORDEN ─────────────────────────────────────────────
  { codigo: '8',    nombre: 'Cuentas de orden',                naturaleza: 'D', nivel: 1, clase: '8', tipo: 'resultado' },
  { codigo: '801',  nombre: 'Activos en garantía',             naturaleza: 'D', nivel: 3, clase: '8', tipo: 'resultado' },
  { codigo: '802',  nombre: 'Pasivos contingentes',            naturaleza: 'A', nivel: 3, clase: '8', tipo: 'resultado' },
]

/** Solo cuentas de nivel 3 (las "hojas" del catálogo — para selects) */
export const CUENTAS_OPERATIVAS = CATALOGO_SAT.filter(c => c.nivel === 3)

/** Cuentas de ingreso (clase 4) para facturas/ingresos */
export const CUENTAS_INGRESO = CATALOGO_SAT.filter(c => c.clase === '4' && c.nivel === 3)

/** Cuentas de gasto (clase 6) para gastos */
export const CUENTAS_GASTO = CATALOGO_SAT.filter(c => c.clase === '6' && c.nivel === 3)

/** Cuentas de costo (clase 5) */
export const CUENTAS_COSTO = CATALOGO_SAT.filter(c => c.clase === '5' && c.nivel === 3)

/** Etiqueta legible: "601 - Sueldos y salarios" */
export function labelCuenta(codigo: string | null | undefined): string {
  if (!codigo) return '—'
  const c = CATALOGO_SAT.find(x => x.codigo === codigo)
  return c ? `${c.codigo} — ${c.nombre}` : codigo
}

/** Clase de la cuenta para colorear */
export function claseCuenta(codigo: string | null | undefined): string {
  if (!codigo) return ''
  const c = CATALOGO_SAT.find(x => x.codigo === codigo)
  return c?.tipo ?? ''
}
