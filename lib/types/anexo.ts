/**
 * Tipos TypeScript para el Módulo de Anexo Financiero
 * Location: lib/types/anexo.ts
 */

// =====================================================
// Enums
// =====================================================

export enum TipoIngreso {
  FIJO = 'fijo',
  RUN_RATE = 'run_rate',
  VARIABLE = 'variable'
}

export enum EtapaOportunidad {
  PROSPECTO = 'prospecto',
  CALIFICACION = 'calificacion',
  PROPUESTA = 'propuesta',
  NEGOCIACION = 'negociacion',
  GANADO = 'ganado',
  PERDIDO = 'perdido'
}

export enum EstadoFactura {
  PENDIENTE = 'pendiente',
  PAGADA = 'pagada',
  PARCIAL = 'parcial',
  VENCIDA = 'vencida',
  CANCELADA = 'cancelada'
}

export enum EstadoGasto {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado'
}

export enum BolsaPresupuestaria {
  OPERACION_FIJA = 'operacion_fija',
  OPERACION_VARIABLE = 'operacion_variable',
  RESERVA = 'reserva',
  CRECIMIENTO = 'crecimiento',
  UTILIDAD = 'utilidad'
}

export enum TipoAlerta {
  RIESGO_CAJA = 'riesgo_caja',
  DEPENDENCIA_VARIABLE = 'dependencia_variable',
  CLIENTE_CRITICO = 'cliente_critico',
  GASTO_CRITICO = 'gasto_critico'
}

export enum SeveridadAlerta {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical'
}

export enum EstadoAlerta {
  ACTIVA = 'activa',
  RESUELTA = 'resuelta',
  APROBADA = 'aprobada'
}

// =====================================================
// Modelos de Bases de Datos (extendidos)
// =====================================================

export interface Factura {
  id: string;
  cliente_id: string;
  proyecto_id?: string;
  numero_factura: string;
  concepto: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: EstadoFactura;
  fecha_emision: string;
  fecha_vencimiento?: string;
  fecha_pago?: string;
  metodo_pago?: string;
  notas?: string;
  // NUEVOS CAMPOS
  tipo_ingreso: TipoIngreso;
  recurrente: boolean;
  dia_mes?: number; // 1-31
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Oportunidad {
  id: string;
  nombre: string;
  cliente_id: string;
  valor: number;
  fecha_cierre_estimada?: string;
  probabilidad: number; // 0-100
  etapa: EtapaOportunidad;
  descripcion?: string;
  // NUEVO CAMPO
  tipo_ingreso: TipoIngreso;
  created_at: string;
  updated_at: string;
}

export interface Gasto {
  id: string;
  categoria_id: string;
  concepto: string;
  monto: number;
  estado: EstadoGasto;
  proveedor?: string;
  fecha_vencimiento?: string;
  fecha_pago?: string;
  recurrente: boolean;
  dia_mes?: number;
  subtipo: 'general' | 'sueldo';
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  empresa?: string;
  email?: string;
  telefono?: string;
  rfc?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  notas?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AporteCapital {
  id: string;
  socio: string;
  monto: number;
  concepto: string;
  fecha: string;
  notas?: string;
}

export interface BolsaPresupuestariaRecord {
  id: string;
  mes: number;
  ano: number;
  bolsa_nombre: BolsaPresupuestaria;
  presupuesto_mensual: number;
  porcentaje_asignado?: number;
  uso_descripcion?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionJunta {
  id: string;
  mes: number;
  ano: number;
  pregunta: string;
  respuesta?: boolean;
  decision_detalle?: string;
  responsable_decision?: string;
  completado: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AlertaFinanciera {
  id: string;
  mes: number;
  ano: number;
  tipo_alerta: TipoAlerta;
  valor_actual?: number;
  umbral_alerta?: number;
  severidad: SeveridadAlerta;
  estado: EstadoAlerta;
  notas?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// ANEXO FINANCIERO - Estructuras Complejas
// =====================================================

/**
 * 1. MATRIZ DE INGRESOS
 * Agrupa facturas por cliente y tipo de ingreso
 */
export interface MatrizIngresosRow {
  cliente_id: string;
  cliente_nombre: string;
  tipo_ingreso: TipoIngreso;
  monto_mensual: number;
  monto_total_contrato?: number;
  inicio_fecha?: string;
  fin_fecha?: string;
  probabilidad?: number;
  estatus: string; // 'cerrado', 'activo', etc.
  responsable?: string;
}

export interface MatrizIngresos {
  filas: MatrizIngresosRow[];
  resumenPorTipo: {
    [key in TipoIngreso]: {
      monto_mensual: number;
      porcentaje_total: number;
      certidumbre: string; // 'Alta', 'Media', 'Baja'
    };
  };
  totales: {
    ingreso_mensual_real: number; // suma esperada (no cancelada)
    ingreso_mensual_cobrado: number; // suma de pagos reales del período
    ingreso_fijo_estructural: number;
    dependencia_variable_porcentaje: number;
    porcentaje_cobrado: number; // cobrado / esperado
  };
}

/**
 * 2. MATRIZ DE GASTOS
 * Agrupa gastos por categoría y tipo
 */
export interface MatrizGastosRow {
  concepto: string;
  monto_mensual: number;
  responsable?: string;
  observaciones?: string;
}

export interface MatrizGastos {
  costos_fijos: MatrizGastosRow[];
  costos_variables: Array<{
    concepto: string;
    tipo: 'porcentaje' | 'monto';
    valor: number;
    base_calculo: string; // 'ingreso', 'utilidad', etc.
    observaciones?: string;
  }>;
  totales: {
    total_fijos: number;
    total_variables_estimados: number;
    total_egresos: number;
  };
}

/**
 * 3. MATRIZ DE BOLSAS FINANCIERAS
 */
export interface MatrizBolsas {
  bolsas: Array<{
    bolsa: BolsaPresupuestaria;
    fuente_ingreso: string;
    presupuesto_mensual: number;
    porcentaje_asignado: number;
    uso: string;
  }>;
  validacion_cobertura: {
    gastos_fijos: number;
    ingreso_fijo: number;
    porcentaje_cobertura_fija_pura: number;
    porcentaje_cobertura_ampliada: number; // con run rate
  };
}

/**
 * 4. FLUJO DE CAJA
 */
export interface FlujoCajaPorSemana {
  semana: number;
  ingresos_esperados: number;
  ingresos_comprometidos: number;
  egresos: number;
  balance: number;
}

export interface FlujoCaja {
  caja_actual: {
    saldo_en_banco: number;
    cuentas_por_cobrar: number;
    cuentas_por_pagar: number;
  };
  flujo_proyectado_4_semanas: FlujoCajaPorSemana[];
  lecturas_clave: {
    punto_quiebre_caja?: string;
    necesidad_cobranza_urgente?: string;
    margen_maniobra_semanas?: number;
  };
}

/**
 * 5. PIPELINE COMERCIAL
 */
export interface ProyectoEnCierre {
  cliente: string;
  monto: number;
  tipo_ingreso: TipoIngreso;
  probabilidad: number; // 0-100
  fecha_estimada: string;
  impacto_mensual: number;
}

export interface PipelineComercial {
  proyectos: ProyectoEnCierre[];
  impacto_potencial: {
    ingreso_adicional_posible: number;
    impacto_en_cobertura_fija: number;
  };
}

/**
 * 6. RESERVA OPERATIVA
 */
export interface ReservaOperativa {
  gastos_fijos_mensuales: number;
  caja_disponible: number;
  meses_cubiertos: number;
}

/**
 * 7. DECISIONES DE LA JUNTA
 */
export interface DecisionCheckbox {
  id: string;
  pregunta: string;
  completado: boolean;
  respuesta?: boolean;
  detalles?: string;
}

export interface DecisionesJunta {
  obligatorias: DecisionCheckbox[];
  acuerdos: Array<{
    decision: string;
    responsable?: string;
    fecha?: string;
  }>;
}

/**
 * 8. ALERTAS
 */
export interface Alerta {
  tipo: TipoAlerta;
  valor: string;
  severidad: SeveridadAlerta;
  descripcion?: string;
}

export interface Alertas {
  alertas: Alerta[];
}

/**
 * 9. CONCLUSIÓN FINANCIERA
 */
export interface ConclusionFinanciera {
  resumen_ejecutivo: string;
}

// =====================================================
// ANEXO FINANCIERO COMPLETO
// =====================================================

export interface AnexoFinanciero {
  mes: number;
  ano: number;
  fecha_generacion: string;
  
  // Las 9 secciones
  matriz_ingresos: MatrizIngresos;
  matriz_gastos: MatrizGastos;
  matriz_bolsas: MatrizBolsas;
  flujo_caja: FlujoCaja;
  pipeline_comercial: PipelineComercial;
  reserva_operativa: ReservaOperativa;
  decisiones_junta: DecisionesJunta;
  alertas: Alertas;
  conclusion: ConclusionFinanciera;
}

// =====================================================
// API Response Types
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// =====================================================
// Helpers para cálculos
// =====================================================

export interface CalculosClave {
  cobertura_gastos_fijos_porcentaje: number;
  dependencia_variable_porcentaje: number;
  cliente_mas_critico: {
    nombre: string;
    porcentaje_ingresos: number;
  };
  gasto_mas_critico: {
    nombre: string;
    porcentaje_total: number;
  };
  riesgo_caja_dias: number;
}
