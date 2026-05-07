/**
 * SAF — Bolsas presupuestarias
 *
 * Las 4 bolsas operativas del sistema. Asignación 100% automática (Opción A).
 *
 * Mapeo:
 *   tipo_ingreso=fijo      → operacion_base
 *   tipo_ingreso=run_rate  → operacion_variable
 *   tipo_ingreso=variable  → crecimiento
 *
 *   tipo_gasto=estructural → operacion_base
 *   tipo_gasto=variable    → operacion_variable
 *   tipo_gasto=estrategico → crecimiento
 *
 *   reserva: solo se alimenta de transferencias manuales (utilidad sobrante)
 */

export type BolsaSaf = 'operacion_base' | 'operacion_variable' | 'crecimiento' | 'reserva'

export const BOLSAS_SAF: BolsaSaf[] = [
    'operacion_base',
    'operacion_variable',
    'crecimiento',
    'reserva',
]

export const BOLSA_LABEL: Record<BolsaSaf, string> = {
    operacion_base: 'Operación Base',
    operacion_variable: 'Operación Variable',
    crecimiento: 'Crecimiento',
    reserva: 'Reserva',
}

export const BOLSA_DESCRIPCION: Record<BolsaSaf, string> = {
    operacion_base: 'Gastos fijos esenciales: nómina, renta, software, servicios.',
    operacion_variable: 'Gastos del día a día: comisiones, gasolina, suministros.',
    crecimiento: 'Inversión: marketing, equipo nuevo, contrataciones, herramientas.',
    reserva: 'Colchón financiero. Solo se toca en emergencias o por decisión de junta.',
}

export const BOLSA_COLOR: Record<BolsaSaf, string> = {
    operacion_base: '#22c55e', // verde
    operacion_variable: '#06b6d4', // cyan
    crecimiento: '#a855f7', // purple
    reserva: '#facc15', // amarillo
}

export function bolsaDeIngreso(tipo_ingreso: string | null | undefined): BolsaSaf {
    switch (tipo_ingreso) {
        case 'fijo':
            return 'operacion_base'
        case 'run_rate':
            return 'operacion_variable'
        default:
            return 'crecimiento'
    }
}

export function bolsaDeGasto(tipo_gasto: string | null | undefined): BolsaSaf {
    switch (tipo_gasto) {
        case 'estructural':
            return 'operacion_base'
        case 'estrategico':
            return 'crecimiento'
        default:
            return 'operacion_variable'
    }
}
