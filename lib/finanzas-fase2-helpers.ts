/**
 * Funciones de Fase 2: Historización, Export y Comparativas
 * Se agregan al final de lib/finanzas-helpers.ts
 */

import { sql } from './db';
import { AnexoFinanciero } from './types/anexo';
import { generarAnexoFinanciero } from './finanzas-helpers';

// =====================================================
// HISTORIZACIÓN: Guardar snapshots mensuales
// =====================================================

export async function guardarAnexoEnHistorial(
  anexo: AnexoFinanciero,
  generado_por?: string,
  notas?: string
): Promise<void> {
  try {
    const gastosFijos = anexo.matriz_gastos.totales.total_fijos;
    const ingresoFijo = anexo.matriz_bolsas.validacion_cobertura.ingreso_fijo;
    const cobertura =
      gastosFijos > 0 ? (ingresoFijo / gastosFijos) * 100 : 0;

    await sql`
      INSERT INTO anexos_historicos 
        (mes, ano, anexo_completo, ingreso_total, egreso_total, balance, 
         cobertura_gastos_fijos_pct, dependencia_variable_pct, generado_por, notas_generacion)
      VALUES (
        ${anexo.mes},
        ${anexo.ano},
        ${JSON.stringify(anexo)}::jsonb,
        ${anexo.matriz_ingresos.totales.ingreso_mensual_real},
        ${anexo.matriz_gastos.totales.total_egresos},
        ${anexo.matriz_ingresos.totales.ingreso_mensual_real - anexo.matriz_gastos.totales.total_egresos},
        ${cobertura},
        ${anexo.matriz_ingresos.totales.dependencia_variable_porcentaje},
        ${generado_por ?? null},
        ${notas ?? null}
      )
      ON CONFLICT (mes, ano) 
      DO UPDATE SET 
        anexo_completo = EXCLUDED.anexo_completo,
        ingreso_total = EXCLUDED.ingreso_total,
        egreso_total = EXCLUDED.egreso_total,
        balance = EXCLUDED.balance,
        cobertura_gastos_fijos_pct = EXCLUDED.cobertura_gastos_fijos_pct,
        dependencia_variable_pct = EXCLUDED.dependencia_variable_pct,
        notas_generacion = EXCLUDED.notas_generacion,
        updated_at = NOW()
    `;

    console.log(`✅ Anexo ${anexo.mes}/${anexo.ano} guardado en historial`);
  } catch (error) {
    console.error('Error guardando anexo en historial:', error);
    throw error;
  }
}

export async function obtenerAnexoHistorico(mes: number, ano: number): Promise<AnexoFinanciero | null> {
  try {
    const resultRaw = await sql`
      SELECT anexo_completo FROM anexos_historicos
      WHERE mes = ${mes} AND ano = ${ano}
    `;
    const result = resultRaw as Array<{ anexo_completo: AnexoFinanciero }>;

    if (result.length === 0) return null;
    
    return result[0].anexo_completo as AnexoFinanciero;
  } catch (error) {
    console.error('Error obteniendo anexo histórico:', error);
    return null;
  }
}

export async function obtenerHistorialAnexos(ano: number) {
  try {
    return await sql`
      SELECT 
        mes, ano, 
        ingreso_total, egreso_total, balance,
        cobertura_gastos_fijos_pct, dependencia_variable_pct,
        created_at, updated_at
      FROM anexos_historicos
      WHERE ano = ${ano}
      ORDER BY mes ASC
    `;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
}

// =====================================================
// COMPARATIVAS: Análisis mes a mes
// =====================================================

export interface ComparativaAnexos {
  mes_anterior: number;
  ano_anterior: number;
  mes_actual: number;
  ano_actual: number;
  
  variaciones: {
    ingreso: { actual: number; anterior: number; cambio_pct: number };
    egreso: { actual: number; anterior: number; cambio_pct: number };
    balance: { actual: number; anterior: number; cambio_pct: number };
    cobertura: { actual: number; anterior: number; cambio_pct: number };
    dependencia_variable: { actual: number; anterior: number; cambio_pct: number };
  };
  
  tendencias: {
    ingresos_subiendo: boolean;
    gastos_controlados: boolean;
    cobertura_mejorando: boolean;
  };
}

export async function compararAnexos(
  mes1: number,
  ano1: number,
  mes2: number,
  ano2: number
): Promise<ComparativaAnexos | null> {
  try {
    const anexo1ResultRaw = await sql`
      SELECT * FROM anexos_historicos WHERE mes = ${mes1} AND ano = ${ano1}
    `;
    const anexo2ResultRaw = await sql`
      SELECT * FROM anexos_historicos WHERE mes = ${mes2} AND ano = ${ano2}
    `;
    const anexo1Result = anexo1ResultRaw as Array<{
      ingreso_total: number;
      egreso_total: number;
      balance: number;
      cobertura_gastos_fijos_pct: number;
      dependencia_variable_pct: number;
    }>;
    const anexo2Result = anexo2ResultRaw as Array<{
      ingreso_total: number;
      egreso_total: number;
      balance: number;
      cobertura_gastos_fijos_pct: number;
      dependencia_variable_pct: number;
    }>;

    if (anexo1Result.length === 0 || anexo2Result.length === 0) {
      console.warn(`Anexos no encontrados para comparación`);
      return null;
    }

    const a1 = anexo1Result[0];
    const a2 = anexo2Result[0];

    const calcularCambio = (actual: number, anterior: number): number => {
      if (anterior === 0) return 0;
      return ((actual - anterior) / anterior) * 100;
    };

    return {
      mes_anterior: mes1,
      ano_anterior: ano1,
      mes_actual: mes2,
      ano_actual: ano2,
      
      variaciones: {
        ingreso: {
          actual: a2.ingreso_total,
          anterior: a1.ingreso_total,
          cambio_pct: calcularCambio(a2.ingreso_total, a1.ingreso_total),
        },
        egreso: {
          actual: a2.egreso_total,
          anterior: a1.egreso_total,
          cambio_pct: calcularCambio(a2.egreso_total, a1.egreso_total),
        },
        balance: {
          actual: a2.balance,
          anterior: a1.balance,
          cambio_pct: calcularCambio(a2.balance, a1.balance),
        },
        cobertura: {
          actual: a2.cobertura_gastos_fijos_pct,
          anterior: a1.cobertura_gastos_fijos_pct,
          cambio_pct: a2.cobertura_gastos_fijos_pct - a1.cobertura_gastos_fijos_pct,
        },
        dependencia_variable: {
          actual: a2.dependencia_variable_pct,
          anterior: a1.dependencia_variable_pct,
          cambio_pct: a2.dependencia_variable_pct - a1.dependencia_variable_pct,
        },
      },
      
      tendencias: {
        ingresos_subiendo: a2.ingreso_total > a1.ingreso_total,
        gastos_controlados: a2.egreso_total <= a1.egreso_total,
        cobertura_mejorando: a2.cobertura_gastos_fijos_pct >= a1.cobertura_gastos_fijos_pct,
      },
    };
  } catch (error) {
    console.error('Error comparando anexos:', error);
    throw error;
  }
}

// =====================================================
// EXPORT DATA: Preparar datos para PDF/Excel
// =====================================================

export interface DatosExportPDF {
  anexo: AnexoFinanciero;
  titulo: string;
  fecha_generacion: string;
  responsable?: string;
  empresa_nombre: string;
  logo_url?: string;
}

export async function prepararDatosExportPDF(
  mes: number,
  ano: number,
  empresa_nombre: string = 'Netlab'
): Promise<DatosExportPDF> {
  try {
    const anexo = await generarAnexoFinanciero(mes, ano);

    return {
      anexo,
      titulo: `Anexo Financiero • ${empresa_nombre}`,
      fecha_generacion: new Date().toLocaleString('es-MX'),
      empresa_nombre,
      logo_url: '/logo.png', // Ajustar según tu setup
    };
  } catch (error) {
    console.error('Error preparando datos export:', error);
    throw error;
  }
}

// =====================================================
// AUDITORÍA: Registrar exports
// =====================================================

export async function registrarExport(
  mes: number,
  ano: number,
  tipo_export: string,
  formato: string,
  nombre_archivo?: string,
  tamano_bytes?: number,
  exportado_por?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO reportes_exportados 
        (mes, ano, tipo_export, formato, nombre_archivo, tamano_bytes, exportado_por)
      VALUES (
        ${mes}, ${ano}, ${tipo_export}, ${formato}, 
        ${nombre_archivo ?? null}, ${tamano_bytes ?? null}, 
        ${exportado_por ?? null}
      )
    `;
  } catch (error) {
    console.error('Error registrando export:', error);
    throw error;
  }
}

export async function obtenerHistorialExports(mes: number, ano: number) {
  try {
    return await sql`
      SELECT * FROM reportes_exportados
      WHERE mes = ${mes} AND ano = ${ano}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error('Error obteniendo historial exports:', error);
    throw error;
  }
}
