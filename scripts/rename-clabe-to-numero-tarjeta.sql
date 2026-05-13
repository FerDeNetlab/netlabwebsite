-- Renombrar columna clabe → numero_tarjeta en rh_empleados
ALTER TABLE rh_empleados RENAME COLUMN clabe TO numero_tarjeta;

-- Ajustar longitud a 16 caracteres (número de tarjeta)
ALTER TABLE rh_empleados ALTER COLUMN numero_tarjeta TYPE VARCHAR(16);
