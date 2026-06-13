-- Añadir campo cuenta_contable (catálogo SAT) a facturas y gastos
-- Ejecutar en Neon DB

ALTER TABLE facturas
  ADD COLUMN IF NOT EXISTS cuenta_contable VARCHAR(10) DEFAULT NULL;

COMMENT ON COLUMN facturas.cuenta_contable IS 'Código de cuenta contable del catálogo SAT (ej. 401, 402, 403)';

ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS cuenta_contable VARCHAR(10) DEFAULT NULL;

COMMENT ON COLUMN gastos.cuenta_contable IS 'Código de cuenta contable del catálogo SAT (ej. 601, 607, 608)';

-- Índices para reportes por cuenta contable
CREATE INDEX IF NOT EXISTS idx_facturas_cuenta_contable ON facturas(cuenta_contable);
CREATE INDEX IF NOT EXISTS idx_gastos_cuenta_contable ON gastos(cuenta_contable);
