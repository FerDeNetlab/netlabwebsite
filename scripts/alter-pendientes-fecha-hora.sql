-- Cambiar fecha_deseada de DATE a TIMESTAMPTZ para soportar hora
ALTER TABLE pendientes_externos
  ALTER COLUMN fecha_deseada TYPE TIMESTAMPTZ
  USING fecha_deseada::TIMESTAMPTZ;
