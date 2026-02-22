import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    try {
        const { searchParams } = new URL(request.url)
        const mesActual = new Date().getMonth() + 1
        const anioActual = new Date().getFullYear()
        const mes = Number(searchParams.get('mes') || mesActual)
        const anio = Number(searchParams.get('anio') || anioActual)

        // ========== CxC (Definiciones) ==========
        const facturas = await sql`SELECT * FROM facturas` as Record<string, unknown>[]
        const facturasRecurrentes = facturas.filter(f => f.recurrente === true)
        const facturasUnicas = facturas.filter(f => f.recurrente !== true)
        const totalMensualRecurrente = facturasRecurrentes.reduce((s, f) => s + Number(f.total || 0), 0)
        const totalUnico = facturasUnicas.reduce((s, f) => s + Number(f.total || 0), 0)

        // ========== Gastos (Definiciones) ==========
        const gastos = await sql`SELECT * FROM gastos` as Record<string, unknown>[]
        const gastosFijos = gastos.filter(g => g.recurrente === true)
        const gastosUnicos = gastos.filter(g => g.recurrente !== true)
        const sueldos = gastosFijos.filter(g => g.subtipo === 'sueldo')
        const gastosFijosGenerales = gastosFijos.filter(g => g.subtipo !== 'sueldo')
        const totalSueldosMensual = sueldos.reduce((s, g) => s + Number(g.monto || 0), 0)
        const totalGastosFijosMensual = gastosFijosGenerales.reduce((s, g) => s + Number(g.monto || 0), 0)
        const totalGastosUnicos = gastosUnicos.reduce((s, g) => s + Number(g.monto || 0), 0)

        // ========== Pagos Realizados (Mes seleccionado) ==========
        const pagosDelMes = await sql`
      SELECT p.*, f.numero_factura, f.concepto, f.recurrente,
        cl.nombre as cliente_nombre
      FROM pagos p LEFT JOIN facturas f ON p.factura_id = f.id
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM p.fecha_pago) = ${anio}
      ORDER BY p.fecha_pago DESC
    ` as Record<string, unknown>[]

        const ingresosMes = pagosDelMes.reduce((s, p) => s + Number(p.monto || 0), 0)

        // ========== Gastos Pagados (Mes seleccionado) ==========
        const gastosPagadosMes = await sql`
      SELECT g.*, cg.nombre as categoria_nombre, cg.color as categoria_color
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE g.estado = 'pagado'
        AND EXTRACT(MONTH FROM g.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM g.fecha_pago) = ${anio}
      ORDER BY g.fecha_pago DESC
    ` as Record<string, unknown>[]

        const egresosMes = gastosPagadosMes.reduce((s, g) => s + Number(g.monto || 0), 0)

        // ========== Histórico Mensual (últimos 6 meses) ==========
        const historico = await sql`
      SELECT
        EXTRACT(YEAR FROM p.fecha_pago) as anio,
        EXTRACT(MONTH FROM p.fecha_pago) as mes,
        SUM(p.monto) as total_ingresos
      FROM pagos p
      WHERE p.fecha_pago >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY 1, 2 ORDER BY 1, 2
    ` as Record<string, unknown>[]

        const historicoEgresos = await sql`
      SELECT
        EXTRACT(YEAR FROM g.fecha_pago) as anio,
        EXTRACT(MONTH FROM g.fecha_pago) as mes,
        SUM(g.monto) as total_egresos
      FROM gastos g
      WHERE g.estado = 'pagado' AND g.fecha_pago >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY 1, 2 ORDER BY 1, 2
    ` as Record<string, unknown>[]

        // Merge historico
        const mesesMap: Record<string, { anio: number; mes: number; ingresos: number; egresos: number }> = {}
        for (const h of historico) {
            const key = `${h.anio}-${h.mes}`
            mesesMap[key] = { anio: Number(h.anio), mes: Number(h.mes), ingresos: Number(h.total_ingresos), egresos: 0 }
        }
        for (const h of historicoEgresos) {
            const key = `${h.anio}-${h.mes}`
            if (!mesesMap[key]) mesesMap[key] = { anio: Number(h.anio), mes: Number(h.mes), ingresos: 0, egresos: 0 }
            mesesMap[key].egresos = Number(h.total_egresos)
        }
        const historicoMensual = Object.values(mesesMap).sort((a, b) => a.anio * 100 + a.mes - (b.anio * 100 + b.mes))

        // ========== Cobranza por cliente (12 meses) ==========
        const cobranzaClientes = await sql`
      SELECT cl.id, cl.nombre, COUNT(p.id) as pagos,
        SUM(p.monto) as total_cobrado,
        AVG(EXTRACT(DAY FROM (p.fecha_pago::timestamp - f.fecha_emision::timestamp))) as dias_promedio
      FROM pagos p LEFT JOIN facturas f ON p.factura_id = f.id
      LEFT JOIN clientes cl ON f.cliente_id = cl.id
      WHERE p.fecha_pago >= CURRENT_DATE - INTERVAL '12 months'
        AND cl.id IS NOT NULL
      GROUP BY cl.id, cl.nombre
      ORDER BY total_cobrado DESC
    ` as Record<string, unknown>[]

        // ========== Gastos por categoría (mes seleccionado) ==========
        const gastosPorCategoria = await sql`
      SELECT cg.nombre, cg.color, SUM(g.monto) as total, COUNT(g.id) as cantidad
      FROM gastos g LEFT JOIN categorias_gasto cg ON g.categoria_id = cg.id
      WHERE g.estado = 'pagado'
        AND EXTRACT(MONTH FROM g.fecha_pago) = ${mes}
        AND EXTRACT(YEAR FROM g.fecha_pago) = ${anio}
      GROUP BY cg.nombre, cg.color
      ORDER BY total DESC
    ` as Record<string, unknown>[]

        // ========== Clientes ==========
        const clientes = await sql`SELECT COUNT(*) as total FROM clientes` as Record<string, unknown>[]

        return NextResponse.json({
            resumen: {
                mes, anio,
                ingresos_mes: ingresosMes,
                egresos_mes: egresosMes,
                balance_mes: ingresosMes - egresosMes,
                total_clientes: Number(clientes[0]?.total || 0),
            },
            definiciones: {
                cxc_recurrentes: facturasRecurrentes.length,
                cxc_unicas: facturasUnicas.length,
                total_mensual_recurrente: totalMensualRecurrente,
                total_unico: totalUnico,
                gastos_fijos: gastosFijosGenerales.length,
                sueldos: sueldos.length,
                gastos_unicos: gastosUnicos.length,
                total_sueldos_mensual: totalSueldosMensual,
                total_gastos_fijos_mensual: totalGastosFijosMensual,
                total_gastos_unicos: totalGastosUnicos,
                carga_mensual: totalSueldosMensual + totalGastosFijosMensual,
            },
            movimientos_mes: {
                pagos: pagosDelMes.map(p => ({
                    numero: p.numero_factura, concepto: p.concepto, cliente: p.cliente_nombre,
                    monto: Number(p.monto), fecha: p.fecha_pago, metodo: p.metodo_pago, recurrente: p.recurrente,
                })),
                gastos: gastosPagadosMes.map(g => ({
                    concepto: g.concepto, monto: Number(g.monto), fecha: g.fecha_pago,
                    categoria: g.categoria_nombre, color: g.categoria_color, subtipo: g.subtipo,
                })),
            },
            historico_mensual: historicoMensual,
            cobranza_clientes: cobranzaClientes.map(c => ({
                id: c.id, nombre: c.nombre, pagos: Number(c.pagos),
                total_cobrado: Number(c.total_cobrado),
                dias_promedio: Math.round(Number(c.dias_promedio || 0)),
            })),
            gastos_por_categoria: gastosPorCategoria.map(g => ({
                nombre: g.nombre || 'Sin categoría', color: g.color || '#666',
                total: Number(g.total), cantidad: Number(g.cantidad),
            })),
        })
    } catch (error) {
        console.error('[ERP] Error:', error)
        return NextResponse.json({ error: 'Error al generar reportes' }, { status: 500 })
    }
}
