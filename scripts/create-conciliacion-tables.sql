-- Módulo de Conciliación Bancaria
-- Estados de cuenta subidos (uno por mes)
CREATE TABLE IF NOT EXISTS estados_cuenta (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banco            VARCHAR(50)    NOT NULL DEFAULT 'BBVA',
  numero_cuenta    VARCHAR(30)    NOT NULL,
  periodo_inicio   DATE           NOT NULL,
  periodo_fin      DATE           NOT NULL,
  saldo_inicial    DECIMAL(14,2),
  saldo_final      DECIMAL(14,2),
  total_cargos     DECIMAL(14,2),
  total_abonos     DECIMAL(14,2),
  archivo_nombre   TEXT,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  UNIQUE (numero_cuenta, periodo_inicio, periodo_fin)
);

-- Movimientos individuales parseados del PDF
CREATE TABLE IF NOT EXISTS movimientos_bancarios (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estado_cuenta_id    UUID           NOT NULL REFERENCES estados_cuenta(id) ON DELETE CASCADE,
  fecha_operacion     DATE           NOT NULL,
  fecha_liquidacion   DATE           NOT NULL,
  codigo              VARCHAR(10),
  descripcion         TEXT           NOT NULL,
  referencia          TEXT,
  cargo               DECIMAL(14,2),
  abono               DECIMAL(14,2),
  saldo_operacion     DECIMAL(14,2),
  saldo_liquidacion   DECIMAL(14,2),
  -- Conciliación
  cfdi_id             UUID           REFERENCES cfdis(id),
  etiqueta            TEXT,           -- texto libre: "Nómina Edgar", "Renta oficina", etc.
  categoria           TEXT,           -- ingreso | gasto_operativo | transferencia | impuestos | otro
  conciliado          BOOLEAN        NOT NULL DEFAULT FALSE,
  notas               TEXT,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mov_estado_cuenta ON movimientos_bancarios(estado_cuenta_id);
CREATE INDEX IF NOT EXISTS idx_mov_fecha ON movimientos_bancarios(fecha_operacion);
CREATE INDEX IF NOT EXISTS idx_mov_conciliado ON movimientos_bancarios(conciliado);
CREATE INDEX IF NOT EXISTS idx_mov_cfdi ON movimientos_bancarios(cfdi_id) WHERE cfdi_id IS NOT NULL;
