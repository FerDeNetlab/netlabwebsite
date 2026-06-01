-- Renombrar columna clabe → numero_tarjeta en rh_empleados
-- Correr solo si la columna aún se llama 'clabe':
ALTER TABLE rh_empleados RENAME COLUMN clabe TO numero_tarjeta;
