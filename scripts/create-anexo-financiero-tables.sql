-- Anexo Financiero - Extensiones y Nuevas Tablas
-- Creado para el módulo de Anexo Financiero en /admin/finanzas/anexo

-- =====================================================
-- 1. EXTENDER TABLA facturas
-- =====================================================
ALTER TABLE IF EXISTS facturas 
  ADD COLUMN IF NOT EXISTS tipo_ingreso VARCHAR(50) DEFAULT 'variable'; -- 'fijo', 'run_rate', 'variable'

ALTER TABLE IF EXISTS facturas 
  ADD COLUMN IF NOT EXISTS recurrente BOOLEAN DEFAULT false;

ALTER TABLE IF EXISTS facturas 
  ADD COLUMN IF NOT EXISTS dia_mes INTEGER; -- Día del mes en que se repite (1-31, NULL si no recurrente)

-- Comentarios
COMMENT ON COLUMN facturas.tipo_ingreso IS 'Clasificación de ingresos: fijo (contrato indefinido), run_rate (línea por período), variable (puntual)';
COMMENT ON COLUMN facturas.recurrente IS 'Indicador si la factura es recurrente mensualmente';
COMMENT ON COLUMN facturas.dia_mes IS 'Día del mes en que ocurre el ingreso recurrente (1-31)';

-- =====================================================
-- 2. EXTENDER TABLA oportunidades (CRM)
-- =====================================================
ALTER TABLE IF EXISTS oportunidades 
  ADD COLUMN IF NOT EXISTS tipo_ingreso VARCHAR(50) DEFAULT 'variable'; -- 'fijo', 'run_rate', 'variable'

COMMENT ON COLUMN oportunidades.tipo_ingreso IS 'Clasificación de ingresos cuando la oportunidad se cierre: fijo, run_rate, o variable';

-- =====================================================
-- 3. CREAR TABLA bolsas_presupuestarias
-- =====================================================
CREATE TABLE IF NOT EXISTS bolsas_presupuestarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2099),
  bolsa_nombre VARCHAR(100) NOT NULL, -- 'operacion_fija', 'operacion_variable', 'reserva', 'crecimiento', 'utilidad'
  presupuesto_mensual DECIMAL(15, 2) NOT NULL DEFAULT 0,
  porcentaje_asignado DECIMAL(5, 2), -- Porcentaje del total de ingresos
  uso_descripcion TEXT,
  created_by UUID REFERENCES neon_auth.user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(mes, ano, bolsa_nombre)
);

CREATE INDEX IF NOT EXISTS idx_bolsas_presupuestarias_mes_ano ON bolsas_presupuestarias(mes, ano);
CREATE INDEX IF NOT EXISTS idx_bolsas_presupuestarias_bolsa ON bolsas_presupuestarias(bolsa_nombre);

COMMENT ON TABLE bolsas_presupuestarias IS 'Distribución presupuestaria mensual por bolsa (operación, reserva, crecimiento, etc.)';

-- =====================================================
-- 4. CREAR TABLA decisiones_junta
-- =====================================================
CREATE TABLE IF NOT EXISTS decisiones_junta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2099),
  pregunta VARCHAR(255) NOT NULL, -- La pregunta de decisión (ej: "¿Se puede cubrir operación fija con ingresos actuales?")
  respuesta BOOLEAN, -- NULL = no decidido, true = sí, false = no
  decision_detalle TEXT, -- Riqueza de la decisión
  responsable_decision UUID REFERENCES neon_auth.user(id),
  completado BOOLEAN DEFAULT false,
  created_by UUID REFERENCES neon_auth.user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_decisiones_junta_mes_ano ON decisiones_junta(mes, ano);
CREATE INDEX IF NOT EXISTS idx_decisiones_junta_completado ON decisiones_junta(completado);

COMMENT ON TABLE decisiones_junta IS 'Registro formal de decisiones de junta mensual para el Anexo Financiero';

-- =====================================================
-- 5. CREAR TABLA alertas_financieras
-- =====================================================
CREATE TABLE IF NOT EXISTS alertas_financieras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2099),
  tipo_alerta VARCHAR(100) NOT NULL, -- 'riesgo_caja', 'dependencia_variable', 'cliente_critico', 'gasto_critico'
  valor_actual DECIMAL(15, 2),
  umbral_alerta DECIMAL(15, 2),
  severidad VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
  estado VARCHAR(50) DEFAULT 'activa', -- 'activa', 'resuelta', 'aprobada'
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alertas_financieras_mes_ano ON alertas_financieras(mes, ano);
CREATE INDEX IF NOT EXISTS idx_alertas_financieras_tipo ON alertas_financieras(tipo_alerta);
CREATE INDEX IF NOT EXISTS idx_alertas_financieras_severidad ON alertas_financieras(severidad);

COMMENT ON TABLE alertas_financieras IS 'Sistema de alertas automáticas detectadas durante análisis de Anexo Financiero';

-- =====================================================
-- 6. TRIGGERS para updated_at
-- =====================================================
CREATE TRIGGER update_bolsas_presupuestarias_updated_at BEFORE UPDATE ON bolsas_presupuestarias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decisiones_junta_updated_at BEFORE UPDATE ON decisiones_junta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alertas_financieras_updated_at BEFORE UPDATE ON alertas_financieras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
