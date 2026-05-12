-- ============================================================================
-- Tablas de Conciliación Bancaria
-- ============================================================================

CREATE TABLE IF NOT EXISTS estados_cuenta (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banco          VARCHAR(50)  NOT NULL DEFAULT 'BBVA',
  numero_cuenta  VARCHAR(20)  NOT NULL,
  periodo_inicio DATE         NOT NULL,
  periodo_fin    DATE         NOT NULL,
  saldo_inicial  DECIMAL(14,2) NOT NULL DEFAULT 0,
  saldo_final    DECIMAL(14,2) NOT NULL DEFAULT 0,
  total_cargos   DECIMAL(14,2) NOT NULL DEFAULT 0,
  total_abonos   DECIMAL(14,2) NOT NULL DEFAULT 0,
  archivo_nombre VARCHAR(255),
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(numero_cuenta, periodo_inicio, periodo_fin)
);

CREATE TABLE IF NOT EXISTS movimientos_bancarios (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estado_cuenta_id    UUID NOT NULL REFERENCES estados_cuenta(id) ON DELETE CASCADE,
  fecha_operacion     DATE NOT NULL,
  fecha_liquidacion   DATE,
  codigo              VARCHAR(20),
  descripcion         VARCHAR(500),
  referencia          TEXT,
  cargo               DECIMAL(14,2),
  abono               DECIMAL(14,2),
  saldo_operacion     DECIMAL(14,2),
  saldo_liquidacion   DECIMAL(14,2),
  cfdi_id             UUID REFERENCES cfdis(id) ON DELETE SET NULL,
  factura_id          UUID REFERENCES facturas(id) ON DELETE SET NULL,
  gasto_id            UUID REFERENCES gastos(id) ON DELETE SET NULL,
  etiqueta            VARCHAR(200),
  categoria           VARCHAR(50),
  conciliado          BOOLEAN NOT NULL DEFAULT FALSE,
  notas               TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movbancario_estado    ON movimientos_bancarios(estado_cuenta_id);
CREATE INDEX IF NOT EXISTS idx_movbancario_fecha     ON movimientos_bancarios(fecha_operacion DESC);
CREATE INDEX IF NOT EXISTS idx_movbancario_conciliado ON movimientos_bancarios(conciliado);
CREATE INDEX IF NOT EXISTS idx_movbancario_cfdi      ON movimientos_bancarios(cfdi_id);
CREATE INDEX IF NOT EXISTS idx_movbancario_factura   ON movimientos_bancarios(factura_id);
CREATE INDEX IF NOT EXISTS idx_movbancario_gasto     ON movimientos_bancarios(gasto_id);
