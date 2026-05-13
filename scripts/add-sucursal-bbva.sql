-- Agregar sucursal BBVA a empleados (código de sucursal gestora de la cuenta, 4 dígitos)
ALTER TABLE rh_empleados ADD COLUMN IF NOT EXISTS sucursal_bbva VARCHAR(10);
