-- Fase 2: Historización, Export y Comparativas
-- Extensión del script de migración del Anexo Financiero

-- =====================================================
-- TABLA: anexos_historicos (Historización)
-- =====================================================
CREATE TABLE IF NOT EXISTS anexos_historicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2099),
  
  -- Snapshot completo del anexo en formato JSON
  anexo_completo JSONB NOT NULL,
  
  -- Campos clave para búsqueda rápida
  ingreso_total DECIMAL(15, 2),
  egreso_total DECIMAL(15, 2),
  balance DECIMAL(15, 2),
  cobertura_gastos_fijos_pct DECIMAL(5, 2),
  dependencia_variable_pct DECIMAL(5, 2),
  
  -- Auditoría
  generado_por UUID REFERENCES neon_auth.user(id),
  notas_generacion TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Un anexo por mes
  UNIQUE(mes, ano)
);

CREATE INDEX IF NOT EXISTS idx_anexos_historicos_mes_ano ON anexos_historicos(mes, ano);
CREATE INDEX IF NOT EXISTS idx_anexos_historicos_ingreso ON anexos_historicos(ingreso_total);
CREATE INDEX IF NOT EXISTS idx_anexos_historicos_cobertura ON anexos_historicos(cobertura_gastos_fijos_pct);

COMMENT ON TABLE anexos_historicos IS 'Histórico de anexos financieros por mes (one-to-one con meses)';
COMMENT ON COLUMN anexos_historicos.anexo_completo IS 'Snapshot JSON de todas las 9 secciones del anexo';

-- =====================================================
-- TABLA: reportes_exportados (Auditoría de exports)
-- =====================================================
CREATE TABLE IF NOT EXISTS reportes_exportados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2099),
  tipo_export VARCHAR(50) NOT NULL, -- 'pdf', 'excel', 'comparativa'
  nombre_archivo VARCHAR(255),
  formato VARCHAR(20), -- 'PDF', 'XLSX', 'HTML'
  tamano_bytes INTEGER,
  
  exportado_por UUID REFERENCES neon_auth.user(id),
  notas TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reportes_exportados_mes_ano ON reportes_exportados(mes, ano);
CREATE INDEX IF NOT EXISTS idx_reportes_exportados_tipo ON reportes_exportados(tipo_export);

COMMENT ON TABLE reportes_exportados IS 'Auditoría de exportaciones realizadas (PDF, Excel, etc)';

-- =====================================================
-- TRIGGER para updated_at
-- =====================================================
CREATE TRIGGER update_anexos_historicos_updated_at BEFORE UPDATE ON anexos_historicos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
