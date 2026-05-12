-- ============================================================================
-- Migración: Ligar movimientos bancarios a facturas y gastos
-- ============================================================================
-- Ejecutar en Neon DESPUÉS de que existan las tablas:
--   - facturas (create-netlab-erp-tables.sql)
--   - gastos   (create-netlab-erp-tables.sql)
--   - movimientos_bancarios (create-conciliacion-tables.sql)
-- ============================================================================

-- 1. Agregar FK en movimientos_bancarios → facturas y gastos
ALTER TABLE movimientos_bancarios
  ADD COLUMN IF NOT EXISTS factura_id UUID REFERENCES facturas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gasto_id   UUID REFERENCES gastos(id)   ON DELETE SET NULL;

-- 2. Agregar FK en facturas → movimientos_bancarios
ALTER TABLE facturas
  ADD COLUMN IF NOT EXISTS movimiento_bancario_id UUID REFERENCES movimientos_bancarios(id) ON DELETE SET NULL;

-- 3. Agregar FK en gastos → movimientos_bancarios
ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS movimiento_bancario_id UUID REFERENCES movimientos_bancarios(id) ON DELETE SET NULL;

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_movbancario_factura  ON movimientos_bancarios(factura_id);
CREATE INDEX IF NOT EXISTS idx_movbancario_gasto    ON movimientos_bancarios(gasto_id);
CREATE INDEX IF NOT EXISTS idx_facturas_movbancario ON facturas(movimiento_bancario_id);
CREATE INDEX IF NOT EXISTS idx_gastos_movbancario   ON gastos(movimiento_bancario_id);
