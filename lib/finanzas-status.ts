/**
 * SAF — utilidades de estado y vencimientos
 *
 * Centraliza el cálculo de:
 *   - estado real de una factura/gasto (incluye "vencido" automático)
 *   - días de atraso
 *   - próximo vencimiento
 *
 * No persiste — son campos virtuales que se computan al leer.
 */

export type EstadoFactura = 'pendiente' | 'pagada' | 'parcial' | 'vencida' | 'cancelada'
export type EstadoGasto = 'pendiente' | 'pagado' | 'vencido' | 'cancelado'

export interface FacturaParaEstado {
    estado?: string | null
    fecha_vencimiento?: string | Date | null
    recurrente?: boolean | null
    dia_mes?: number | null
    total?: number | string | null
    total_pagado?: number | string | null
}

export interface GastoParaEstado {
    estado?: string | null
    fecha_vencimiento?: string | Date | null
    recurrente?: boolean | null
    dia_mes?: number | null
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function startOfToday(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

/**
 * Devuelve la fecha efectiva de vencimiento para alertas:
 *   - facturas/gastos únicos: fecha_vencimiento
 *   - recurrentes: día del mes actual (clamp a fin de mes)
 */
export function getFechaVencimientoEfectiva(
    item: { fecha_vencimiento?: string | Date | null; recurrente?: boolean | null; dia_mes?: number | null }
): Date | null {
    if (item.recurrente && item.dia_mes) {
        const hoy = new Date()
        const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate()
        const dia = Math.min(item.dia_mes, ultimoDia)
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), dia)
        fecha.setHours(0, 0, 0, 0)
        return fecha
    }
    if (item.fecha_vencimiento) {
        const fecha = new Date(item.fecha_vencimiento)
        if (isNaN(fecha.getTime())) return null
        fecha.setHours(0, 0, 0, 0)
        return fecha
    }
    return null
}

/**
 * Días entre hoy y fecha de vencimiento.
 *   > 0  → días de atraso (ya venció)
 *   < 0  → días que faltan
 *   null → no aplica
 */
export function getDiasAtraso(
    item: { fecha_vencimiento?: string | Date | null; recurrente?: boolean | null; dia_mes?: number | null }
): number | null {
    const venc = getFechaVencimientoEfectiva(item)
    if (!venc) return null
    const hoy = startOfToday()
    return Math.round((hoy.getTime() - venc.getTime()) / MS_PER_DAY)
}

/**
 * Calcula el estado real de una factura.
 * Si está marcada 'pagada' o 'cancelada', se respeta.
 * Si tiene total_pagado >= total → 'pagada'
 * Si tiene 0 < pagado < total y vencida → 'vencida' (con saldo)
 * Si pendiente y vencida → 'vencida'
 * Si parcial → 'parcial'
 * Default: 'pendiente'
 */
export function calcularEstadoFactura(f: FacturaParaEstado): EstadoFactura {
    const estadoBase = (f.estado as EstadoFactura) || 'pendiente'
    if (estadoBase === 'cancelada') return 'cancelada'
    if (estadoBase === 'pagada') return 'pagada'

    const total = Number(f.total || 0)
    const pagado = Number(f.total_pagado || 0)

    if (total > 0 && pagado >= total) return 'pagada'

    const dias = getDiasAtraso(f)
    if (dias !== null && dias > 0) return 'vencida'

    if (pagado > 0 && pagado < total) return 'parcial'
    return 'pendiente'
}

/**
 * Estado real de un gasto. Incluye 'vencido' automático.
 */
export function calcularEstadoGasto(g: GastoParaEstado): EstadoGasto {
    const estadoBase = (g.estado as EstadoGasto) || 'pendiente'
    if (estadoBase === 'pagado' || estadoBase === 'cancelado') return estadoBase

    const dias = getDiasAtraso(g)
    if (dias !== null && dias > 0) return 'vencido'
    return 'pendiente'
}

/**
 * Enriquece un objeto factura con campos virtuales:
 *   estado_calculado, dias_atraso, fecha_vencimiento_efectiva
 */
export function enriquecerFactura<T extends FacturaParaEstado>(f: T) {
    const fecha_vencimiento_efectiva = getFechaVencimientoEfectiva(f)
    return {
        ...f,
        estado_calculado: calcularEstadoFactura(f),
        dias_atraso: getDiasAtraso(f),
        fecha_vencimiento_efectiva: fecha_vencimiento_efectiva
            ? fecha_vencimiento_efectiva.toISOString().split('T')[0]
            : null,
    }
}

export function enriquecerGasto<T extends GastoParaEstado>(g: T) {
    const fecha_vencimiento_efectiva = getFechaVencimientoEfectiva(g)
    return {
        ...g,
        estado_calculado: calcularEstadoGasto(g),
        dias_atraso: getDiasAtraso(g),
        fecha_vencimiento_efectiva: fecha_vencimiento_efectiva
            ? fecha_vencimiento_efectiva.toISOString().split('T')[0]
            : null,
    }
}
