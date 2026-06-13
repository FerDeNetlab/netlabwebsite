-- Limpieza de registros manuales de facturas y gastos
-- IMPORTANTE: ejecutar SOLO cuando estés seguro de que quieres borrar los manuales
-- Los estados de cuenta (movimientos_bancarios) y CFDIs NO se borran

-- 1. Desligar movimientos_bancarios de facturas y gastos manuales
--    (antes de borrar para no violar FK constraints)
UPDATE movimientos_bancarios SET factura_id = NULL WHERE factura_id IS NOT NULL;
UPDATE movimientos_bancarios SET gasto_id   = NULL WHERE gasto_id   IS NOT NULL;

-- 2. Borrar pagos asociados a facturas (tabla intermedia)
DELETE FROM pagos WHERE factura_id IN (SELECT id FROM facturas);

-- 3. Borrar facturas manuales
DELETE FROM facturas;

-- 4. Borrar gastos manuales
DELETE FROM gastos;

-- Verificar resultados
SELECT
  (SELECT COUNT(*) FROM facturas)            AS facturas_restantes,
  (SELECT COUNT(*) FROM gastos)              AS gastos_restantes,
  (SELECT COUNT(*) FROM movimientos_bancarios) AS movimientos_bancarios,
  (SELECT COUNT(*) FROM cfdis)               AS cfdis;
