/**
 * Helpers y Utilities para Anexo Financiero
 * Location: lib/finanzas-helpers.ts
 * 
 * Funciones para:
 * - Recuperar datos de la BD
 * - Calcular métricas financieras
 * - Generar alertas automáticas
 * - Mapear datos a estructura del Anexo
 */

import { sql } from './db';
import {
  MatrizIngresos,
  MatrizGastos,
  MatrizBolsas,
  FlujoCaja,
  PipelineComercial,
  ReservaOperativa,
  DecisionesJunta,
  Alertas,
  ConclusionFinanciera,
  AnexoFinanciero,
  BolsaPresupuestaria,
  TipoIngreso,
  SeveridadAlerta,
  TipoAlerta,
  EtapaOportunidad,
  MatrizIngresosRow,
  Factura,
  Gasto,
  Cliente,
  Oportunidad,
  BolsaPresupuestariaRecord,
  DecisionJunta,
  AlertaFinanciera,
  AporteCapital,
  CalculosClave,
} from './types/anexo';

// =====================================================
// 1. MATRIZ DE INGRESOS
// =====================================================

export async function getMatrizIngresos(mes: number, ano: number): Promise<MatrizIngresos> {
  try {
    // Obtener facturas del mes (esperadas) + pagos reales del mes (cobrados)
    // Usamos fecha_vencimiento (o dia_mes para recurrentes) para asignar al período,
    // NO fecha_emision — alinea ingresos con cuándo deberían cobrarse.
    const facturasResult = await sql`
      SELECT f.*,
        c.nombre as cliente_nombre,
        COALESCE((SELECT SUM(p.monto) FROM pagos p
                   WHERE p.factura_id = f.id
                     AND EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
                     AND EXTRACT(YEAR FROM p.fecha_pago) = ${ano}), 0) as cobrado_periodo
      FROM facturas f
      LEFT JOIN clientes c ON f.cliente_id = c.id
      WHERE f.estado != 'cancelada'
        AND (
          (f.recurrente = true AND f.dia_mes IS NOT NULL)
          OR (f.recurrente = false AND EXTRACT(MONTH FROM COALESCE(f.fecha_vencimiento, f.fecha_emision)) = ${mes}
              AND EXTRACT(YEAR FROM COALESCE(f.fecha_vencimiento, f.fecha_emision)) = ${ano})
          OR EXISTS (
            SELECT 1 FROM pagos p WHERE p.factura_id = f.id
              AND EXTRACT(MONTH FROM p.fecha_pago) = ${mes}
              AND EXTRACT(YEAR FROM p.fecha_pago) = ${ano}
          )
        )
    `;
    const facturas = facturasResult as Array<Factura & { cliente_nombre?: string; cobrado_periodo?: number }>;

    // Agrupar por cliente y tipo de ingreso
    const mapClientes: Record<string, Record<TipoIngreso, Partial<MatrizIngresosRow> & { cobrado?: number }>> = {};

    facturas.forEach((f) => {
      const clienteId = f.cliente_id || 'sin-cliente';
      const clienteNombre = f.cliente_nombre || 'Sin Cliente';
      const tipoIngreso = (f.tipo_ingreso as TipoIngreso) || TipoIngreso.VARIABLE;
      const cobrado = Number(f.cobrado_periodo || 0);

      if (!mapClientes[clienteId]) {
        mapClientes[clienteId] = {
          [TipoIngreso.FIJO]: {},
          [TipoIngreso.RUN_RATE]: {},
          [TipoIngreso.VARIABLE]: {},
        };
      }

      if (!mapClientes[clienteId][tipoIngreso]) {
        mapClientes[clienteId][tipoIngreso] = {};
      }

      const row = mapClientes[clienteId][tipoIngreso];
      row.cliente_id = clienteId;
      row.cliente_nombre = clienteNombre;
      row.tipo_ingreso = tipoIngreso;
      row.monto_mensual = (row.monto_mensual || 0) + Number(f.total);
      row.cobrado = (row.cobrado || 0) + cobrado;
    });

    // Convertir a filas
    const filas: MatrizIngresosRow[] = [];
    Object.entries(mapClientes).forEach(([_, tiposMap]) => {
      Object.values(tiposMap).forEach((row) => {
        if (row.monto_mensual && row.monto_mensual > 0) {
          const cobrado = row.cobrado || 0;
          const esperado = row.monto_mensual || 0;
          filas.push({
            cliente_id: row.cliente_id || '',
            cliente_nombre: row.cliente_nombre || '',
            tipo_ingreso: row.tipo_ingreso || TipoIngreso.VARIABLE,
            monto_mensual: esperado,
            estatus: cobrado >= esperado ? 'cobrado' : cobrado > 0 ? 'parcial' : 'pendiente',
          });
        }
      });
    });

    // Calcular totales (esperado vs cobrado)
    const totalEsperado = filas.reduce((sum, f) => sum + f.monto_mensual, 0);
    const totalCobrado = Object.values(mapClientes).reduce((acc, tipos) => {
      return acc + Object.values(tipos).reduce((s, r) => s + (r.cobrado || 0), 0);
    }, 0);

    const ingresosPorTipo: Record<TipoIngreso, number> = {
      [TipoIngreso.FIJO]: 0,
      [TipoIngreso.RUN_RATE]: 0,
      [TipoIngreso.VARIABLE]: 0,
    };

    filas.forEach((f) => {
      ingresosPorTipo[f.tipo_ingreso] += f.monto_mensual;
    });

    const ingresoFijoYRunRate = ingresosPorTipo[TipoIngreso.FIJO] + ingresosPorTipo[TipoIngreso.RUN_RATE];

    return {
      filas,
      resumenPorTipo: {
        [TipoIngreso.FIJO]: {
          monto_mensual: ingresosPorTipo[TipoIngreso.FIJO],
          porcentaje_total: totalEsperado > 0 ? (ingresosPorTipo[TipoIngreso.FIJO] / totalEsperado) * 100 : 0,
          certidumbre: 'Alta',
        },
        [TipoIngreso.RUN_RATE]: {
          monto_mensual: ingresosPorTipo[TipoIngreso.RUN_RATE],
          porcentaje_total: totalEsperado > 0 ? (ingresosPorTipo[TipoIngreso.RUN_RATE] / totalEsperado) * 100 : 0,
          certidumbre: 'Media',
        },
        [TipoIngreso.VARIABLE]: {
          monto_mensual: ingresosPorTipo[TipoIngreso.VARIABLE],
          porcentaje_total: totalEsperado > 0 ? (ingresosPorTipo[TipoIngreso.VARIABLE] / totalEsperado) * 100 : 0,
          certidumbre: 'Baja',
        },
      },
      totales: {
        ingreso_mensual_real: totalEsperado,
        ingreso_mensual_cobrado: totalCobrado,
        ingreso_fijo_estructural: ingresoFijoYRunRate,
        dependencia_variable_porcentaje:
          totalEsperado > 0 ? (ingresosPorTipo[TipoIngreso.VARIABLE] / totalEsperado) * 100 : 0,
        porcentaje_cobrado: totalEsperado > 0 ? (totalCobrado / totalEsperado) * 100 : 0,
      },
    };
  } catch (error) {
    console.error('Error en getMatrizIngresos:', error);
    throw error;
  }
}

// =====================================================
// 2. MATRIZ DE GASTOS
// =====================================================

export async function getMatrizGastos(mes: number, ano: number): Promise<MatrizGastos> {
  try {
    const gastosResult = await sql`
      SELECT g.*
      FROM gastos g
      WHERE EXTRACT(MONTH FROM COALESCE(g.fecha_pago, g.fecha_vencimiento, CURRENT_DATE)) = ${mes}
        AND EXTRACT(YEAR FROM COALESCE(g.fecha_pago, g.fecha_vencimiento, CURRENT_DATE)) = ${ano}
    `;
    const gastos = gastosResult as Gasto[];

    const costos_fijos = gastos
      .filter((g) => !g.recurrente || g.subtipo === 'sueldo')
      .map((g) => ({
        concepto: g.concepto,
        monto_mensual: g.monto,
        responsable: undefined,
        observaciones: undefined,
      }));

    const total_fijos = costos_fijos.reduce((sum, g) => sum + g.monto_mensual, 0);
    const total_variables = gastos
      .filter((g) => g.recurrente && g.subtipo !== 'sueldo')
      .reduce((sum, g) => sum + g.monto, 0);

    return {
      costos_fijos,
      costos_variables: [],
      totales: {
        total_fijos,
        total_variables_estimados: total_variables,
        total_egresos: total_fijos + total_variables,
      },
    };
  } catch (error) {
    console.error('Error en getMatrizGastos:', error);
    throw error;
  }
}

// =====================================================
// 3. MATRIZ DE BOLSAS PRESUPUESTARIAS
// =====================================================

export async function getMatrizBolsas(mes: number, ano: number): Promise<MatrizBolsas> {
  try {
    const bolsasResult = await sql`
      SELECT * FROM bolsas_presupuestarias
      WHERE mes = ${mes} AND ano = ${ano}
    `;
    const bolsas = bolsasResult as BolsaPresupuestariaRecord[];

    // Si no hay bolsas, crear defaults sugeridos
    let bolsasData = bolsas;
    if (bolsas.length === 0) {
      // Calcular defaults desde ingresos/gastos del mes
      const matrizIngresos = await getMatrizIngresos(mes, ano);
      const matrizGastos = await getMatrizGastos(mes, ano);

      const totalIngresos = matrizIngresos.totales.ingreso_mensual_real;
      const totalGastos = matrizGastos.totales.total_egresos;

      bolsasData = [
        {
          id: 'default-1',
          mes,
          ano,
          bolsa_nombre: BolsaPresupuestaria.OPERACION_FIJA,
          presupuesto_mensual: matrizGastos.totales.total_fijos,
          porcentaje_asignado: totalIngresos > 0 ? (matrizGastos.totales.total_fijos / totalIngresos) * 100 : 0,
          uso_descripcion: 'Nómina, estructura fija',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'default-2',
          mes,
          ano,
          bolsa_nombre: BolsaPresupuestaria.OPERACION_VARIABLE,
          presupuesto_mensual: totalIngresos * 0.2,
          porcentaje_asignado: 20,
          uso_descripcion: 'Comisiones, proyectos variables',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'default-3',
          mes,
          ano,
          bolsa_nombre: BolsaPresupuestaria.RESERVA,
          presupuesto_mensual: (totalIngresos - totalGastos) * 0.5,
          porcentaje_asignado: 50,
          uso_descripcion: 'Caja de seguridad (3 meses)',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'default-4',
          mes,
          ano,
          bolsa_nombre: BolsaPresupuestaria.CRECIMIENTO,
          presupuesto_mensual: (totalIngresos - totalGastos) * 0.3,
          porcentaje_asignado: 30,
          uso_descripcion: 'Inversi\u00f3n en herramientas/personal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'default-5',
          mes,
          ano,
          bolsa_nombre: BolsaPresupuestaria.UTILIDAD,
          presupuesto_mensual: Math.max(0, totalIngresos - totalGastos - ((totalIngresos - totalGastos) * 0.8)),
          porcentaje_asignado: 20,
          uso_descripcion: 'Distribuci\u00f3n a socios',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    // Calcular cobertura
    const matrizGastos = await getMatrizGastos(mes, ano);
    const matrizIngresos = await getMatrizIngresos(mes, ano);

    const gastosFijos = matrizGastos.totales.total_fijos;
    const ingresoFijo = matrizIngresos.totales.ingreso_fijo_estructural;

    return {
      bolsas: bolsasData.map((b) => ({
        bolsa: b.bolsa_nombre,
        fuente_ingreso: 'ingresos mensuales',
        presupuesto_mensual: b.presupuesto_mensual,
        porcentaje_asignado: b.porcentaje_asignado || 0,
        uso: b.uso_descripcion || '',
      })),
      validacion_cobertura: {
        gastos_fijos: gastosFijos,
        ingreso_fijo: ingresoFijo,
        porcentaje_cobertura_fija_pura: gastosFijos > 0 ? (ingresoFijo / gastosFijos) * 100 : 0,
        porcentaje_cobertura_ampliada:
          gastosFijos > 0 ? (matrizIngresos.totales.ingreso_mensual_real / gastosFijos) * 100 : 0,
      },
    };
  } catch (error) {
    console.error('Error en getMatrizBolsas:', error);
    throw error;
  }
}

// =====================================================
// 4. FLUJO DE CAJA
// =====================================================

export async function getFlujoCaja(mes: number, ano: number): Promise<FlujoCaja> {
  try {
    // Calculamos caja neta desde tablas existentes (facturas y gastos)
    const [matrizIngresos, matrizGastos] = await Promise.all([
      getMatrizIngresos(mes, ano),
      getMatrizGastos(mes, ano),
    ]);

    const saldoNeto =
      matrizIngresos.totales.ingreso_mensual_cobrado - matrizGastos.totales.total_egresos;

    // Cuentas por cobrar: facturas pendientes del periodo
    const cxcRaw = await sql`
      SELECT COALESCE(SUM(total), 0) AS cuentas_por_cobrar
      FROM facturas
      WHERE EXTRACT(MONTH FROM fecha_emision) = ${mes}
        AND EXTRACT(YEAR FROM fecha_emision) = ${ano}
        AND estado IN ('pendiente', 'vencida', 'parcial')
    `;
    const cxc = (cxcRaw as Array<{ cuentas_por_cobrar: number }>)[0]?.cuentas_por_cobrar || 0;

    // Cuentas por pagar: gastos pendientes del periodo
    const cxpRaw = await sql`
      SELECT COALESCE(SUM(monto), 0) AS cuentas_por_pagar
      FROM gastos
      WHERE EXTRACT(MONTH FROM COALESCE(fecha_pago, fecha_vencimiento, CURRENT_DATE)) = ${mes}
        AND EXTRACT(YEAR FROM COALESCE(fecha_pago, fecha_vencimiento, CURRENT_DATE)) = ${ano}
        AND estado = 'pendiente'
    `;
    const cxp = (cxpRaw as Array<{ cuentas_por_pagar: number }>)[0]?.cuentas_por_pagar || 0;

    // Proyección simple: distribución semanal del neto del periodo
    const semanal = saldoNeto / 4;
    const flujo_proyectado = Array.from({ length: 4 }, (_, i) => ({
      semana: i + 1,
      ingresos_esperados: matrizIngresos.totales.ingreso_mensual_real / 4,
      ingresos_comprometidos: cxc / 4,
      egresos: matrizGastos.totales.total_egresos / 4,
      balance: semanal * (i + 1),
    }));

    return {
      caja_actual: {
        saldo_en_banco: saldoNeto,
        cuentas_por_cobrar: cxc,
        cuentas_por_pagar: cxp,
      },
      flujo_proyectado_4_semanas: flujo_proyectado,
      lecturas_clave: {
        margen_maniobra_semanas:
          matrizGastos.totales.total_egresos > 0
            ? Math.max(0, (saldoNeto / matrizGastos.totales.total_egresos) * 4)
            : 0,
      },
    };
  } catch (error) {
    console.error('Error en getFlujoCaja:', error);
    throw error;
  }
}

// =====================================================
// 5. PIPELINE COMERCIAL (desde CRM)
// =====================================================

export async function getPipelineComercial(): Promise<PipelineComercial> {
  try {
    // Obtener oportunidades en etapas propuesta y negociación
    const oportunidadesResult = await sql`
      SELECT o.*, c.nombre as cliente_nombre
      FROM oportunidades o
      LEFT JOIN clientes c ON o.cliente_id = c.id
      WHERE o.etapa IN (${EtapaOportunidad.PROPUESTA}, ${EtapaOportunidad.NEGOCIACION})
        AND o.valor > 0
    `;
    const oportunidades = oportunidadesResult as Oportunidad[];

    const proyectos = oportunidades.map((o) => ({
      cliente: o.cliente_id || 'Sin cliente',
      monto: o.valor,
      tipo_ingreso: o.tipo_ingreso as TipoIngreso,
      probabilidad: o.probabilidad,
      fecha_estimada: o.fecha_cierre_estimada || new Date().toISOString(),
      impacto_mensual: (o.valor * o.probabilidad) / 100,
    }));

    const impactoTotal = proyectos.reduce((sum, p) => sum + p.impacto_mensual, 0);

    return {
      proyectos,
      impacto_potencial: {
        ingreso_adicional_posible: impactoTotal,
        impacto_en_cobertura_fija: impactoTotal,
      },
    };
  } catch (error) {
    console.error('Error en getPipelineComercial:', error);
    throw error;
  }
}

// =====================================================
// 6. RESERVA OPERATIVA
// =====================================================

export async function getReservaOperativa(mes: number, ano: number): Promise<ReservaOperativa> {
  try {
    const matrizGastos = await getMatrizGastos(mes, ano);
    const gastosMensuales = matrizGastos.totales.total_fijos;

    // Simular caja disponible (últimos 3 meses de gastos)
    const cajaDisponible = gastosMensuales * 3;
    const mesescubiertos = gastosMensuales > 0 ? cajaDisponible / gastosMensuales : 0;

    return {
      gastos_fijos_mensuales: gastosMensuales,
      caja_disponible: cajaDisponible,
      meses_cubiertos: mesescubiertos,
    };
  } catch (error) {
    console.error('Error en getReservaOperativa:', error);
    throw error;
  }
}

// =====================================================
// 7. DECISIONES DE JUNTA
// =====================================================

export async function getDecisionesJunta(mes: number, ano: number): Promise<DecisionesJunta> {
  try {
    const decisionesResult = await sql`
      SELECT * FROM decisiones_junta
      WHERE mes = ${mes} AND ano = ${ano}
    `;
    const decisiones = decisionesResult as DecisionJunta[];

    const obligatorias = [
      { id: '1', pregunta: '¿Se puede cubrir operación fija con ingresos actuales?', completado: false },
      { id: '2', pregunta: '¿Se necesita ajuste de gastos?', completado: false },
      { id: '3', pregunta: '¿Se puede contratar?', completado: false },
      { id: '4', pregunta: '¿Se debe priorizar cobranza?', completado: false },
      { id: '5', pregunta: '¿Se congela crecimiento?', completado: false },
    ].map((q) => {
      const dec = decisiones.find((d) => d.pregunta === q.pregunta);
      return {
        ...q,
        completado: dec?.completado || false,
        respuesta: dec?.respuesta,
        detalles: dec?.decision_detalle,
      };
    });

    return {
      obligatorias,
      acuerdos: decisiones
        .filter((d) => d.completado)
        .map((d) => ({
          decision: d.decision_detalle || '',
          responsable: d.responsable_decision,
          fecha: d.updated_at,
        })),
    };
  } catch (error) {
    console.error('Error en getDecisionesJunta:', error);
    throw error;
  }
}

// =====================================================
// 8. ALERTAS FINANCIERAS
// =====================================================

export async function getAlertasFinancieras(mes: number, ano: number): Promise<Alertas> {
  try {
    const alertasResult = await sql`
      SELECT * FROM alertas_financieras
      WHERE mes = ${mes} AND ano = ${ano}
    `;
    const alertas = alertasResult as AlertaFinanciera[];

    // Detectar alertas automáticas
    const calculadas = await calcularAlertasAutomaticas(mes, ano);

    const alertasFinales = [
      ...alertas.map((a) => ({
        tipo: a.tipo_alerta,
        valor: a.valor_actual?.toString() || '',
        severidad: a.severidad,
        descripcion: a.notas,
      })),
      ...calculadas,
    ];

    return { alertas: alertasFinales };
  } catch (error) {
    console.error('Error en getAlertasFinancieras:', error);
    throw error;
  }
}

async function calcularAlertasAutomaticas(mes: number, ano: number) {
  const alertas = [];

  try {
    // 1. Riesgo de caja
    const flujo = await getFlujoCaja(mes, ano);
    if (flujo.caja_actual.saldo_en_banco < 50000) {
      alertas.push({
        tipo: TipoAlerta.RIESGO_CAJA,
        valor: `$${flujo.caja_actual.saldo_en_banco}`,
        severidad: SeveridadAlerta.CRITICAL,
        descripcion: 'Saldo en banco por debajo de umbral crítico',
      });
    }

    // 2. Dependencia variable
    const ingresos = await getMatrizIngresos(mes, ano);
    if (ingresos.totales.dependencia_variable_porcentaje > 40) {
      alertas.push({
        tipo: TipoAlerta.DEPENDENCIA_VARIABLE,
        valor: `${ingresos.totales.dependencia_variable_porcentaje.toFixed(1)}%`,
        severidad: SeveridadAlerta.WARNING,
        descripcion: 'Ingresos muy dependientes de variable (>40%)',
      });
    }

    // 3. Cliente crítico (>30% de ingresos)
    const filas = ingresos.filas;
    const totalIngresos = ingresos.totales.ingreso_mensual_real;
    filas.forEach((f) => {
      if ((f.monto_mensual / totalIngresos) * 100 > 30) {
        alertas.push({
          tipo: TipoAlerta.CLIENTE_CRITICO,
          valor: f.cliente_nombre,
          severidad: SeveridadAlerta.WARNING,
          descripcion: `Cliente representa ${((f.monto_mensual / totalIngresos) * 100).toFixed(1)}% de ingresos`,
        });
      }
    });
  } catch (error) {
    console.error('Error calculando alertas automáticas:', error);
  }

  return alertas;
}

// =====================================================
// 9. CONCLUSIÓN FINANCIERA
// =====================================================

export async function getConclusion(): Promise<ConclusionFinanciera> {
  return {
    resumen_ejecutivo:
      'Resumen ejecutivo de la situación financiera. Esta sección debe completarse manualmente cada mes.',
  };
}

// =====================================================
// ANEXO FINANCIERO COMPLETO
// =====================================================

export async function generarAnexoFinanciero(mes: number, ano: number): Promise<AnexoFinanciero> {
  try {
    console.log(`🔄 Generando Anexo Financiero para ${mes}/${ano}...`);

    const [ingresos, gastos, bolsas, flujo, pipeline, reserva, decisiones, alertas, conclusion] =
      await Promise.all([
        getMatrizIngresos(mes, ano),
        getMatrizGastos(mes, ano),
        getMatrizBolsas(mes, ano),
        getFlujoCaja(mes, ano),
        getPipelineComercial(),
        getReservaOperativa(mes, ano),
        getDecisionesJunta(mes, ano),
        getAlertasFinancieras(mes, ano),
        getConclusion(),
      ]);

    const anexo: AnexoFinanciero = {
      mes,
      ano,
      fecha_generacion: new Date().toISOString(),
      matriz_ingresos: ingresos,
      matriz_gastos: gastos,
      matriz_bolsas: bolsas,
      flujo_caja: flujo,
      pipeline_comercial: pipeline,
      reserva_operativa: reserva,
      decisiones_junta: decisiones,
      alertas,
      conclusion,
    };

    console.log(`✅ Anexo generado exitosamente`);
    return anexo;
  } catch (error) {
    console.error('Error generando Anexo Financiero:', error);
    throw error;
  }
}

// =====================================================
// Helpers para cálculos clave
// =====================================================

export async function calcularCalculosClave(mes: number, ano: number): Promise<CalculosClave> {
  try {
    const ingresos = await getMatrizIngresos(mes, ano);
    const gastos = await getMatrizGastos(mes, ano);
    const flujo = await getFlujoCaja(mes, ano);

    const gastosFijos = gastos.totales.total_fijos;
    const totalIngresos = ingresos.totales.ingreso_mensual_real;
    const cobertura = gastosFijos > 0 ? (ingresos.totales.ingreso_fijo_estructural / gastosFijos) * 100 : 0;

    // Cliente más crítico
    const clienteMasCritico = ingresos.filas.reduce(
      (max, f) => (f.monto_mensual > max.monto_mensual ? f : max),
      ingresos.filas[0] || { cliente_nombre: 'N/A', monto_mensual: 0 }
    );

    return {
      cobertura_gastos_fijos_porcentaje: cobertura,
      dependencia_variable_porcentaje: ingresos.totales.dependencia_variable_porcentaje,
      cliente_mas_critico: {
        nombre: clienteMasCritico.cliente_nombre,
        porcentaje_ingresos: totalIngresos > 0 ? (clienteMasCritico.monto_mensual / totalIngresos) * 100 : 0,
      },
      gasto_mas_critico: {
        nombre: 'N/A',
        porcentaje_total: 0,
      },
      riesgo_caja_dias: 14,
    };
  } catch (error) {
    console.error('Error en calcularCalculosClave:', error);
    throw error;
  }
}
